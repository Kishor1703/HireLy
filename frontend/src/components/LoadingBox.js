import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const LoadingBox = ({ message = 'Loading jobs...' }) => {
  return (
    <Box sx={{
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2.5,
    }}>

      {/* Animated icon container */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer spinning ring */}
        <CircularProgress
          size={64}
          thickness={2.5}
          sx={{
            color: '#dbeafe',
            position: 'absolute',
          }}
          variant="determinate"
          value={100}
        />
        {/* Inner spinning ring */}
        <CircularProgress
          size={64}
          thickness={2.5}
          sx={{
            color: '#1e4fd8',
            animationDuration: '1.2s',
          }}
        />
        {/* Center icon */}
        <Box sx={{
          position: 'absolute',
          width: 36, height: 36,
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.75, transform: 'scale(0.92)' },
          },
        }}>
          <WorkOutlineIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
      </Box>

      {/* Dots animation */}
      <Box sx={{ display: 'flex', gap: 0.75 }}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{
            width: 7, height: 7,
            borderRadius: '50%',
            bgcolor: '#1e4fd8',
            animation: 'bounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
              '50%': { transform: 'translateY(-8px)', opacity: 1 },
            },
          }} />
        ))}
      </Box>

      {/* Message */}
      <Typography sx={{
        fontSize: '0.88rem',
        color: '#94a3b8',
        fontWeight: 500,
        letterSpacing: '0.3px',
      }}>
        {message}
      </Typography>

    </Box>
  );
};

export default LoadingBox;