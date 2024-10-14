// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';

const socket = io('http://localhost:1337');

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load messages from localStorage
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, msg];
        // Save messages to localStorage
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!user) {
    return (
      <Container>
        <Login setUser={handleSetUser} />
        <Signup setUser={handleSetUser} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Welcome, {user.username}!</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Chat user={user} messages={messages} socket={socket} />
    </Container>
  );
}
export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 800px;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border:`