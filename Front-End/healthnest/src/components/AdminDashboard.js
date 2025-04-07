
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("userName") || "Admin";
  const email = "admin@example.com"; // Replace with dynamic data if needed
  const phone = "+91-1234567890"; // Replace with dynamic data if needed

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container vh-100 d-flex flex-column">
      {/* Profile Section */}
      <div className="row mt-4 justify-content-end">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="card-title text-center mb-3">Profile</h5>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row justify-content-center align-items-center flex-grow-1">
        <div className="col-md-3 d-flex flex-column align-items-center">
          <button
            className="btn btn-primary btn-lg mb-4 w-100"
            onClick={() => navigate("/add-symptom")}
          >
            Add Symptom
          </button>
          <button
            className="btn btn-success btn-lg w-100"
            onClick={() => navigate("/manage-doctors")}
          >
            Manage Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
