import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, success: false, message: 'Verifying your email...' });

  useEffect(() => {
    const verify = async () => {
      const token = (searchParams.get('token') || '').trim();
      if (!token) {
        setState({ loading: false, success: false, message: 'Missing verification token.' });
        return;
      }

      try {
        const { data } = await axios.get(`/api/verify-email?token=${encodeURIComponent(token)}`);
        setState({
          loading: false,
          success: true,
          message: data?.message || 'Email verified successfully. You can now log in.'
        });
      } catch (error) {
        setState({
          loading: false,
          success: false,
          message: error?.response?.data?.error || 'Verification link is invalid or expired.'
        });
      }
    };

    verify();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 10, bgcolor: '#f8fbff' }}>
        <Box sx={{ width: '100%', maxWidth: 520, bgcolor: '#fff', border: '1px solid #dbeafe', borderRadius: '16px', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a2463', mb: 1 }}>
            Email Verification
          </Typography>
          <Typography sx={{ color: state.success ? '#166534' : '#b91c1c', fontSize: '0.96rem', mb: 3 }}>
            {state.loading ? 'Verifying your email...' : state.message}
          </Typography>
          {!state.loading && (
            <Button
              component={Link}
              to={state.success ? '/login?verified=1' : '/login'}
              variant="contained"
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)'
              }}
            >
              Go to Sign In
            </Button>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default VerifyEmail;
