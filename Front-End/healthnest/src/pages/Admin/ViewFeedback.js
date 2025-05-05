import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ViewFeedback.css';
import { BASE_URL } from '../../config/apiConfig';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null); // Add state for flipped card
  const navigate = useNavigate();

  // Get auth token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/feedbacks`, getAuthHeader());
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to fetch feedback data. Please try again later.');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const openFeedbackDetail = (feedback) => {
    setActiveFeedback(feedback);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeFeedbackDetail = () => {
    setActiveFeedback(null);
    // Restore body scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };

  const handleCardFlip = (cardId) => {
    setFlippedCardId(flippedCardId === cardId ? null : cardId); // Toggle flip state
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading feedback data...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="view-feedback-container">
        <header className="feedback-header">
          <h1>User Feedback</h1>
          <p>Review and respond to user feedback across the platform</p>
        </header>
        
        <div className="feedback-summary">
          <div className="summary-card">
            <h2>Total Feedbacks</h2>
            <span className="count">{feedbacks.length}</span>
          </div>
        </div>
        
        <div className="feedback-list">
          {feedbacks.length === 0 ? (
            <div className="no-feedback-message">No feedback found.</div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.feedBackId}
                className={`flip-card ${flippedCardId === feedback.feedBackId ? 'flipped' : ''}`}
                onClick={() => handleCardFlip(feedback.feedBackId)} // Handle flip
              >
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <div className="user-header">
                      <div className="user-avatar">
                        {feedback.userName ? feedback.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <h3>{feedback.userName || 'Unknown User'}</h3>
                      <p className="feedback-preview">
                        {feedback.feedback?.length > 120
                          ? `${feedback.feedback.substring(0, 120)}...`
                          : feedback.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h3>{feedback.userName || 'Unknown User'}</h3>
                    <div className="flip-card-back-info">
                      <p>
                        <span className="detail-label">Feedback:</span> {feedback.feedback}
                      </p>
                      {feedback.rating && (
                        <p>
                          <span className="detail-label">Rating:</span> {feedback.rating} / 5
                        </p>
                      )}
              
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the flip
                          openFeedbackDetail(feedback);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activeFeedback && (
          <div className="feedback-detail-overlay" onClick={closeFeedbackDetail}>
            <div className="feedback-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="feedback-detail-header">
                <h2>Feedback Details</h2>
                <button className="close-modal-btn" onClick={closeFeedbackDetail}>×</button>
              </div>
              
              <div className="feedback-detail-content">
                <div className="feedback-user-details">
                  <div className="detail-row">
                    <span className="detail-label">From:</span>
                    <span className="detail-value">{activeFeedback.userName || 'Unknown'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{activeFeedback.userEmail || 'N/A'}</span>
                  </div>
                 
                  
                </div>
                
                <div className="feedback-message">
                  <h3>Message</h3>
                  <p>{activeFeedback.feedback}</p>
                </div>
                
                {activeFeedback.rating && (
                  <div className="feedback-rating">
                    <h3>Rating</h3>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < activeFeedback.rating ? 'star filled' : 'star'}>★</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="feedback-detail-footer">
                <button 
                  className="close-detail-btn"
                  onClick={closeFeedbackDetail}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewFeedback;
