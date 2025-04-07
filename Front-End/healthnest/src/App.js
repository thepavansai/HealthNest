import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login'; // make sure this file exists
import SignUp from './components/Signup';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import DoctorProfile from './pages/DoctorProfile';
import ManageAppointments from './pages/ManageAppointments';

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

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
