import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchingRequestList from './MatchingRequestList';

jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [
      { id: 1, mentorName: '멘토1', status: '대기' },
      { id: 2, menteeName: '멘티1', status: '수락' }
    ] })),
    ['delete']: jest.fn(() => Promise.resolve({})),
  }
}));

describe('MatchingRequestList', () => {
  it('매칭 요청 목록이 렌더링된다', async () => {
    render(<MatchingRequestList />);
    expect(await screen.findByText('멘토1')).toBeInTheDocument();
    expect(await screen.findByText('멘티1')).toBeInTheDocument();
    expect(screen.getAllByText('수락').length).toBeGreaterThan(0);
    expect(screen.getAllByText('거절').length).toBeGreaterThan(0);
  });
});
