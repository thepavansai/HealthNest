import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../../config/apiConfig'; // Import BASE_URL
import "./AdminLogin.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const AdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      // Use BASE_URL instead of hardcoded URL
      const response = await axios.post(`${BASE_URL}/admin-login`, {
        username: userName,
        password: password
      });
      
      if (response.data && response.data.token) {
        // Handle successful login
        setIsError(false);
        setMessage("Login successful! Redirecting...");
        
        // Store the token and admin info from backend
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminId", "admin");
        localStorage.setItem("userName", userName);
        
        // Ensure role is stored in uppercase to match the dashboard check
        localStorage.setItem("userRole", "ADMIN");
        
        // Navigate directly to admin dashboard without setTimeout
        navigate("/admin");
      } else {
        // Handle login failure
        setIsError(true);
        setMessage(response.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setIsError(true);
      console.error("Admin login error:", error);
      
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        switch (error.response.status) {
          case 401:
            setMessage("Invalid username or password");
            break;
          case 403:
            setMessage("Access forbidden. Please contact support.");
            break;
          case 500:
            setMessage("Server error. Please try again later.");
            break;
          default:
            setMessage(error.response.data?.message || "Login failed. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <div
        className="admin-login-bg"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/images/AdminLogin.jpg"})`,
        }}
      >
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
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AdminLogin;
