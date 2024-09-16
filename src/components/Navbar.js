// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import balance_sheet from "../images/balance_sheet.png";
// import {useUserContext } from './Usercontext';

// const Navbar = () => {
//     const {user} = useUserContext();
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     const closeSidebar = () => {
//         setSidebarOpen(false);
//     }

//     return (
//         <div className={`navbar ${sidebarOpen ? 'active' : ''}`}>
//             <div className="overlay" onClick={closeSidebar}></div>
//             <div className="logo-container">
//                 <img src={balance_sheet} className={`logo ${sidebarOpen ? 'small-logo' : ''}`} alt="Logo" />
//             </div>
//             <div className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
//                 <i className="fas fa-bars"></i>
//             </div>
//             <ul className={`nav-links ${sidebarOpen ? 'active' : ''}`}>
//                 <li><NavLink to="/" exact activeClassName="active" onClick={closeSidebar}>Home</NavLink></li>
//                 <li><NavLink to="/about" activeClassName="active" onClick={closeSidebar}>About</NavLink></li>
//                 <li><NavLink to="/department" activeClassName="active" onClick={closeSidebar}>Department</NavLink></li>
//                 <li><NavLink to="/contact" activeClassName="active" onClick={closeSidebar}>Contact Us</NavLink></li>
//                 <li><NavLink to="/profile" activeClassName="active" onClick={closeSidebar}>Profile</NavLink></li>
//                 <li><NavLink to="/login" activeClassName="active" onClick={closeSidebar}>Login</NavLink></li>
//                 <li><NavLink to="/signup" activeClassName="active" onClick={closeSidebar}>Registration</NavLink></li>
//             </ul>
//         </div>
//     );
// }

// export default Navbar;




import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import balance_sheet from "../images/balance_sheet.png";
import { useUserContext } from './Usercontext';

const Navbar = () => {
    const { user } = useUserContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handlelogout = () => {
        window.location.href = "/";
    }

    return (
        <div className={`navbar ${sidebarOpen ? 'active' : ''}`}>
            <div className="overlay" onClick={closeSidebar}></div>
            <div className="logo-container">
                <img src={balance_sheet} className={`logo ${sidebarOpen ? 'small-logo' : ''}`} alt="Logo" />
            </div>
            <div className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </div>
            <ul className={`nav-links ${sidebarOpen ? 'active' : ''}`}>
                <li><NavLink to="/home" exact activeClassName="active" onClick={closeSidebar}>Home</NavLink></li>
                <li><NavLink to="/about" activeClassName="active" onClick={closeSidebar}>About Us</NavLink></li>
                <li><NavLink to="/department" activeClassName="active" onClick={closeSidebar}>Services</NavLink></li>
                <li><NavLink to="/contact" activeClassName="active" onClick={closeSidebar}>Contact Us</NavLink></li>
                <li><NavLink to="/profile" activeClassName="active" onClick={closeSidebar}>Profile</NavLink></li>

                {user ? ( 
                    // <li><NavLink to="/" activeClassName="active" onClick={closeSidebar}>Logout</NavLink></li>
                    <li><NavLink to="/" activeClassName="active" onClick={()=>{closeSidebar(); handlelogout()}}>Logout</NavLink></li>
                ) : (
                    
                    <>
                        <li><NavLink to="/login" activeClassName="active" onClick={closeSidebar}>Login</NavLink></li>
                        <li><NavLink to="/signup" activeClassName="active" onClick={closeSidebar}>Registration</NavLink></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;





