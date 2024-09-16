import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebaseconfig";
import { collection, getDocs, where, query } from "firebase/firestore";
import Cookies from 'js-cookie';
import { useUserContext } from './Usercontext';

function CheckUser() {
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    useEffect(() => {
        const uniqueToken = Cookies.get('unique_token');

        if (uniqueToken) {
            const q = query(collection(db, 'users'), where('unique_token', '==', uniqueToken));
            getDocs(q)
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            const userArray = [userData.name, userData.email, userData.number, userData.cname, userData.cemail, userData.Document_Id];
                            //   setUserData(user);
                            setUser(userArray);
                            navigate('/home');
                        });
                    } else {
                        navigate('/login');
                    }
                })
                .catch((error) => {
                    console.error('Firestore query error: ', error);
                });
        } else {
            navigate('/login');
        }
    }, [navigate, setUser]);

    return null;
}

export default CheckUser;







