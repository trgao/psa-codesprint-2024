require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { extractTextFromPdf } = require('./services/pdfService');
const { parsePdfContentToSections } = require('./services/gptService');
const { uploadMentee } = require('./services/uploadMentee');
const { uploadMentor } = require('./services/uploadMentor');
const { matching } = require('./services/Matching');
const { updateTables } = require('./services/updateTables');

const app = express();
const port = 8000;
const upload = multer({ dest: 'uploads/' });

// Endpoint for handling mentor uploads
app.post('/upload/mentor', upload.array('files'), async (req, res) => {
  try {
    let combinedData = {};

    // First, add any additional fields from req.body into combinedData
    for (const [key, value] of Object.entries(req.body)) {
        combinedData[key] = value; // Store any other data directly from the request
    }

    for (const file of req.files) {
      const filePath = file.path;
      const fileType = file.mimetype;

      if (fileType === 'application/pdf') {
        const pdfText = await extractTextFromPdf(filePath);
        // console.log(pdfText);
        const parsedInfo = await parsePdfContentToSections(pdfText);
        // console.log(parsedInfo);
        const parsedData = JSON.parse(parsedInfo);
        // Combine parsed data with existing combinedData object
        for (const [key, value] of Object.entries(parsedData)) {
            if (key == "name" || key == "email") {
              continue;
            } else if (combinedData[key]) {
                combinedData[key] += `\n${value}`; // Concatenate if key already exists
            } else {
                combinedData[key] = value; // Add new key-value pair if key doesn't exist
            }
        }
      } else {
        throw new Error('Unsupported file type');
      }
    }
    console.log(combinedData);
    //upload json to database
    const response = await uploadMentor(combinedData);
    console.log(response);
    return res.json(response);
  } catch (error) {
    console.error('Error in /upload/mentor endpoint:', error.message);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

// Endpoint for handling mentee uploads and matching them to mentors
app.post('/upload/mentee', upload.array('files'), async (req, res) => {
    try {
        let combinedData = {};
    
        // First, add any additional fields from req.body into combinedData
        for (const [key, value] of Object.entries(req.body)) {
            combinedData[key] = value; // Store any other data directly from the request
        }
    
        for (const file of req.files) {
          const filePath = file.path;
          const fileType = file.mimetype;
    
          if (fileType === 'application/pdf') {
            const pdfText = await extractTextFromPdf(filePath);
            // console.log(pdfText);
            const parsedInfo = await parsePdfContentToSections(pdfText);
            // console.log(parsedInfo);
            const parsedData = JSON.parse(parsedInfo);
            // Combine parsed data with existing combinedData object
            for (const [key, value] of Object.entries(parsedData)) {
                if (key == "name" || key == "email") {
                  continue;
                } else if (combinedData[key]) {
                    combinedData[key] += `\n${value}`; // Concatenate if key already exists
                } else {
                    combinedData[key] = value; // Add new key-value pair if key doesn't exist
                }
            }
          } else {
            throw new Error('Unsupported file type');
          }
        }
        console.log(combinedData);
        //upload json to database
        const response = await uploadMentee(combinedData);
        return res.json(response);
    } catch (error) {
        console.error('Error in /upload/mentee endpoint:', error.message);
        return res.status(500).json({ statusCode: 500, message: error.message });
    }
});

app.post('/matching', async (req, res) => {
    try {
      const matches = await matching(); 
      updateTables(matches);
      res.send('Matching process triggered successfully');
    } catch (error) {
      res.status(500).send('Error triggering matching process');
    }
});


app.get('/', (req, res) => {
    res.send('Server is running!');
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
