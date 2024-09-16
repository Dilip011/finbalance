// import React, { useState } from 'react'
// import login from "../images/login.jpg"
// import { useNavigate } from 'react-router-dom'
// import { db } from "./firebaseconfig"
// import { collection, query, where, getDocs } from "firebase/firestore"
// import { useUserContext } from './Usercontext'



// const Login = () => {
//   const [data, setdata] = useState('');
//   const { setUser } = useUserContext();
//   const Navigate = useNavigate();

//   const handleInput = (event) => {
//     let newInput = { [event.target.name]: event.target.value };
//     setdata({ ...data, ...newInput })
//   };


//   const handleLogin = async (event) => {
//     event.preventDefault();

//     const { email, password } = data;

//     const usersRef = collection(db, 'users');
//     const q = query(usersRef, where('email', '==', email));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       alert('Login failed: User not found');
//       return;
//     }

//     const userDoc = querySnapshot.docs[0];
//     const userData = userDoc.data();
//     const arr = [userData.name,userData.email,userData.number,userData.cname,userData.cemail,userData.Document_Id]
//     if (userData.password === password && userData.email === email) {
//       setTimeout(() => {
//         setUser(arr);
//         Navigate("/")

//       }, 3000);
//     } else {
//       alert('Login failed: Incorrect password');
//     }
//   }
//   return (



//     <div className='login_box'>
//       <p className='login_top_topic'>Login</p>
//       <form className='login_input_box' action="/">
//         <div>
//           <i id='login_i_tags' className="fa-solid fa-envelope"></i>
//           <input type="email" name='email'
//             onChange={(event) => { handleInput(event) }} placeholder='Email Id' autoComplete='off' />
//           <p className="login_border_bottom"></p>
//         </div>

//         <div>
//           <i id='login_i_tags' className="fa-solid fa-lock"></i>
//           <input type="password" name='password'
//             onChange={(event) => { handleInput(event) }} placeholder='Password' autoComplete='off' />
//           <p className="login_border_bottom"></p>
//         </div>

//       </form>
//       <input type="submit" value="login" className='login_button' onClick={handleLogin} style={{ padding: "16px 33px 17px 35px", margin: "42px 5px 5px 55px", border: '1px solid white', background: '#009879', border_radius: "16px", font_size: "19px" }} />

//       <img className='login_box_img' src={login} alt="" />
//     </div>
//   )
// }

// export default Login;


import React, { useState } from 'react';
//import login from "../images/login.jpg";
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

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h2 className='login-form-title'>Login</h2>
        <form className='login-input-box'>
          <div className='input-wrapper'>
            <input type="email" name='email' onChange={handleInput} placeholder='Email Address' autoComplete='off' />
            <i className="fa-solid fa-envelope"></i>
          </div>

          <div className='input-wrapper'>
            <input type="password" name='password' onChange={handleInput} placeholder='Password' autoComplete='off' />
            <i className="fa-solid fa-lock"></i>
          </div>

          <button className='login-button' onClick={handleLogin}>Login</button>
        </form>
      </div>

      
    </div>
  );
};

export default Login;


