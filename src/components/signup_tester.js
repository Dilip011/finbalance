import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebaseconfig";
import { collection, addDoc, getDocs, where,query,updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Cookies from 'js-cookie';

const Signup = () => {
  const Navigate = useNavigate();
  const [data, setdata] = useState('');

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setdata({ ...data, ...newInput });
  };

  let date = new Date().getTime();
  let dataObj = new Date(date);
  let month = dataObj.getMonth();
  let year = dataObj.getFullYear();
  let DATE = dataObj.getDate();
  let Main_date = (`${DATE}/${month + 1}/${year}`);
  let userid = new Date().getTime();

  
  const checkEmailExists = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };
  const checkCompanyemailExists = async (cemail) =>{
    const d = query(collection(db, 'users'), where("cemail", "==", cemail));
    const querySnapshot = await getDocs(d);
    return !querySnapshot.empty;
  }
  const checkNumberExists = async (number) =>{
    const n = query(collection(db, 'users'), where("number", "==", number));
    const querySnapshot = await getDocs(n);
    return !querySnapshot.empty;
  }

  const generateUniqueUserId = async () => {
    let userId;
    let isUnique = false;
  
    while (!isUnique) {
      userId = uuidv4();
  
      const q = query(collection(db, 'users'), where('cookie_id', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }
  
    return userId;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const emailExists = await checkEmailExists(data.email);
    const companyemailexists = await checkCompanyemailExists(data.cemail);
    const numberExists = await checkNumberExists(data.number);
  
    if (emailExists) {
      alert('Email already exists.');
      return;
    } else if (companyemailexists) {
      alert("Company Mail has already been taken");
      return;
    } else if (numberExists) {
      alert("The Given Number has already been taken");
    }
  
    if (data.password !== data.cpassword) {
      alert("The passwords do not match");
    }
  
    try {
      const userId = await generateUniqueUserId();
      Cookies.set('cookie_id', userId);
      const docRef = await addDoc(collection(db, 'users'), {
        ...data,
        Timestamp: Main_date,
        User_Id: userid,
        cookie_id:userId
      });
  
      const newDocId = docRef.id;
      await updateDoc(docRef, {
        Document_Id: newDocId,
      });
  
      setTimeout(() => {
        Navigate("/login");
      }, 3000);
    } catch (error) {
      console.error('Error adding data to Firestore: ', error);
    }
  };
  

  return (
    <>
      <div>
        <div className='registration_box'>
        
          <form className='input_box' action="/">
          <h2 className='register_top_topic'>Sign In</h2>
          <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-user"></i>
              <input type="text" name='name' id='name'
                onChange={(event) => { handleInput(event) }} placeholder='Name' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>


            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-envelope"></i>
              <input type="email" name='email'
                onChange={(event) => { handleInput(event) }} placeholder='Email Id' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>

            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-phone"></i>
              <input type="text" name='number'
                onChange={(event) => { handleInput(event) }} placeholder='Contact Number' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>

            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-building"></i>
              <input type="text" name='cname'
                onChange={(event) => { handleInput(event) }} placeholder='Company Name' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>

            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-envelope"></i>
              <input type="email" name='cemail'
                onChange={(event) => { handleInput(event) }} placeholder='Company Mail Id' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>

            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-lock"></i>
              <input type="password" name='password'
                onChange={(event) => { handleInput(event) }} placeholder='Password' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>

            <div className="wrapper-input">
              <i id='i_tags' className="fa-solid fa-lock"></i>
              <input type="password" name='cpassword'
                onChange={(event) => { handleInput(event) }} placeholder='Confirm password' autoComplete='off' />
              {/* <p className="register_border_bottom"></p> */}
            </div>
            {/* <input type="submit" value="Register" className='register_button' onClick={handleSubmit} /> */}
            <button className='register_button' onClick={handleSubmit}>Register</button>
          </form>
          

        </div>
      </div>
    </>
  );
}

export default Signup;
