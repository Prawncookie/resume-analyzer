import React from 'react';

interface Analysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[];
}

interface Props {
  analysis: Analysis;
}

const Results: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="results">
      <div className="score-section">
        <h2>Resume Score</h2>
        <div className={`score ${analysis.score >= 70 ? 'good' : analysis.score >= 50 ? 'medium' : 'poor'}`}>
          {analysis.score}/100
        </div>
      </div>

      <div className="feedback-grid">
        <div className="feedback-section">
          <h3>💪 Strengths</h3>
          <ul>
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3>🎯 Areas to Improve</h3>
          <ul>
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3>💡 Suggestions</h3>
          <ul>
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3>🔑 Key Keywords</h3>
          <div className="keywords">
            {analysis.keywords.map((keyword, index) => (
              <span key={index} className="keyword">{keyword}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;