import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';

export default function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');

  const features = [
    {
      icon: '👤',
      title: '간편한 회원가입',
      description: '멘토 또는 멘티로 쉽게 가입하고 프로필을 작성하세요.'
    },
    {
      icon: '👥',
      title: '멘토 검색',
      description: '기술 스택별로 원하는 멘토를 찾아보세요.'
    },
    {
      icon: '🤝',
      title: '매칭 요청',
      description: '관심 있는 멘토에게 매칭 요청을 보내보세요.'
    },
    {
      icon: '⚙️',
      title: '프로필 관리',
      description: '자신의 프로필과 매칭 상태를 관리하세요.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box py={8}>
        {/* 히어로 섹션 */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom>
            멘토-멘티 매칭 플랫폼
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            경험 있는 멘토와 성장하고 싶은 멘티를 연결하는 플랫폼
          </Typography>
          
          {isLoggedIn ? (
            <Box display="flex" gap={2} justifyContent="center" mt={4}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/mentors"
              >
                멘토 찾기
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/profile"
              >
                내 프로필
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={2} justifyContent="center" mt={4}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/signup"
              >
                회원가입
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/login"
              >
                로그인
              </Button>
            </Box>
          )}
        </Box>

        {/* 기능 소개 */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h2" component="div" mb={2}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA 섹션 */}
        {!isLoggedIn && (
          <Box textAlign="center" mt={8} p={4} bgcolor="grey.50" borderRadius={2}>
            <Typography variant="h4" gutterBottom>
              지금 시작하세요
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              멘토가 되어 경험을 공유하거나, 멘티가 되어 새로운 것을 배워보세요.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/signup"
            >
              무료로 시작하기
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}