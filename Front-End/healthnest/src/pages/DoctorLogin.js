import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorLogin.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DoctorLogin = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    
    if (!emailId.trim() || !password.trim()) {
      setIsError(true);
      setMessage("Please fill in all fields");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setIsError(true);
      setMessage("Please enter a valid email address");
      return;
    }


    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/doctor-login", {
        emailId,
        password,
      });

      if (res.data.message === "Login successful") {
        setIsError(false);
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("doctorId", res.data.userId);
        localStorage.setItem("doctorName", res.data.name);
        setTimeout(() => navigate("/doctor/dashboard"), 500);
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
    }
  };

  return (
    <><Header/>
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
                required
              />
            </div>

            <button type="submit">Login</button>

            <div className="signup-link">
              Don’t have an account? <a href="/doctor/signup">Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default DoctorLogin;
