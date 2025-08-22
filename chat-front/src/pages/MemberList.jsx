import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import axios from 'axios';

function MemberList() {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    const fetchMemberList = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/member/list`);
        setMemberList(response.data);
      } catch (error) {
        console.error('회원목록 조회 실패:', error);
      }
    }

    fetchMemberList();
  }, [])

  const startChat = async (otherMemberId) => {
    // @TODO: 채팅 시작 로직 구현
    console.log(`채팅 시작: ${otherMemberId}`);
  }

  return (
    <Container>
      <Grid container>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" align="center" gutterBottom>
                회원목록
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>email</TableCell>
                    <TableCell>채팅</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {memberList.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => startChat(member.id)}
                        >
                          채팅하기
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
    </Container>
  )
}

export default MemberList;