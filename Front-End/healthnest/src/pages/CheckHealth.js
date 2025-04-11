import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../components/Footer";
import Header from "../components/Header";

import "./CheckHealth.css";

// Update the helper functions at the top
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '9:00 AM', 
  '11:00 AM',
  '2:00 PM',
  '4:00 PM'
];



const getNextDays = (availability) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start from tomorrow
  const nextDays = [];
  
  // Get next 7 days starting from tomorrow
  for (let i = 0; i < 7; i++) {
    const date = new Date(tomorrow);
    date.setDate(tomorrow.getDate() + i);
    
    const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Reverse the bit position since our bitmap has Sunday as rightmost bit
    const reversedIndex = 6 - dayIndex; // Convert 0->6, 1->5, 2->4, etc.
    if ((availability & (1 << reversedIndex)) !== 0) {
      nextDays.push({
        day: DAYS[dayIndex],
        date: date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short'
        })
      });
    }
  }
  
  return nextDays;
};

const formatDate = (day, date) => {
  const [dayNum, monthStr] = date.split(' ');
  const currentYear = new Date().getFullYear();
  
  // Map month abbreviations to month numbers
  const monthMap = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  
  // Get month number from the map
  const monthNum = monthMap[monthStr];
  
  // Pad day number with leading zero if needed
  const paddedDay = dayNum.padStart(2, '0');
  
  // Return in YYYY-MM-DD format
  return `${currentYear}-${monthNum}-${paddedDay}`;
};

const formatTime = (timeStr) => {
  const [time, meridiem] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  
  if (meridiem === 'PM' && hour !== 12) {
    hour += 12;
  } else if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }
  
  // Return time in HH:mm:ss format
  return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
};

const CheckHealth = () => {
  const [text, setText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
              content: "The user will give his current health condition(which should be explainatory raather than random hi and other stuff) with appropiate symptoms.prompt should be reasonale  to decide specilist if not ask him to give input again . Suggest a specialist doctor or general physician based on the user's appropiate and accurate input Donot give for random words. Respond with just one word like 'Cardiologist' or 'General physician'. if the user is not clear about the disease, ask them to clarify their symptoms. and give specialist name only when appropiate symptoms are given ask for again to give prompt.",
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
      try {
        const doctorsResponse = await axios.get(`http://localhost:8080/doctor/${doctorSuggestion}`);
        const doctors = doctorsResponse.data;
        setDoctors(doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
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

  const handleSlotSelect = (day, date, slot) => {
    setSelectedDay(day);
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    try {
      const userId = parseInt(localStorage.getItem('userId'));
      
      if (!userId) {
        console.error('No valid user ID found');
        navigate('/login');
        return;
      }

      const appointmentData = {
        appointmentDate: formatDate(selectedDay, selectedDate),
        appointmentTime: formatTime(selectedSlot),
        appointmentStatus: "PENDING", // Changed to PENDING
        description: text,
        user: {
          userId: userId
        },
        doctor: {
          doctorId: selectedDoctor.doctorId
        }
      };

      const response = await axios.post(
        'http://localhost:8080/users/bookappointment',
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setShowSuccessPopup(true); 
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
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
                  doc.status === 1 && (
                    <div key={doc.doctorId} className="doctor-card-carousel">
                      <h4>{doc.doctorName}</h4>
                      <p><b>{doc.specializedrole}</b></p>
                      <p>Gender: {doc.gender}</p>
                      <p>Experience: {doc.experience} Years</p>
                      <p>Consultation Fee: ₹{doc.consultationFee}</p>
                      <button onClick={() => handleSelectDoctor(doc)}>Select</button>
                    </div>
                  )
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
            <h3>{selectedDoctor.doctorName}</h3>
            <p>
              <strong>Specialization:</strong> {selectedDoctor.specializedrole}
            </p>
            <p>
              <strong>Experience:</strong> {selectedDoctor.experience} Years
            </p>
            <p>
              <strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}
            </p>

            <h4>Choose Appointment</h4>
            <div className="calendar">
              {selectedDoctor && getNextDays(selectedDoctor.availability).map(({ day, date }) => (
                <div key={`${day}-${date}`} className="day-slot">
                  <strong>{day}, {date}</strong>
                  <div className="slots">
                    {TIME_SLOTS.map((slot, idx) => (
                      <button
                        key={idx}
                        className={`slot-button ${selectedDay === day && selectedSlot === slot ? "selected" : ""}`}
                        onClick={() => handleSlotSelect(day, date, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSlot && (
              <div className="appointment-actions">
                <button 
                  className="book-appointment-btn" 
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        )}

        {showSuccessPopup && (
          <div className="success-popup-overlay">
            <div className="success-popup">
              <div className="success-icon">✓</div>
              <h3>Appointment Booked Successfully!</h3>
              <p>Waiting for doctor's approval</p>
              <button 
                className="view-appointments-btn"
                onClick={() => navigate('/viewappointments')}
              >
                View My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckHealth;