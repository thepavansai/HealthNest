import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserEditProfile.css";
import { BASE_URL } from '../../config/apiConfig';

import Footer from "../../components/Footer";
import Header from "../../components/Header";

const UserEditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Already a string
    const token = localStorage.getItem("token");

    if (!storedUserId) {
      toast.error("User ID not found. Please login again.");
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);

    // Use string userId in API call
    axios.get(`${BASE_URL}/users/userdetails/${storedUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.data) {
        
          const userData = response.data;
          setName(userData.name);
          setEmail(userData.email);
          setPhoneNo(userData.phoneNo);
          setGender(userData.gender);
          setDateOfBirth(userData.dateOfBirth);
        } else {
          toast.error("No user data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch user details";
        toast.error(errorMessage);
        
        // If unauthorized or token expired, redirect to login
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      navigate("/login");
      return;
    }

    const updatedUser = {
      userId: userId, // Send as string
      name,
      email,
      phoneNo,
      gender,
      dateOfBirth,
    };

    axios
      // Use string userId in API call
      .patch(`${BASE_URL}/users/editprofile/${userId}`, updatedUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(() => {
        localStorage.setItem('userName', updatedUser.name);
        toast.success("Profile updated successfully!", {
          onClose: () => navigate("/user"),
          autoClose: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        } else {
          toast.error("Failed to update profile.");
        }
      });
  };

  return (
    <><Header/>
    <div className="edit-profile-container">
      <ToastContainer position="top-right" />
      <div className="edit-profile-card">
        <h3 className="mb-4">Edit Profile</h3>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Gender</label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Date of Birth</label>
              <input
                type="text"
                className="form-control"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="DD-MM-YYYY"
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/user")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default UserEditProfile;
