import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      // Make API call to backend
      const response = await axios.post("http://localhost:8080/admin-login", {
        username: userName,
        password: password
      });
      if(response.data.message === "Admin login successful") {
      
      // Handle successful login
      setIsError(false);
      setMessage("Login successful! Redirecting...");
      
      // Store the token and admin info from backend
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminId", "admin");
      localStorage.setItem("userName", userName);
      localStorage.setItem("userRole", response.data.role);
      
      setTimeout(() => navigate("/admin"), 1000);
    } 
    else{
      // Handle login failure
      setIsError(true);
      setMessage(response.data.message || "Login failed. Please try again.");
    }}
      catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
      
      // Fallback to mock login for development if needed
      
        // Create a mock token
       
        
        setTimeout(() => navigate("/admin"), 1000);
      }
     finally {
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
