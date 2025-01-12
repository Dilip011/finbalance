import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserContext } from './Usercontext';

const Login = () => {
  const [data, setdata] = useState({});
  const { setUser } = useUserContext();
  const navigate = useNavigate();   

  const handleInput = (event) => {
    const { name, value } = event.target;
    setdata(prevData => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const { email, password } = data;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert('Login failed: User not found');
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userArray = [userData.name, userData.email, userData.number, userData.cname, userData.cemail, userData.Document_Id];

    if (userData.password === password && userData.email === email) {
      setTimeout(() => {
        setUser(userArray);
        navigate("/home");
      }, 1000);
    } else {
      alert('Login failed: Incorrect password');
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset@ax45password', { state: { email: data.email || '' } });
  };

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h2 className='login-form-title'>Login</h2>
        <form className='login-input-box'>
          <div className='input-wrapper'>
            <input 
              type="email" 
              name='email' 
              onChange={handleInput} 
              placeholder='Email Address' 
              autoComplete='off' 
              value={data.email || ''} 
            />
            <i className="fa-solid fa-envelope"></i>
          </div>

          <div className='input-wrapper'>
            <input 
              type="password" 
              name='password' 
              onChange={handleInput} 
              placeholder='Password' 
              autoComplete='off' 
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <button className='login-button' onClick={handleLogin}>Login</button>
          
          <div className="auth-links">
            <p>
              Not have an Account? <a href="/signup">Sign Up Now</a>
            </p>
            {/* <span className="or-divider">or</span>
            <p>
              <a href="/reset@ax45password" onClick={handleForgotPassword}>Forgot Password?</a>
            </p> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
