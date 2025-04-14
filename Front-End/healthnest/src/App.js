import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutUs from './components/AboutUs.js';
import SignUp from './components/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageUsers from './pages/Admin/ManageUsers.js';
import View from './pages/Admin/View.js';
import ViewFeedback from './pages/Admin/ViewFeedback.js';
import ChangePassword from './pages/ChangePassword';
import CheckHealth from './pages/CheckHealth';
import DeleteAccount from './pages/DeleteAccount';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorEditProfile from './pages/Doctor/DoctorEditProfile';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Home from './pages/Home';
import ManageAppointments from './pages/ManageAppointments';
import UserDashboard from './pages/UserDashboard';
import UserEditProfile from './pages/UserEditProfile';
import ViewAppointments from './pages/ViewAppointments';
import AboutUs from './components/AboutUs.js';

import DoctorLogin from './pages/Doctor/DoctorLogin';
import DoctorSignup from './pages/Doctor/DoctorSignUp';
import UserLogin from './pages/UserLogin.js';
import Remedies from './components/Remedies.js';
import UserFeedback from './pages/UserFeedback.js';
import DoctorViewAppointments from './pages/Doctor/DoctorViewAppointments.js';
import AdminLogin from './pages/Admin/AdminLogin.js';
import UserChangePassword from './pages/UserChangePassword.js';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/doctor/viewappointments" element={<DoctorViewAppointments/>}/>

          <Route path="/doctor/editprofile" element={<DoctorEditProfile />} />
          <Route path="/aboutus" element={<AboutUs/>}/>
          <Route path="/user/change-password" element={<UserChangePassword />} />
          <Route path="/faq" element={<FAQ/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
