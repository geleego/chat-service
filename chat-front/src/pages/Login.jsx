import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async (e) => {
    e.preventDefault();
    
    const loginData = { email: email, password: password };
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/member/doLogin`, loginData);
      const token = response.data.token;
      login(token);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  }

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" align="center" gutterBottom>
                로그인
              </Typography>
              <form onSubmit={doLogin}>
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
                  로그인
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login;