import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SERVER_URL = 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080';
const SOCKET_URL = 'http://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092'; // WebSocket 서버 URL

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // 현재 로그인한 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('❌ 토큰이 없습니다.');
          return;
        }

        const response = await axios.get('/api/v1/mypage', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('👤 로그인 유저 정보:', response.data);

        if (response.data.isSuccess) {
          setUserId(response.data.data.id);
        } else {
          console.error('❌ 유저 정보 불러오기 실패');
        }
      } catch (error) {
        console.error('❌ 유저 정보 요청 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('❌ 토큰이 없습니다.');
          return;
        }

        const response = await axios.get(`${SERVER_URL}/api/v1/chat/message/load/${roomId}?pageNumber=0`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📩 받은 메시지:', response.data);

        if (response.data.isSuccess && Array.isArray(response.data.data)) {
          setMessages(response.data.data);

          // 받은 메시지에서 roomName을 설정
          if (response.data.data.length > 0) {
            setRoomName(response.data.data[0].roomName);
          }
        } else {
          console.error('❌ 메시지 데이터가 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('❌ 메시지 불러오기 실패:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log('❌ 메시지가 비어 있습니다.');
      return;
    }

    if (!client || !isConnected) {
      console.log('❌ 연결이 없거나 WebSocket이 연결되지 않았습니다.');
      return;
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
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(newMessage),
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      axios
        .post(`${SERVER_URL}/api/v1/chat/message`, newMessage, {
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

  const formatRelativeTime = (sendTime) => {
    const now = new Date();
    const notificationDate = new Date(sendTime);

    const isToday =
      now.getFullYear() === notificationDate.getFullYear() &&
      now.getMonth() === notificationDate.getMonth() &&
      now.getDate() === notificationDate.getDate();

    const month = notificationDate.getMonth() + 1;
    const day = notificationDate.getDate();
    const hours = notificationDate.getHours();
    const minutes = notificationDate.getMinutes();

    const formattedTime = `${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`;
    const formattedDate = `${month}월 ${day}일`;

    return { formattedDate, formattedTime, isToday };
  };

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <button onClick={() => navigate('/chat-list')}>{`<`}</button>
        <h2>{roomName || '채팅방'}</h2>
      </ChatHeader>

      <MessageList>
        {messages.map((msg, index) => {
          const isMine = msg.senderId === userId;
          const { formattedDate, formattedTime, isToday } = formatRelativeTime(msg.createdAt);

          return (
            <Message key={index} className={isMine ? 'my-message' : 'other-message'}>
              <div className='sendUserName'>{msg.senderName || '알 수 없음'}</div>
              <div className='sendMessage'>
                <MessageBubble $isMine={isMine}>{msg.message}</MessageBubble>
                <div className='timeContainer'>
                  <div className='date' style={{ color: isToday ? 'transparent' : '#999' }}>
                    {formattedDate}
                  </div>
                  <div className='time'>{formattedTime}</div>
                </div>
              </div>
            </Message>
          );
        })}
      </MessageList>

      <InputContainer>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder='메시지를 입력하세요'
          spellCheck={false}
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
