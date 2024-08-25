import SockJS from "sockjs-client";
import { over } from "stompjs";
import React, { useState, useEffect, useRef } from 'react';
import MessageInput from '../MessageInput/MessageInput.jsx';
import axios from 'axios';
import styles from './ChatRoom.module.css';
import fallBackImage from '../../assets/user.png'; // Ensure the image path is correct

const BASE_URL = 'http://localhost:8083';
let stompClient = null;

const ChatRoom = ({ userData, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const isConnecting = useRef(false);

    const connect = () => {
        if (isConnecting.current || isConnected) return;

        isConnecting.current = true;

        if (userData && userData.userName) {
            const sock = new SockJS(`${BASE_URL}/ws`);
            const client = over(sock);
            client.connect({}, () => onConnect(client), onError);
        } else {
            console.log('UserData is null or invalid');
            isConnecting.current = false;
        }
    };

    const onConnect = (client) => {
        setIsConnected(true);
        isConnecting.current = false;
        stompClient = client;

        stompClient.subscribe('/user/public', onPublicMessage);
        stompClient.subscribe(`/user/${userData.userName}/queue/messages`, onPrivateMessage);
        stompClient.send('/app/user.addUser', {}, JSON.stringify(userData));
        findAndDisplayConnectedUsers();
    };

    const onError = (error) => {
        console.error('WebSocket connection error:', error);
        isConnecting.current = false;
    };

    const findAndDisplayConnectedUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const onPublicMessage = async (payload) => {
        await findAndDisplayConnectedUsers();
        const payloadData = JSON.parse(payload.body);
        console.log('Public message received:', payloadData);
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        
        // Add the received message to the message list
        if (payloadData.sender === selectedUser || payloadData.sender === userData.userName) {
            setMessages((prevMessages) => [...prevMessages, payloadData]);
        }
    };

    const messagesList = messages.map((message, index) => (
        <div
            key={index}
            className={`${styles.message} ${message.sender === userData.userName ? styles.sent : styles.received}`}
        >
            <p className={styles.messageSender}>{message.sender}</p>
            <p className={styles.messageContent}>{message.content}</p>
        </div>
    ));

    const fetchAndDisplayUserChat = async () => {
        if (selectedUser) {
            try {
                console.log( 'Fetching chat messages ',`${BASE_URL}/messages/${userData.userName}/${selectedUser}`);
                const response = await axios.get(`${BASE_URL}/messages/${userData.userName}/${selectedUser}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        }
    };

    useEffect(() => {
        fetchAndDisplayUserChat();
    }, [selectedUser]);

    useEffect(() => {
        connect();
    }, [userData]);

    const handleSendMessage = (messageContent) => {
        if (stompClient && isConnected) {
            const message = {
                sender: userData.userName,
                receiver: selectedUser,
                content: messageContent,
                timeStamp: new Date().toISOString(),
            };

            stompClient.send('/app/chat', {}, JSON.stringify(message));

            // Add the sent message to the message list
            setMessages((prevMessages) => [...prevMessages, message]);
        } else {
            console.error("STOMP client is not connected. Cannot send message.");
        }
    };

    const handleLogOut = () => {
        setIsConnected(false);
        if (stompClient) {
            stompClient.disconnect();
        }
        onLogout();
    };

    return (
        <div className={styles.chatRoomContainer}>
            <div className={styles.userListContainer}>
                <h3>Online Users</h3>
                <ul className={styles.userList}>
                    {users.map((user) => (
                        <li
                            key={user.userName}
                            className={`${styles.userItem} ${selectedUser === user.userName ? styles.activeUser : ''}`}
                            onClick={() => setSelectedUser(user.userName)}
                        >
                            <div className={styles.userDetails}>
                                <img src={fallBackImage} alt="User" />
                                <span>{user.userName}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles.logoutContainer}>
                    <p>{userData.userName}</p>
                    <button onClick={handleLogOut} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>
            <div className={styles.chatWindowContainer}>
                {selectedUser ? (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.headerContent}>
                                <img className={styles.userIcon} src={fallBackImage} alt="User" />
                                <div className={styles.userInfo}>
                                    <h4>{selectedUser}</h4>
                                    <p className={styles.userStatus}>{isConnected ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chatMessages}>
                            {messagesList}
                        </div>
                        <MessageInput onSendMessage={handleSendMessage} />
                    </>
                ) : (
                    <div className={styles.selectUserPrompt}>Select a user to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
