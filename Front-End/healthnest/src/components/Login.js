import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import your CSS file here

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

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
            />
          </div>

          <button type="submit" className="login-btn">Login</button>

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
  );
};

export default Login;
