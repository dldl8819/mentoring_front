import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert,
  CircularProgress 
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

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('안녕하세요! 프론트엔드 개발을 배우고 있는 신입 개발자입니다. React와 TypeScript를 더 깊이 있게 학습하고 싶어서 멘토링을 신청합니다. 현재 개인 프로젝트를 진행 중이며, 실무 경험이 풍부한 멘토님께 코드 리뷰와 개발 방향성에 대한 조언을 받고 싶습니다.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadMentorDetail();
    }
  }, [id]);

  const loadMentorDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/auth/mentors/${id}`);
      setMentor(response.data);
    } catch (error) {
      console.error('멘토 정보 로드 실패:', error);
      setError('멘토 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await api.post('/auth/matching-requests', {
        mentorId: parseInt(id!),
        message: requestMessage
      });
      
      setSuccess('매칭 요청을 보냈습니다.');
      setRequestDialogOpen(false);
      setRequestMessage('');
      
      // 3초 후 요청 목록 페이지로 이동
      setTimeout(() => {
        navigate('/requests');
      }, 3000);
    } catch (error: any) {
      console.error('매칭 요청 실패:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('매칭 요청을 보낼 수 없습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!mentor) {
    return (
      <Box p={3}>
        <Alert severity="error">멘토 정보를 찾을 수 없습니다.</Alert>
        <Button onClick={() => navigate('/mentors')} sx={{ mt: 2 }}>
          멘토 목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="800px" margin="0 auto">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box display="flex" gap={3} mb={3}>
            <Avatar 
              src={mentor.profileImageUrl} 
              sx={{ width: 120, height: 120 }}
              alt={mentor.name}
            />
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                {mentor.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {mentor.email}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                {mentor.skills.map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            소개
          </Typography>
          <Typography variant="body1" paragraph>
            {mentor.introduction || '소개글이 없습니다.'}
          </Typography>

          <Box display="flex" gap={2} mt={3}>
            <Button 
              variant="contained" 
              onClick={() => setRequestDialogOpen(true)}
              disabled={submitting}
            >
              매칭 요청하기
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/mentors')}
            >
              목록으로 돌아가기
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 매칭 요청 다이얼로그 */}
      <Dialog 
        open={requestDialogOpen} 
        onClose={() => !submitting && setRequestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>매칭 요청 보내기</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {mentor.name} 멘토에게 매칭 요청을 보냅니다.
          </Typography>
          <TextField
            label="요청 메시지"
            multiline
            rows={4}
            fullWidth
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="자기소개와 함께 멘토링을 받고 싶은 이유를 간단히 작성해주세요."
            margin="normal"
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRequestDialogOpen(false)}
            disabled={submitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSendRequest}
            variant="contained"
            disabled={submitting || !requestMessage.trim()}
          >
            {submitting ? <CircularProgress size={20} /> : '요청 보내기'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
