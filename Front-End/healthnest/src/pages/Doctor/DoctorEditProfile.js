import React, { useState, useEffect, useRef } from 'react';
import './DoctorEditProfile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { toast } from 'sonner';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { BASE_URL } from '../../config/apiConfig';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DoctorEditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    hospitalName: '',
    specializedrole: '',
    phone: '',
    consultationFee: '',
    availability: [],
    address: '',
    latitude: 20.5937,
    longitude: 78.9629,
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const doctorId = localStorage.getItem("doctorId");
  const autocompleteRef = useRef(null);
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) {
        setMessage("Doctor ID not found. Please login again.");
        setIsError(true);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/doctor/profile/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
      
        const availabilityDays = daysOfWeek.filter((day, index) => data.availability[index] === '1');
        setFormData({
          name: data.doctorName || '',
          email: data.emailId || '',
          experience: data.experience || '',
          hospitalName: data.hospitalName || '',
          specializedrole: data.specializedrole || '',
          phone: data.docPhnNo || '',
          consultationFee: data.consultationFee || '',
          availability: availabilityDays,
          address: data.address || '',
          latitude: data.latitude || 20.5937,
          longitude: data.longitude || 78.9629,
        });
      } catch (error) {
        setIsError(true);
        if (error.response?.status === 401) {
          setMessage("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setMessage("Failed to load doctor data. Please try again later.");
        }
        toast.error("Failed to load profile.");
      }
    };
    
    fetchDoctorData();
  }, [doctorId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        availability: checked
          ? [...prev.availability, value]
          : prev.availability.filter(day => day !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;
        
        
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: address
        }));
      }
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    // Get address from coordinates
    axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    ).then(response => {
      if (response.data.results && response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setFormData(prev => ({
          ...prev,
          address: address
        }));
      }
    }).catch(error => {
      
      toast.error("Error fetching address. Please enter it manually.");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate address
    if (!formData.address || formData.address.trim() === '') {
      toast.error("Please provide a valid address");
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
      availability: binaryAvailability,
      address: formData.address.trim(), // Ensure address is properly trimmed
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      const token = localStorage.getItem('token');


      const response = await axios.put(
        `${BASE_URL}/doctor/profile/${doctorId}`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response contains updated data
      if (response.data) {
      }

      setIsError(false);
      localStorage.setItem("doctorName", payload.doctorName);
      setMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/doctor/dashboard"), 1500);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      setIsError(true);
      if (error.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(`Error updating profile: ${error.response?.data?.message || 'Address update failed'}`);
      }
      toast.error("Failed to update profile.");
    }
  };

  return (
    <>
      <Header />
      <div className="doctor-edit-container">
        <h2 className="edit-title">Edit Profile</h2>
        {message && (
          <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="doctor-edit-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email ID</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Email ID" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Professional Details</h3>
            <div className="form-group">
              <label>Experience (in years)</label>
              <input 
                type="text" 
                name="experience" 
                placeholder="Experience (in years)" 
                value={formData.experience} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Hospital Name</label>
              <input 
                type="text" 
                name="hospitalName" 
                placeholder="Hospital Name" 
                value={formData.hospitalName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Specialization</label>
              <input 
                type="text" 
                name="specializedrole" 
                placeholder="Specialization" 
                value={formData.specializedrole} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Consultation Fee</label>
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
          
          <div className="form-section">
            <h3>Availability</h3>
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
          </div>
          
          <div className="form-section">
            <h3>Location</h3>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                name="address" 
                placeholder="Address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="map-section">
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
                <div className="map-search-container">
                  <label>Search for a location:</label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <input
                      type="text"
                      placeholder="Search for a location"
                      className="map-search-input"
                    />
                  </Autocomplete>
                </div>
                
                <div className="map-container">
                  <p className="map-instruction">Click on the map to set your location or drag the marker</p>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ 
                      lat: formData.latitude, 
                      lng: formData.longitude 
                    }}
                    zoom={10}
                    onClick={handleMapClick}
                  >
                    <Marker
                      position={{ 
                        lat: formData.latitude, 
                        lng: formData.longitude 
                      }}
                      draggable
                      onDragEnd={handleMapClick}
                    />
                  </GoogleMap>
                </div>
                
                <div className="coordinates-display">
                  <p>
                    <strong>Latitude:</strong> {formData.latitude.toFixed(6)}, 
                    <strong>Longitude:</strong> {formData.longitude.toFixed(6)}
                  </p>
                </div>
              </LoadScript>
            </div>
          </div>
          
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
      <Footer />
  </>
  );
};

export default DoctorEditProfile;

