import React from "react";
import { Stethoscope, Calendar, UserPlus } from 'lucide-react';
import HealthCheck from "./HealthCheck";

const UserDashboard = () => {
  const features = [
    {
      name: "Health Checkup",
      description: "Take a quick health checkup and get symptom insights.",
      Icon: Stethoscope,
    },
    {
      name: "View Appointments",
      description: "See your upcoming and past appointments with doctors.",
      Icon: Calendar,
    },
    {
      name: "Join Our Team",
      description: "Are you a doctor? Join our platform to help patients.",
      Icon: UserPlus,
    },
  ];

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <HealthCheck
            key={index}
            name={feature.name}
            description={feature.description}
            Icon={feature.Icon}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;