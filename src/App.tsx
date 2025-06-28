import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ProfileForm from './components/Profile/ProfileForm';
import MentorList from './components/Mentor/MentorList';
import MentorDetail from './components/Mentor/MentorDetail';
import MatchingRequestList from './components/Matching/MatchingRequestList';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm onLogin={() => {}} />} />
        <Route path="/signup" element={<SignupForm onSignup={() => {}} />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/mentors/:id" element={<MentorDetail />} />
        <Route path="/requests" element={<MatchingRequestList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
