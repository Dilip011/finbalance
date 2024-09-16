
import React from 'react';
import invoice from "../images/invoice.jpg";
import { useUserContext } from './Usercontext';

const Home = () => {
  const { user } = useUserContext();

  if (!user) {
    return <div>Please log in first.</div>;
  }

  

  return (
    <div className='home_element'>
      <p className='welcome_message'>Hi, {user[0]}</p>
      <img className='home primary_element' src={invoice} alt="Invoice" />
      <div className="quotes">
        <p className="quote">Effortless Data Entry,</p>
        <p className="quote">Streamlined Processes,</p>
        <p className="quote">Improved Efficiency.</p>
      </div>
    </div>
  );
}

export default Home;
