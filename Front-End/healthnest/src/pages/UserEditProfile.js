import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserEditProfile.css";

const UserEditProfile = () => {
  const navigate = useNavigate();

  // Dummy default values — these can be loaded from API/localStorage
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Load initial data (this is placeholder logic)
    const storedName = localStorage.getItem("userName") || "John Doe";
    const storedEmail = localStorage.getItem("userEmail") || "john@example.com";
    const storedPhone = localStorage.getItem("userPhone") || "9876543210";

    setName(storedName);
    setEmail(storedEmail);
    setPhone(storedPhone);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send updated data to your backend here
    alert("Profile updated successfully!");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);
  };

  return (
    <div className="edit-profile-container">
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
