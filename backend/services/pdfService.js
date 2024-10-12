const fs = require('fs');
const pdf = require('pdf-parse');

// Function to extract text from a PDF
async function extractTextFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const data = await pdf(dataBuffer);
    return data.text; // Returns the extracted text from the PDF
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

module.exports = { extractTextFromPdf };
