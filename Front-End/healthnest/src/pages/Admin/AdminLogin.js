import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [userName, setUserName] = useState(""); // Changed to match the naming convention
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    if (userName === "admin" && password === "admin") {
      setIsError(false);
      setMessage("Login successful! Redirecting...");

      // Store admin credentials
      localStorage.setItem("adminId", "admin");
      localStorage.setItem("userName", "Admin"); // Using userName for consistency

      setTimeout(() => navigate("/admin"), 1000);
    } else {
      setIsError(true);
      setMessage("Invalid username or password.");
    }
  };

  return (
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
                value={userName} // Changed from emailId to userName
                onChange={(e) => setUserName(e.target.value)} // Changed to setUserName
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
    </div>
  );
};

export default AdminLogin;
