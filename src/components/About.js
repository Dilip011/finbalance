// import React from 'react';
// import aboutpage from '../images/about_page.jpg'; // Import your image

// const AboutUs = () => {
//     return (
//       <div className='about_content'>
//         <div className="about-us-container">
//             <div className="about-us-left">
//                 <h1>About Our Company</h1>
//                 <p>
//                     We are a company dedicated to providing high-quality financial services. With a team of experienced professionals,
//                     we specialize in balancing sheets, journal entries, and ledger management. Our mission is to assist businesses
//                     in achieving their financial goals with accuracy and integrity.
//                 </p>
//                 <p>
//                     We take pride in our work, and we are committed to helping our clients navigate the complexities of financial management.
//                     Whether you're a small startup or an established corporation, we have the expertise to guide you towards success.
//                 </p>
                
//             </div>
//             <div className="about-us-right">
//                 <img src={aboutpage} alt="" />
//             </div>
//         </div>
//         </div>
//     );
// };

// export default AboutUs;




import React from 'react';
import yourImage from '../images/about_page.jpg'; // Import your larger image
import { useUserContext } from './Usercontext';

const AboutUs = () => {
    const { user } = useUserContext();

    if (!user) {
        return <div>Please log in first.</div>;
      }
    return (
      <div className='about_content'>
        <div className="about-us-container">
            <div className="about-us-image">
                <img src={yourImage} alt="" />
            </div>
            <div className="about-us-content">
                <h1>Our Product</h1>
                <p>
                    Introducing our amazing product! It's designed to revolutionize the way you do things.
                    With cutting-edge features and exceptional performance, it's a game-changer for your business.
                </p>

                <p>
                Discover our comprehensive financial services designed to streamline your business operations.
                 We specialize in creating accurate balance sheets, managing complex journal entries, and providing
                 detailed trial balances to help you make informed financial decisions.
                </p>
            </div>
        </div>
        </div>
    );
};

export default AboutUs;


