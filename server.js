// Require the modules
var express = require('express');
var multer = require('multer');
var fs = require('fs').promises;
var path = require('path');
var exif = require('exif-parser');
var sharp = require('sharp');

// Create the app and the upload middleware
var app = express();
var upload = multer({ dest: 'uploads/' });

// Set the view engine to Jade
app.set('view engine', 'jade');

// Serve the static files in the uploads folder
app.use('/uploads', express.static('uploads'));

async function checkIfPathExists(filePath) {
    try {
        await access(filePath, constants.R_OK);
        return true;
      } catch (err) {
        return false;
      } 
}

// Define an async function to resize and crop an image
// input: the path to the original image
// output: the path to the resized and cropped image
// width, height: the dimensions of the output image
// crop: a boolean value indicating whether to crop the image or not
var resizeAndCrop = async function(input, output, width, height, crop) {
  try {
    // Create a sharp instance with the input image
    var image = sharp(input);
    // If crop is true, use the '^' flag to resize the image
    // and then use the 'center' gravity to crop it
    if (crop) {
      image.resize(width, height, { fit: 'cover' });
    } else {
      // If crop is false, use the 'inside' flag to resize the image
      // and preserve the aspect ratio
      image.resize(width, height, { fit: 'inside' });
    }
    // Get the destination directory from the output path
    var outputDir = path.dirname(output);
    // Check if the destination directory exists
    var exists = await checkIfPathExists(outputDir);
    if (!exists) {
      // Create the destination directory
      await fs.mkdir(outputDir, { recursive: true });
    }
    // Check if the output path already exists
    var exists = await checkIfPathExists(output);
    if (!exists) {
      // Write the output image to the output path
      await image.toFile(output);
    }
  } catch (err) {
    console.error(err);
  }
};

// Define the routes
app.get('/', async function(req, res) {
  try {
    // Get the list of files in the uploads folder
    var items = await fs.readdir('uploads');
    // Create an empty array to store the files
    var files = [];
    // Loop through the items and check the file type
    for (let item of items) {
      // Get the item path
      var itemPath = path.join('uploads', item);
      // Get the file stats
      var stats = await fs.stat(itemPath);
      // Check if the item is a file
      if (stats.isFile()) {
        // Push the item to the files array
        files.push(item);
      }
    }
    // Loop through the files and create thumbnails
    for (let file of files) {
      // Get the file path
      var filePath = path.join('uploads', file);
      // Get the thumbnail path
      var thumbPath = path.join('uploads', 'thumbs', file);
      // Resize and crop the image to 200x200
      await resizeAndCrop(filePath, thumbPath, 200, 200, true);
    }
    // Render the main view with the files array
    res.render('main', { files: files });
  } catch (err) {
    res.status(500).send('Error reading files');
  }
});

app.get('/upload', function(req, res) {
  // Render the upload view
  res.render('upload');
});

app.post('/upload', upload.single('photo'), async function(req, res) {
  // Handle the file upload
  if (req.file) {
    try {
      // Rename the file to its original name
      var oldPath = req.file.path;
      var newPath = path.join('uploads', req.file.originalname);
      await fs.rename(oldPath, newPath);
      // Redirect to the main view
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error renaming file');
    }
  } else {
    // No file was uploaded
    res.status(400).send('No file was uploaded');
  }
});

app.get('/details/:file', async function(req, res) {
  // Get the file name from the params
  var file = req.params.file;
  // Get the file path
  var filePath = path.join('uploads', file);
  // Get the resized path
  var resizedPath = path.join('uploads', 'resized', file);
  // Resize the image to fit in 1000x1000
  await resizeAndCrop(filePath, resizedPath, 1000, 1000, false);
  try {
    // Read the file as a buffer
    var buffer = await fs.readFile(filePath);
    // Parse the EXIF data from the buffer
    var parser = exif.create(buffer);
    var result = parser.parse();
    // Render the details view with the file and the EXIF data
    res.render('details', { file: file, exif: result });
  } catch (err) {
    res.status(500).send('Error reading file');
  }
});

// Start the server
app.listen(3000, function() {
  console.log('App listening on port 3000');
});