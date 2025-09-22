# AI Resume Analyzer
A tool to analyze resumes using AI, built from scratch with no coding experience, aimed at optimizing resumes for UAE tech jobs.

## Why It’s Special
- Built by a Comp Sci student (no prior coding skills) for UAE job seekers targeting 8–10K AED/month roles.
- Uses React, Node.js, and OpenAI to score resumes and suggest improvements.
- Learned Git, APIs, and debugging through trial and error.

## Features
- Upload PDF/DOCX resumes via Multer.
- Extract text with `pdf-parse` (PDF) and `mammoth` (DOCX).
- AI analysis (currently mock data, awaiting OpenAI credits on Sept 26).
- Displays score, strengths, weaknesses, suggestions, and keywords.

## Tech Stack
- **Frontend**: React, TypeScript, Axios
- **Backend**: Node.js, Express, Multer, OpenAI
- **Tools**: Git, GitHub, VS Code

## My Journey
- **Day 1 (Sept 21, 2025)**: Set up `frontend/` (React + TypeScript) and `backend/` (Node.js + Express). Added file upload support in `server.js` using Multer for PDF/DOCX. Learned `express` runs the server, `cors` connects frontend-backend, and `dotenv` hides API keys.
- **Day 2**: Created `FileUpload.tsx` for uploads and `Results.tsx` for displaying AI analysis. Hit ESLint `import/first` error in `Results.tsx`—fixed by ensuring `import React from 'react';` was at the top and clearing cache.
- **Day 3**: Added mock response in `server.js` to bypass OpenAI quota error (no credits until Sept 26). App now shows sample analysis (score: 85, strengths, etc.).
- **Day 4**: Fixed GitHub repo—added `frontend/` and `server.js` using VS Code Git. Updated `.gitignore` to exclude `node_modules/` and `.env`.

## Challenges Overcome
- Fixed ESLint/TypeScript errors (e.g., `import/first`, `useState` issues).
- Debugged OpenAI 429 quota error with mock data.
- Learned Git commits and `.gitignore` to manage repo.

## Next Steps
- Add OpenAI credits (Sept 26) for real AI analysis.
- Deploy to Vercel (frontend) and Railway (backend).
- Tailor for UAE job market and improve the User Interface

## Live Demo
[To be added post-deployment]

## Goal
Land a high-paying software dev job (8–10K AED/month) in the UAE, leveraging this project and my Comp Sci degree (Cybersecurity/IT honors).