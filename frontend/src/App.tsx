import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Add icons for toggle
import './App.css';
import FileUpload from './components/FileUpload';
import Results from './components/Results';

// This defines what data structure we expect back from OpenAI
interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
  atsMatch: number; // For ATS matcher
  missingKeywords: string[]; // For ATS matcher
}

// These are like variables that can change and update the UI
function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state

  // The Main Layout you feel like typa shi the user actually gon see... you feel me
  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <header className="App-header">
        <h1>AI Resume Analyzer</h1>
        <p>Optimize your resume for UAE tech jobs</p>
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      <main>
        <FileUpload 
          onAnalysis={setAnalysis} 
          loading={loading}
          setLoading={setLoading}
        />
        
        {analysis && <Results analysis={analysis} />}
      </main>
    </div>
  );
}

export default App;