// Import the necessary modules
import Cookies from 'js-cookie';
import { db } from './firebaseconfig'; // Import your Firebase configuration

// Function to check if the user's cookie matches Firestore cookie
const checkUserCookie = async () => {
  // Get the user's cookie
  const userCookie = Cookies.get('cookie_id');

  if (!userCookie) {
    // If the user's cookie doesn't exist, redirect to the login page
    window.location.href = '/login';
    return;
  }

  // Check if the user's cookie exists in Firestore
  const usersRef = db.collection('users');
  const query = usersRef.where('cookie_id', '==', userCookie);
  const querySnapshot = await query.get();

  if (querySnapshot.empty) {
    // If the user's cookie doesn't match any Firestore document, redirect to the login page
    window.location.href = '/login';
  } else {
    // If the user's cookie matches a Firestore document, redirect to the homepage
    window.location.href = '/homepage';
  }
};

// Call the function when the page loads
window.addEventListener('load', checkUserCookie);
