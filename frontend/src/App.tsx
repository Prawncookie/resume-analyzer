import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import './App.css';
import FileUpload from './components/FileUpload';
import Results from './components/Results';

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
  atsMatch: number;
}

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleAnalysis = (result: AnalysisResult | null) => {
    console.log('Received analysis:', result, 'Error:', error);
    setAnalysis(result);
    if (!result && error) {
      console.log('Setting error in App.tsx:', error);
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <h1>AI Resume Analyzer</h1>
        <p>Optimize your resume for UAE tech jobs</p>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <FileUpload
          onAnalysis={handleAnalysis}
          loading={loading}
          setLoading={setLoading}
          setError={(err) => {
            console.log('FileUpload setError:', err);
            setError(err);
          }}
        />
        {loading && <div className="loading">Analyzing your resume...</div>}
        {analysis && !error && <Results analysis={analysis} />}
      </main>
    </div>
  );
}

export default App;