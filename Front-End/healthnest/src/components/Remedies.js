import React, { useState } from 'react';
import axios from 'axios';
import './Remedies.css';
import Header from './Header';

const Remedies = ({ onSuggest }) => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "The user will give his current health condition. Suggest a WHO recommended Suggestions and remedies for symptoms",
            },
            {
              role: "user",
              content: `I am having ${text}. Donot show my disase name or speciliasit name. Just show the Suggestions and remedies for my symptoms`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const doctorSuggestion = res.data.choices[0].message.content.trim();
      setResponse(doctorSuggestion);

      // 🔔 Notify parent (CheckHealth.js)
      if (onSuggest) {
        onSuggest(doctorSuggestion);
      }
      setIsLoading(false);
    } catch (error) {
      setResponse("Error: " + error.message);
      setIsLoading(false);
    }
  };

  const formatResponse = (response) => {
    const formatBoldText = (text) => {
      return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    // Split response into sections based on common patterns
    const sections = response.split(/\n(?=[A-Z][a-z]* *:)|\n(?=\d+\.)/);
    
    let currentList = [];
    let formattedSections = [];

    sections.forEach((section, index) => {
      if (section.trim().length === 0) return;

      // Check if section starts with number
      const isNumberedPoint = /^(\d+)\.(.*)/.test(section);
      // Check if section has a title
      const hasTitle = /^[A-Z][a-z]* *:/.test(section);

      if (isNumberedPoint) {
        // Extract just the content without the number
        const content = section.replace(/^\d+\./, '').trim();
        currentList.push(
          <li key={`point-${index}`} className="remedy-point">
            <span className="point-star">★</span>
            <span className="point-content">{formatBoldText(content)}</span>
          </li>
        );
      } else {
        // If we have accumulated list items, add them to formatted sections
        if (currentList.length > 0) {
          formattedSections.push(
            <ul key={`list-${index}`} className="remedy-list">
              {currentList}
            </ul>
          );
          currentList = [];
        }

        if (hasTitle) {
          const [title, ...contentParts] = section.split(/:(.*)/s);
          const content = contentParts.join('').trim();
          formattedSections.push(
            <div key={`section-${index}`} className="remedy-section">
              <h4 className="remedy-section-title">{title.trim()}</h4>
              <p className="remedy-section-content">{formatBoldText(content)}</p>
            </div>
          );
        } else {
          formattedSections.push(
            <p key={`text-${index}`} className="remedy-text">
              {formatBoldText(section.trim())}
            </p>
          );
        }
      }
    });

    // Add any remaining list items
    if (currentList.length > 0) {
      formattedSections.push(
        <ul key="final-list" className="remedy-list">
          {currentList}
        </ul>
      );
    }

    return formattedSections;
  };

  return (<>
    <Header/>
    <div className="feeling-input-component">
      <div className="feeling-container">
        <div className="feeling-card">
          <div className="header">
            <h2>How are you feeling today?</h2>
            <p>Describe your symptoms we will give some of  Suggestions </p>
          </div>

          <div className="input-area">
            <textarea
              className="symptom-textarea"
              placeholder="I've been experiencing..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? (
              <>
                <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span>Suggest</span>
              </>
            )}
          </button>

          {response && (
            <div className="result-card">
              <h3 className="result-title">Recommended Suggestions</h3>
              <div className="remedies-content">
                {formatResponse(response)}
              </div>
              <div className="who-footer">
                <p>Data sourced from World Health Organization (WHO) guidelines</p>
                <small>Note: These are general recommendations. Please consult a healthcare professional for specific medical advice.</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Remedies;
