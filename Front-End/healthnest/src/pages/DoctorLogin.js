import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorLogin.css";

const DoctorLogin = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8080/doctor-login", {
        emailId,
        password,
      });

      if (res.data.message === "Login successful") {
        const doctorId = res.data.userId;
        localStorage.setItem("doctorId", doctorId);
        localStorage.setItem("doctorName", res.data.name);

        const profileRes = await axios.get(
          `http://localhost:8080/doctor/profile/${doctorId}`
        );

        const { status } = profileRes.data;
        if (status === 1) {
          setIsError(false);
          setMessage("Login successful! Redirecting...");
          setTimeout(() => navigate("/doctordashboard"), 500);
        } else if (status === 0) {
          setIsError(true);
          setMessage("You are yet to be approved by Administration.");
        } else if (status === -1) {
          setIsError(true);
          setMessage("Sorry we are not proceding with your application.");
        }
      } else {
        setIsError(true);
        setMessage(res.data.message);
      }
    } catch (err) {
      setIsError(true);
      if (err.response && err.response.status === 401) {
        setMessage(err.response.data.message || "Invalid credentials");
      } else {
        setMessage("An error occurred during login.");
      }
    }
  };

  return (
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
  );
};

export default DoctorLogin;
