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
      const res = await axios.post("http://localhost:8080/admin-login", {
        emailId,
        password,
      });

      if (res.data.message === "Login successful") {
        setIsError(false);
        setMessage("Login successful! Redirecting...");

        setTimeout(() => navigate("/admin"), 500);
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
    
      <div className="admin-login-overlay">
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
          </form>
        </div>
      </div>
    
  );
};

export default DoctorLogin;
