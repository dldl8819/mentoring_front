import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MentorDetail from './MentorDetail';

// Axios mock
vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

// React Router mock
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' })
  };
});

const mockMentor = {
  id: 1,
  name: '김멘토',
  email: 'mentor@test.com',
  introduction: '안녕하세요. 프론트엔드 개발자입니다.',
  profileImageUrl: 'https://placehold.co/500x500.jpg?text=MENTOR',
  skills: ['React', 'TypeScript', 'JavaScript']
};

const renderMentorDetail = () => {
  return render(
    <BrowserRouter>
      <MentorDetail />
    </BrowserRouter>
  );
};

describe('MentorDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('멘토 정보를 올바르게 표시해야 한다', async () => {
    const { default: api } = await import('../../api/axios');
    (api.get as any).mockResolvedValueOnce({ data: mockMentor });

    renderMentorDetail();

    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.getByText('mentor@test.com')).toBeInTheDocument();
      expect(screen.getByText('안녕하세요. 프론트엔드 개발자입니다.')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('매칭 요청 다이얼로그가 열리고 닫혀야 한다', async () => {
    const { default: api } = await import('../../api/axios');
    (api.get as any).mockResolvedValueOnce({ data: mockMentor });

    renderMentorDetail();

    await waitFor(() => {
      expect(screen.getByText('매칭 요청하기')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('매칭 요청하기'));

    expect(screen.getByText('매칭 요청 보내기')).toBeInTheDocument();
    expect(screen.getByLabelText('요청 메시지')).toBeInTheDocument();

    fireEvent.click(screen.getByText('취소'));

    await waitFor(() => {
      expect(screen.queryByText('매칭 요청 보내기')).not.toBeInTheDocument();
    });
  });

  it('매칭 요청을 성공적으로 보내야 한다', async () => {
    const { default: api } = await import('../../api/axios');
    (api.get as any).mockResolvedValueOnce({ data: mockMentor });
    (api.post as any).mockResolvedValueOnce({ data: { id: 1 } });

    renderMentorDetail();

    await waitFor(() => {
      expect(screen.getByText('매칭 요청하기')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('매칭 요청하기'));

    const messageInput = screen.getByLabelText('요청 메시지');
    fireEvent.change(messageInput, { target: { value: '멘토링을 받고 싶습니다.' } });

    fireEvent.click(screen.getByText('요청 보내기'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/matching-requests', {
        mentorId: 1,
        message: '멘토링을 받고 싶습니다.'
      });
      expect(screen.getByText('매칭 요청을 보냈습니다.')).toBeInTheDocument();
    });
  });

  it('목록으로 돌아가기 버튼이 동작해야 한다', async () => {
    const { default: api } = await import('../../api/axios');
    (api.get as any).mockResolvedValueOnce({ data: mockMentor });

    renderMentorDetail();

    await waitFor(() => {
      expect(screen.getByText('목록으로 돌아가기')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('목록으로 돌아가기'));

    expect(mockNavigate).toHaveBeenCalledWith('/mentors');
  });
});
