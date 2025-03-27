import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const AnimalIllustration: React.FC = () => {
  const { isAnimalTheme } = useCustomTheme();

  if (!isAnimalTheme) return null;

  return (
    <>
      {/* 左上のパンダ */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          left: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="white" />
          <circle cx="30" cy="30" r="15" fill="black" />
          <circle cx="70" cy="30" r="15" fill="black" />
          <circle cx="35" cy="45" r="8" fill="white" />
          <circle cx="65" cy="45" r="8" fill="white" />
          <circle cx="35" cy="45" r="4" fill="black" />
          <circle cx="65" cy="45" r="4" fill="black" />
          <circle cx="50" cy="60" r="8" fill="black" />
          <circle cx="35" cy="55" r="5" fill="pink" opacity="0.8" />
          <circle cx="65" cy="55" r="5" fill="pink" opacity="0.8" />
          <path d="M40 70 Q50 75 60 70" stroke="black" strokeWidth="2" fill="none" />
        </svg>
        <Typography
          sx={{
            fontFamily: 'Mochiy Pop One',
            fontSize: '0.9rem',
            color: '#4CAF50',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          ぱんださん
        </Typography>
      </Box>

      {/* 右上のウサギ */}
      <Box
        sx={{
          position: 'fixed',
          top: 120,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
          animation: 'bounce 2s ease-in-out infinite',
        }}
      >
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="55" r="40" fill="white" />
          <path d="M30 20 Q40 0 50 20" stroke="white" strokeWidth="30" fill="white" />
          <path d="M50 20 Q60 0 70 20" stroke="white" strokeWidth="30" fill="white" />
          <circle cx="35" cy="45" r="8" fill="white" />
          <circle cx="65" cy="45" r="8" fill="white" />
          <circle cx="35" cy="45" r="4" fill="#87CEEB" />
          <circle cx="65" cy="45" r="4" fill="#87CEEB" />
          <circle cx="50" cy="55" r="5" fill="pink" />
          <path d="M45 65 Q50 70 55 65" stroke="black" strokeWidth="2" fill="none" />
          <circle cx="20" cy="15" r="8" fill="pink" />
          <circle cx="80" cy="15" r="8" fill="pink" />
          <path d="M45 75 L55 75" stroke="pink" strokeWidth="2" />
        </svg>
        <Typography
          sx={{
            fontFamily: 'Mochiy Pop One',
            fontSize: '0.9rem',
            color: '#87CEEB',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          うさちゃん
        </Typography>
      </Box>

      {/* 左下のライオン */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          left: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
          animation: 'wiggle 3s ease-in-out infinite',
        }}
      >
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#FFD700" />
          <path
            d="M20 50 Q50 80 80 50"
            fill="#FFA500"
            transform="rotate(-180 50 50)"
          />
          <circle cx="35" cy="45" r="8" fill="white" />
          <circle cx="65" cy="45" r="8" fill="white" />
          <circle cx="35" cy="45" r="4" fill="black" />
          <circle cx="65" cy="45" r="4" fill="black" />
          <circle cx="50" cy="55" r="5" fill="black" />
          <path d="M45 65 Q50 70 55 65" stroke="black" strokeWidth="2" fill="none" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M${50 + 25 * Math.cos(i * Math.PI / 6)} ${50 + 25 * Math.sin(i * Math.PI / 6)} 
                 L${50 + 45 * Math.cos(i * Math.PI / 6)} ${50 + 45 * Math.sin(i * Math.PI / 6)}`}
              stroke="#FFA500"
              strokeWidth="8"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <Typography
          sx={{
            fontFamily: 'Mochiy Pop One',
            fontSize: '0.9rem',
            color: '#FFA500',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          らいおんくん
        </Typography>
      </Box>

      {/* 右下のクマ */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 120,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
          animation: 'bounce 4s ease-in-out infinite',
        }}
      >
        <svg width="75" height="75" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#8B4513" />
          <circle cx="30" cy="30" r="15" fill="#A0522D" />
          <circle cx="70" cy="30" r="15" fill="#A0522D" />
          <circle cx="35" cy="45" r="8" fill="white" />
          <circle cx="65" cy="45" r="8" fill="white" />
          <circle cx="35" cy="45" r="4" fill="black" />
          <circle cx="65" cy="45" r="4" fill="black" />
          <circle cx="50" cy="60" r="10" fill="#A0522D" />
          <circle cx="50" cy="55" r="5" fill="black" />
          <path d="M40 70 Q50 75 60 70" stroke="black" strokeWidth="2" fill="none" />
          <circle cx="35" cy="55" r="4" fill="pink" opacity="0.8" />
          <circle cx="65" cy="55" r="4" fill="pink" opacity="0.8" />
        </svg>
        <Typography
          sx={{
            fontFamily: 'Mochiy Pop One',
            fontSize: '0.9rem',
            color: '#8B4513',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          くまさん
        </Typography>
      </Box>
    </>
  );
};

export default AnimalIllustration; 