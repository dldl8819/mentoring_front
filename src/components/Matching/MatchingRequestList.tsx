import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import api from '../../api/axios';

interface MatchingRequest {
  id: number;
  mentorId: number;
  menteeId: number;
  mentorName: string;
  menteeName: string;
  mentorProfileImageUrl?: string;
  menteeProfileImageUrl?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MatchingRequestList() {
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MatchingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const statusTabs = [
    { label: '전체', value: 'all' },
    { label: '대기중', value: 'pending' },
    { label: '수락됨', value: 'accepted' },
    { label: '거절됨', value: 'rejected' }
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/matching/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('매칭 요청 목록 로드 실패:', error);
      setError('매칭 요청 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filterValue = statusTabs[activeTab].value;
    if (filterValue === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(r => r.status === filterValue));
    }
  }, [requests, activeTab]);

  const handleAction = async (id: number, action: 'accepted' | 'rejected') => {
    try {
      setError('');
      await api.patch(`/matching/requests/${id}`, { status: action });
      setSuccess(`매칭 요청을 ${action === 'accepted' ? '수락' : '거절'}했습니다.`);
      await fetchRequests();
    } catch (error: any) {
      console.error('매칭 요청 처리 실패:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('매칭 요청 처리에 실패했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedRequestId) return;
    
    try {
      setError('');
      await api.delete(`/matching/requests/${selectedRequestId}`);
      setSuccess('매칭 요청을 삭제했습니다.');
      await fetchRequests();
      setDeleteDialogOpen(false);
      setSelectedRequestId(null);
    } catch (error: any) {
      console.error('매칭 요청 삭제 실패:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('매칭 요청 삭제에 실패했습니다.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'accepted': return '수락됨';
      case 'rejected': return '거절됨';
      default: return status;
    }
  };

  const openDeleteDialog = (requestId: number) => {
    setSelectedRequestId(requestId);
    setDeleteDialogOpen(true);
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
        매칭 요청 관리
      </Typography>

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

      {/* 상태별 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          {statusTabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {filteredRequests.length === 0 ? (
        <Alert severity="info">
          {activeTab === 0 ? '매칭 요청이 없습니다.' : `${statusTabs[activeTab].label} 상태의 요청이 없습니다.`}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} md={6} key={request.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar 
                      src={request.mentorProfileImageUrl || request.menteeProfileImageUrl} 
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box flex={1}>
                      <Typography variant="h6">
                        {request.mentorName || request.menteeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusText(request.status)}
                      color={getStatusColor(request.status) as any}
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>메시지:</strong> {request.message}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAction(request.id, 'accepted')}
                        >
                          수락
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleAction(request.id, 'rejected')}
                        >
                          거절
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => openDeleteDialog(request.id)}
                    >
                      삭제
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>매칭 요청 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 이 매칭 요청을 삭제하시겠습니까? 삭제된 요청은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
