import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = ({ name }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (userId && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
  };

  const getLoginPath = () => {
    if (name === "doctor") return "/doctor/login";
    if (name === "admin") return "/admin/login";
    return "/login"; // default user login
  };

  const getSignupPath = () => {
    if (name === "doctor") return "/doctor/signup";
    if (name === "admin") return "/admin/signup";
    return "/signup"; // default user signup
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "blue" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">HealthNest</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">About Us</Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white">Welcome, {userName}</span>
                </li>
                
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/signup">Create Account</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
