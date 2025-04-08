import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserEditProfile.css";

const UserEditProfile = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (storedUserId) {
      axios
        .get(`http://localhost:8080/users/userdetails/${storedUserId}`)
        .then((res) => {
          const data = res.data;
          setName(data.name || "");
          setEmail(data.email || "");
          setPhoneNo(data.phoneNo || "");
          setGender(data.gender || "");
          setDateOfBirth(data.dateOfBirth || "");
        })
        .catch(() => {
          toast.error("Failed to fetch user details.");
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      userId,
      name,
      email,
      phoneNo,
      gender,
      dateOfBirth,
    };

    axios
      .patch("http://localhost:8080/users/editprofile", updatedUser)
      .then(() => {
        toast.success("Profile updated successfully!", {
          onClose: () => navigate("/dashboard"),
          autoClose: 1500,
        });
      })
      .catch(() => {
        toast.error("Failed to update profile.");
      });
  };

  return (
    <div className="edit-profile-container">
      <ToastContainer position="top-right" />
      <div className="edit-profile-card">
        <h3 className="mb-4">Edit Profile</h3>
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
              className="btn btn-outline-primary"
              onClick={() => navigate("/changepassword")}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditProfile;
