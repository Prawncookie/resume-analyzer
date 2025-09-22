import React, { useState } from 'react';
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
}

// These are like variables that can change and update the UI
function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  //The Main Layout you feel like typa shi the user actually gon see... you feel me
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Resume Analyzer</h1>
        <p>Upload your resume and get instant feedback</p>
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