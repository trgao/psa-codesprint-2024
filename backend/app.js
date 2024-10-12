require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { extractTextFromPdf } = require('./services/pdfService');
const { parsePdfContentToSections } = require('./services/gptService');
// const { saveParsedDataToSupabase } = require('./services/supabaseService');
// const { matchMenteeToMentor } = require('./services/matchingService'); // Assuming you have a matching service

const app = express();
const port = 5000;
const upload = multer({ dest: 'uploads/' });

// Endpoint for handling mentor uploads
app.post('/upload/mentor', upload.array('files'), async (req, res) => {
  try {
    const responses = [];
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
            if (combinedData[key]) {
                combinedData[key] += `\n${value}`; // Concatenate if key already exists
            } else {
                combinedData[key] = value; // Add new key-value pair if key doesn't exist
            }
        }
          

        // const supabaseResult = await saveParsedDataToSupabase(parsedData);
        // responses.push({ filename: file.originalname, supabaseResult });
      } else {
        responses.push({ filename: file.originalname, message: 'Unsupported file type' });
      }
    }
    console.log(combinedData);

    res.json(responses);
  } catch (error) {
    console.error('Error in /upload/mentor endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for handling mentee uploads and matching them to mentors
app.post('/upload/mentee', upload.array('files'), async (req, res) => {
    try {
        const responses = [];
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
                if (combinedData[key]) {
                    combinedData[key] += `\n${value}`; // Concatenate if key already exists
                } else {
                    combinedData[key] = value; // Add new key-value pair if key doesn't exist
                }
            }
              
    
            // const supabaseResult = await saveParsedDataToSupabase(parsedData);
            // responses.push({ filename: file.originalname, supabaseResult });
          } else {
            responses.push({ filename: file.originalname, message: 'Unsupported file type' });
          }
        }
        console.log(combinedData);
    
        res.json(responses);
    } catch (error) {
        console.error('Error in /upload/mentor endpoint:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.get('/', (req, res) => {
    res.send('Server is running!');
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
