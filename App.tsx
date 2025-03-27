import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Login from './pages/Login';
import RecordingPage from './pages/RecordingPage';
import DiaryPage from './pages/DiaryPage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import AnimalIllustration from './components/AnimalIllustration';

const AppContent: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recording" element={<RecordingPage />} />
          <Route path="/diary" element={<DiaryPage />} />
        </Routes>
      </Router>
      <ThemeToggle />
      <AnimalIllustration />
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 