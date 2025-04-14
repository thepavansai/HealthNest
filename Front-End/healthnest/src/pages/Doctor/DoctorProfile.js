import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorProfile = () => {
  const doctorData = {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: "15 years",
    education: "MD from Harvard Medical School",
    languages: ["English", "Spanish"],
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    rating: 4.8,
    totalReviews: 156,
    about:
      "Dr. Johnson is a board-certified cardiologist with extensive experience in treating heart conditions. She specializes in preventive cardiology and has published numerous research papers in leading medical journals.",
    certifications: [
      "American Board of Internal Medicine",
      "American College of Cardiology",
      "European Society of Cardiology"
    ]
  };

  return (
    <div>
      <Header />
      <div className="container mt-5 pt-4">
        <div className="row">
          { }
          <div className="col-12 mb-4">
            <div className="bg-white border rounded shadow-sm p-4">
              <div className="row align-items-center">
                <div className="col-md-3 text-center mb-3 mb-md-0">
                  <img
                    src="https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg"
                    alt={doctorData.name}
                    className="rounded-circle img-fluid shadow"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-9">
                  <h2 className="fw-semibold text-dark">{doctorData.name}</h2>
                  <h5 className="text-primary mb-2">{doctorData.specialization}</h5>
                  <div className="d-flex align-items-center">
                    <span className="text-warning fs-5 me-2">★ {doctorData.rating}</span>
                    <span className="text-muted">({doctorData.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          { }
          <div className="col-md-8">
            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">About</h4>
                <p className="text-muted">{doctorData.about}</p>
              </div>
            </div>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Education & Experience</h4>
                <p><strong>Education:</strong> {doctorData.education}</p>
                <p><strong>Experience:</strong> {doctorData.experience}</p>
              </div>
            </div>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Certifications</h4>
                <ul className="list-unstyled">
                  {doctorData.certifications.map((cert, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-certificate text-primary me-2"></i>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          { }
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Availability</h4>
                <p className="text-muted"><i className="far fa-clock me-2"></i>{doctorData.availability}</p>
              </div>
            </div>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Languages</h4>
                {doctorData.languages.map((lang, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2">{lang}</span>
                ))}
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <button className="btn btn-primary w-100 mb-2 py-2">Book Appointment</button>
                <button className="btn btn-outline-primary w-100 py-2">Contact Doctor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
