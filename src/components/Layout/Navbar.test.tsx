import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
  it('네비게이션 링크가 모두 렌더링된다', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('프로필')).toBeInTheDocument();
    expect(screen.getByText('멘토목록')).toBeInTheDocument();
    expect(screen.getByText('매칭요청')).toBeInTheDocument();
  });
});