
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Chat = ({ user, messages, socket }) => {
  const [input, setInput] = useState('');
  // const [user,setUser]=useState('')
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat message', { user: user.id, content: input });
      setInput('');
    }
  };
//  setUser(localStorage.getItem('user'))
 console.log(user)

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageItem key={index} isOwnMessage={msg.user === user.username}>
            {console.log(msg)}
            <strong>{user.username}: </strong>{msg.content}
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </Form>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 80%;
  max-width: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.isOwnMessage ? '#e6f3ff' : '#f0f0f0'};
  align-self: ${props => props.isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const Form = styled.form`
  display: flex;
  padding: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default Chat;