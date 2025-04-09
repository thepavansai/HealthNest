import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./CheckHealth.css";

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

const CheckHealth = () => {
  const [text, setText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  const navigate = useNavigate();

  const handleSymptomSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "The user will give his current health condition. Suggest a specialist doctor or general physician based on the user's input. Respond with just one word like 'Cardiologist' or 'General physician'.",
            },
            {
              role: "user",
              content: `I am having ${text}. Suggest me the respective doctor specialist regarding to the disease given. Just return the doctor specialist in one word.`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const doctorSuggestion = res.data.choices[0].message.content.trim();
      setAiResponse(doctorSuggestion);
      setShowSuggestions(true);
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setIsLoading(false);
    } catch (error) {
      setAiResponse("Error: " + error.message);
      setIsLoading(false);
    }
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
    setTimeout(() => {
      navigate('/user');
    }, 1500);
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
        <div className="feeling-container">
          <div className="feeling-card">
            <div className="header">
              <h2>How are you feeling today?</h2>
              <p>Describe your symptoms and we'll help you find the right specialist</p>
            </div>

            <div className="input-area">
              <textarea
                className="symptom-textarea"
                placeholder="I've been experiencing..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <button
              className="submit-button"
              onClick={handleSymptomSubmit}
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                  <span>Find Specialist</span>
                </>
              )}
            </button>

            {aiResponse && (
              <div className="result-card">
                <h3 className="result-title">Recommended Specialist</h3>
                <div className="specialist-name">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>

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
                <input type="radio" name="paymentMethod" checked readOnly />Card
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