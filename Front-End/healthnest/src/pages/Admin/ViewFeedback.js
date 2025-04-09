import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ViewFeedback.css';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/feedbacks');
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feedback data. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const openFeedbackDetail = (feedback) => {
    setActiveFeedback(feedback);
  };

  const closeFeedbackDetail = () => {
    setActiveFeedback(null);
  };

  const filteredFeedbacks = () => {
    if (filterStatus === 'all') return feedbacks;
    return feedbacks.filter(feedback => feedback.status === filterStatus);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div className="loading-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-feedback-container">
      <header className="feedback-header">
        <h1>User Feedback</h1>
        <p>Review and respond to user feedback across the platform</p>
      </header>

      <div className="feedback-filters">
        <div className="filter-group">
          <span>Filter by status:</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} 
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'new' ? 'active' : ''}`} 
              onClick={() => setFilterStatus('new')}
            >
              New
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`} 
              onClick={() => setFilterStatus('read')}
            >
              Read
            </button>
          </div>
        </div>
        <div className="feedback-count">
          Showing <strong>{filteredFeedbacks().length}</strong> of <strong>{feedbacks.length}</strong> total
        </div>
      </div>

      <div className="feedback-list">
        {filteredFeedbacks().length === 0 ? (
          <div className="no-feedback-message">
            No feedback found matching your criteria.
          </div>
        ) : (
          filteredFeedbacks().map(feedback => (
            <div 
              key={feedback.id} 
              className={`feedback-card ${feedback.status === 'new' ? 'new' : ''}`}
              onClick={() => openFeedbackDetail(feedback)}
            >
              <div className="feedback-card-header">
                <div className="user-info">
                  <div className="user-avatar">{feedback.username.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{feedback.username}</h3>
                    <p className="user-email">{feedback.email}</p>
                  </div>
                </div>
                <div className="feedback-date">{formatDate(feedback.submittedAt)}</div>
              </div>
              <div className="feedback-preview">
                {feedback.content.length > 120 
                  ? `${feedback.content.substring(0, 120)}...` 
                  : feedback.content
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
                  <span className="detail-value">{activeFeedback.username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{activeFeedback.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(activeFeedback.submittedAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{activeFeedback.type}</span>
                </div>
              </div>
              <div className="feedback-message">
                <h3>Message</h3>
                <p>{activeFeedback.content}</p>
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
              <button className="detail-btn mark-read">Mark as Read</button>
              <button className="detail-btn archive">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;