import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Footer from './Footer';
import Header from './Header';
import './Remedies.css';

const Remedies = ({ onSuggest }) => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
              content: `You are a helpful health assistant who provides evidence-based suggestions and remedies based on WHO guidelines. 
              When a user describes their symptoms, provide clear recommendations following this exact format:

              **Suggestions:**
              1. **First suggestion title**: Brief explanation
              2. **Second suggestion title**: Brief explanation
              3. **Third suggestion title**: Brief explanation
              4. **Fourth suggestion title**: Brief explanation

              **Remedies:**
              1. **First remedy title**: Brief explanation
              2. **Second remedy title**: Brief explanation 
              3. **Third remedy title**: Brief explanation

              Always include a reminder to consult healthcare professionals for persistent symptoms.
              Do not diagnose specific conditions or recommend medications.
              If symptoms are unclear, politely ask for clarification.`
            },
            {
              role: "user",
              content: `I am having ${text}. Please provide suggestions and remedies for my symptoms without mentioning specific disease names or specialist types.`
            },
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const doctorSuggestion = res.data.choices[0].message.content.trim();
      setResponse(doctorSuggestion);

      if (onSuggest) {
        onSuggest(doctorSuggestion);
      }
      setIsLoading(false);
    } catch (error) {
      setResponse("Error: " + error.message);
      setIsLoading(false);
    }
  };

  // Function to handle specialist consultation
  const handleConsultSpecialist = () => {
    // Store symptoms in localStorage for CheckHealth page to access
    localStorage.setItem('userSymptoms', text);
    // Navigate to CheckHealth page
    navigate('/user/check-health');
  };

  const formatResponse = (response) => {
    // Improve bold text handling
    const formatBoldText = (text) => {
      if (!text) return '';
      return text.split(/(\*\*[^*]+?\*\*)/).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    // Split text into sections by looking for headers
    const sections = response.split(/\n\n(?=\*\*[A-Za-z]+:)|\n(?=\*\*[A-Za-z]+:)/g)
      .filter(section => section.trim().length > 0);
    
    let formattedSections = [];

    sections.forEach((section, sectionIndex) => {
      if (section.trim().length === 0) return;
      
      // Check if this has a header (like "**Suggestions:**")
      const headerMatch = section.match(/^\*\*([A-Za-z]+):\*\*/);
      
      if (headerMatch) {
        const heading = headerMatch[1];
        // Remove the header from content
        const content = section.replace(/^\*\*[A-Za-z]+:\*\*/, '').trim();
        
        formattedSections.push(
          <div key={`section-${sectionIndex}`} className="remedy-section">
            <h4 className="remedy-section-title">{heading}</h4>
            <div className="remedy-section-content">
              {processListItems(content, heading)}
            </div>
          </div>
        );
      } else {
        // Plain text section (like a reminder)
        formattedSections.push(
          <p key={`text-${sectionIndex}`} className="remedy-text">
            {formatBoldText(section.trim())}
          </p>
        );
      }
    });
    
    // Process numbered items in a section with proper formatting
    function processListItems(content, sectionType) {
      if (!content) return null;
      
      // Split content into lines and filter out empty ones
      const lines = content.split(/\n/).filter(line => line.trim().length > 0);
      const items = [];
      
      lines.forEach((line, lineIndex) => {
        // Match numbered items like "1. Content" or "1. **Title**: Content"
        const numberedItem = line.match(/^\d+\.\s*(.*)/);
        
        if (numberedItem) {
          const itemContent = numberedItem[1];
          items.push(
            <li key={`item-${lineIndex}`} className="remedy-point">
              {/* Add star icons for both Suggestions and Remedies sections */}
              <span className="point-star">★</span>
              <span className="point-content">{formatBoldText(itemContent)}</span>
            </li>
          );
        } else {
          // Handle non-numbered lines (like additional info)
          items.push(
            <p key={`text-${lineIndex}`} className="remedy-text">
              {formatBoldText(line)}
            </p>
          );
        }
      });
      
      return items.length > 0 ? (
        <ul className="remedy-list">{items}</ul>
      ) : null;
    }

    return formattedSections;
  };

  return (<>
    <Header />
    <div className="feeling-input-component">
      <div className="feeling-container">
        <div className="feeling-card">
          <div className="header">
            <h2>How are you feeling today?</h2>
            <p>Describe your symptoms and we'll provide evidence-based suggestions</p>
          </div>

          <div className="input-area">
            <textarea
              className="symptom-textarea"
              placeholder="Please describe your symptoms (e.g., headache, fever, sore throat)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Suggest</span>
                </>
              )}
            </button>

          </div>

          {response && (
            <div className="result-card">
              <h3 className="result-title">Health Recommendations</h3>
              <div className="remedies-content">
                {formatResponse(response)}
              </div>
              <div className="who-footer">
                <p>Data sourced from World Health Organization (WHO) guidelines</p>
                <small>Note: These are general recommendations. Please consult a healthcare professional for specific medical advice.</small>
                
                {/* Add specialist consultation button at the bottom of results */}
                <div className="specialist-cta">
                  <p>Need further assistance?</p>
                  <button 
                    className="consult-specialist-button-secondary"
                    onClick={handleConsultSpecialist}
                  >
                    Consult a Specialist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default Remedies;