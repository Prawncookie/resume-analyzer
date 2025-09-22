import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Icons for toggle
import './App.css';
import FileUpload from './components/FileUpload';
import Results from './components/Results';

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
}

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

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