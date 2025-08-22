import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material'
import axios from 'axios'

function MemberCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const memberCreate = async (e) => {
    e.preventDefault();
    
    const data = {
      name: name,
      email: email,
      password: password,
    };
    
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/member/create`, data);
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  }

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" align="center" gutterBottom>
                회원가입
              </Typography>
              <form onSubmit={memberCreate}>
                <TextField
                  label="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  fullWidth
                  margin="normal"
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  등록
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default MemberCreate