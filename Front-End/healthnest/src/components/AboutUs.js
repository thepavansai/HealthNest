import React from 'react';
import './AboutUs.css';
import Footer from './Footer';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  
  const handleJoinClick = () => {
    navigate('/doctor/signup');
  };
  
  return (
    <>
      <Header/>
      <div className="about-container">
        <section className="about-header">
          <h1>Welcome to HealthNest</h1>
          <p>Your trusted partner in health and wellness.</p>
        </section>
        
        <section className="about-intro">
          <div className="intro-content">
            <h2>About HealthNest</h2>
            <p>
              HealthNest is a revolutionary healthcare platform designed to bridge the gap between patients 
              and specialist doctors. We understand that finding the right medical professional for your 
              specific health concerns can be challenging, which is why we've created a seamless, 
              user-friendly solution that connects you with specialists based on your symptoms.
            </p>
            <p>
              Our platform leverages advanced technology to ensure you receive personalized healthcare 
              recommendations, making your journey to wellness simpler and more efficient.
            </p>
          </div>
         
        </section>

        <section className="vision-mission">
          <div className="card">
            <h2>Our Vision</h2>
            <hr />
            <p>
              Empower individuals through accessible healthcare solutions and cutting-edge technology to
              live healthier lives.
            </p>
          </div>
          <div className="card">
            <h2>Our Mission</h2>
            <hr />
            <p>
              At HealthNest, we aim to connect patients with the most suitable specialist doctors based on
              their symptoms and health concerns. We strive to make healthcare accessible, convenient, and
              effective for everyone.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Choose HealthNest?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Symptom-Based Matching</h3>
              <p>Our intelligent system suggests the most appropriate specialists based on your symptoms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Scheduling</h3>
              <p>Book, reschedule, or cancel appointments with just a few clicks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Verified Specialists</h3>
              <p>All doctors on our platform are thoroughly vetted and credentialed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Supportive Experience</h3>
              <p>User-friendly interface with dedicated customer support.</p>
            </div>
          </div>
        </section>

        
          
          

        <section className="about-doctors">
          <h2>Join Our Doctor Community</h2>
          <p>
            Are you a medical professional passionate about helping people?
            Partner with us to reach more patients and grow your practice with HealthNest.
          </p>
          <button className="join-button" onClick={handleJoinClick}>
            Join Us
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;