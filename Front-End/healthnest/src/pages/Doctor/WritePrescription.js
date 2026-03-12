import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaPlus, FaTrash, FaPrescription } from 'react-icons/fa';
import './WritePrescription.css';

const WritePrescription = () => {
    const { appointmentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const patientName = location.state?.patientName || "Unknown Patient";
    const doctorId = localStorage.getItem('doctorId');
    
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
    const [advice, setAdvice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const list = [...medicines];
        list.splice(index, 1);
        setMedicines(list);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...medicines];
        list[index][name] = value;
        setMedicines(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                appointmentId: parseInt(appointmentId),
                doctorId: parseInt(doctorId),
                patientName: patientName,
                additionalAdvice: advice,
                medicines: medicines
            };

            await axios.post(`${BASE_URL}/prescriptions/add`, payload, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert("Prescription saved successfully!");
            navigate('/doctor/appointments');
        } catch (error) {
            console.error("Error saving prescription:", error);
            alert("Failed to save prescription. Ensure all fields are valid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="prescription-container">
                <div className="prescription-card">
                    <div className="prescription-header">
                        <h2><FaPrescription className="prescription-icon" /> Digital Prescription</h2>
                        <div className="patient-details">
                            <p><strong>Patient Name:</strong> {patientName}</p>
                            <p><strong>Appointment ID:</strong> #{appointmentId}</p>
                            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <hr className="divider" />
                    
                    <form onSubmit={handleSubmit}>
                        <div className="medicines-section">
                            <h3>Medicines</h3>
                            {medicines.map((med, index) => (
                                <div key={index} className="medicine-row">
                                    <input type="text" name="name" placeholder="Medicine Name (e.g., Paracetamol)" value={med.name} onChange={(e) => handleChange(e, index)} required />
                                    <input type="text" name="dosage" placeholder="Dosage (e.g., 1-0-1)" value={med.dosage} onChange={(e) => handleChange(e, index)} required />
                                    <input type="text" name="duration" placeholder="Duration (e.g., 5 Days)" value={med.duration} onChange={(e) => handleChange(e, index)} required />
                                    <input type="text" name="instructions" placeholder="Instructions (e.g., After Food)" value={med.instructions} onChange={(e) => handleChange(e, index)} />
                                    {medicines.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveMedicine(index)} className="remove-med-btn" title="Remove Medicine">
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={handleAddMedicine} className="add-med-btn">
                                <FaPlus /> Add Another Medicine
                            </button>
                        </div>

                        <div className="advice-section">
                            <h3>Additional Advice & Remarks</h3>
                            <textarea 
                                value={advice} 
                                onChange={(e) => setAdvice(e.target.value)} 
                                placeholder="Dietary restrictions, rest recommendations, follow-up instructions..." 
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => navigate('/doctor/appointments')}>Cancel</button>
                            <button type="submit" className="submit-prescription-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save & Issue Prescription"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default WritePrescription;