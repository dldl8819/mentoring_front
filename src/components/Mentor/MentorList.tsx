import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Chip, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../../api/axios';

interface Mentor {
  id: number;
  name: string;
  introduction: string;
  profileImageUrl: string;
  skills: string[];
  email: string;
}

export default function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMentors();
  }, [search, sort]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/auth/mentors', { 
        params: { techStack: search, sortBy: sort } 
      });
      setMentors(response.data);
    } catch (error) {
      console.error('멘토 목록 로드 실패:', error);
      setError('멘토 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorClick = (mentorId: number) => {
    navigate(`/mentors/${mentorId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        멘토 목록
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 검색 및 정렬 컨트롤 */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="기술 스택으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="예: React, JavaScript, Python"
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>정렬</InputLabel>
          <Select
            value={sort}
            label="정렬"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="name">이름순</MenuItem>
            <MenuItem value="techStack">기술스택순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {mentors.length === 0 ? (
        <Alert severity="info">
          조건에 맞는 멘토가 없습니다.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {mentors.map((mentor) => (
            <Grid item xs={12} sm={6} md={4} key={mentor.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
                onClick={() => handleMentorClick(mentor.id)}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Avatar 
                      src={mentor.profileImageUrl} 
                      sx={{ width: 80, height: 80, mb: 1 }}
                      alt={mentor.name}
                    />
                    <Typography variant="h6" textAlign="center">
                      {mentor.name}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.5em'
                    }}
                  >
                    {mentor.introduction || '소개글이 없습니다.'}
                  </Typography>

                  <Box display="flex" gap={0.5} flexWrap="wrap" justifyContent="center">
                    {mentor.skills.slice(0, 3).map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                    {mentor.skills.length > 3 && (
                      <Chip 
                        label={`+${mentor.skills.length - 3}`} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMentorClick(mentor.id);
                    }}
                  >
                    상세보기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
