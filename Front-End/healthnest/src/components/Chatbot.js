import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your HealthNest assistant. How can I help you today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLinkClick = useCallback((path) => {
    navigate(path);
    // Optionally close the chatbot after navigation
    // setIsOpen(false);
  }, [navigate]);

  const formatResponse = (text) => {
    // Replace URLs with clickable links
    const urlRegex = /(https:\/\/health-nest\.netlify\.app\/[a-zA-Z0-9/-]+)/g;
    
    // Create a map of paths to friendly names
    const pathMap = {
      'https://health-nest.netlify.app/user/appointments': 'View Appointments',
      'https://health-nest.netlify.app/user/feedback': 'Give Feedback',
      'https://health-nest.netlify.app/user/check-health': 'Book Appointment',
      'https://health-nest.netlify.app/user/profile': 'Edit Profile',
      'https://health-nest.netlify.app/user/change-password': 'Change Password',
      'https://health-nest.netlify.app/user/remedies': 'View Remedies',
      'https://health-nest.netlify.app/doctor/signup': 'Doctor Registration'
    };
    
    // Replace URLs with buttons
    const rawHtml = text.replace(urlRegex, (url) => {
      const path = url.replace('https://health-nest.netlify.app', '');
      const displayName = pathMap[url] || url;
      return `<button class="chatbot-link-button" data-path="${path}">${displayName}</button>`;
    });
    return DOMPurify.sanitize(rawHtml);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      role: 'user',
      content: inputText
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are a customer support AI agent for HealthNest, a healthcare website. 
              
              About HealthNest:
              At HealthNest, we aim to connect patients with the most suitable specialist doctors based on their symptoms and health concerns. We strive to make healthcare accessible, convenient, and effective for everyone.
              
              Features:
              - Symptom-based doctor suggestions
              - Easy appointment scheduling & management
              - Trusted & verified specialist doctors
              - Supportive and user-friendly experience
              
              Your role is to answer questions related to the website and guide users through various features. When users want to perform specific actions, provide them with the appropriate link:
              
              - For rating doctors: https://health-nest.netlify.app/user/appointments
              - For website feedback: https://health-nest.netlify.app/user/feedback
              - For booking appointments: https://health-nest.netlify.app/user/check-health
              - For editing profile: https://health-nest.netlify.app/user/profile
              - For changing password: https://health-nest.netlify.app/user/change-password
              - For viewing remedies/precautions: https://health-nest.netlify.app/user/remedies
              - For viewing appointments: https://health-nest.netlify.app/user/appointments
              - For doctor registration: https://health-nest.netlify.app/doctor/signup
              
              When users mention symptoms or diseases, ask if they want to see remedies or book an appointment with a specialized doctor.
              
              If users ask about topics unrelated to healthcare or the website, politely guide them back to relevant topics.
              
              Be helpful, concise, and always include the appropriate link when suggesting an action. and answer questions related to the website and its features.and answer question related only don;t give any thing extra after answering eachquestion ask do you need anything else? and when giving link give it and format text to look visually appealing. after giving link ask do you need anything else? give text in next line after link,if anything else other than health or related to website or any appropriate thing enterd by user then say politely that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user ask for any link then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else.don't give stars or asteriks or any other thing in the text. and don't give any extra information after answering each question and also if user says i;m not feeling well or says i'm sick or says i'm not well then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user ask for any link then say do you want to see remedies or book an appointment with a specialized doctor? and if user says yes then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user ask for any link then say do you want to see remedies or book an appointment with a specialized doctor? and if user says yes then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user say want to see remedies then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user ask for any link then say do you want to see remedies or book an appointment with a specialized doctor? and if user says yes then say that i can only assist you with health related queries and website related queries. I am not able to assist you with anything else. and if user say want to see remedies then give link which is https://health-nest.netlify.app/user/remedies and say that here is the link to see remedies if user says bookappointment then give link which is https://health-nest.netlify.app/user/check-health and say that here is the link to book appointment with a specialized doctor. and if user says i want to see remedies then give link which is https://health-nest.netlify.app/user/remedies and say that here is the link to see remedies if user says bookappointment then give link which is https://health-nest.netlify.app/user/check-health and say that here is the link to book appointment with a specialized doctor. and if user says i want to see remedies then give link which is https://health-nest.netlify.app/user/remedies and say that here is the link to see remedies if user says bookappointment then give link which is https://health-nest.netlify.app/user/check-health and say that here is the link to book appointment with a specialized doctor.`
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: inputText }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botResponse = {
        role: 'assistant',
        content: res.data.choices[0].message.content
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Add event listener for link button clicks
  useEffect(() => {
    const handleLinkButtonClick = (e) => {
      if (e.target.classList.contains('chatbot-link-button')) {
        const path = e.target.getAttribute('data-path');
        if (path) {
          handleLinkClick(path);
        }
      }
    };

    document.addEventListener('click', handleLinkButtonClick);
    return () => {
      document.removeEventListener('click', handleLinkButtonClick);
    };
  }, [navigate, handleLinkClick]);

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot className="chatbot-icon" />
              <span>HealthNest Assistant</span>
            </div>
            <button className="close-button" onClick={toggleChatbot}>
              <FaTimes />
            </button>
                    </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ 
                    __html: message.role === 'assistant' 
                      ? formatResponse(message.content) 
                      : DOMPurify.sanitize(message.content) 
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button 
              className="send-button" 
              onClick={sendMessage}
              disabled={isLoading || inputText.trim() === ''}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default Chatbot;

