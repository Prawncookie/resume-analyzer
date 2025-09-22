const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files allowed'), false);
    }
  }
});

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Extract text from PDF
async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

// Extract text from DOCX
async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeResume(resumeText) {
  // Commented out OpenAI API call to avoid quota error
  /*
  const prompt = `
  Analyze this resume and provide feedback in JSON format:
  
  Resume: ${resumeText}
  
  Provide response in this exact JSON format:
  {
    "score": number (0-100),
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "keywords": ["keyword1", "keyword2"]
  }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return JSON.parse(response.choices[0].message.content);
  */
  
  // Mock response for testing without OpenAI
  return {
    score: 85,
    strengths: ["Strong technical skills", "Relevant experience"],
    weaknesses: ["Formatting issues", "Limited project details"],
    suggestions: ["Add quantifiable achievements", "Use action verbs"],
    keywords: ["JavaScript", "React", "Node.js"]
  };
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working gg!' });
});

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let resumeText = '';
    
    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      resumeText = await extractPdfText(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractDocxText(req.file.buffer);
    }

    // Analyze with mock data (or OpenAI when credits are available)
    const analysis = await analyzeResume(resumeText);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});