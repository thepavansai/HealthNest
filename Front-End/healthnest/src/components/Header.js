import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "blue" }}>
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">HealthNest</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/about">About Us</a>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link text-white" href="#">Welcome, {userName}</a>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link text-white" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link text-white" href={getLoginPath()}>Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white" href={getSignupPath()}>Create Account</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
