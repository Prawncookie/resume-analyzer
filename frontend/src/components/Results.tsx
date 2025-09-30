import React from 'react';
import { motion } from 'framer-motion';

interface Analysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
  atsMatch: number;
}

interface Props {
  analysis: Analysis;
}

const Results: React.FC<Props> = ({ analysis }) => {
  return (
    <motion.div
      className="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="score-section"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2>Resume Score</h2>
        <div className={`score ${analysis.score >= 70 ? 'good' : analysis.score >= 50 ? 'medium' : 'poor'}`}>
          {analysis.score}/100
        </div>
      </motion.div>

      <motion.div
        className="ats-score"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        ATS Match: {analysis.atsMatch}%
      </motion.div>

      <div className="feedback-grid">
        <motion.div
          className="feedback-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
          transition={{ duration: 0.5, delay: 0.4 }}
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
          transition={{ duration: 0.5, delay: 0.5 }}
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
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3>🔑 Key Keywords</h3>
          <div className="keywords">
            {analysis.keywords.map((keyword, index) => (
              <span key={index} className="keyword">{keyword}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Results;