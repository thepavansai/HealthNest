import React, { useRef, useState } from 'react';
import { FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import './ForgotPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userType, setUserType] = useState('patient'); 
  const emailForm = useRef();

  
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      
      
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      
      
      
      
      
       await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { 
          passcode: newOtp,
          email: email,
          
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      
      
      const checkEndpoint = userType === 'doctor' 
        ? 'http://localhost:8080/doctor/check-email'
        : 'http://localhost:8080/users/check-email';
      
      const response = await axios.post(checkEndpoint, { 
        email,
        userType
      });
      
      if (response.status === 200) {
        setStep(2);
        toast.success('OTP sent to your email');
        
        
        setTimer(300);
        const countdown = setInterval(() => {
          setTimer(prevTimer => {
            if (prevTimer <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prevTimer - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) {
        toast.error(`${userType === 'doctor' ? 'Doctor' : 'User'} email not found. Please check your email address.`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      
      
      if (otp === generatedOtp && timer > 0) {
        setStep(3);
        toast.success('OTP verified successfully');
      } else if (timer === 0) {
        toast.error('OTP has expired. Please request a new one.');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number');
      return;
    }

    try {
      setLoading(true);
      
      
      const resetEndpoint = userType === 'doctor' 
        ? 'http://localhost:8080/doctor/setnewpassword'
        : 'http://localhost:8080/users/setnewpassword';
      
      
      const response = await axios.post(resetEndpoint, {
        email:email,
        newPassword: password,

      });
      
      if (response.status === 200) {
        toast.success('Password reset successful');
        setTimeout(() => {
          
          if (userType === 'doctor') {
            navigate('/doctor/login');
          } else {
            navigate('/login');
          }
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    try {
      setLoading(true);
      
      
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      
      
      
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { 
          passcode: newOtp,
          email: email,
          
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      
      
      toast.success('New OTP sent to your email');
      
      
      setTimer(300);
      const countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <Header />
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2 className="forgot-password-title">Reset Your Password</h2>
          
          <div className="progress-steps">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <div className="step-text">Email</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-text">Verify</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-text">Reset</div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="forgot-password-form">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="user-type-selection">
                <p className="selection-label">Select account type:</p>
                <div className="checkbox-group">
                  <div className="checkbox-wrapper">
                    <input 
                      type="radio" 
                      id="patient" 
                      name="userType" 
                      value="patient"
                      checked={userType === 'patient'} 
                      onChange={() => setUserType('patient')}
                    />
                    <label htmlFor="patient">Patient</label>
                  </div>
                  <div className="checkbox-wrapper">
                    <input 
                      type="radio" 
                      id="doctor" 
                      name="userType" 
                      value="doctor" 
                      checked={userType === 'doctor'}
                      onChange={() => setUserType('doctor')}
                    />
                    <label htmlFor="doctor">Doctor</label>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="request-otp-btn" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Request OTP'}
              </button>
              
              <div className="back-to-login">
                Remember your password? <a href="/login">Login</a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="forgot-password-form">
              <p className="otp-info">
                We've sent a 6-digit OTP to your email address. Please enter it below.
              </p>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaKey className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter the 6-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required 
                  />
                </div>
              </div>
              
              <div className="timer-section">
                {timer > 0 ? (
                  <p>Resend OTP in {formatTime(timer)}</p>
                ) : (
                  <button 
                    type="button" 
                    className="resend-otp-btn" 
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              
              <button 
                type="submit" 
                className="verify-otp-btn" 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <p className="reset-info">
                Create a new password for your account
              </p>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="New Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <span 
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="password-requirements">
                  Must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                  <span 
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="reset-password-btn" 
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
      <Footer />
    </>
  );
};

export default ForgotPassword;