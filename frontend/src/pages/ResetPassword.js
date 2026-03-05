import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/reset-password', {
        token,
        password,
        confirmPassword,
      });
      setMessage(data?.message || 'Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 10, bgcolor: '#f8fbff' }}>
        <Box sx={{ width: '100%', maxWidth: 520, bgcolor: '#fff', border: '1px solid #dbeafe', borderRadius: '16px', p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a2463', mb: 1 }}>
            Reset Password
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mb: 3 }}>
            Enter your new password below.
          </Typography>

          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>

          <Typography sx={{ mt: 2.2, textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Back to{' '}
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

export default ResetPassword;
