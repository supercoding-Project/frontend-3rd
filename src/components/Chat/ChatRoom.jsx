import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:8080';
const SOCKET_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092'; // WebSocket 서버 URL

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 추적
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('✅ WebSocket 연결 시도 중...');

    if (!token) {
      console.error('❌ 토큰이 없습니다.');
      return;
    }

    const sock = new SockJS(`${SOCKET_URL}?token=${token}`);
    console.log('✅ SockJS 객체 생성 완료:', sock);

    const stompClient = new Client({
      webSocketFactory: () => sock,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log('✅ WebSocket 연결 성공!');
        setIsConnected(true);
        stompClient.subscribe('/topic/messages', (messageOutput) => {
          console.log('✅ 메시지 수신:', messageOutput.body);
        });
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket 오류 발생:', frame);
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error('❌ WebSocket 자체 오류:', error);
      },
    });

    console.log('✅ WebSocket 클라이언트 설정 완료:', stompClient);

    stompClient.activate(); // WebSocket 연결 시도
    console.log('✅ WebSocket 연결 시도 중...');

    setClient(stompClient);

    return () => {
      console.log('❌ WebSocket 연결 해제 중...');
      stompClient.deactivate();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log('❌ 메시지가 비어 있습니다.');
      return; // 메시지가 비어 있으면 전송 안 함
    }

    if (!client || !isConnected) {
      console.log('❌ 연결이 없거나 WebSocket이 연결되지 않았습니다.');
      return; // WebSocket 연결이 없으면 전송 안 함
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ 토큰이 없습니다.');
      return;
    }

    const newMessage = {
      content: message,
      sender: 'me',
      timestamp: new Date().toISOString(),
    };

    try {
      // 메시지를 WebSocket을 통해 실시간으로 전송
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(newMessage),
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // 메시지 전송 후 입력창 초기화

      // 메시지 저장 요청을 9092로 보내기
      axios
        .post(`${SOCKET_URL}/api/v1/chat/message`, newMessage, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.isSuccess) {
            console.log('✅ 메시지가 저장되었습니다.');
          } else {
            console.error('❌ 메시지 저장 실패');
          }
        })
        .catch((error) => {
          console.error('❌ 메시지 저장 요청 실패:', error);
        });
    } catch (error) {
      console.error('❌ 메시지 전송 실패:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    navigate('/chat-list');
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value); // 인풋값을 상태에 반영
  };

  // if (loading) return <div>로딩 중...</div>; // 로딩 중 메시지

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <button onClick={handleBack}>{`<`}</button>
        <h2>{roomName || '채팅방'}</h2>
      </ChatHeader>

      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} className={msg.sender === 'me' ? 'my-message' : 'other-message'}>
            <MessageBubble $isMine={msg.sender === 'me'} data-time={msg.timestamp}>
              {msg.content}
            </MessageBubble>
          </Message>
        ))}
      </MessageList>

      <InputContainer>
        <input
          type='text'
          value={message}
          onChange={handleInputChange} // 변경 핸들러 추가
          onKeyPress={handleKeyPress}
          placeholder='메시지를 입력하세요'
          spellCheck={false} // 글자 교정 기능 비활성화
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
  align-items: center;
  input {
    /* flex: 1; */
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
