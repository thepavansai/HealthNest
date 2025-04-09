import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow rounded" style={{ width: "25rem" }}>
        {/* User Role Links */}
        <div className="d-flex justify-content-between mb-3">
          <a href="/doctor/login" className="text-decoration-none text-primary fw-bold">
            I&apos;m a Doctor
          </a>
          <a href="/admin/login" className="text-decoration-none text-primary fw-bold">
            I&apos;m an Admin
          </a>
        </div>

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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="text-center mt-3">
            <small>
              Don&apos;t have an account? <a href="/signup">Register</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
