import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignUp.css';
import Footer from "./Footer";
import Header from "./Header";

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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!/^[A-Za-z\s]{3,}$/.test(formData.name)) {
      setError("Name should contain only letters and be at least 3 characters long");
      return false;
    }

    if (!formData.gender) {
      setError("Please select a gender");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNo)) {
      setError("Phone number should be 10 digits");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18 || age > 120) {
      setError("Age should be between 18 and 120 years");
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      setError("Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/users/Signup', {
        name: formData.name,
        gender: formData.gender,
        password: formData.password,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        phoneNo: formData.phoneNo
      });

      setSuccess(response.data);
      setError('');
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed.");
      setSuccess('');
    }
  };

  return (
    <>
    <Header/>
    <div className="signup-wrapper">
      { }
      <div className="branding">
        <h1>HealthNest</h1>
        <p>Find the right doctor based on your symptoms with our smart healthcare platform.</p>
      </div>
      
      <div className="signup-form">
        <h2>Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="password-field">
            <Form.Label>Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>

          <Form.Group className="password-field">
            <Form.Label>Confirm Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>

          <Button type="submit">Sign Up</Button>
        </Form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SignUp;