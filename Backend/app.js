const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 3000;

//Serving static files from the Frontend dir.
app.use(express.static(path.join(__dirname, 'Frontend')));

app.use(cors());

//Middleware to parse JSON and form data.
const upload = multer();

//function to format bytes to KB or MB.
function formaBytes(bytes){
  if (bytes < 1024) {
    return bytes + ' B';
  } 
  else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(2) + ' KB';
  }
  else {
    return (bytes / 1048576).toFixed(2) + ' MB';
  }
}

// Endpoint to process image.
app.post('/process-image',upload.single('image'), async(req, res) => {
  try {
    //checking if file is included in the request.
    if (!req.file) {
        return res.status(400).json({error: 'No image file provided'});
    }

    //Read and process the image.
    const imageBuffer = req.file.buffer;
    const metadata = await sharp(imageBuffer).metadata();

    //Extracting relevant information.
    const imageSize = formaBytes(imageBuffer.length);
    const imageDimensions = {
        width: `${metadata.width} px`,
        height: `${metadata.height} px`
    };

    //Sending response with image information.
    res.json({
        size: imageSize,
        dimensions: imageDimensions,
        imageFormat: metadata.format.toUpperCase()
    });

  } catch (error) {
    console.error('Error processing image: ', error);
    res.status(500).json({ error: 'Internal server error'});
  }
});

app.get('/process-image', async(req, res) => {
    res.send('The API for Image Processing is running');
});

app.listen(PORT, () => console.log(`Image Processing app listening on PORT ${PORT}!`));