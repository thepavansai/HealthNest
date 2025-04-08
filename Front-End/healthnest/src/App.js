import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FeelingInputComponent from './components/FeelingInputComponent';
import Login from './components/Login'; // make sure this file exists
import SignUp from './components/Signup';
import ViewAppointments from './components/ViewAppointments';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import CheckHealth from './pages/CheckHealth';
import Dashboard from './pages/Dashboard';
import DeleteAccount from './pages/DeleteAccount';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import Home from './pages/Home';
import ManageAppointments from './pages/ManageAppointments';
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
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/checkhealth" element={<CheckHealth/>}/>
          <Route path="/doctordashboard" element={<DoctorDashboard/>}/>
          <Route path="/feeling-input" element={<FeelingInputComponent />} />
          <Route path="/editprofile" element={<UserEditProfile/>}/>
          <Route path="/admin/viewappointments" element={<ViewAppointments />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
