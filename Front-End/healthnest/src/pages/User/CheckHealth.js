import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PaymentModal from "../../components/PaymentModal";

import "./CheckHealth.css";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

const getNextDays = (availability) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextDays = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(tomorrow);
    date.setDate(tomorrow.getDate() + i);
    
    const dayIndex = date.getDay();
    const reversedIndex = 6 - dayIndex;
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
  const monthMap = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  const monthNum = monthMap[monthStr];
  const paddedDay = dayNum.padStart(2, '0');
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
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const suggestionsRef = useRef(null);
  const doctorRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const fetchDoctorAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:8080/appointments/doctor/${doctorId}`);
      setDoctorAppointments(response.data);
    } catch (error) {
      console.error("Error fetching doctor's appointments:", error);
    }
  };

  const handleSymptomSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a doctor who gives health advice. You will suggest what type of doctor to see based on the symptoms.In only  one word like General.If Symptoms are not clear ask user to clarify his symptoms. donot give without appropiate symptoms. and try to seek for more context",
            },
            {
              role: "user",
              content: `I have these symptoms: ${text}. What type of doctor should I see for consultation? in one word you should suggest the doctor name,like cardiologist,general,dermatologist,gynecologist etc.`
            }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
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
    fetchDoctorAppointments(doctor.doctorId);
    setTimeout(() => {
      doctorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSlotSelect = (day, date, slot) => {
    setSelectedDay(day);
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    
    if (!selectedSlot) {
      toast.error("Please select a time slot first");
      return;
    }
    
    
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setPaymentComplete(true);
    
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
        appointmentStatus: "Pending",
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
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const isSlotBooked = (date, slot) => {
    return doctorAppointments.some(appointment => 
      appointment.appointmentDate === formatDate(selectedDay, date) &&
      appointment.appointmentTime === formatTime(slot)
    );
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

  const getConsultationFee = () => {
    return selectedDoctor ? selectedDoctor.consultationFee : 0;
  };

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
                    {TIME_SLOTS.map((slot, idx) => {
                      const booked = isSlotBooked(date, slot);
                      return (
                        <div className="slot-container" key={idx} title={booked ? "This slot is already booked" : ""}>
                          <button
                            className={`slot-button ${selectedDay === day && selectedDate === date && selectedSlot === slot ? "selected" : ""} ${booked ? "booked" : ""}`}
                            onClick={() => {
                              if (!booked) {
                                handleSlotSelect(day, date, slot);
                              }
                            }}
                            disabled={booked}
                          >
                            {slot}
                          </button>
                          {booked && <span className="booked-tooltip">Already Booked</span>}
                        </div>
                      );
                    })}
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

        {}
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={getConsultationFee()}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {showSuccessPopup && (
          <div className="success-popup-overlay">
            <div className="success-popup">
              <div className="success-icon">✓</div>
              <h3>Appointment Booked Successfully!</h3>
              <p>Waiting for doctor's approval</p>
              <button 
                className="view-appointments-btn"
                onClick={() => navigate('/user/appointments')}
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
