import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ViewFeedback.css';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);
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
        const response = await axios.get('http://localhost:8080/admin/feedbacks', getAuthHeader());
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
  };

  const closeFeedbackDetail = () => {
    setActiveFeedback(null);
  };

  const handleMarkAsRead = async (feedbackId) => {
    try {
      await axios.put(`http://localhost:8080/admin/feedbacks/${feedbackId}/read`, {}, getAuthHeader());
      // Update the local state to reflect the change
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, status: 'read' } : feedback
      ));
      // Update active feedback if it's the one being marked
      if (activeFeedback && activeFeedback.id === feedbackId) {
        setActiveFeedback({ ...activeFeedback, status: 'read' });
      }
    } catch (error) {
      console.error('Error marking feedback as read:', error);
    }
  };

  const handleArchiveFeedback = async (feedbackId) => {
    try {
      await axios.put(`http://localhost:8080/admin/feedbacks/${feedbackId}/archive`, {}, getAuthHeader());
      // Update the local state to reflect the change
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, status: 'archived' } : feedback
      ));
      // Close the modal if the archived feedback is currently active
      if (activeFeedback && activeFeedback.id === feedbackId) {
        closeFeedbackDetail();
      }
    } catch (error) {
      console.error('Error archiving feedback:', error);
    }
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
          <div className="summary-card">
            <h2>New Feedbacks</h2>
            <span className="count">
              {feedbacks.filter(feedback => feedback.status === 'new').length}
            </span>
          </div>
        </div>
        <div className="feedback-list">
          {feedbacks.length === 0 ? (
            <div className="no-feedback-message">
              No feedback found.
            </div>
          ) : (
            feedbacks.map(feedback => (
              <div
                key={feedback.feedBackId}
                className={`feedback-card ${feedback.status === 'new' ? 'new' : ''}`}
                onClick={() => openFeedbackDetail(feedback)}
              >
                <div className="feedback-card-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {feedback.userName ? feedback.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3>{feedback.userName || 'Unknown User'}</h3>
                      <p className="user-email">{feedback.userEmail || 'No Email Provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="feedback-preview">
                  {feedback.feedback?.length > 120
                    ? `${feedback.feedback.substring(0, 120)}...`
                    : feedback.feedback
                  }
                </div>
                <div className="feedback-card-footer">
                  <div className="feedback-type">{feedback.type}</div>
                  {feedback.status === 'new' && <div className="feedback-badge">New</div>}
                </div>
              </div>
            ))
          )}
        </div>
        {activeFeedback && (
          <div className="feedback-detail-overlay">
            <div className="feedback-detail-modal">
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
                  className="detail-btn mark-read" 
                  onClick={() => handleMarkAsRead(activeFeedback.id)}
                  disabled={activeFeedback.status !== 'new'}
                >
                  Mark as Read
                </button>
                <button 
                  className="detail-btn archive" 
                  onClick={() => handleArchiveFeedback(activeFeedback.id)}
                >
                  Archive
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
