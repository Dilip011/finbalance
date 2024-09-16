import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sign_up from "../images/sign_up.jpg"
import { db } from "./firebaseconfig"
import { collection, doc, query, onSnapshot, orderBy, where, getDocs, setDoc } from "firebase/firestore"
import { auth } from "./firebaseconfig"

const Signup = () => {
  const Navigate = useNavigate();
  // const [user, setUser] = useState({
  //   name: "", email: "", number: "", cname: "", cemail: "", password: "", cpassword: ""
  // })
  // let name, value;
  // const handleInput = (e) => {
  //   console.log(e)
  //   name = e.target.name;
  //   value = e.target.value;
  //   setUser({ ...user, [name]: value })

  // }
  // const PostData = async (e) => {
  //   e.preventDefault();

  //   const { name, email, number, cname, cemail, password, cpassword } = user;

  //   const res = await fetch("/register", {
  //     method: "POST", headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       name, email, number, cname, cemail, password, cpassword

  //     })
  //   });
  //   const data = await res.json();

  //   if (res.status === 422 || !data) {
  //     window.alert("Invalid registration");
  //     console.log("Invalid Registration");
  //   } else {
  //     window.alert("Successful Reigstration");
  //     console.log("Successful Reigstration");

  //     Navigate("/login")
  //   }

  // }
  const [data, setdata] = useState('');
  const collection_ref = collection(db, "users")

  const dateQuery = query(collection_ref, orderBy("Timestamp", "asc"))
  const emailQuery = query(collection_ref, where("email", "==", "dilipkumar656656@gmail.com"))

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setdata({ ...data, ...newInput })
  };


  let date = new Date().getTime();;
  let dataObj = new Date(date);
  let month = dataObj.getMonth();
  let year = dataObj.getFullYear();
  let DATE = dataObj.getDate();
  let Main_date = (`${DATE}/${month + 1
    }/${year}`)
  let userid = new Date().getTime()


  // const handleSubmit = () => {
  //   addDoc(collection_ref, {
  //     name: data.name,
  //     email:data.email,
  //     Number:data.number,
  //     company: data.cname,
  //     Company_mail: data.cemail,
  //     password: data.password,
  //     confirm_password: data.cpassword,
  //     // Timestamp:new Date(Timestamp.now().toDate()),
  //     Timestamp: Main_date,
  //     User_Id: userid

  //   }).then(() => {

  //     setTimeout(() => {
  //       Navigate("/login")
  //     }, 2000);
  //   }).catch((err) => {
  //     console.log(err.message);
  //   })
  // }
  const checkEmailExists = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
  
    return !querySnapshot.empty;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      console.log('Email already exists.');
      return;
    }
  
    try {
      // const docRef = await addDoc(collection(db, 'users'), {
        // name: data.name,
        // email: data.email,
        // Number: data.number,
        // company: data.cname,
        // Company_mail: data.cemail,
        // password: data.password,
        // confirm_password: data.cpassword,
        // Timestamp: Main_date,
        // User_Id: userid,
      // });
      const docRef = doc(collection(db, 'users'));
      const newDocId = docRef.id;
      await setDoc(docRef, {
        ...data,
        name: data.name,
        email: data.email,
        Number: data.number,
        company: data.cname,
        Company_mail: data.cemail,
        password: data.password,
        confirm_password: data.cpassword,
        Timestamp: Main_date,
        User_Id: userid,
        Document_id:newDocId

      })
      // const newDocId = docRef.id;
      // console.log('New document ID:', newDocId);
  
      // const newData = {
      //   ...data,
      //   Document_Id: newDocId,
      // };
      
    } catch (error) {
      // Error adding data to Firestore
      console.error('Error adding data to Firestore: ', error);
    }
  };

  
  

  const docarray = [];
  const getData = () => {
    onSnapshot(emailQuery, (data) => {
      console.log(
        data.docs.map((item) => {
          docarray.push(item.data())
          console.log("before")
          console.log(docarray)
          console.log("after");
          return item.data();
          
        })
      )
    })
  }


  return (
    <>
      <div>
        <div className='registration_box'>
          <p className='register_top_topic'>Sign up</p>
          <form className='input_box' action="/">
            <div>
              <i id='i_tags' className="fa-solid fa-user"></i>
              <input type="text" name='name' id='name'
                onChange={(event) => { handleInput(event) }} placeholder='Name' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>


            <div>
              <i id='i_tags' className="fa-solid fa-envelope"></i>
              <input type="email" name='email'
                onChange={(event) => { handleInput(event) }} placeholder='Email Id' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>

            <div>
              <i id='i_tags' className="fa-solid fa-envelope"></i>
              <input type="text" name='number'
                onChange={(event) => { handleInput(event) }} placeholder='Contact Number' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>

            <div>
              <i id='i_tags' className="fa-solid fa-building"></i>
              <input type="text" name='cname'
                onChange={(event) => { handleInput(event) }} placeholder='Company Name' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>

            <div>
              <i id='i_tags' className="fa-solid fa-envelope"></i>
              <input type="email" name='cemail'
                onChange={(event) => { handleInput(event) }} placeholder='Company Mail Id' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>

            <div>
              <i id='i_tags' className="fa-solid fa-lock"></i>
              <input type="password" name='password'
                onChange={(event) => { handleInput(event) }} placeholder='Password' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>

            <div>
              <i id='i_tags' className="fa-solid fa-lock"></i>
              <input type="password" name='cpassword'
                onChange={(event) => { handleInput(event) }} placeholder='Confirm password' autoComplete='off' />
              <p className="register_border_bottom"></p>
            </div>


          </form>
          <input type="submit" value="Register" className='register_button' id='register_button' onClick={handleSubmit} style={{ padding: "16px 33px 17px 35px", margin: "7px 5px 5px 55px", border: '1px solid white', background: '#009879', border_radius: "16px", font_size: "19px" }} />

          {/* <input type="button" placeholder="Register" className='register_button'  onClick={handleSubmit} /> */}
          {/* <input type="submit" value="Register" className='register_button' style={padding:'16px 33px 17px 35px', margin:'7px 5px 5px 55px', border_radius:'16px', font_size:'19px', border:'1px solid white', background:'#009879', color:'white', font-weight: '400' } onClick={handleSubmit} /> */}



          <img className='register_box_img' src={sign_up} alt="" />

        </div>

      </div>

    </>
  )
}

export default Signup;