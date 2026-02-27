import { Box, Typography, Chip } from '@mui/material';
import React from 'react';
import headerImage from '../images/jobbg.png';
import SearchInputEl from './SearchInputEl';

const NAVBAR_HEIGHT = 90; // matches the updated Navbar height

const Header = () => {
  return (
    <Box sx={{
      position: 'relative',
      minHeight: 520,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${headerImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
      // Push entire header down so nothing hides under navbar
      mt: `${NAVBAR_HEIGHT}px`,
    }}>

      {/* Dark blue gradient overlay */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(10,36,99,0.88) 0%, rgba(30,79,216,0.72) 100%)',
        zIndex: 0,
      }} />

      {/* Subtle grid overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow blobs */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', filter: 'blur(90px)',
        background: 'rgba(47,128,237,0.25)',
        top: -100, left: -80, zIndex: 1,
      }} />
      <Box sx={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', filter: 'blur(80px)',
        background: 'rgba(10,36,99,0.3)',
        bottom: -60, right: -60, zIndex: 1,
      }} />

      {/* Content */}
      <Box sx={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', px: 2,
        width: '100%', maxWidth: 700,
        py: 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* Badge */}
        {/* <Chip
          label="✦  1.2M+ Jobs Available Worldwide"
          size="small"
          sx={{
            mb: 2.5,
            bgcolor: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 600, fontSize: '0.78rem',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px', px: 1,
            backdropFilter: 'blur(8px)',
          }}
        /> */}

        {/* Headline */}
        <Typography sx={{
          fontWeight: 800,
          fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
          color: '#fff',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          mb: 1.5,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          Find Your{' '}
          <Box component="span" sx={{
            background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Dream Job
          </Box>{' '}
          Today
        </Typography>

        {/* Subtitle */}
        <Typography sx={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: { xs: '0.9rem', sm: '1rem' },
          mb: 3.5, lineHeight: 1.7,
          maxWidth: 480, mx: 'auto',
        }}>
          Search thousands of opportunities from top companies.
          Your next career move starts here.
        </Typography>

        {/* Search bar — centred via parent flexbox */}
        <SearchInputEl />

        {/* Popular tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2.5 }}>
          {['Remote', 'Frontend', 'Data Science', 'Marketing', 'Design'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '100px',
                fontSize: '0.75rem', fontWeight: 500,
                backdropFilter: 'blur(6px)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;