# Photo Gallery

A simple Express.js app with Jade as a view engine that allows users to upload and view photos.

## Installation

Clone this repository and install the dependencies using `npm install`.

## Usage

Start the server using `npm start` and visit `http://localhost:3000` in your browser.

You can upload a photo by clicking on the "Upload a photo" button and choosing a file from your device. The photo must be an image file with EXIF data.

You can view the thumbnails of the uploaded photos on the main page. You can click on any thumbnail to see the full-size photo and the EXIF data on the details page.

## Features

- Express.js framework
- Jade template engine
- Multer middleware for file upload
- Exif-parser module for EXIF data extraction
- Bootstrap CSS framework for styling