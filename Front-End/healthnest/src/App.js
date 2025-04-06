import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login'; // make sure this file exists
import SignUp from './components/Signup';
//import NotFound from './pages/NotFound'; // optional 404 page

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
