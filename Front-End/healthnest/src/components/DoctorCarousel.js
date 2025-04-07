import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const DoctorCarousel = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/doctors')
      .then(res => {
        const availableDoctors = res.data.filter(doc => doc.availability === "Available");
        setDoctors(availableDoctors);
      })
      .catch(err => {
        console.error("Error fetching doctors", err);
      });
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  if (doctors.length === 0) {
    return <div className="text-center text-gray-600 mt-4">No doctors are available</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-inner">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Available Doctors</h2>
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000} showDots={true}>
        {doctors.map(doctor => (
          <div
            key={doctor.doctorId}
            className="bg-white rounded-2xl shadow-md p-6 m-3 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-sm mb-4">
              <img
                src={`https://randomuser.me/api/portraits/${doctor.gender === "FEMALE" ? "women" : "men"}/${doctor.doctorId + 10}.jpg`}
                alt="Doctor"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-doctor.png";
                }}
              />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">{doctor.doctorName}</h3>
            <p className="text-sm text-gray-700 mt-1">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">{doctor.hospitalName}</p>
            <p className="text-sm text-yellow-600 mt-1">⭐ {doctor.rating}</p>
            <p className="text-sm font-semibold text-green-700 mt-1">₹{doctor.consultationFee}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DoctorCarousel;
