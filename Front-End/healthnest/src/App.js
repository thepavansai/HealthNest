import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login'; // make sure this file exists
import SignUp from './components/Signup';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import DoctorProfile from './pages/DoctorProfile';
import ManageAppointments from './pages/ManageAppointments';
import AdminDashboard from './pages/AdminDashboard';
//import Dashboard from './pages/Dashboard';
import CheckHealth from './pages/CheckHealth';
import DoctorDashboard from './pages/DoctorDashboard';
import FeelingInputComponent from './components/FeelingInputComponent';
import UserDashboard from './pages/UserDashboard';
import UserEditProfile from './pages/UserEditProfile';


//import NotFound from './pages/NotFound'; // optional 404 page

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/changepassword" element={<ChangePassword/>} />
          <Route path="/deleteaccount" element={<DeleteAccount/>} />
          <Route path="/doctorprofile" element={<DoctorProfile/>} />
          <Route path="/manageappointments" element={<ManageAppointments/>} />
          <Route path="/admin"element={<AdminDashboard/>}/>
          <Route path="/user"element={<UserDashboard/>}/>
          <Route path="/dashboard" element={<UserDashboard/>} />
          <Route path="/checkhealth" element={<CheckHealth/>}/>
          <Route path="/doctordashboard" element={<DoctorDashboard/>}/>
          <Route path="/feeling-input" element={<FeelingInputComponent />} />
          <Route path="/editprofile" element={<UserEditProfile/>}/>

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
