import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import styled from '@emotion/styled';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const ChatBox = styled.div`
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

function StompChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // sockjs는 websocket을 내장한 향상된 js 라이브러리 (http엔드포인트 사용)
    const sockJs = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/connect`);
    stompClient.current = Stomp.over(sockJs);
    
    stompClient.current.connect({
      Authorization: `Bearer ${token}`
    }, () => {
      stompClient.current.subscribe(`/topic/1`, (message) => { //@TODO: 채팅방 변수화 예정

        console.log('received message:', message.body);
        
        setMessages((prev) => [...prev, message.body]);
        scrollToBottom();
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    console.log('sending message:', newMessage);

    stompClient.current.send(`/publish/1`, newMessage); //@TODO: 채팅방 변수화 예정
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
              채팅
            </Typography>
            <CardContent>
              <ChatBox ref={chatBoxRef}>
                {messages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </ChatBox>
              <TextField
                label="메시지 입력"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={handleKeyPress}
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={sendMessage}
              >
                전송
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StompChat;