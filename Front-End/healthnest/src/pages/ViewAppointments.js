import React, { useEffect, useState } from 'react';
import './ViewAppointments.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);

  useEffect(() => {
    const mockData = [
      { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2025-04-07', time: '10:00 AM', status: 'Completed' },
      { id: 2, patientName: 'Jane Doe', doctorName: 'Dr. Alice', date: '2025-04-08', time: '2:00 PM', status: 'Scheduled' },
    ];
    const current = mockData.filter(app => app.status !== 'Completed');
    const completed = mockData.filter(app => app.status === 'Completed');
    setAppointments(current);
    setCompletedAppointments(completed);
  }, []);

  return (
    <div className="view-appointments">
      <h2>Total Appointments: {appointments.length + completedAppointments.length}</h2>

      <div className="appointment-section">
        <h3>Current Appointments</h3>
        {appointments.length === 0 ? (
          <p>No current appointments</p>
        ) : (
          <ul>
            {appointments.map((app) => (
              <li key={app.id}>
                <strong>{app.patientName}</strong> with <strong>{app.doctorName}</strong> on {app.date} at {app.time}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="appointment-section">
        <h3>Completed Appointments</h3>
        {completedAppointments.length === 0 ? (
          <p>No completed appointments</p>
        ) : (
          <ul>
            {completedAppointments.map((app) => (
              <li key={app.id}>
                <strong>{app.patientName}</strong> with <strong>{app.doctorName}</strong> on {app.date} at {app.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;
