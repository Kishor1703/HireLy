import { Box } from '@mui/material';
import React from 'react';
import HeaderTop from './HeaderTop';
import SidebarAdm from './Sidebar';

const Layout = (Component) => ({ ...props }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', overflow: 'hidden' }}>

      {/* Sidebar — fixed height, no shrink */}
      <Box sx={{ flexShrink: 0, height: '100dvh', overflowY: 'auto' }}>
        <SidebarAdm />
      </Box>

      {/* Right side: header + scrollable content */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 60%, #eef4ff 100%)',
        position: 'relative',
      }}>

        {/* Subtle background grid */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(31,79,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Header — always on top */}
        <Box sx={{ flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <HeaderTop />
        </Box>

        {/* Scrollable page content */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          p: { xs: 1.25, sm: 2.25, md: 3 },
        }}>
          {/* White content card */}
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: { xs: '12px', sm: '16px' },
            border: '1px solid rgba(219,234,254,0.9)',
            boxShadow: '0 2px 16px rgba(10,36,99,0.07)',
            p: { xs: 1.5, sm: 2.5, md: 3 },
            minHeight: '100%',
          }}>
            <Component {...props} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Layout;
