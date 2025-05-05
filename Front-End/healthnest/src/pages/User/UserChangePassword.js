import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL } from '../../config/apiConfig';

const UserChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId'); // Already a string
  const token = localStorage.getItem('token');

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

  // Update the validateForm function with new password requirements
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

    if (!userId) {
      toast.error("Please login to change password");
      navigate('/login');
      return;
    }

    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      navigate('/login');
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Use string userId in API call
        const response = await axios.patch(
          `${BASE_URL}/users/changepassword/${userId}/${formData.currentPassword}/${formData.newPassword}`,
          {}, // Empty body as data is in URL
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
          
          toast.success('Password updated successfully!');
          setTimeout(() => navigate('/user'), 2000);
        }
      } catch (error) {
        console.error("Error updating password:", error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate('/login');
        } else {
          toast.error(error.response?.data || 'Failed to update password');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5 pt-4">
        <ToastContainer position="top-right" />
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Change Password</h2>
                
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
                  <a href="/user" className="text-decoration-none">Back to Profile</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserChangePassword;
