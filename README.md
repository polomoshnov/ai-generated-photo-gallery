> [!NOTE]  
> This is an AI generated app that I asked to create in order to demonstrate the programming capabilities of the AI-powered chat feature of Microsoft Bing. The whole conversion is provided in the "Conversation with AI.pdf" file included in this repo. The outcome of this conversion is presented in this repo 
with minor tweaks to the directory structure and the addition of `checkIfPathExists` in the server.js to make the app work properly. The conversion happened on January 13, 2024.

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