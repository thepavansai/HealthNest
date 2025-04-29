import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ViewFeedback.css';
 import { BASE_URL } from '../../config/apiConfig';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/feedbacks`);
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

  if (loading) {
    return <div className="loading-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (<>
    <Header></Header>
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
          <div className="no-feedback-message">
            No feedback found.
          </div>
        ) : (
          feedbacks.map(feedback => (
            <div
              key={feedback.id}
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
                  <span className="detail-value">{activeFeedback.userName|| 'Unknown'}</span>
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
              <button className="detail-btn mark-read">Mark as Read</button>
              <button className="detail-btn archive">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer></Footer>
    </>
  );
};

export default ViewFeedback;