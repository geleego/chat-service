import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

const ChatBox = styled.div`
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

function SimpleWebsocket() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const wsRef = useRef(null);
  const chatBoxRef = useRef(null);

  // 웹소켓 connect/disconnect
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/connect');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('successfully connected!!');
    };

    ws.onmessage = (message) => {
      setMessages((prev) => [...prev, message.data]);
      scrollToBottom();
    };

    ws.onclose = () => {
      console.log('disconnected!!');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        console.log('disconnected!!');
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
    if (wsRef.current) {
      wsRef.current.send(newMessage);
    }
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

export default SimpleWebsocket;