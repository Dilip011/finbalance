import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import "./styles/App.css";
import "./styles/Navbar.css";
import "./styles/Profile.css";
import "./styles/journal.css";
import "./styles/Ledger.css";
import "./styles/Login.css";
import "./styles/Signup.css";
import "./styles/Departement.css";
import "./styles/contact.css";
import "./styles/Trialbalance.css";
import "./styles/Home.css";
import "./styles/aboutus.css";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Signup from './components/Signup';
import Login from './components/Login';
import Errorpage from './components/Errorpage';
import Departement from './components/Departement';
import Journalentry from './components/Journal';
import Profile from './components/Profile';
import Ledger from './components/Ledger';
import Balancesheet from './components/balancesheet';
import Trading from './components/Trading';
import Profile_loss from "./components/Profit_loss";
import Trialbalance from "./components/Trialbalance";
import CheckUser from './components/checkuser';
import Home2 from './components/Home_page2';
import ResetPassword from './components/Resetpassword';
import { UserContextProvider } from './components/Usercontext';

const App = () => {
  const location = useLocation();

  // Hide Navbar on these routes
  const noNavbarRoutes = ["/login", "/signup","/"];

  return (
    <div>
      <UserContextProvider>
        {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home2 />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/department" element={<Departement />} />
          <Route exact path="/Journal/:data" element={<Journalentry />} />
          <Route exact path="/Ledger/:data" element={<Ledger />} />
          <Route exact path="/profitandloss/:data" element={<Profile_loss />} />
          <Route exact path="/trading/:data" element={<Trading />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/balancesheet" element={<Balancesheet />} />
          <Route exact path="/Trialbalance/:data" element={<Trialbalance />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="*" element={<Errorpage />} />
          {/* <Route path="/reset@ax45password" element={<ResetPassword />} /> */}
        </Routes>
      </UserContextProvider>
    </div>
  );
};

export default App;
