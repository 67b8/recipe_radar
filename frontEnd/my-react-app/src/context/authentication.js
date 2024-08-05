import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate(); 

    const loginAction = async (data) => {
        try {
            const response = await axios.post("http://localhost:3001/api/auth/login", { ...data });
            console.log('Response data:', response.data);
    
            const { token, user } = response.data;
    
    
            setToken(token);
            setUser(user);
            setUserDetails(userDetails);  // Set userDetails
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userDetails", JSON.stringify(userDetails));  // Store userDetails in localStorage
    
            return user;
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");  
        if (savedToken) {
            setToken(savedToken);
        }
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));  // Parse and set user if savedUser is valid JSON
            } catch (error) {
                console.error('Error parsing saved user:', error);
                setUser(null);  // Reset user if parsing fails
            }
        }
        
    }, []);
     
    const logOut = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
         
        setToken(null);
        setUser(null);
        navigate('/'); 
        console.log('Token and user details removed from localStorage');
    }

    return (
        <AuthContext.Provider value={{ token, user, userDetails, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => {
    return useContext(AuthContext);
};
