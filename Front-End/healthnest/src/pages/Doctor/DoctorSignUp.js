import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorSignUp.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    hospitalName: '',
    specializedrole: '',
    phone: '',
    consultationFee: '',
    availability: [],
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        availability: checked
          ? [...prevState.availability, value]
          : prevState.availability.filter(day => day !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
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

    const exp = Number(formData.experience);
    if (isNaN(exp) || exp < 0 || exp > 50) {
      setIsError(true);
      setMessage("Experience should be between 0 and 50 years");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setIsError(true);
      setMessage("Phone number should be 10 digits");
      return false;
    }

    const fee = parseFloat(formData.consultationFee);
    if (isNaN(fee) || fee <= 0) {
      setIsError(true);
      setMessage("Consultation fee should be a positive number");
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      setIsError(true);
      setMessage("Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number");
      return false;
    }

    if (formData.availability.length === 0) {
      setIsError(true);
      setMessage("Please select at least one day of availability");
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
      setIsError(true);
      setMessage("Passwords do not match!");
      return;
    }

    const binaryAvailability = daysOfWeek.map(day =>
      formData.availability.includes(day) ? '1' : '0'
    ).join('');

    const payload = {
      doctorName: formData.name,
      emailId: formData.email,
      experience: Number(formData.experience),
      hospitalName: formData.hospitalName,
      specializedrole: formData.specializedrole,
      docPhnNo: formData.phone,
      consultationFee: parseFloat(formData.consultationFee),
      password: formData.password,
      availability: binaryAvailability,
      gender: "MALE",
      rating: 0.0,
      status: 0
    };

    try {
      const res = await axios.post("http://localhost:8080/doctor-signup", payload);
      if (res.status === 200) {
        setIsError(false);
        setMessage("Successfully signed up! Redirecting to login...");
        setTimeout(() => navigate("/doctor/login"), 2000);
      }
    } catch (err) {
      setIsError(true);
      setMessage("Error occurred during signup. Please try again.");
    }
  };

  return (
    <>
    <Header/>
    <div className="doctor-signup-container">
      <h2 className="signup-title">Doctor Signup</h2>
      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="doctor-signup-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
        <input type="text" name="experience" placeholder="Experience (in years)" value={formData.experience} onChange={handleChange} required />
        <input type="text" name="hospitalName" placeholder="Hospital Name" value={formData.hospitalName} onChange={handleChange} required />
        <input type="text" name="specializedrole" placeholder="specializedrole" value={formData.specializedrole} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="number" name="consultationFee" placeholder="Consultation Fee" value={formData.consultationFee} onChange={handleChange} required />
        <div className="availability-section">
          <label>Availability (Days):</label>
          <div className="availability-checkboxes">
            {daysOfWeek.map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  name="availability"
                  value={day}
                  checked={formData.availability.includes(day)}
                  onChange={handleChange}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Password" 
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

        <div className="password-wrapper">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword" 
            placeholder="Confirm Password" 
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

        <button type="submit" className="signup-btn">Signup</button>
        <p className="login-redirect">
          Already have an account? <Link to="/doctor/login">Login</Link>
        </p>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default DoctorSignup;