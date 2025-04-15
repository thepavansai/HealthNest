import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType }) => {
  const isAuthenticated = () => {
    const userId = localStorage.getItem("userId");
    const doctorId = localStorage.getItem("doctorId");
    const adminId = localStorage.getItem("adminId");

    switch(userType) {
      case 'user':
        return userId;
      case 'doctor':
        return doctorId;
      case 'admin':
        return adminId;
      default:
        return false;
    }
  };

  if (!isAuthenticated()) {
    
    switch(userType) {
      case 'doctor':
        return <Navigate to="/doctor/login" />;
      case 'admin':
        return <Navigate to="/admin/login" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;