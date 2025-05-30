import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from "../../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChangePassword.css';
import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const doctorId = localStorage.getItem('doctorId'); // Already a string

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character (@$!%*?&)';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      setErrors({ currentPassword: 'Doctor ID not found. Please login again.' });
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const token = localStorage.getItem('token');
        // Use string doctorId in API call
        const response = await axios.patch(
          `${BASE_URL}/doctor/changepassword/${doctorId}/${formData.currentPassword}/${formData.newPassword}`,
          {}, // empty body
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          setSuccessMessage('Your password has been successfully updated!');
          
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setErrors({
            currentPassword: 'Session expired. Please login again.'
          });
        } else {
          setErrors({
            currentPassword: error.response?.data || 'Failed to update password. Please try again.'
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5 pt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Change Password</h2>
                
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    {errors.currentPassword && (
                      <div className="invalid-feedback">{errors.currentPassword}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <small className="form-text text-muted">
                      Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character (@$!%*?&)
                    </small>
                    {errors.newPassword && (
                      <div className="invalid-feedback">{errors.newPassword}</div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center mt-4">
                  <a href="/doctor/dashboard" className="text-decoration-none">Back to Profile</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;