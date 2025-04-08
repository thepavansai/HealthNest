import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from "../components/Footer";
import Header from "../components/Header";
import FeelingInputComponent from "../components/FeelingInputComponent";
import "./CheckHealth.css";

const doctors = [
  // ... (rest of your doctors array)
];

const CheckHealth = () => {
    
const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      experience: "10 years",
      fee: "₹800",
      description: "Expert in heart-related issues with a decade of experience.",
      availability: {
        Mon: ["11:00 - 12:00", "5:00 - 6:00"],
        Tue: ["2:00 - 3:00"],
        Wed: ["9:00 - 10:00"],
      },
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialization: "Dermatologist",
      experience: "8 years",
      fee: "₹700",
      description: "Specializes in skin conditions and dermatological treatments.",
      availability: {
        Tue: ["10:00 - 11:00", "4:00 - 5:00"],
        Thu: ["1:00 - 2:00"],
        Fri: ["10:00 - 11:00", "6:00 - 7:00"],
      },
    },
    {
      id: 3,
      name: "Dr. Sunita Verma",
      specialization: "Pediatrician",
      experience: "12 years",
      fee: "₹900",
      description: "Dedicated to the health and well-being of children.",
      availability: {
        Mon: ["9:00 - 10:00", "3:00 - 4:00"],
        Wed: ["11:00 - 12:00"],
        Fri: ["2:00 - 3:00"],
      },
    },
  ];
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const suggestionsRef = useRef(null);
  const doctorRef = useRef(null);
  const paymentRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSuggestMe = () => {
    setShowSuggestions(true);
    setTimeout(() => {
      suggestionsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setTimeout(() => {
      doctorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSlotSelect = (day, slot) => {
    setSelectedDay(day);
    setSelectedSlot(slot);
  };

  const handleMakePayment = () => {
    setPaymentInitiated(true);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmitPayment = () => {
    setPaymentSuccess(true);
    // Redirect to /user page after successful payment
    setTimeout(() => {
      navigate('/user');
    }, 1500); // Adjust the delay as needed
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : doctors.length - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < doctors.length - 1 ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    if (showSuggestions && doctors.length > 0 && carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  }, [currentIndex, showSuggestions, doctors.length]);

  return (
    <div>
      <Header />
      <div className="check-health-container">
        {/* Input feeling */}
        <FeelingInputComponent onSuggest={handleSuggestMe} />

        {/* Doctor suggestions - only after clicking Suggest me */}
        {showSuggestions && (
          <div className="suggested-doctors-carousel-container" ref={suggestionsRef}>
            <h2>Suggested Specialists</h2>
            <div className="suggested-doctors-carousel">
              <div className="carousel-wrapper" ref={carouselRef}>
                {doctors.map((doc) => (
                  <div key={doc.id} className="doctor-card-carousel">
                    <h4>{doc.name}</h4>
                    <p>{doc.specialization}</p>
                    <button onClick={() => handleSelectDoctor(doc)}>Select</button>
                  </div>
                ))}
              </div>
              {doctors.length > 1 && (
                <>
                  <button className="carousel-button prev" onClick={goToPrevious}>
                    &lt;
                  </button>
                  <button className="carousel-button next" onClick={goToNext}>
                    &gt;
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Selected Doctor Details */}
        {selectedDoctor && (
          <div className="selected-doctor-details" ref={doctorRef}>
            <h3>{selectedDoctor.name}</h3>
            <p>
              <strong>Specialization:</strong> {selectedDoctor.specialization}
            </p>
            <p>
              <strong>Experience:</strong> {selectedDoctor.experience}
            </p>
            <p>
              <strong>Consultation Fee:</strong> {selectedDoctor.fee}
            </p>
            <p>
              <strong>Description:</strong> {selectedDoctor.description}
            </p>

            <h4>Choose Appointment</h4>
            <div className="calendar">
              {Object.entries(selectedDoctor.availability).map(
                ([day, slots]) => (
                  <div key={day} className="day-slot">
                    <strong>{day}</strong>
                    <div className="slots">
                      {slots.map((slot, idx) => (
                        <button
                          key={idx}
                          className={`slot-button ${
                            selectedDay === day && selectedSlot === slot
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleSlotSelect(day, slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {selectedSlot && (
              <button className="make-payment-btn" onClick={handleMakePayment}>
                Make Payment
              </button>
            )}
          </div>
        )}

        {/* Payment Section */}
        {paymentInitiated && (
          <div className="payment-section" ref={paymentRef}>
            <h4>Payment</h4>
            <form
              className="payment-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPayment();
              }}
            >
              <div className="form-check">
                <input type="radio" name="paymentMethod" checked readOnly /> UPI/Card
              </div>
              <input type="text" placeholder="Card Number" required />
              <input type="text" placeholder="Expires" required />
              <input type="password" placeholder="Security Code" required />
              <button type="submit">Submit</button>
            </form>
            {paymentSuccess && <p className="success-message">Payment Success!</p>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckHealth;