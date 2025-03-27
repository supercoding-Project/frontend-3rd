import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ 토큰이 없습니다.');
      return;
    }

    // WebSocket 연결
    const sock = new SockJS(`${SERVER_URL}/ws/chat`);
    const stompClient = new Client({
      webSocketFactory: () => sock,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log('✅ WebSocket 연결 성공!');
        stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [roomId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const token = localStorage.getItem('access_token');
    const newMessage = {
      content: message,
      sender: 'me', // 나중에 실제 유저 정보로 수정
      timestamp: new Date().toISOString(),
    };

    client.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(newMessage),
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessage('');
  };

  const handleBack = () => {
    navigate('/chat-list');
  };

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <button onClick={handleBack}>뒤로 가기</button>
        <h2>채팅방 {roomId}</h2>
      </ChatHeader>

      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} className={msg.sender === 'me' ? 'my-message' : 'other-message'}>
            <MessageBubble isMine={msg.sender === 'me'} data-time={msg.timestamp}>
              {msg.content}
            </MessageBubble>
          </Message>
        ))}
      </MessageList>

      <InputContainer>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='메시지를 입력하세요'
        />
        <button onClick={handleSendMessage}>전송</button>
      </InputContainer>
    </ChatRoomContainer>
  );
};

export default ChatRoom;

const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ChatHeader = styled.div`
  background: #f1f1f1;
  padding: 10px;
  display: flex;
  align-items: center;
  button {
    margin-right: 10px;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #e5e5e5;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 10px;
  &.my-message {
    justify-content: flex-end;
  }
  &.other-message {
    justify-content: flex-start;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  background-color: ${(props) => (props.isMine ? '#dcf8c6' : '#fff')};
  border-radius: 10px;
  position: relative;
  word-wrap: break-word;
  font-size: 14px;

  &::after {
    content: attr(data-time);
    font-size: 10px;
    position: absolute;
    bottom: -15px;
    left: ${(props) => (props.isMine ? 'auto' : '5px')};
    right: ${(props) => (props.isMine ? '5px' : 'auto')};
  }
`;

const InputContainer = styled.div`
  padding: 10px;
  display: flex;
  position: relative;
  input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    margin-right: 10px;
  }
  button {
    position: absolute;
    right: 10px;
    bottom: 10px;
    border: none;
    background: none;
  }
`;
