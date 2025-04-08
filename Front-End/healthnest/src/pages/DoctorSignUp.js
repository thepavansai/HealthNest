import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DoctorSignUp.css'; // create this CSS file or use global styles

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    hospitalName: '',
    specialization: '',
    phone: '',
    consultationFee: '',
    availability: [],
    password: '',
    confirmPassword: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with actual submission logic
  };

  return (
    <div className="doctor-signup-container">
      <h2 className="signup-title">Doctor Signup</h2>
      <form onSubmit={handleSubmit} className="doctor-signup-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
        <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required />
        <input type="text" name="hospitalName" placeholder="Hospital Name" value={formData.hospitalName} onChange={handleChange} required />
        <input type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="number" name="consultationFee" placeholder="Consultation Fee" value={formData.consultationFee} onChange={handleChange} required />

        <div className="availability-section">
          <label>Availability:</label>
          <div className="availability-checkboxes">
            {daysOfWeek.map(day => (
              <label key={day}>
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

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

        <button type="submit" className="signup-btn">Signup</button>

        <p className="login-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorSignup;
