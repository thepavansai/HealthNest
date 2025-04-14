import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const AdminLogin = () => {
  const [userName, setUserName] = useState("");
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
      localStorage.setItem("adminId", "admin");
      localStorage.setItem("userName", "Admin");

      setTimeout(() => navigate("/admin"), 1000);
    } else {
      setIsError(true);
      setMessage("Invalid username or password.");
    }
  };

  return (<>
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
    <Footer/>
    </>
  );
};

export default AdminLogin;
