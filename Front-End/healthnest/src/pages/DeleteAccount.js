import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
 
  const userEmail = "user@example.com";
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  
  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
    setError('');
  };
  
  const handleDeleteAccount = () => {
   
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      
      console.log('Account deletion requested for:', userEmail);
      
      setPassword('');
      setConfirmText('');
      setIsDeleted(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const renderDeleteForm = () => (
    <div className="delete-content">
      <div className="warning-icon mb-4">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <h3 className="mb-4">Delete Your Account</h3>
      <p className="mb-4">
        We're sorry to see you go. Before you delete your account, please understand that:
      </p>
      <ul className="mb-4">
        <li>All your personal information will be permanently deleted</li>
        <li>Your appointment history will be removed</li>
        <li>Any saved medical records will be deleted</li>
        <li>This action cannot be undone</li>
      </ul>
      <p className="mb-4">
        You are about to permanently delete your account for <strong>{userEmail}</strong>.
      </p>
      <div className="mb-4">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className={`form-control ${error && !password ? 'is-invalid' : ''}`}
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
        />
        {error && !password && <div className="invalid-feedback">{error}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="confirmText" className="form-label">Type DELETE to confirm</label>
        <input
          type="text"
          className={`form-control ${error && confirmText !== 'DELETE' ? 'is-invalid' : ''}`}
          id="confirmText"
          value={confirmText}
          onChange={handleConfirmTextChange}
          placeholder="Type DELETE to confirm"
        />
        {error && confirmText !== 'DELETE' && <div className="invalid-feedback">{error}</div>}
      </div>
      <div className="d-grid">
        <button 
          className="btn btn-danger" 
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Deleting...
            </>
          ) : (
            'Delete My Account'
          )}
        </button>
      </div>
    </div>
  );
  
  const renderSuccessMessage = () => (
    <div className="delete-content text-center">
      <div className="success-icon mb-4">
        <i className="fas fa-check-circle"></i>
      </div>
      <h3 className="mb-4">Account Deletion Requested</h3>
      <p className="mb-4">
        Your account deletion request has been submitted. Your account will be permanently deleted within 30 days.
      </p>
      <p className="mb-4">
        If you change your mind, you can log in within the next 30 days to cancel the deletion request.
      </p>
      <div className="d-grid">
        <a href="/" className="btn btn-primary">
          Return to Home
        </a>
      </div>
    </div>
  );
  
  return (
    <div>
      <Header />
      <div className="container mt-5 pt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                {isDeleted ? renderSuccessMessage() : renderDeleteForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeleteAccount; 