import React from 'react';
import './AboutUs.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Footer from './Footer';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    const handleJoinClick = () => {
        navigate('/doctor/signup'); // 👈 Navigate on button click
      };
    
  return (
    <>
    <Header/>
    <div className="about-container">
      <section className="about-header">
        <h1>Welcome to HealthNest</h1>
        <p>Your trusted partner in health and wellness.</p>
      </section>

      <section className="carousel-section">
        <h2>Explore HealthNest</h2>
        <Carousel autoPlay infiniteLoop showThumbs={false} className="carousel">
          <div>
            <img src="/images/about1.jpg" alt="Connecting Patients" className="carousel-image" />
            <p className="legend">Connecting patients with top doctors</p>
          </div>
          <div>
            <img src="/images/about2.jpg" alt="Easy Appointments" className="carousel-image" />
            <p className="legend">Seamless Appointment Booking</p>
          </div>
          <div>
            <img src="/images/about3.jpg" alt="Specialist Network" className="carousel-image" />
            <p className="legend">Wide network of specialists</p>
          </div>
        </Carousel>
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

      <section className="about-details-split">
        <div className="left-space"></div>
        <div className="why-choose-us">
          <h2>Why Choose Us?</h2>
          <ul>
            <li> Symptom-based doctor suggestions</li>
            <li> Easy appointment scheduling & management</li>
            <li> Trusted & verified specialist doctors</li>
            <li> Supportive and user-friendly experience</li>
          </ul>
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
