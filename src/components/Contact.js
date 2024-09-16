import React, { useState } from 'react';
import { database } from "./firebaseconfig";
import { useUserContext } from './Usercontext';
import { ref, push} from "firebase/database";

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useUserContext();

  if (!user) {
    return <div>Please log in first.</div>;
  }
  const getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const dbRef = ref(database, 'contacts'); 
    const timestamp = getCurrentTimestamp(); // Get the current server timestamp

    // Push data with a timestamp
    push(dbRef, {
      name,
      email,
      message,
      timestamp, // Add the timestamp field
    });

    setName('');
    setEmail('');
    setMessage('');
    alert("The Form has been submitted");
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete='off'
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='off'
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete='off'
          rows="5"
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactUs;
