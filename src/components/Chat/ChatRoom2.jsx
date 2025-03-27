import React, { useEffect, useState } from 'react';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log(token);

    if (!token) {
      console.error('❌ 토큰이 없습니다.');
      return;
    }

    const socket = new WebSocket(`ws://ec2-54-180-153-214.ap-northeast-2.compute.amazonaws.com:9092/?token=${token}`); // WebSocket 서버 URL

    socket.onopen = () => {
      console.log('WebSocket 연결 성공!');
      // 연결 성공 시 메시지 송신 가능
      // 예: socket.send("Hello server");
    };

    socket.onmessage = (event) => {
      const newMessage = event.data; // 서버로부터 받은 메시지
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log('WebSocket 연결 종료');
      } else {
        console.error('WebSocket 비정상 종료');
      }
    };

    // WebSocket 객체 상태로 저장
    setWs(socket);

    return () => {
      socket.close(); // 컴포넌트 unmount 시 WebSocket 종료
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      setMessage(''); // 메시지 전송 후 입력란 비우기
    } else {
      console.log('WebSocket이 열리지 않았습니다.');
    }
  };

  return (
    <div>
      <div>
        <h2>채팅방</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='메시지를 입력하세요'
      />
      <button onClick={sendMessage}>메시지 전송</button>
    </div>
  );
};

export default ChatRoom;
