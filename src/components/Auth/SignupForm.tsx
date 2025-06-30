import React, { useState } from 'react';
import api from '../../api/axios';

export default function SignupForm({ onSignup }: { onSignup: () => void }) {
  const [email, setEmail] = useState('mentor@demo.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('mentor');
  const [name, setName] = useState('김멘토');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password, role, name });
      onSignup();
    } catch {
      setError('회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">이메일</label>
      <input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">비밀번호</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <label htmlFor="role">역할</label>
      <select id="role" value={role} onChange={e => setRole(e.target.value)}>
        <option value="mentor">멘토</option>
        <option value="mentee">멘티</option>
      </select>
      <label htmlFor="name">이름</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
      <button id="signup" type="submit">회원가입</button>
      {error && <div>{error}</div>}
    </form>
  );
}
