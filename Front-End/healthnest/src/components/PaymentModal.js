import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample list of popular banks
  const popularBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IDBI Bank'
  ];

  const filteredBanks = popularBanks.filter(bank =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  if (!isOpen) return null;

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length === 2) {
        setExpiryDate(value + '/');
      } else {
        setExpiryDate(value);
      }
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Please fill in all card details');
        setLoading(false);
        return;
      }
      if (cardNumber.length !== 16) {
        setError('Invalid card number');
        setLoading(false);
        return;
      }
      if (cvv.length !== 3) {
        setError('Invalid CVV');
        setLoading(false);
        return;
      }
    } else if (paymentMethod === 'upi' && !upiId) {
      setError('Please enter UPI ID');
      setLoading(false);
      return;
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank || !bankAccount || !ifscCode || !accountHolderName) {
        setError('Please fill in all bank details');
        setLoading(false);
        return;
      }
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentSuccess();
      onClose();
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText('healthnest@upi');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="payment-modal-content">
          <div className="payment-amount">
            <span>Amount to Pay</span>
            <h3>₹{amount}</h3>
          </div>

          <div className="payment-methods">
            <div className="method-tabs">
              <button
                className={`tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </button>
              <button
                className={`tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </button>
              <button
                className={`tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                Net Banking
              </button>
            </div>

            <div className="payment-form">
              {paymentMethod === 'card' && (
                <>
                  <div className="input-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="card-details">
                    <div className="input-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-section">
                  <div className="upi-qr">
                    <div className="upi-amount">₹{amount}</div>
                    <div className="upi-scan-text">Scan to pay</div>
                    <div className="upi-qr-code">
                      <img src="images/radaar.png" alt="QR Code" className="qr-code-image" />
                    </div>
                    <div className="upi-or">OR</div>
                    <div className="upi-id-section">
                      <div className="upi-id-label">Pay to UPI ID</div>
                      <div className="upi-id-value">healthnest@upi</div>
                      <button 
                        className={`copy-upi-btn ${copySuccess ? 'copied' : ''}`}
                        onClick={handleCopyUpiId}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <>
                  <div className="input-group">
                    <label>Search Bank</label>
                    <input
                      type="text"
                      placeholder="Search your bank"
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                    />
                    {bankSearch && (
                      <div className="bank-list">
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((bank) => (
                            <div
                              key={bank}
                              className="bank-option"
                              onClick={() => {
                                setSelectedBank(bank);
                                setBankSearch('');
                              }}
                            >
                              {bank}
                            </div>
                          ))
                        ) : (
                          <div className="bank-not-found">
                            <div className="bank-not-found-message">
                              Bank not found in our list
                            </div>
                            <div className="enter-bank-manually">
                              <input
                                type="text"
                                placeholder="Enter your bank name"
                                value={bankSearch}
                                onChange={(e) => {
                                  setBankSearch(e.target.value);
                                  setSelectedBank(e.target.value);
                                }}
                              />
                              <button 
                                className="use-this-bank"
                                onClick={() => setBankSearch('')}
                              >
                                Use this bank
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedBank && (
                    <>
                      <div className="selected-bank">
                        Selected Bank: {selectedBank}
                        <button className="change-bank" onClick={() => setSelectedBank('')}>
                          Change
                        </button>
                      </div>
                      <div className="input-group">
                        <label>Account Holder Name</label>
                        <input
                          type="text"
                          placeholder="Enter account holder name"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Account Number</label>
                        <input
                          type="text"
                          placeholder="Enter your account number"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      <div className="input-group">
                        <label>IFSC Code</label>
                        <input
                          type="text"
                          placeholder="Enter IFSC code"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {error && <div className="error-message">{error}</div>}

              <button
                className="pay-button"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${amount}`}
              </button>
            </div>
          </div>
        </div>

        <div className="payment-security">
          <div className="security-badge">
            <span>🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className="payment-providers">
            <img src="images/visa.png" alt="Visa" />
            <img src="images/mastercard.png" alt="Mastercard" />
            <img src="images/rupay.png" alt="RuPay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 