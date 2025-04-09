import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FeelingInputComponent from './components/FeelingInputComponent';
import Login from './components/Login';
import SignUp from './components/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageUsers from './pages/Admin/ManageUsers.js';
import View from './pages/Admin/View.js';
import ChangePassword from './pages/ChangePassword';
import CheckHealth from './pages/CheckHealth';
import DeleteAccount from './pages/DeleteAccount';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import Home from './pages/Home';
import ManageAppointments from './pages/ManageAppointments';
import UserDashboard from './pages/UserDashboard';
import UserEditProfile from './pages/UserEditProfile';
import ViewAppointments from './pages/ViewAppointments';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignUp';
import UserLogin from './pages/UserLogin.js';
import UserFeedback from './pages/UserFeedback.js';

// ✅ NEWLY ADDED DOCTOR EDIT PROFILE
import DoctorEditProfile from './pages/DoctorEditProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/viewappointments" element={<ViewAppointments />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/deleteaccount" element={<DeleteAccount />} />
          <Route path="/doctorprofile" element={<DoctorProfile />} />
          <Route path="/manageappointments" element={<ManageAppointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/checkhealth" element={<CheckHealth />} />
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
          <Route path="/feeling-input" element={<FeelingInputComponent />} />
          <Route path="/editprofile" element={<UserEditProfile />} />
          <Route path="/user/viewappointments" element={<ViewAppointments />} />
          <Route path="/admin/managedoctors" element={<ManageDoctors />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          <Route path="/admin/viewappointmets" element={<View />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/feedback" element={<UserFeedback/>}/>

          {/* ✅ NEW ROUTE FOR DOCTOR EDIT PROFILE */}
          <Route path="/doctor/editprofile" element={<DoctorEditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
