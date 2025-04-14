import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserLogin.css"; 
import Footer from "../components/Footer";
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      if (res.data.message === "Login successful") {
        setIsError(false);
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userName", res.data.name);
        setTimeout(() => navigate("/user"), 500);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setIsError(true);
      
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setMessage("User not found. Please check your email address.");
            break;
          case 401:
            setMessage("Incorrect password. Please try again.");
            break;
          case 400:
            setMessage("Invalid email or password format.");
            break;
          case 500:
            setMessage("Server error. Please try again later.");
            break;
          default:
            setMessage("Login failed. Please try again.");
        }
      } else if (err.request) {
        setMessage("Cannot connect to server. Please check your internet connection.");
      } else {
        setMessage(err.message || "An error occurred during login.");
      }  
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Header/>
    <div
      className="doctor-login-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/images/UserLogin.jpg"})`,
      }}
    >
      <div className="login-container">
        <div className="login-card">
          <h4 className="login-title">Login to Your Account</h4>

          {message && (
            <div className={`login-alert ${isError ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="register-link">
              <small>
                Don&apos;t have an account? <a href="/signup">Register</a>
              </small>
            </div>
            <div className="login-links">
              <a href="/doctor/login">I&apos;m a Doctor</a>
              <a href="/admin/login">I&apos;m an Admin</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
