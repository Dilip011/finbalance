import React, { useState } from 'react';
// import "../styles/resetpassword.css"

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
  
    const sendOtp = () => {
      // Simulate OTP sending
      console.log('OTP sent to:', email);
      setIsOtpSent(true);
    };
  
    const handlePasswordReset = () => {
      // Simulate password reset logic
      console.log('Password reset to:', newPassword);
      setIsPasswordReset(true);
    };
  
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-box">
          <h2>Forgot Password</h2>
          
          {!isOtpSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={sendOtp} disabled={!email}>
                Send OTP
              </button>
            </>
          ) : !isPasswordReset ? (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handlePasswordReset} disabled={!otp}>
                Reset Password
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handlePasswordReset} disabled={!newPassword}>
                Save New Password
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

export default ResetPassword;
