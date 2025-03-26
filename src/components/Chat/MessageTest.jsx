const MessageTest = ({ socket }) => {
  const sendMessage = () => {
    if (!socket) {
      console.error('❌ 소켓이 없습니다.');
      return;
    }

    console.log('📤 메세지 전송 요청 전송');
    socket.emit('sendMessage', {
      roomId: 1,
      sendUserId: 1,
      message: '안녕하세요~~~~',
      fileURL: null,
    });
  };

  return <button onClick={sendMessage}>메세지 보내기</button>;
};

export default MessageTest;
