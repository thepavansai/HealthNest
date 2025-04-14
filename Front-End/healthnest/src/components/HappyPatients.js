import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HappyPatients.css";

const HappyPatients = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/feedback/all");
        // Access feedback data directly from response.data
        const filteredFeedbacks = response.data.filter(
          (feedback) => feedback.rating === 4 || feedback.rating === 5
        );
        setFeedbacks(filteredFeedbacks);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to fetch feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="happy-patients-section">
      <h2 className="section-title text-center mb-4">Our Happy Patients</h2>
      <div className="feedback-grid">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-card">
            <p className="feedback-message">"{feedback.feedback}"</p>
            <div className="feedback-rating">
              {Array(feedback.rating)
                .fill("★")
                .map((star, i) => (
                  <span key={i} className="star gold-star">
                    {star}
                  </span>
                ))}
            </div>
            <p className="feedback-user">- {feedback.userName}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HappyPatients;