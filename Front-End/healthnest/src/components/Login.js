import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ name }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // Dynamically select endpoint based on user type
    const loginUrl =
      name === "doctor"
        ? "http://localhost:8080/doctor-login"
        : "http://localhost:8080/users/login";

    try {
      const res = await axios.post(loginUrl, { email, password });

      if (res.data.message === "Login successful") {
        setIsError(false);
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userName", res.data.name);

        // Navigate to appropriate dashboard
        const dashboardRoute = name === "doctor" ? "/doctordashboard" : "/dashboard";
        setTimeout(() => navigate(dashboardRoute), 500);
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

  const getSignupPath = () => {
    if (name === "doctor") return "/doctor/signup";
    if (name === "admin") return "/admin/signup";
    return "/signup";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow rounded" style={{ width: "25rem" }}>
        <h4 className="mb-4 text-center">Login to Your Account</h4>

        {message && (
          <div
            className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>

          <div className="text-center mt-3">
            <small>
              Don't have an account? <a href={getSignupPath()}>Register</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
