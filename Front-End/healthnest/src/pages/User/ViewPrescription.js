import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaFileMedical, FaArrowLeft, FaPills } from 'react-icons/fa';
import './ViewPrescription.css'; // You can reuse your WritePrescription styles or create new ones

const ViewPrescription = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/prescriptions/appointment/${appointmentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPrescription(response.data);
            } catch (err) {
                console.error("Error fetching prescription:", err);
                setError("Prescription not found or hasn't been written yet.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [appointmentId]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="doctor-loading-container">
                    <div className="doctor-spinner"></div>
                    <p>Loading prescription details...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="prescription-container">
                <div className="prescription-card">
                    <button className="back-btn" onClick={() => navigate('/user/appointments')}>
                        <FaArrowLeft /> Back to Appointments
                    </button>
                    
                    {error ? (
                        <div className="error-message">
                            <h3><FaFileMedical /> No Prescription Available</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="prescription-header">
                                <h2><FaFileMedical className="prescription-icon" /> Digital Prescription</h2>
                                <div className="patient-details">
                                    <p><strong>Patient Name:</strong> {prescription.patientName}</p>
                                    <p><strong>Date Issued:</strong> {prescription.date}</p>
                                    <p><strong>Appointment Ref:</strong> #{prescription.appointmentId}</p>
                                </div>
                            </div>
                            
                            <hr className="divider" />
                            
                            <div className="medicines-display-section">
                                <h3><FaPills /> Prescribed Medicines</h3>
                                <div className="table-responsive">
                                    <table className="doctor-appointments-table">
                                        <thead>
                                            <tr>
                                                <th>Medicine Name</th>
                                                <th>Dosage</th>
                                                <th>Duration</th>
                                                <th>Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescription.medicines.map((med, index) => (
                                                <tr key={index}>
                                                    <td><strong>{med.name}</strong></td>
                                                    <td>{med.dosage}</td>
                                                    <td>{med.duration}</td>
                                                    <td>{med.instructions || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {prescription.additionalAdvice && (
                                <div className="advice-display-section">
                                    <h3>Doctor's Advice</h3>
                                    <div className="advice-box">
                                        <p>{prescription.additionalAdvice}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ViewPrescription;