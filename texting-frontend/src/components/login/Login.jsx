import React, { useState } from 'react';
import styles from './Login.module.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Simulate a successful login and call the onLogin function
        onLogin(username);
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Enter Chatroom</h2>
            <form onSubmit={handleSubmit}>
                <label>User Name:</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <button type="submit">Enter Chatroom</button>
            </form>
        </div>
    );
}

export default Login;
