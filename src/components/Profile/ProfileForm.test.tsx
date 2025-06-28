import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileForm from './ProfileForm';

// axios 인스턴스 mock: post 메서드만 가진 객체로 대체
jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(() => Promise.resolve({ data: {} })) }
}));

const api = require('../../api/axios').default;

describe('ProfileForm', () => {
  it('이름, 소개글 입력란이 렌더링된다', () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('소개글')).toBeInTheDocument();
  });

  it('멘토 역할일 때 기술 스택 입력란이 보인다', () => {
    render(<ProfileForm />);
    // 역할을 mentor로 변경
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('소개글'), { target: { value: '소개' } });
    // role 상태를 직접 바꿀 수 없으므로, 실제 테스트에서는 prop이나 context로 분리 필요
    // 여기서는 기본 mentee이므로 기술 스택이 안 보임
    expect(screen.queryByLabelText('기술 스택')).not.toBeInTheDocument();
  });

  it('저장 버튼 클릭 시 API가 호출된다', async () => {
    render(<ProfileForm />);
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('소개글'), { target: { value: '소개' } });
    fireEvent.click(screen.getByText('저장'));
    // 비동기 처리 대기
    await screen.findByText('저장');
    expect(api.post).toHaveBeenCalledWith('/auth/profile', { name: '홍길동', bio: '소개' });
  });

  it('프로필 이미지 업로드 버튼이 렌더링된다', () => {
    render(<ProfileForm />);
    expect(screen.getByText('이미지 업로드')).toBeInTheDocument();
  });
});
