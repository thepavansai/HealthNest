import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutUs from './components/AboutUs.js';
import Remedies from './components/Remedies.js';
import SignUp from './components/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin.js';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageUsers from './pages/Admin/ManageUsers.js';
import View from './pages/Admin/View.js';
import ViewFeedback from './pages/Admin/ViewFeedback.js';
import ChangePassword from './pages/ChangePassword';
import CheckHealth from './pages/CheckHealth';
import DeleteAccount from './pages/DeleteAccount';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorEditProfile from './pages/DoctorEditProfile';
import DoctorLogin from './pages/DoctorLogin';
import DoctorProfile from './pages/DoctorProfile';
import DoctorSignup from './pages/DoctorSignUp';
import DoctorViewAppointments from './pages/DoctorViewAppointments.js';
import FAQ from './pages/FAQ.js';
import Home from './pages/Home';
import ManageAppointments from './pages/ManageAppointments';
import UserChangePassword from './pages/UserChangePassword.js';
import UserDashboard from './pages/UserDashboard';
import UserEditProfile from './pages/UserEditProfile';
import UserFeedback from './pages/UserFeedback.js';
import UserLogin from './pages/UserLogin.js';
import ViewAppointments from './pages/ViewAppointments';

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
          <Route path="/suggestions" element={<Remedies />} />
          <Route path="/editprofile" element={<UserEditProfile />} />
          <Route path="/user/viewappointments" element={<ViewAppointments />} />
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/user/feedback" element={<UserFeedback/>}/>
          <Route path="/admin/managedoctors" element={<ManageDoctors />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          <Route path="/admin/viewappointments" element={<View />} />
          <Route path="/admin/viewfeedbacks" element={<ViewFeedback/>} />


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
