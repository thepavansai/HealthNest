import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './UserFeedback.css';
import { BASE_URL } from '../../config/apiConfig';
import Footer from "../../components/Footer";
import Header from "../../components/Header";


const UserFeedback = () => {
  const [formData, setFormData] = useState({
    id: null,
    feedback: '',
    emailId: '',
    rating: 0,
    user: {
      userId: ''
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Already a string
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      toast.error('Please login to submit feedback');
      navigate('/login');
      return;
    }

    setFormData(prev => ({
      ...prev,
      emailId: userEmail || '',
      user: {
        userId: userId // Use string ID
      }
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rate) => {
    setFormData(prev => ({ ...prev, rating: rate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      navigate('/login');
      return;
    }

    setSubmitted(true);
    
    try {
      // Note: The endpoint in your code is /feedback/add but in the controller it's /users/feeback
      // I'm using the endpoint from your controller
      const response = await axios.post(
        `${BASE_URL}/users/feeback`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        toast.success('Feedback submitted successfully!');
        setTimeout(() => navigate('/user'), 2000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token"); // Clear invalid token
        navigate('/login');
      } else {
        toast.error(error.response?.data || 'Failed to submit feedback');
      }
    } finally {
      setSubmitted(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null);
    const stars = useMemo(() => {
      return [...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={25}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      });
    }, [rating, hover, onRatingChange]);

    return <div className="star-rating">{stars}</div>;
  };

  return (
    <><Header/>
    <div
      className="doctor-login-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/images/UserFeedback.jpg'})`,
      }}
    >
      <div className="feedback-container">
        <ToastContainer position="top-right" />
        <div className="feedback-card">
          <h2 className="feedback-title">User Feedback</h2>
          <form onSubmit={handleSubmit} className="feedback-form">
            <input
              type="email"
              name="emailId"
              placeholder="Email ID"
              value={formData.emailId}
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
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
              />
              <div className="rating-value">Your Rating: {formData.rating}</div>
            </div>
            <button 
              type="submit" 
              className="feedback-button"
              disabled={submitted}
            >
              {submitted ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default UserFeedback;
