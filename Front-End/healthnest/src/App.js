import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import SignUp from './components/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageUsers from './pages/Admin/ManageUsers.js';
import View from './pages/Admin/View.js';
import ViewFeedback from './pages/Admin/ViewFeedback.js';
import CheckHealth from './pages/User/CheckHealth';
import DeleteAccount from './pages/DeleteAccount';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorEditProfile from './pages/DoctorEditProfile';
import DoctorProfile from './pages/DoctorProfile';
import Home from './pages/Home';
import UserDashboard from './pages/User/UserDashboard';
import UserEditProfile from './pages/User/UserEditProfile';
import ViewAppointments from './pages/User/ViewAppointments';
import AboutUs from './components/AboutUs.js';

import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignUp';
import UserLogin from './pages/User/UserLogin.js';
import Remedies from './components/Remedies.js';
import UserFeedback from './pages/User/UserFeedback.js';
import DoctorViewAppointments from './pages/DoctorViewAppointments.js';
import AdminLogin from './pages/Admin/AdminLogin.js';
import UserChangePassword from './pages/UserChangePassword.js';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
