import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserFeedback.css';

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    feedback: '',
  });

  const [submitted, setSubmitted] = useState(false); // 👈 state to show message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Feedback:', formData);
    setSubmitted(true); // 👈 show success message
    // Optional: clear form after submission
    // setFormData({
    //   userId: '',
    //   userName: '',
    //   email: '',
    //   feedback: '',
    // });

    // Optional: redirect after delay
     setTimeout(() => navigate('/user'), 2000);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2 className="feedback-title">💬 User Feedback Form</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          
          <input
            type="text"
            name="userName"
            placeholder=" User Name"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder=" Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="feedback"
            placeholder=" Write your experience and suggestions here..."
            value={formData.feedback}
            onChange={handleChange}
            rows={5}
            required
          />
          <button type="submit" className="feedback-button"> Submit Feedback</button>

          {/* ✅ Success message shown here */}
          {submitted && <p className="success-message">✅ Feedback sent successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default UserFeedback;
