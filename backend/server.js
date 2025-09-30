const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Validate env vars
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is missing in .env');
  process.exit(1);
}

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genai = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

// Extract text from PDF
async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    console.log('PDF text extracted:', data.text.slice(0, 100) + '...');
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    throw new Error('Failed to extract text from PDF');
  }
}

// Extract text from DOCX
async function extractDocxText(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    console.log('DOCX text extracted:', result.value.slice(0, 100) + '...');
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error.message);
    throw new Error('Failed to extract text from DOCX');
  }
}

async function analyzeResume(resumeText) {
  // List of common tech keywords for UAE jobs
  const techKeywords = [
    'javascript', 'react', 'node.js', 'python', 'java', 'aws', 'typescript',
    'sql', 'mongodb', 'docker', 'kubernetes', 'cloud computing', 'fintech',
    'cybersecurity', 'dubai smart city', 'html', 'css', 'angular', 'vue.js'
  ];

  // Extract keywords from resume
  const words = resumeText.toLowerCase().split(/\W+/);
  const foundKeywords = techKeywords.filter(keyword => 
    words.some(word => word.includes(keyword))
  );
  console.log('Extracted keywords:', foundKeywords);

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
    Analyze this resume for suitability for UAE tech jobs, focusing on ATS (Applicant Tracking System) compatibility. Evaluate based on skills, experience, education, and relevance to tech roles in Dubai (e.g., software development, fintech, smart city projects). Use the extracted keywords (${foundKeywords.join(', ') || 'none'}) to guide the analysis. Provide a score (0-100) reflecting overall quality, with higher scores (90+) for resumes with many relevant skills and quantifiable achievements, average scores (70-85) for moderate relevance, and lower scores (<70) for weak resumes. Ensure the score varies based on the resume's content.

    Resume: ${resumeText}

    Provide response in this exact JSON format:
    {
      "score": number (0-100),
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "keywords": ["keyword1", "keyword2"],
      "atsMatch": number (0-100)
    }
    `;
    console.log('Sending prompt to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Strip Markdown code fences
    responseText = responseText.replace(/```json\n|\n```/g, '').trim();
    console.log('Gemini raw response (cleaned):', responseText);

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      throw new Error('Invalid JSON response from Gemini API');
    }

    // Validate response format
    if (
      typeof analysis.score !== 'number' ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.weaknesses) ||
      !Array.isArray(analysis.suggestions) ||
      !Array.isArray(analysis.keywords) ||
      typeof analysis.atsMatch !== 'number'
    ) {
      console.error('Invalid response format:', analysis);
      throw new Error('Invalid response format from Gemini API');
    }

    // Log final analysis
    console.log('Final analysis:', analysis);
    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    // Fallback mock response (dynamic based on keywords, UAE-focused)
    const keywordCount = foundKeywords.length;
    const baseScore = 50 + (keywordCount * 8); // 50 base + 8 per keyword
    const atsMatch = 40 + (keywordCount * 10); // 40 base + 10 per keyword
    return {
      score: Math.min(baseScore, 95),
      strengths: keywordCount > 3 ? ['Strong technical skills in multiple areas', 'Relevant UAE tech keywords detected'] : ['Basic technical skills', 'Good structure'],
      weaknesses: keywordCount > 3 ? ['Limited quantifiable achievements', 'More Dubai-specific experience needed'] : ['Few technical keywords', 'Needs more skills for ATS'],
      suggestions: ['Add quantifiable achievements (e.g., "Led project saving 20% time")', 'Include UAE-relevant terms like "fintech" or "smart city"'],
      keywords: foundKeywords.length > 0 ? foundKeywords : ['none detected'],
      atsMatch: Math.min(atsMatch, 95)
    };
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working gg!' });
});

// Analyze resume
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file' });
    }

    let resumeText = '';
    if (req.file.mimetype === 'application/pdf') {
      resumeText = await extractPdfText(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractDocxText(req.file.buffer);
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Resume file is empty or unreadable' });
    }

    const analysis = await analyzeResume(resumeText);
    res.json(analysis);
  } catch (error) {
    console.error('Error in /api/analyze:', error.message);
    if (error.message.includes('file size')) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (error.message.includes('Only PDF and DOCX')) {
      return res.status(400).json({ error: 'Only PDF and DOCX files are allowed' });
    }
    res.status(500).json({ error: 'Failed to analyze resume: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});