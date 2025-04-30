import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSearch, FaTimesCircle, FaUserMd, FaUserPlus } from 'react-icons/fa';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ManageDoctors.css';
import { BASE_URL } from '../../config/apiConfig';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [flippedDoctorId, setFlippedDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/doctors`);
        const processedDoctors = response.data.map(doc => ({
          ...doc,
          doctorId: String(doc.doctorId)
        }));
        const active = processedDoctors.filter(doctor => doctor.status === 1);
        const pending = processedDoctors.filter(doctor => doctor.status === 0);
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
      await axios.put(`${BASE_URL}/admin/doctors/${String(doctorId)}/accept`);
      const approvedDoctor = pendingDoctors.find(doctor => doctor.doctorId === String(doctorId));
      if (approvedDoctor) {
        const updatedDoctor = { ...approvedDoctor, status: 1 };
        setDoctors([...doctors, updatedDoctor]);
        setPendingDoctors(pendingDoctors.filter(doctor => doctor.doctorId !== String(doctorId)));
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await axios.put(`${BASE_URL}/admin/doctors/${String(doctorId)}/reject`);
      setPendingDoctors(pendingDoctors.filter(doctor => doctor.doctorId !== String(doctorId)));
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  const handleFlipCard = (doctorId) => {
    setFlippedDoctorId(flippedDoctorId === String(doctorId) ? null : String(doctorId));
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      (doctor.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (doctor.specializedrole?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (doctor.emailId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredPendingDoctors = pendingDoctors.filter(doctor => {
    return (doctor.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (doctor.specializedrole?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (doctor.emailId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading doctors data...</p>
      </div>
    );
  }

  return (<>
    <Header></Header>
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
            style={{ textAlign: searchTerm ? 'left' : 'center' }}
          />
        </div>
        <div className="view-toggle">
          <button className={viewMode === 'all' ? 'active' : ''} onClick={() => setViewMode('all')}>
            All Doctors
          </button>
          <button className={viewMode === 'pending' ? 'active' : ''} onClick={() => setViewMode('pending')}>
            Pending Requests {pendingDoctors.length > 0 && <span className="badge">{pendingDoctors.length}</span>}
          </button>
        </div>
      </div>

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
                <div
                  className={`flip-card ${flippedDoctorId === String(doctor.doctorId) ? 'flipped' : ''}`}
                  key={String(doctor.doctorId)}
                  onClick={() => handleFlipCard(String(doctor.doctorId))}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <div className="doctor-header">
                        <div className="doctor-avatar">
                          {doctor.profileImage ? (
                            <img src={doctor.profileImage} alt={doctor.doctorName} />
                          ) : (
                            <div className="avatar-placeholder">
                              {doctor.doctorName?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3>{doctor.doctorName}</h3>
                          <p className="doctor-specialty">{doctor.specializedrole}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <h3>{doctor.doctorName}</h3>
                      <p><span className="label-specialty">Specialty:</span> {doctor.specializedrole}</p>
                      <p><span className="label-email">Email:</span> {doctor.emailId}</p>
                      <p><span className="label-phone">Phone:</span> {doctor.docPhnNo}</p>
                      <p><span className="label-experience">Experience:</span> {doctor.experience} years</p>
                      <p><span className="label-fee">Fee:</span> ₹{doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'pending' && (
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
                    <tr key={String(doctor.doctorId)}>
                      <td>
                        <div className="doctor-name-cell">
                          {doctor.profileImage ? (
                            <img
                              src={doctor.profileImage}
                              alt={doctor.doctorName}
                              className="small-avatar"
                            />
                          ) : (
                            <div className="small-avatar-placeholder">
                              {doctor.doctorName?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span>{doctor.doctorName}</span>
                        </div>
                      </td>
                      <td>{doctor.specializedrole}</td>
                      <td>{doctor.emailId}</td>
                      <td>{doctor.docPhnNo}</td>
                      <td>{doctor.experience} years</td>
                      <td>₹{doctor.consultationFee}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="approve-btn" onClick={() => handleApproveDoctor(String(doctor.doctorId))}>
                            <FaCheckCircle /> Approve
                          </button>
                          <button className="reject-btn" onClick={() => handleRejectDoctor(String(doctor.doctorId))}>
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
    <Footer></Footer>
  </>);
};

export default ManageDoctors;