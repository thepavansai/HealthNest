import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutUs from './components/AboutUs.js';
import ContactUs from './components/ContactUs.js';
import Faq from './components/FAQ.js';
import ProtectedRoute from './components/ProtectedRoute';
import Remedies from './components/Remedies.js';
import SignUp from './components/Signup';
import TermsOfService from './components/TermsOfService.js';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin.js';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageUsers from './pages/Admin/ManageUsers.js';
import View from './pages/Admin/View.js';
import ViewFeedback from './pages/Admin/ViewFeedback.js';
import ChangePassword from './pages/Doctor/ChangePassword';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorEditProfile from './pages/Doctor/DoctorEditProfile';
import DoctorLogin from './pages/Doctor/DoctorLogin';
import DoctorSignup from './pages/Doctor/DoctorSignUp';
import DoctorViewAppointments from './pages/Doctor/DoctorViewAppointments.js';
import IncomeDetails from './pages/Doctor/IncomeDetails.js';
import Home from './pages/Home';
import CheckHealth from './pages/User/CheckHealth';
import UserChangePassword from './pages/User/UserChangePassword.js';
import UserDashboard from './pages/User/UserDashboard';
import UserEditProfile from './pages/User/UserEditProfile';
import UserFeedback from './pages/User/UserFeedback.js';
import UserLogin from './pages/User/UserLogin.js';
import ViewAppointments from './pages/User/ViewAppointments';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/terms' element={<TermsOfService/>}/>
          <Route path='/contactus'element={<ContactUs/>} />
          {/* Authentication Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Routes */}
          <Route path="/user" element={
            <ProtectedRoute userType="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/appointments" element={
            <ProtectedRoute userType="user">
              <ViewAppointments />
            </ProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <ProtectedRoute userType="user">
              <UserEditProfile />
            </ProtectedRoute>
          } />
          <Route path="/user/feedback" element={
            <ProtectedRoute userType="user">
              <UserFeedback />
            </ProtectedRoute>
          } />
          <Route path="/user/change-password" element={
            <ProtectedRoute userType="user">
              <UserChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/user/check-health" element={
            <ProtectedRoute userType="user">
              <CheckHealth />
            </ProtectedRoute>
          } />
          <Route path="/user/remedies" element={
            <ProtectedRoute userType="user">
              <Remedies />
            </ProtectedRoute>
          } />

          {/* Protected Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute userType="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/income-details" element={
            <ProtectedRoute userType="doctor">
              <IncomeDetails/>
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute userType="doctor">
              <DoctorViewAppointments />
            </ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute userType="doctor">
              <DoctorEditProfile />
            </ProtectedRoute>
          } />
          <Route path="/doctor/change-password" element={
            <ProtectedRoute userType="doctor">
              <ChangePassword />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute userType="admin">
              <ManageDoctors />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute userType="admin">
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute userType="admin">
              <View />
            </ProtectedRoute>
          } />
          <Route path="/admin/feedback" element={
            <ProtectedRoute userType="admin">
              <ViewFeedback />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
