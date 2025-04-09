import React, { useState } from 'react';
import axios from 'axios';
import './FeelingInput.css';

const FeelingInputComponent = ({ onSuggest }) => {
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
              content: "The user will give his current health condition. Suggest a specialist doctor or general physician based on the user's input. Respond with just one word like 'Cardiologist' or 'General physician'.",
            },
            {
              role: "user",
              content: `I am having ${text}. Suggest me the respective doctor specialist regarding to the disease given. Just return the doctor specialist in one word.`,
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

  return (
    <div className="feeling-input-component">
      <div className="feeling-container">
        <div className="feeling-card">
          <div className="header">
            <h2>How are you feeling today?</h2>
            <p>Describe your symptoms and we'll help you find the right specialist</p>
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
                <span>Find Specialist</span>
              </>
            )}
          </button>

          {response && (
            <div className="result-card">
              <h3 className="result-title">Recommended Specialist</h3>
              <div className="specialist-name">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeelingInputComponent;
