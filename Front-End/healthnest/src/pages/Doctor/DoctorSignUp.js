import React, { useState } from 'react';
import axios from 'axios';
import {
  FaBriefcase,
  FaCalendarAlt,
  FaRupeeSign,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHospital,
  FaLock,
  FaPhone,
  FaUser,
  FaUserMd,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './DoctorSignUp.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places']; // Define this outside the component
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
    confirmPassword: '',
    gender: 'MALE',
    address: '',
    latitude: 20.5937,
    longitude: 78.9629,
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const handlePlaceSelect = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setFormData((prevState) => ({
        ...prevState,
        latitude: lat(),
        longitude: lng(),
        address: place.formatted_address,
      }));
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then((res) => {
        if (res.data.results && res.data.results.length > 0) {
          setFormData((prevState) => ({
            ...prevState,
            address: res.data.results[0].formatted_address,
          }));
        } else {
          setMessage('Unable to fetch address. Please enter it manually.');
          setIsError(true);
        }
      })
      .catch(() => {
        setMessage('Error fetching address. Please enter it manually.');
        setIsError(true);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        availability: checked
          ? [...prevState.availability, value]
          : prevState.availability.filter((day) => day !== value),
      }));
    } else if (name === 'gender') {
      setFormData({ ...formData, gender: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep1 = () => {
    if (!/^[A-Za-z\s]{3,}$/.test(formData.name)) {
      setIsError(true);
      setMessage('Name should contain only letters and be at least 3 characters long');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setIsError(true);
      setMessage('Please enter a valid email address');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setIsError(true);
      setMessage('Phone number should be 10 digits');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const exp = Number(formData.experience);
    if (isNaN(exp) || exp < 0 || exp > 50) {
      setIsError(true);
      setMessage('Experience should be between 0 and 50 years');
      return false;
    }

    if (!formData.hospitalName.trim()) {
      setIsError(true);
      setMessage('Hospital name is required');
      return false;
    }

    if (!formData.specializedrole.trim()) {
      setIsError(true);
      setMessage('Specialization is required');
      return false;
    }

    const fee = parseFloat(formData.consultationFee);
    if (isNaN(fee) || fee <= 0) {
      setIsError(true);
      setMessage('Consultation fee should be a positive number');
      return false;
    }

    if (formData.availability.length === 0) {
      setIsError(true);
      setMessage('Please select at least one day of availability');
      return false;
    }

    if (!formData.address.trim()) {
      setIsError(true);
      setMessage('Address is required');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      setIsError(true);
      setMessage('Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match!');
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

    const binaryAvailability = daysOfWeek
      .map((day) => (formData.availability.includes(day) ? '1' : '0'))
      .join('');

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
      gender: formData.gender,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      rating: 0.0,
      status: 0,
    };

    try {
      setMessage('Creating your account...');
      setIsError(false);
      const res = await axios.post('http://localhost:8080/doctor-signup', payload);
      if (res.status === 200) {
        setMessage('Successfully signed up! Kindly Please wait for the Admin Approval');
        setTimeout(() => navigate('/doctor/login'), 2000);
      }
    } catch (err) {
      setIsError(true);
      setMessage('Error occurred during signup. Please try again.');
    }
  };

  const renderStep1 = () => (
    <>
      <h3 className="step-title">Personal Information</h3>
      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaPhone className="input-icon" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="gender-label">Gender:</label>
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
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 className="step-title">Professional Details</h3>
      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaBriefcase className="input-icon" />
          <input
            type="text"
            name="experience"
            placeholder="Experience (in years)"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaHospital className="input-icon" />
          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaUserMd className="input-icon" />
          <input
            type="text"
            name="specializedrole"
            placeholder="Specialization"
            value={formData.specializedrole}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaRupeeSign className="input-icon scale-x-100" />
          <input
            type="number"
            name="consultationFee"
            placeholder="Consultation Fee"
            value={formData.consultationFee}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <div className="availability-section">
          <div className="availability-header">
            <FaCalendarAlt className="calendar-icon" />
            <label>Available Days:</label>
          </div>
          <div className="availability-checkboxes">
            {daysOfWeek.map((day) => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  name="availability"
                  value={day}
                  checked={formData.availability.includes(day)}
                  onChange={handleChange}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener('place_changed', () => handlePlaceSelect(autocomplete));
            }}
          >
            <input
              type="text"
              placeholder="Search for a location"
              className="map-search-input"
            />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: formData.latitude, lng: formData.longitude }}
            zoom={5}
            onClick={handleMapClick}
          >
            <Marker
              position={{ lat: formData.latitude, lng: formData.longitude }}
              draggable
              onDragEnd={(event) => handleMapClick(event)}
            />
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h3 className="step-title">Security</h3>
      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
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
        <div className="password-requirements">
          Must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number
        </div>
      </div>

      <div className="form-group">
        <div className="input-icon-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
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
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div
        className="doctor-signup-bg"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/images/DocSignup.JPG'})`,
        }}
      >
        <div className="doctor-signup-container">
          <div className="signup-card">
            <h2 className="signup-title">Doctor Registration</h2>

            <div className="progress-steps">
              <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-text">Personal</div>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-text">Professional</div>
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

            <form
              onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}
              className="doctor-signup-form"
            >
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
              Already have an account? <Link to="/doctor/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorSignup;