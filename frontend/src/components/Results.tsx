import React from 'react';
import { motion } from 'framer-motion'; // Add import

interface Analysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
  atsMatch: number; // New: ATS compatibility score
  missingKeywords: string[]; // New: Missing UAE job keywords
}

interface Props {
  analysis: Analysis;
}

const Results: React.FC<Props> = ({ analysis }) => {
  return (
    <motion.div
      className="results"
      initial={{ opacity: 0 }} // Start hidden
      animate={{ opacity: 1 }} // Fade in
      transition={{ duration: 0.6 }} // Smooth 0.6s animation
    >
      <motion.div
        className="score-section"
        initial={{ opacity: 0, scale: 0.8 }} // Start small and hidden
        animate={{ opacity: 1, scale: 1 }} // Scale to normal
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2>Resume Score</h2>
        <div className={`score ${analysis.score >= 70 ? 'good' : analysis.score >= 50 ? 'medium' : 'poor'}`}>
          {analysis.score}/100
        </div>
      </motion.div>

      <div className="feedback-grid">
        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }} // Start left
          animate={{ opacity: 1, x: 0 }} // Slide in
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>💪 Strengths</h3>
          <ul>
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>🎯 Areas to Improve</h3>
          <ul>
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>💡 Suggestions</h3>
          <ul>
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3>🔑 Key Keywords</h3>
          <div className="keywords">
            {analysis.keywords.map((keyword, index) => (
              <span key={index} className="keyword">{keyword}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3>📊 ATS Compatibility (UAE Tech Jobs)</h3>
          <div className="ats-score">{analysis.atsMatch}% Match</div>
          <p>Missing Keywords: {analysis.missingKeywords.join(', ')}</p>
          <p>Add these to improve ATS filtering for UAE tech roles!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Results;