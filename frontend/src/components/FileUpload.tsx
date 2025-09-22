import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onAnalysis: (analysis: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<Props> = ({ onAnalysis, loading, setLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze resume');
    }
    
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`upload-zone ${dragActive ? 'active' : ''}`}
         onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
         onDragLeave={() => setDragActive(false)}
         onDrop={handleDrop}>
      
      <input 
        type="file" 
        accept=".pdf,.docx" 
        onChange={handleFileInput}
        disabled={loading}
        style={{ display: 'none' }}
        id="file-input"
      />
      
      <label htmlFor="file-input" className="upload-label">
        {loading ? 'Analyzing...' : 'Click or drag resume here'}
        <p>Supports PDF and DOCX files</p>
      </label>
    </div>
  );
};

export default FileUpload;