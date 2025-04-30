import React, { useState, useEffect } from 'react';
import './DoctorEditProfile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { BASE_URL } from '../../config/apiConfig';

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
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const doctorId = localStorage.getItem("doctorId"); // Already a string
 

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) {
        setMessage("Doctor ID not found. Please login again.");
        setIsError(true);
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/doctor/${doctorId}`);
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
        });
      } catch (error) {
        setIsError(true);
        setMessage("Failed to load profile.");
      }
    };

    fetchDoctorData();
  }, [doctorId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      setMessage("Doctor ID not found. Cannot update profile.");
      setIsError(true);
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
    };

    try {
      const response = await axios.put(`${BASE_URL}/doctor/${doctorId}`, payload);
      setIsError(false);
      localStorage.setItem("doctorName", payload.doctorName); // Corrected: Use setItem
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/doctor/dashboard"), 1500); // Consider delaying navigation slightly to allow user to see message
    } catch (error) {
      setIsError(true);
      setMessage("Error updating profile.");
    }
  };

  return (<>
    <Header />
    <div className="doctor-edit-container">
      <h2 className="edit-title">Edit Profile</h2>

      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="doctor-edit-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
        <input type="text" name="experience" placeholder="Experience (in years)" value={formData.experience} onChange={handleChange} required />
        <input type="text" name="hospitalName" placeholder="Hospital Name" value={formData.hospitalName} onChange={handleChange} required />
        <input type="text" name="specializedrole" placeholder="Specialization" value={formData.specializedrole} onChange={handleChange} required />
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
        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
    <Footer />
  </>
  );
};

export default DoctorEditProfile;
