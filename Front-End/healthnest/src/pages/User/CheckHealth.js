import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PaymentModal from "../../components/PaymentModal";
import { BASE_URL } from '../../config/apiConfig';
import "./CheckHealth.css";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

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
  // Initialize text state with the symptoms from localStorage if available
  const [text, setText] = useState(() => {
    const savedSymptoms = localStorage.getItem('userSymptoms');
    return savedSymptoms || '';
  });
  
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Location selection states
  const [locationType, setLocationType] = useState('');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [customLocation, setCustomLocation] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    address: ''
  });
  const [mapContainerStyle] = useState({
    width: '100%',
    height: '400px',
  });

  const suggestionsRef = useRef(null);
  const doctorRef = useRef(null);
  const carouselRef = useRef(null);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

  // Auto-analyze symptoms if coming from Remedies page
  useEffect(() => {
    const savedSymptoms = localStorage.getItem('userSymptoms');
    if (savedSymptoms && savedSymptoms.trim() !== '') {
      setText(savedSymptoms);
      // Auto submit after a short delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        handleSymptomSubmit();
        // Clear the localStorage to prevent auto-submission on future visits
        localStorage.removeItem('userSymptoms');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationTypeSelect = (type) => {
    setLocationType(type);
    
    if (type === 'current') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            
            // Get address from coordinates
            axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            ).then(response => {
              if (response.data.results && response.data.results.length > 0) {
                const address = response.data.results[0].formatted_address;
                setCustomLocation(prev => ({
                  ...prev,
                  address: address
                }));
              }
            }).catch(error => {
              console.error("Error fetching address:", error);
            });
            
            setShowLocationSelector(false);
            if (aiResponse) {
              fetchDoctors(aiResponse);
            }
          },
          (error) => {
            console.error("Error fetching user location:", error);
            toast.error("Unable to fetch your location. Please enable location services.");
            setLocationType('custom');
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
        setLocationType('custom');
      }
    } else if (type === 'custom') {
      setShowLocationSelector(true);
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setCustomLocation({
          latitude: lat,
          longitude: lng,
          address: place.formatted_address
        });
        
        setUserLocation({
          latitude: lat,
          longitude: lng
        });
      }
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setCustomLocation(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    setUserLocation({
      latitude: lat,
      longitude: lng
    });
    
    // Get address from coordinates
    axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    ).then(response => {
      if (response.data.results && response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setCustomLocation(prev => ({
          ...prev,
          address: address
        }));
      }
    }).catch(error => {
      console.error("Error fetching address:", error);
    });
  };

  const confirmCustomLocation = () => {
    if (customLocation.latitude && customLocation.longitude) {
      setShowLocationSelector(false);
      if (aiResponse) {
        fetchDoctors(aiResponse);
      }
    } else {
      toast.error("Please select a location on the map");
    }
  };

  useEffect(() => {
    if (userLocation && aiResponse) {
      fetchDoctors(aiResponse);
    }
  }, [userLocation, aiResponse]);

  const fetchDoctors = async (doctorSuggestion) => {
    try {
      // Get the token from localStorage or wherever you store it
      const token = localStorage.getItem('token');
      
      // Set up headers with authorization
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
      };
      
      const doctorsResponse = await axios.get(
        `${BASE_URL}/doctor/${doctorSuggestion}`,
        { headers }
      );
      
      let doctors = doctorsResponse.data;
          
      // Filter out doctors without valid latitude and longitude
      doctors = doctors.filter((doctor) => doctor.latitude && doctor.longitude);
          
      // If user location is available, calculate distances and sort doctors
      if (userLocation) {
        doctors = doctors.map((doctor) => ({
          ...doctor,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            doctor.latitude,
            doctor.longitude
          ),
        }));
        doctors.sort((a, b) => a.distance - b.distance); // Sort by distance
      }
          
      setDoctors(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };
  
 

const fetchDoctorAppointments = async (doctorId) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // Make sure we have a token
    if (!token) {
      console.error("No authentication token found");
      toast.error("Please log in to view appointments");
      return;
    }
    
    const response = await axios.get(
      `${BASE_URL}/appointments/doctor/${doctorId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    setDoctorAppointments(response.data);
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    
    // Set empty appointments array to prevent further errors
    setDoctorAppointments([]);
    
    // Handle different error scenarios
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("You are not authorized to view these appointments");
      } else if (error.response.status === 403) {
        toast.error("You don't have permission to view these appointments");
      } else if (error.response.status === 500) {
        toast.error("Server error. Appointments may not be available at this time.");
      } else {
        toast.error("Failed to fetch appointments");
      }
    } else {
      toast.error("Network error. Please try again later.");
    }
  }
};

  

  const handleSymptomSubmit = async () => {
    if (!text.trim()) return;
    
    if (!locationType) {
      setShowLocationSelector(true);
      toast.info("Please select your location type first");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: "You are a doctor who gives health advice.You will suggest what type of doctor to see based on the symptoms.In only  one word like General.If Symptoms are not clear ask user to clarify his symptoms. donot give without appropiate symptoms. and try to seek for more context Donot use punctuation marks and do not use any other words. Just give the doctor specialization ",
            },
            {
              role: "user",
              content: `I have these symptoms: ${text}. What type of doctor should I see for consultation? In one word you should suggest the doctor name, like cardiologist, general, dermatologist, gynecologist, etc.`,
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
      
      if (userLocation) {
        fetchDoctors(doctorSuggestion);
      }
      
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (error) {
      setAiResponse("Error: " + error.message);
    } finally {
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
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); // Get the authentication token
          
      if (!userId) {
        console.error('No valid user ID found');
        navigate('/login');
        return;
      }
          
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to book an appointment');
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
          doctorId: String(selectedDoctor.doctorId)
        }
      };
          
      const response = await axios.post(
        `${BASE_URL}/users/bookappointment`,
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        }
      );
          
      if (response.status === 200) {
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // More detailed error handling
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        } else if (error.response.status === 403) {
          toast.error('You do not have permission to book this appointment.');
        } else if (error.response.status === 400) {
          toast.error(error.response.data || 'Invalid appointment details.');
        } else {
          toast.error('Failed to book appointment. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    }
  };
  


  const isSlotBooked = (date, slot) => {
    if (!doctorAppointments || doctorAppointments.length === 0) {
      return false; // If no appointments data, assume slot is available
    }
    
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
            
            {!locationType && (
              <div className="location-selection">
                <h3>Select your location</h3>
                <p>This helps us find doctors near you</p>
                <div className="location-buttons">
                  <button 
                    className="location-btn current"
                    onClick={() => handleLocationTypeSelect('current')}
                  >
                    Use current location
                  </button>
                  <button 
                    className="location-btn custom"
                    onClick={() => handleLocationTypeSelect('custom')}
                  >
                    Enter custom location
                  </button>
                </div>
              </div>
            )}
            
            {locationType && !showLocationSelector && (
              <>
                <div className="location-info">
                  <p>
                    <strong>Your location:</strong> {locationType === 'current' ? 'Current location' : customLocation.address}
                    <button 
                      className="change-location-btn"
                      onClick={() => setShowLocationSelector(true)}
                    >
                      Change
                    </button>
                  </p>
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
              </>
            )}
            
            {showLocationSelector && (
              <div className="custom-location-selector">
                <h3>Select your location</h3>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
                  <div className="map-search-container">
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete;
                      }}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        type="text"
                        placeholder="Search for a location"
                        className="map-search-input"
                      />
                    </Autocomplete>
                  </div>
                  
                  <div className="map-container">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={{ 
                        lat: customLocation.latitude, 
                        lng: customLocation.longitude 
                      }}
                      zoom={10}
                      onClick={handleMapClick}
                    >
                      <Marker
                        position={{ 
                          lat: customLocation.latitude, 
                          lng: customLocation.longitude 
                        }}
                        draggable
                        onDragEnd={handleMapClick}
                      />
                    </GoogleMap>
                  </div>
                  
                  {customLocation.address && (
                    <div className="selected-address">
                      <p><strong>Selected address:</strong> {customLocation.address}</p>
                    </div>
                  )}
                  
                  <div className="location-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setShowLocationSelector(false);
                        if (!userLocation && !customLocation.latitude) {
                          setLocationType('');
                        }
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-btn"
                      onClick={confirmCustomLocation}
                      disabled={!customLocation.latitude || !customLocation.longitude}
                    >
                      Confirm Location
                    </button>
                  </div>
                </LoadScript>
              </div>
            )}
            
            {aiResponse && !showLocationSelector && (
              <div className="result-card">
                <h3 className="result-title">Recommended Specialist</h3>
                <div className="specialist-name">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showSuggestions && !showLocationSelector && (
          <div className="suggested-doctors-carousel-container" ref={suggestionsRef}>
            <h2>Experts Nearby, Just for You</h2>
            {doctors.length === 0 ? (
              <div className="no-doctors-message">
                <p>We apologize for the inconvenience</p>
                <p>There are currently no specialized doctors available for <b>{aiResponse}</b> category.</p>
                <div className="remedies-suggestion">
                  <p>Meanwhile, you can check our remedies section for self-care tips</p>
                  <button 
                    className="remedies-link-btn"
                    onClick={() => {
                      localStorage.setItem('userSymptoms', text);
                      navigate('/user/remedies');
                    }}
                  >
                    View Home Remedies
                  </button>
                </div>
              </div>
            ) : (
              <div className="suggested-doctors-carousel">
                <div className="carousel-wrapper" ref={carouselRef}>
                  {doctors.map((doc) => (
                    doc.latitude && doc.longitude && doc.status === 1 && (
                      <div key={doc.doctorId} className="doctor-card-carousel">
                        <h4>{doc.doctorName}</h4>
                        <p><b>{doc.specializedrole}</b></p>
                        <p>Gender: {doc.gender}</p>
                        <p>Experience: {doc.experience} Years</p>
                        <p>Consultation Fee: ₹{doc.consultationFee}</p>
                        {userLocation && <p>Distance: {doc.distance.toFixed(2)} km</p>}
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
            )}
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

        <>
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
        </>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckHealth;
