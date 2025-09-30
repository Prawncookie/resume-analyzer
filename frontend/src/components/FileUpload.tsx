import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
  atsMatch: number;
}

interface Props {
  onAnalysis: (analysis: AnalysisResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const FileUpload: React.FC<Props> = ({ onAnalysis, loading, setLoading, setError }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      console.log('Uploading resume to /api/analyze...');
      const response = await axios.post<AnalysisResult>('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response:', response.data);
      onAnalysis(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to analyze resume';
      console.error('Upload error:', errorMessage);
      setError(errorMessage);
      onAnalysis(null);
    } finally {
      setLoading(false);
    }
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
    <motion.div
      className={`upload-zone ${dragActive ? 'active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.div>
  );
};

export default FileUpload;