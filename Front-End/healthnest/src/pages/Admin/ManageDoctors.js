import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSearch, FaTimesCircle, FaUserMd, FaUserPlus } from 'react-icons/fa';
import './ManageDoctors.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/admin/doctors');
        
        // Separate active and pending doctors
        const active = response.data.filter(doctor => doctor.status === 'active');
        const pending = response.data.filter(doctor => doctor.status === 'pending');
        
        setDoctors(active);
        setPendingDoctors(pending);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleApproveDoctor = async (doctorId) => {
    try {
      // Replace with your actual API endpoint
      await axios.put(`/api/admin/doctors/${doctorId}/approve`);
      
      // Update local state
      const approvedDoctor = pendingDoctors.find(doctor => doctor.id === doctorId);
      if (approvedDoctor) {
        approvedDoctor.status = 'active';
        setDoctors([...doctors, approvedDoctor]);
        setPendingDoctors(pendingDoctors.filter(doctor => doctor.id !== doctorId));
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleDeleteDoctor = async (doctorId, isPending = false) => {
    try {
      // Replace with your actual API endpoint
      await axios.delete(`/api/admin/doctors/${doctorId}`);
      
      // Update local state
      if (isPending) {
        setPendingDoctors(pendingDoctors.filter(doctor => doctor.id !== doctorId));
      } else {
        setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredPendingDoctors = pendingDoctors.filter(doctor => {
    return doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading doctors data...</p>
      </div>
    );
  }

  return (
    <div className="manage-doctors-container">
      <div className="doctors-header">
        <h1>Manage Doctors</h1>
        
        <div className="doctors-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <FaUserMd />
            </div>
            <div className="summary-details">
              <h3>{doctors.length}</h3>
              <p>Active Doctors</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon pending-icon">
              <FaUserPlus />
            </div>
            <div className="summary-details">
              <h3>{pendingDoctors.length}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="doctors-filter">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, specialty or email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="view-toggle">
          <button 
            className={viewMode === 'all' ? 'active' : ''} 
            onClick={() => setViewMode('all')}
          >
            All Doctors
          </button>
          <button 
            className={viewMode === 'pending' ? 'active' : ''} 
            onClick={() => setViewMode('pending')}
          >
            Pending Requests {pendingDoctors.length > 0 && <span className="badge">{pendingDoctors.length}</span>}
          </button>
        </div>
      </div>
      
      {/* Active Doctors Section */}
      {viewMode === 'all' && (
        <div className="doctors-section">
          <h2>Active Doctors</h2>
          {filteredDoctors.length === 0 ? (
            <div className="no-data">
              <p>No active doctors found matching your criteria</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map(doctor => (
                <div className="doctor-card" key={doctor.id}>
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      {doctor.profileImage ? (
                        <img src={doctor.profileImage} alt={doctor.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3>{doctor.name}</h3>
                      <p className="doctor-specialty">{doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="doctor-details">
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{doctor.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{doctor.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{doctor.experience} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fee:</span>
                      <span className="detail-value">${doctor.consultationFee}</span>
                    </div>
                  </div>
                  
                  <div className="doctor-actions">
                    <button className="view-btn">View Details</button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Pending Requests Section */}
      {(viewMode === 'pending' || pendingDoctors.length > 0) && (
        <div className="doctors-section pending-section">
          <h2>Pending Doctor Requests</h2>
          {filteredPendingDoctors.length === 0 ? (
            <div className="no-data">
              <p>No pending doctor requests</p>
            </div>
          ) : (
            <div className="pending-table-container">
              <table className="pending-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingDoctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>
                        <div className="doctor-name-cell">
                          {doctor.profileImage ? (
                            <img 
                              src={doctor.profileImage} 
                              alt={doctor.name} 
                              className="small-avatar" 
                            />
                          ) : (
                            <div className="small-avatar-placeholder">
                              {doctor.name.charAt(0)}
                            </div>
                          )}
                          <span>{doctor.name}</span>
                        </div>
                      </td>
                      <td>{doctor.specialty}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.experience} years</td>
                      <td>${doctor.consultationFee}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="approve-btn" 
                            onClick={() => handleApproveDoctor(doctor.id)}
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleDeleteDoctor(doctor.id, true)}
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;