import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../../config/apiConfig';
import "./DoctorLogin.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DoctorLogin = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!emailId.trim() || !password.trim()) {
      setIsError(true);
      setMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setIsError(true);
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Login and get token
      const res = await axios.post(`${BASE_URL}/doctor-login`, {
        emailId,
        password,
      });

      if (res.data.message === "Login successful") {
        const doctorId = String(res.data.userId); // Convert to string
        const token = res.data.token;
        
        // Store token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "DOCTOR");
        
        try {
          // Step 2: Use token to fetch profile
          
          const profileRes = await axios.get(
            // Use string doctorId in API call
            `${BASE_URL}/doctor/profile/${doctorId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
   
          
          const { status } = profileRes.data;
          
          if (status === 1) {
// Store doctor info in localStorage
            localStorage.setItem("doctorId", doctorId); // Store as string
            localStorage.setItem("doctorName", res.data.name);
            
            setIsError(false);
            setMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/doctor/dashboard"), 500);
          } else if (status === 0) {
            // Clear token since login is not complete
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            
            setIsError(true);
            setMessage("Your account is pending approval by Administration.");
          } else if (status === -1) {
            // Clear token since login is not complete
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            
            setIsError(true);
            setMessage("Your application has been rejected by Administration.");
          }
        } catch (profileErr) {
          console.error("Profile fetch error:", profileErr);
          console.error("Error details:", profileErr.response?.data);
          
          // Clear token on error
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          
          setIsError(true);
          if (profileErr.response && profileErr.response.status === 401) {
            setMessage("Session expired. Please login again.");
          } else {
            setMessage("Error fetching doctor profile. Please try again.");
          }
        }
      } else {
        setIsError(true);
        setMessage(res.data.message);
      }
    } catch (err) {
      setIsError(true);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setMessage("Invalid request. Please check your input.");
            break;
          case 401:
            setMessage("Invalid email or password.");
            break;
          case 403:
            setMessage("Access denied. Please contact support.");
            break;
          case 404:
            setMessage("Account not found. Please register first.");
            break;
          case 429:
            setMessage("Too many login attempts. Please try again later.");
            break;
          case 500:
            setMessage("Server error. Please try again later.");
            break;
          default:
            setMessage("An error occurred during login.");
        }
      } else if (err.request) {
        setMessage("Network error. Please check your internet connection.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        className="doctor-login-bg"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/images/DoctorLogin.jpg"})`,
        }}
      >
        <div className="doctor-login-overlay">
          <div className="login-form-card">
            <h2 className="login-title">Login to Your Account</h2>
            {message && (
              <div
                className={`alert ${isError ? "alert-danger" : "alert-success"}`}
                role="alert"
              >
                {message}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="signup-link">
                Don't have an account? <a href="/doctor/signup">Register</a>
              </div>
              <div className="forgot-password-link">
                <small>
                  Forgot your password?
                  <a href="/forgot-password"> Reset it </a>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorLogin;
