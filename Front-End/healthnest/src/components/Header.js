const Header = () => {
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
                  <a className="nav-link text-white" href="/About">About us</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/login">Login</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/signup">Create Account</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  };
  
  export default Header;
  