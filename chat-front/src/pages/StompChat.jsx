import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import styled from '@emotion/styled';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const ChatBox = styled.div`
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 14px;
`;
const ChatMessage = styled.div`
  padding: 8px 12px;
  margin-bottom: 10px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;

  &.my-message {
    align-self: flex-end;
    background-color: #deefff;
    text-align: right;
    border-radius: 12px 0 12px 12px;
  }

  &.other-message {
    align-self: flex-start;
    background-color: #f1f1f1;
    text-align: left;
    border-radius: 0 12px 12px 12px;
  }
`;

function StompChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);
  const [token] = useState(() => localStorage.getItem('token'));
  const [senderEmail] = useState(() => localStorage.getItem('email'));
  const { roomId } = useParams();

  useEffect(() => {
    // sockjs는 websocket을 내장한 향상된 js 라이브러리 (http엔드포인트 사용)
    const sockJs = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/connect`);
    stompClient.current = Stomp.over(sockJs);
    
    stompClient.current.connect({
      Authorization: `Bearer ${token}`
    }, () => {
      stompClient.current.subscribe(`/topic/${roomId}`, (message) => {

        console.log('received message:', message.body);
        
        const parsedMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, parsedMessage]);
        scrollToBottom();
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      disconnectWebSocket();
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
    
    const message = {
      senderEmail: senderEmail,
      message: newMessage
    };
    stompClient.current.send(`/publish/${roomId}`, JSON.stringify(message));
    setNewMessage('');
  };

  const disconnectWebSocket = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.unsubscribe(`/topic/${roomId}`);
      stompClient.current.disconnect();
    }
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
                  <ChatMessage
                    key={index}
                    className={`chat-message ${msg.senderEmail === senderEmail ? 'my-message' : 'other-message'}`}
                  >{msg.senderEmail}: {msg.message}</ChatMessage>
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