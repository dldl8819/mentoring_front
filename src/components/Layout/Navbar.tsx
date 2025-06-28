import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          멘토-멘티 매칭
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/profile">프로필</Button>
              <Button color="inherit" component={Link} to="/mentors">멘토목록</Button>
              <Button color="inherit" component={Link} to="/requests">매칭요청</Button>
              <Button color="inherit" onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">로그인</Button>
              <Button color="inherit" component={Link} to="/signup">회원가입</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
