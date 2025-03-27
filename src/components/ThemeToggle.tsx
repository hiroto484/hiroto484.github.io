import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isAnimalTheme, toggleTheme } = useTheme();

  return (
    <Tooltip title={isAnimalTheme ? "通常テーマに切り替え" : "動物テーマに切り替え"}>
      <IconButton
        onClick={toggleTheme}
        color={isAnimalTheme ? "secondary" : "primary"}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'background.paper',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <PetsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 