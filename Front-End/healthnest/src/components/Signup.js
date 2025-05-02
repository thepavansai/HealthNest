import axios from 'axios';
import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaUser
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import Footer from "./Footer";
import Header from "./Header";
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    password: '',
    confirmPassword: '',
    email: '',
    dateOfBirth: '',
    phoneNo: ''
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!/^[A-Za-z\s]{3,}$/.test(formData.name)) {
      setIsError(true);
      setMessage("Name should contain only letters and be at least 3 characters long");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setIsError(true);
      setMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.gender) {
      setIsError(true);
      setMessage("Please select a gender");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNo)) {
      setIsError(true);
      setMessage("Phone number should be 10 digits");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();


    const hasBirthdayOccurred =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    const adjustedAge = hasBirthdayOccurred ? age : age - 1;

    if (adjustedAge < 18 || adjustedAge > 120) {
      setIsError(true);
      setMessage("Age should be between 18 and 120 years");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      setIsError(true);
      setMessage("Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    setIsError(false);
    setMessage('');

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setIsError(false);
    setMessage('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    try {
      setMessage("Creating your account...");
      setIsError(false);

      const response = await axios.post(`${BASE_URL}/users/Signup`, {
        name: formData.name,
        gender: formData.gender,
        password: formData.password,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        phoneNo: formData.phoneNo,
        role: "USER"
      });

      setMessage(response.data || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data || "Registration failed. Please try again.");
    }
  };

  const renderStep1 = () => (
    <>
      <h3 className="step-title">Personal Information</h3>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Full Name</label>
        <div className="input-icon-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Aayesha Aggarwal"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <div className="input-icon-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g., Ayesha@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 className="step-title">Additional Details</h3>
      <div className="form-group">
        <label className="gender-label">Gender</label>
        <div className="gender-options">
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="MALE"
              checked={formData.gender === 'MALE'}
              onChange={handleChange}
            />
            <span>Male</span>
          </label>
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="FEMALE"
              checked={formData.gender === 'FEMALE'}
              onChange={handleChange}
            />
            <span>Female</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phoneNo" className="form-label">Phone Number (10 digits)</label>
        <div className="input-icon-wrapper">
          <FaPhone className="input-icon" />
          <input
            type="tel"
            id="phoneNo"
            name="phoneNo"
            placeholder="e.g., 9876543210"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
        <div className="input-icon-wrapper">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="date-hint">You must be at least 18 years old</div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h3 className="step-title">Security</h3>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-icon-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="password-requirements">
          Must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <div className="input-icon-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header/>
      <div
        className="user-signup-bg"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/images/UserLogin.jpg"})`
        }}
      >
        <div className="user-signup-container">
          <div className="signup-card">
            <h2 className="signup-title">Create Your Account</h2>

            <div className="progress-steps">
              <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-text">Basic</div>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-text">Details</div>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-text">Security</div>
              </div>
            </div>

            {message && (
              <div className={`message-alert ${isError ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()} className="user-signup-form">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="form-buttons">
                {currentStep > 1 && (
                  <button type="button" className="prev-btn" onClick={prevStep}>
                    Previous
                  </button>
                )}

                {currentStep < 3 && (
                  <button type="button" className="next-btn" onClick={nextStep}>
                    Next
                  </button>
                )}

                {currentStep === 3 && (
                  <button type="submit" className="signup-btn">
                    Create Account
                  </button>
                )}
              </div>
            </form>

            <div className="login-redirect">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SignUp;