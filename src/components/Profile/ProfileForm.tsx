import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Avatar, Alert, Stack } from '@mui/material';

const PLACEHOLDER = {
  mentor: 'https://placehold.co/500x500.jpg?text=MENTOR',
  mentee: 'https://placehold.co/500x500.jpg?text=MENTEE',
};

export default function ProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('김멘토');
  const [bio, setBio] = useState('10년차 프론트엔드 개발자입니다. React와 TypeScript 전문가로 활동하고 있습니다.');
  const [role, setRole] = useState<'mentor' | 'mentee'>('mentor');
  const [skills, setSkills] = useState('React,TypeScript,JavaScript,Node.js');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 기존 프로필 정보 불러오기
    api.get('/auth/profile').then(res => {
      const d = res.data;
      setName(d.name || '');
      setBio(d.bio || '');
      setRole(d.role || 'mentee');
      setSkills(Array.isArray(d.skills) ? d.skills.join(',') : (d.skills || ''));
      setImageUrl(d.profileImageUrl || '');
    }).catch(() => {});
  }, []);

  const handleUpload = async () => {
    setError('');
    if (!file) return;
    // 용량 제한(1MB)
    if (file.size > 1024 * 1024) {
      setError('이미지 용량은 1MB 이하여야 합니다.');
      return;
    }
    // 해상도 제한(500~1000px)
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (
        img.width < 500 || img.height < 500 ||
        img.width > 1000 || img.height > 1000
      ) {
        setError('이미지 해상도는 500~1000px 정사각형이어야 합니다.');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/auth/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url || '');
      setMessage('이미지 업로드 완료');
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFile(e.target.files?.[0] || null);
  };

  const handleSave = async () => {
    await api.post('/auth/profile', {
      name,
      bio,
      role,
      skills: role === 'mentor' ? skills.split(',').map(s => s.trim()) : undefined,
      profileImageUrl: imageUrl
    });
    setMessage('프로필 저장 완료');
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5} p={4} borderRadius={3} boxShadow={3} bgcolor="#fff">
      <Typography variant="h5" fontWeight={700} mb={2} align="center">프로필 등록</Typography>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="role-label">역할</InputLabel>
          <Select labelId="role-label" id="role" value={role} label="역할" onChange={e => setRole(e.target.value as 'mentor' | 'mentee')}>
            <MenuItem value="mentor">멘토</MenuItem>
            <MenuItem value="mentee">멘티</MenuItem>
          </Select>
        </FormControl>
        <TextField id="name" label="이름" value={name} onChange={e => setName(e.target.value)} fullWidth />
        <TextField id="bio" label="소개글" value={bio} onChange={e => setBio(e.target.value)} fullWidth />
        {role === 'mentor' && (
          <TextField id="skills" label="기술 스택" value={skills} onChange={e => setSkills(e.target.value)} placeholder="예: React,Spring" fullWidth />
        )}
        <Button variant="outlined" component="label">
          프로필 이미지 업로드
          <input hidden id="profile" type="file" accept=".jpg,.png" onChange={handleFileChange} />
        </Button>
        <Avatar src={imageUrl || PLACEHOLDER[role]} alt="프로필" sx={{ width: 100, height: 100, mx: 'auto' }} />
        <Button id="upload" variant="contained" color="primary" onClick={handleUpload} disabled={!file}>이미지 업로드</Button>
        <Button id="save" variant="contained" color="success" onClick={handleSave}>저장</Button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
}
