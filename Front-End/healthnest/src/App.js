import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutUs from './components/AboutUs.js';
import SignUp from './components/Signup';
import DoctorEditProfile from './pages/DoctorEditProfile';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignUp';
import DoctorViewAppointments from './pages/DoctorViewAppointments.js';
import FAQ from './pages/FAQ.js';
import Home from './pages/Home';
import UserChangePassword from './pages/User/UserChangePassword.js';
import UserLogin from './pages/User/UserLogin.js';

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
