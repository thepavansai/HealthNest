import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaCalendarAlt, FaUserMd } from "react-icons/fa";
import "./HealthCheck.css"; 

const HealthCheck = ({ name, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (name === "Join Our Team") {
      navigate("/doctor/signup");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    switch (name) {
      case "Health Checkup":
        navigate("/suggestions");
        break;
      case "View Appointments":
        navigate("/login");
        break;
      default:
        navigate("/aboutus");
    }
  };

  // Function to render the appropriate icon based on the name
  const renderIcon = () => {
    switch (name) {
      case "Health Checkup":
        return <FaHeartbeat size={30} className="mb-3 text-danger" />;
      case "View Appointments":
        return <FaCalendarAlt size={30} className="mb-3 text-primary" />;
      case "Join Our Team":
        return <FaUserMd size={30} className="mb-3 text-success" />;
      default:
        return null;
    }
  };

  return (
    <div className="card m-4 p-3" style={{ width: "18rem", cursor: "pointer" }}>
      <div className="card-body text-center">
        {renderIcon()}
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <button onClick={handleClick} className="btn btn-primary">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default HealthCheck;