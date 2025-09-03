import { AppBar, Toolbar, Button, Box } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)`
  background-color: #1976d2;
`;

const LeftSection = styled(Box)`
  display: flex;
  gap: 16px;
`;

const CenterSection = styled(Box)`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

const RightSection = styled(Box)`
  display: flex;
  gap: 8px;
`;

const TitleButton = styled(Button)`
  font-size: 1.25rem;
  font-weight: bold;
`;

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LeftSection>
          <Button
            color="inherit"
            onClick={() => navigate('/member/list')}
          >
            회원목록
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/groupchatting/list')}
          >
            채팅목록
          </Button>
        </LeftSection>
        
        <CenterSection>
          <TitleButton 
            color="inherit" 
            onClick={() => navigate('/')}
          >
            Chat Service
          </TitleButton>
        </CenterSection>
        
        <RightSection>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/stomp/chat')}
              >
                MyChatPage
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/member/create')}
              >
                회원가입
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
            </>
          )}
        </RightSection>
      </Toolbar>
    </StyledAppBar>
  )
}

export default Header;