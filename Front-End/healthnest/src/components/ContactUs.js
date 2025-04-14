import React from 'react';
import './ContactUs.css';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, HeartPulse, Users,Star } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
const ContactUs = () => {
  return (
    <>
    <Header/>
    <div className="contact-container">
      <h1 className="contact-title">Let’s Connect at HealthNest </h1>
      <p className="contact-subtitle">
        Your health journey matters. Whether you have questions, feedback, or need help finding the right care, we’re here for you—every step of the way.
      </p>

      <section className="intro-section">
        <HeartPulse className="icon-big" />
        <p>
          <strong>HealthNest</strong> is your personalized healthcare companion. From symptom tracking to finding the perfect specialist, from quick home remedies to booking an appointment — we make it seamless, secure, and supportive. Our vision? A healthier you, made easier with tech and empathy. 💚
        </p>
      </section>

      <div className="contact-grid">
        

        <div className="contact-card">
          <Phone className="icon" />
          <h3>Customer Support</h3>
          <p> +91 99887 76655</p>
          <p>We're just a call away for any app or appointment help.</p>
        </div>

        <div className="contact-card">
          <Phone className="icon" />
          <h3>Emergency Helpdesk</h3>
          <p> +91 80088 12345</p>
          <p>Available 24/7 for urgent medical connections.</p>
        </div>

        <div className="contact-card">
          <Mail className="icon" />
          <h3>Email Us</h3>
          <p>support@healthnest.in</p>
          <p> media@healthnest.in</p>
          <p> feedback@healthnest.in</p>
        </div>

        <div className="contact-card">
          <MapPin className="icon" />
          <h3>Corporate HQ</h3>
          <p> 2nd Floor, Wellness Towers, MyHome Twitza, Madhapur, Hyderabad – 500081, Telangana</p>
        </div>

        

        <div className="contact-card">
          <Users className="icon" />
          <h3>Join Our Team</h3>
          <p> Careers at HealthNest – we are open to collaborate</p>
          <p> careers@healthnest.in</p>
        </div>

        <div className="contact-card">
          <Star className="icon" />
          <h3>Give Feedback</h3>
          <p>Your suggestions help us serve better. </p>
          <p> feedback@healthnest.in</p>
        </div>

        <div className="contact-card">
          <h3>Follow Us</h3>
          <div className="social-icons">
          <a href="https://facebook.com"><Facebook /></a>
            <a href="https://twitter.com"><Twitter /></a>
            <a href="https://instagram.com"><Instagram /></a>
            <a href="https://linkedin.com"><Linkedin /></a>
          </div>
        </div>

        
      </div>

      <footer className="contact-footer">
        <p>
          💡 <strong>Note:</strong> HealthNest is not a substitute for emergency medical services. For emergencies, contact your local hospital or dial 108.
        </p>
      </footer>
    </div>
    <Footer />
    </>
  );
};

export default ContactUs;
