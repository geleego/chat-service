import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GroupChatList() {
  const navigate = useNavigate();
  const [chatRoomList, setChatRoomList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    loadChatRooms();
  }, []);

  const joinChatRoom = async (roomId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/room/group/${roomId}/join`);
      navigate(`/stomp/chat/${roomId}`);
    } catch (error) {
      console.error('채팅방 참여 실패:', error);
    }
  };

  const createChatRoom = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/room/group/create?roomName=${roomName}`,
        null
      );
      setOpenModal(false);
      loadChatRooms();
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const loadChatRooms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chat/room/group/list`);
      setChatRoomList(response.data);
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };

  return (
    <div>
      <Container>
        <Grid container>
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                  채팅방 목록
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setOpenModal(true)}
                  >
                    채팅방 생성
                  </Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>방번호</TableCell>
                      <TableCell>방제목</TableCell>
                      <TableCell>채팅</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chatRoomList.map((chatRoom) => (
                      <TableRow key={chatRoom.roomId}>
                        <TableCell>{chatRoom.roomId}</TableCell>
                        <TableCell>{chatRoom.roomName}</TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => joinChatRoom(chatRoom.roomId)}
                          >
                            참여하기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>채팅방 생성</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="채팅방 이름"
              fullWidth
              variant="outlined"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>취소</Button>
            <Button onClick={createChatRoom} variant="contained">생성</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  )
}

export default GroupChatList;