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
        navigate("/user/remedies");
        break;
      case "View Appointments":
        navigate("user/appointments");
        break;
      default:
        navigate("/aboutus");
    }
  };

  
  const renderIcon = () => {
    switch (name) {
      case "Health Checkup":
        return <><center><FaHeartbeat size={30} className="mb-3 text-danger" /></center></>;
      case "View Appointments":
        return <><center><FaCalendarAlt size={30} className="mb-3 text-primary" /></center></>;
      case "Join Our Team":
        return <><center><FaUserMd size={30} className="mb-3 text-success" /></center></>;
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
          {name === "Health Checkup" ? "Check Health Now" : 
           name === "View Appointments" ? "View Schedule" : 
           name === "Join Our Team" ? "Apply Today" : 
           "Learn More"}
        </button>
      </div>
    </div>
  );
};

export default HealthCheck;