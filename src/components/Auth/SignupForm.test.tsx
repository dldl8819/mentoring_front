import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from './SignupForm';

jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(() => Promise.resolve({})) }
}));

describe('SignupForm', () => {
  it('회원가입 폼 입력란과 버튼이 렌더링된다', () => {
    render(<SignupForm onSignup={jest.fn()} />);
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByLabelText('역할')).toBeInTheDocument();
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });
});
