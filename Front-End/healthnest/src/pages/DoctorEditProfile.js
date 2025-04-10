import React, { useState, useEffect } from 'react';
import './DoctorEditProfile.css';
import axios from 'axios';

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
    gender: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const doctorId = localStorage.getItem("doctorId");
  console.log(doctorId)

  useEffect(() => {
    // Simulating data fetch – Replace with your actual API call
    axios.get(`http://localhost:8080/doctor/profile/${doctorId}`) // replace with actual endpoint
      .then(res => {
        const data = res.data;

        // Convert binary availability to array of days
        const availabilityDays = daysOfWeek.filter((day, index) => data.availability[index] === '1');

        setFormData({
          name: data.doctorName || '',
          email: data.emailId || '',
          experience: data.experience || '',
          hospitalName: data.hospitalName || '',
          specialization: data.specializedrole || '',
          phone: data.docPhnNo || '',
          consultationFee: data.consultationFee || '',
          availability: availabilityDays,
          gender: data.gender || '',
        });
      })
      .catch(() => {
        setIsError(true);
        setMessage("Failed to load profile.");
      });
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const binaryAvailability = daysOfWeek.map(day =>
      formData.availability.includes(day) ? '1' : '0'
    ).join('');

    const payload = {
      doctorName: formData.name,
      emailId: formData.email,
      experience: Number(formData.experience),
      hospitalName: formData.hospitalName,
      specialization: formData.specializedrole,
      docPhnNo: formData.phone,
      consultationFee: parseFloat(formData.consultationFee),
      availability: binaryAvailability,
      gender: formData.gender
    };

    axios.put("http://localhost:8080/doctor/update-profile", payload)
      .then(() => {
        setIsError(false);
        setMessage("Profile updated successfully!");
      })
      .catch(() => {
        setIsError(true);
        setMessage("Error updating profile.");
      });
  };

  return (
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
        <input type="text" name="specialization" placeholder="Specialization" value={formData.specializedrole} onChange={handleChange} required />
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

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default DoctorEditProfile;
