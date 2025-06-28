import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(() => Promise.resolve({ data: { token: 'test' } })) }
}));

describe('LoginForm', () => {
  it('로그인 폼 입력란과 버튼이 렌더링된다', () => {
    render(<LoginForm onLogin={jest.fn()} />);
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByText('로그인')).toBeInTheDocument();
  });
});
