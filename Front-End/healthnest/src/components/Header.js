import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName"); // you must store this during login
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
                    <span className="nav-link text-white">Welcome, {userName}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-danger ms-2" onClick={handleLogout}>
                      Logout
                    </button>
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
