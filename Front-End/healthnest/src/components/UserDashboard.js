import React from "react";
import HealthCheck from "./HealthCheck";

const UserDashboard = () => {
  const features = [
    {
      name: "Health Checkup",
      description: "Take a quick health checkup and get symptom insights.",
    },
    {
      name: "View Appointments",
      description: "See your upcoming and past appointments with doctors.",
    },
    {
      name: "Join Our Team",
      description: "Are you a doctor? Join our platform to help patients.",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome to HealthNest</h2>
      <div className="row justify-content-center">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 d-flex justify-content-center">
            <HealthCheck name={feature.name} description={feature.description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
