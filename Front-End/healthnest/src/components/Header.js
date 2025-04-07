import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (userId && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
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
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle text-white"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Welcome, {userName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/edit-profile")}>
                          Edit Profile
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/change-password")}>
                          Change Password
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/appointments")}>
                          My Appointments
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/health-reports")}>
                          My Health Reports
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/recommendations")}>
                          Doctor Recommendations
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleNavigate("/settings")}>
                          Settings
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleNavigate("/delete-account")}>
                          Delete Account
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link text-white" href="/login">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white" href="/signup">Create Account</a>
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
