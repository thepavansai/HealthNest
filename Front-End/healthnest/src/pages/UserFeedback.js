import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from 'react-rating';
import './UserFeedback.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    feedback: '',
    rating: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rate) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/users/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate('/user'), 2000);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div
      className="doctor-login-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/images/UserFeedback.jpg'})`,
      }}
    >
      <div className="feedback-container">
        <div className="feedback-card">
          <h2 className="feedback-title">User Feedback</h2>
          <form onSubmit={handleSubmit} className="feedback-form">
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="feedback"
              placeholder="Write your experience and suggestions here..."
              value={formData.feedback}
              onChange={handleChange}
              rows={5}
              required
            />

            <div className="rating-section">
              <label>Rate your experience:</label>
              <Rating
                initialRating={formData.rating}
                onChange={handleRatingChange}
                fractions={1}
                step={1}
                emptySymbol={<i className="far fa-star"></i>}
                fullSymbol={<i className="fas fa-star"></i>}
              />
              <div className="rating-value">Your Rating: {formData.rating}</div>
            </div>

            <button type="submit" className="feedback-button">
              Submit Feedback
            </button>

            {submitted && <p className="success-message">✅ Feedback sent successfully!</p>}
            {error && <p className="error-message">❌ {error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
