import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';
const SOCKET_SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ 토큰이 없습니다.');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/mypage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.isSuccess) {
          setUserId(response.data.data.id);
        }
      } catch (error) {
        console.error('❌ 유저 정보 요청 실패:', error);
      }
    };

    const fetchChatData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/v1/chat/message/load/${roomId}?pageNumber=0`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.isSuccess) {
          setMessages(res.data.data);
        }
      } catch (error) {
        console.error('❌ 채팅 데이터 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomName = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/v1/chat/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.isSuccess) {
          console.log('✅ roomName:', res.data.data.roomName);
          setRoomName(res.data.data.roomName || '채팅방');
        }
      } catch (error) {
        console.error('❌ 채팅방 정보 요청 실패:', error);
      }
    };

    fetchUserInfo();
    fetchChatData();
    fetchRoomName();
  }, [roomId]);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('access_token');
    const socket = io(SOCKET_SERVER_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinRoom', { userId, roomId });
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.disconnect();
    };
  }, [roomId, userId]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected || !userId) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const newMessage = {
      content: message,
      roomId,
      timestamp: new Date().toISOString(),
      sender: userId,
    };

    socketRef.current.emit('message', newMessage);
    setMessages((prevMessages) => [...prevMessages, { ...newMessage, sender: 'me' }]);
    setMessage('');

    axios
      .post(`${SERVER_URL}/api/v1/chat/message`, newMessage, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.data.isSuccess) {
          console.error('❌ 메시지 저장 실패');
        }
      })
      .catch((error) => {
        console.error('❌ 메시지 저장 요청 실패:', error);
      });
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <button onClick={() => navigate('/chat-list')}>{`<`}</button>
        <h2>{roomName}</h2>
      </ChatHeader>

      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} className={msg.sender === 'me' ? 'my-message' : 'other-message'}>
            <MessageBubble $isMine={msg.sender === 'me'} data-time={formatTime(msg.timestamp)}>
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
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
    border: 0;
    cursor: pointer;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #e5e5e5;
`;

const Message = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  &.my-message {
    align-items: flex-end;
    .sendMessage {
      flex-direction: row-reverse;
      .timeContainer {
        margin-right: 5px;
      }
    }
    .sendUserName {
      display: none;
    }
  }
  &.other-message {
    align-items: flex-start;
  }
  .sendUserName {
    font-size: var(--font-md);
    margin: 0 0 3px 5px;
    font-weight: 400;
    letter-spacing: -0.5px;
  }
  .sendMessage {
    display: flex;
    align-items: center;
    .timeContainer {
      display: flex;
      flex-direction: column;
      font-size: 10px;
      color: var(--color-text-disabled);
      margin-left: 5px;
    }
  }
`;

const MessageBubble = styled.div`
  display: inline-block;
  padding: 10px;
  background-color: ${(props) => (props.$isMine ? '#dcf8c6' : '#fff')};
  border-radius: 10px;
  word-wrap: break-word;
  font-size: 14px;
`;

const InputContainer = styled.div`
  padding: 10px;
  display: flex;
  position: relative;
  align-items: center;
  input {
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    margin-right: 10px;
    width: 90%;
    font-size: var(--font-md);
  }
  button {
    position: absolute;
    right: 10px;
    border: none;
    background: none;
  }
`;
