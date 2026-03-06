import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children, sx }) => {
  const location = useLocation();

  return (
    <Box
      key={location.pathname}
      className="page-transition"
      sx={sx}
    >
      {children}
    </Box>
  );
};

export default PageTransition;
