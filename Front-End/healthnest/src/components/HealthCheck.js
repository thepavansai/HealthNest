import { useNavigate } from "react-router-dom";

const HealthCheck = ({ name, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (name === "Join Our Team") {
      navigate("/doctor/register");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    switch (name) {
      case "Health Checkup":
        navigate("/feeling-input");
        break;
      case "View Appointments":
        navigate("/appointments");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="card m-4 p-3" style={{ width: "18rem", cursor: "pointer" }}>
      <div className="card-body">
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
