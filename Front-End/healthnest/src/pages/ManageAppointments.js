import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Footer from "../components/Footer";
import Header from "../components/Header";
import './ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialization: "Dermatologist",
      date: "2023-06-10",
      time: "2:30 PM",
      status: "completed",
    },
    {
      id: 3,
      doctorName: "Dr. Emily Rodriguez",
      specialization: "Pediatrician",
      date: "2023-06-20",
      time: "11:15 AM",
      status: "upcoming",
    },
    {
      id: 4,
      doctorName: "Dr. James Wilson",
      specialization: "Orthopedist",
      date: "2023-05-28",
      time: "3:45 PM",
      status: "cancelled",
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch =
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === selectedAppointment.id
          ? { ...appointment, status: 'cancelled' }
          : appointment
      );
      setAppointments(updatedAppointments);
      setShowCancelModal(false);
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5 pt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Manage Appointments</h1>
            <div className="card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="btn-group" role="group">
                      {['all', 'upcoming', 'completed', 'cancelled'].map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`btn ${filter === type ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFilter(type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by doctor name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {filteredAppointments.length > 0 ? (
              <div className="row">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.id} className="col-md-6 mb-4">
                    <div className="card appointment-card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title mb-1">{appointment.doctorName}</h5>
                            <p className="text-muted mb-0">{appointment.specialization}</p>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="appointment-details">
                          <div className="detail-item">
                            <i className="far fa-calendar-alt"></i>
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="detail-item">
                            <i className="far fa-clock"></i>
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-between">
                          {appointment.status === 'upcoming' && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelAppointment(appointment)}
                            >
                              Cancel Appointment
                            </button>
                          )}
                          {appointment.status === 'cancelled' && (
                            <button className="btn btn-primary btn-sm">
                              Book New Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="far fa-calendar-times fa-4x mb-3 text-muted"></i>
                <h3>No appointments found</h3>
                <p className="text-muted">Try adjusting your filters or search criteria</p>
                <button className="btn btn-primary mt-3">
                  Book New Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCancelModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel your appointment with {selectedAppointment.doctorName} on {formatDate(selectedAppointment.date)} at {selectedAppointment.time}?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  No, Keep Appointment
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmCancellation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageAppointments;
