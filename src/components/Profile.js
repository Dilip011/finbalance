import React from 'react';
import { useUserContext } from './Usercontext';
import acccountacy from "../images/accountacy.jpg"
import mail from "../images/mail.jpg"
import phone from "../images/phone.jpg"
import c_name from "../images/company_name.jpg"
import c_mail from "../images/mail.jpg"
import USER from "../images/company_user.jpg"

const Profile = () => {
  const { user } = useUserContext();

  return (
    <div className='profile_container'>
      <div className="profile_form">
        <div className="profile_values">
          <img src={acccountacy} alt="User Profile" />
          <div className="profile_items">
            <p>UserName:</p>
            <p>&nbsp;&nbsp;{user[0]}</p>
          </div>
        </div>

        <div className="profile_values">
          <img src={mail} alt="User Profile" />
          <div className="profile_items">
            <p>Email Id:</p>
            <p>&nbsp;&nbsp;{user[1]}</p>
          </div>
        </div>

        <div className="profile_values">
          <img src={phone} alt="User Profile" />
          <div className="profile_items">
            <p>Phone Number:</p>
            <p>&nbsp;&nbsp;{user[2]}</p>
          </div>
        </div>

        <div className="profile_values">
          <img src={c_name} alt="User Profile" />
          <div className="profile_items">
            <p>Company Name:</p>
            <p>&nbsp;&nbsp;{user[3]}</p>
          </div>
        </div>

        <div className="profile_values">
          <img src={c_mail} alt="User Profile" />
          <div className="profile_items">
            <p>Company Mail Id:</p>
            <p>&nbsp;&nbsp;{user[4]}</p>
          </div>
        </div>

        <div className="profile_values">
          <img src={USER} alt="User Profile" />
          <div className="profile_items">
            <p>User Id:</p>
            <p>&nbsp;&nbsp;{user[5]}</p>
          </div>
        </div>
      </div>
    </div>

  );
};




export default Profile;







