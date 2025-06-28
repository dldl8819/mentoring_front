import React from 'react';
import { render, screen } from '@testing-library/react';
import MentorList from './MentorList';

jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [
      { id: 1, name: '멘토1', profileImageUrl: 'url1', skills: ['React', 'Node'] },
      { id: 2, name: '멘토2', profileImageUrl: 'url2', skills: ['Python'] }
    ] }) )
  }
}));

describe('MentorList', () => {
  it('멘토 목록이 렌더링된다', async () => {
    render(<MentorList />);
    expect(await screen.findByText('멘토1')).toBeInTheDocument();
    expect(await screen.findByText('멘토2')).toBeInTheDocument();
    expect((await screen.findAllByTestId('mentor-item')).length).toBe(2);
  });
  it('검색 입력란과 정렬 select가 렌더링된다', () => {
    render(<MentorList />);
    expect(screen.getByLabelText('검색')).toBeInTheDocument();
    expect(screen.getByLabelText('정렬')).toBeInTheDocument();
  });
});
