import React, { useState } from 'react';
import api from '../../api/axios';

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch {
      setError('로그인 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">이메일</label>
      <input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">비밀번호</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button id="login" type="submit">로그인</button>
      {error && <div>{error}</div>}
    </form>
  );
}
