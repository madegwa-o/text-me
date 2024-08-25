import React, { useState,useEffect } from 'react';
import ChatRoom from './components/ChatRoom/ChatRoom';
import Login from './components/login/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const [userData, setUserData] = useState({
        userName: '',
        status: 'OFFLINE',
        lastSeen: ''
    });

    const handleLogin = (username) => {
        const updatedUserData = { ...userData, userName: username, lastSeen: new Date().toISOString() };
        setUserData(updatedUserData);
        
        setIsAuthenticated(true);
    };
    
    

    useEffect(() => {
        console.log("userData ", userData);

    }, [userData]);

    return (
        isAuthenticated ? (
            <ChatRoom userData={userData} onLogout={() => setIsAuthenticated(false)}/>
        ) : (
            <Login onLogin={handleLogin} />
        )
    );
}

export default App;
