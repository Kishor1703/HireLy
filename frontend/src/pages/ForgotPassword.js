import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post('/api/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      setMessage(data?.message || 'If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to process request right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 10, bgcolor: '#f8fbff', paddingTop: '150px' }}>
        <Box sx={{ width: '100%', maxWidth: 520, bgcolor: '#fff', border: '1px solid #dbeafe', borderRadius: '16px', p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a2463', mb: 1 }}>
            Forgot Password
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mb: 3 }}>
            Enter your email and we will send you a password reset link.
          </Typography>

          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            {message && (
              <Typography sx={{ color: '#166534', fontSize: '0.9rem', mb: 1.5 }}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography sx={{ color: '#b91c1c', fontSize: '0.9rem', mb: 1.5 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '10px',
                py: 1.2,
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>

          <Typography sx={{ mt: 2.2, textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Remembered your password?{' '}
            <Box component={Link} to="/login" sx={{ color: '#1e4fd8', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Box>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ForgotPassword;
