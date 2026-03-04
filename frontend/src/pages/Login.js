import { Box, Typography, TextField, Button,Divider } from '@mui/material';
import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { userSignInAction } from '../redux/actions/userAction';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
  loginType: yup.string().oneOf(['employee', 'jobPoster', 'admin']),
  companyName: yup.string().when('loginType', {
    is: 'jobPoster',
    then: (s) => s.required('Company name is required'),
    otherwise: (s) => s.notRequired(),
  }),
});

const roleCards = [
  { value: 'employee', label: 'Job Seeker',  icon: <PersonOutlineIcon />,                desc: 'Browse & apply for jobs' },
  { value: 'jobPoster', label: 'Job Poster', icon: <BusinessCenterOutlinedIcon />,        desc: 'Post & manage listings' },
];

const LogIn = ({ forcedRole }) => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const [resendStatus, setResendStatus] = React.useState({ loading: false, message: '', error: '' });
  const { isAuthenticated, userInfo } = useSelector((s) => s.signIn || {});

  const queryRole   = searchParams.get('role');
  const initialRole = forcedRole || (queryRole === 'jobPoster' ? 'jobPoster' : 'employee');
  const verifyPending = searchParams.get('verify') === 'pending';
  const verifiedSuccess = searchParams.get('verified') === '1';
  const pendingEmail = (searchParams.get('email') || '').trim();

  useEffect(() => {
    if (isAuthenticated) {
      if (userInfo?.role === 1) navigate('/admin/dashboard');
      else if (userInfo?.role === 2) navigate('/poster/dashboard');
      else navigate('/user/info');
    }
  }, [isAuthenticated, navigate, userInfo]);

  const formik = useFormik({
    initialValues: { email: '', password: '', loginType: initialRole, companyName: '' },
    validationSchema,
    onSubmit: (values, actions) => {
      dispatch(userSignInAction(values));
      actions.resetForm();
    },
  });

  const isAdmin = forcedRole === 'admin';

  const resendVerification = async () => {
    if (!pendingEmail) return;
    try {
      setResendStatus({ loading: true, message: '', error: '' });
      const { data } = await axios.post('/api/resend-verification', { email: pendingEmail });
      setResendStatus({ loading: false, message: data?.message || 'Verification email sent.', error: '' });
    } catch (error) {
      setResendStatus({
        loading: false,
        message: '',
        error: error?.response?.data?.error || 'Unable to resend verification email.'
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(160deg, #eff6ff 0%, #ffffff 55%, #dbeafe 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(31,79,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Blobs */}
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(47,128,237,0.12)', filter: 'blur(80px)', top: -100, left: -80, zIndex: 0 }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(10,36,99,0.08)', filter: 'blur(80px)', bottom: -60, right: -60, zIndex: 0 }} />

        <Box sx={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', px: 2, py: 12, position: 'relative', zIndex: 1,
        }}>
          <Box sx={{ width: '100%', maxWidth: 440 }}>

            {/* Card */}
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1.5px solid #dbeafe',
              boxShadow: '0 20px 60px rgba(10,36,99,0.1)',
              p: { xs: 3, sm: 4 },
            }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isAdmin
                    ? <AdminPanelSettingsOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                    : <WorkIcon sx={{ color: '#fff', fontSize: 24 }} />}
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#0a2463',
                  '& span': { color: '#2f80ed' } }}>
                  Talent<span>Sphere</span>
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a2463', letterSpacing: '-0.5px', mb: 0.5 }}>
                {isAdmin ? 'Admin Sign In' : 'Welcome back'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 3 }}>
                {isAdmin ? 'Sign in to your admin account' : 'Sign in to continue to your account'}
              </Typography>

              {!isAdmin && verifyPending && (
                <Box sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', px: 2, py: 1.5, mb: 2.5 }}>
                  <Typography sx={{ color: '#1e40af', fontSize: '0.88rem' }}>
                    Verification email sent to {pendingEmail || 'your inbox'}. Please verify before logging in.
                  </Typography>
                  {pendingEmail && (
                    <Button
                      onClick={resendVerification}
                      size="small"
                      disabled={resendStatus.loading}
                      sx={{ mt: 1, px: 0, minWidth: 0, textTransform: 'none', fontWeight: 700 }}
                    >
                      {resendStatus.loading ? 'Sending...' : 'Resend verification email'}
                    </Button>
                  )}
                  {resendStatus.message && (
                    <Typography sx={{ color: '#166534', fontSize: '0.82rem', mt: 0.8 }}>
                      {resendStatus.message}
                    </Typography>
                  )}
                  {resendStatus.error && (
                    <Typography sx={{ color: '#b91c1c', fontSize: '0.82rem', mt: 0.8 }}>
                      {resendStatus.error}
                    </Typography>
                  )}
                </Box>
              )}

              {!isAdmin && verifiedSuccess && (
                <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', px: 2, py: 1.5, mb: 2.5 }}>
                  <Typography sx={{ color: '#166534', fontSize: '0.88rem' }}>
                    Email verified successfully. You can sign in now.
                  </Typography>
                </Box>
              )}

              {/* Role selector (non-admin) */}
              {!isAdmin && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                  {roleCards.map((r) => (
                    <Box
                      key={r.value}
                      onClick={() => formik.setFieldValue('loginType', r.value)}
                      sx={{
                        flex: 1, p: 1.5, borderRadius: '14px', cursor: 'pointer',
                        border: '1.5px solid',
                        borderColor: formik.values.loginType === r.value ? '#2f80ed' : '#dbeafe',
                        bgcolor: formik.values.loginType === r.value ? '#eff6ff' : '#fff',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        '&:hover': { borderColor: '#2f80ed', bgcolor: '#eff6ff' },
                      }}
                    >
                      <Box sx={{
                        color: formik.values.loginType === r.value ? '#1e4fd8' : '#94a3b8',
                        mb: 0.3, transition: 'color 0.2s',
                      }}>
                        {r.icon}
                      </Box>
                      <Typography sx={{
                        fontWeight: 700, fontSize: '0.82rem',
                        color: formik.values.loginType === r.value ? '#0a2463' : '#64748b',
                      }}>
                        {r.label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {r.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Box component="form" onSubmit={formik.handleSubmit}>
                {/* Company name for job poster */}
                {!isAdmin && formik.values.loginType === 'jobPoster' && (
                  <TextField
                    fullWidth label="Company Name" name="companyName"
                    value={formik.values.companyName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                    helperText={formik.touched.companyName && formik.errors.companyName}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                )}

                <TextField
                  fullWidth label="Email address" name="email" type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  fullWidth label="Password" name="password" type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <Button
                  fullWidth type="submit" variant="contained"
                  sx={{
                    py: 1.4, borderRadius: '12px', fontWeight: 700,
                    fontSize: '1rem', textTransform: 'none',
                    background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                    boxShadow: '0 4px 16px rgba(31,79,216,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
                      boxShadow: '0 6px 20px rgba(10,36,99,0.35)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Sign In
                </Button>
              </Box>

              {!isAdmin && (
                <>
                  <Divider sx={{ my: 2.5, borderColor: '#dbeafe' }}>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', px: 1 }}>
                      Don't have an account?
                    </Typography>
                  </Divider>
                  <Button
                    component={Link} to="/register"
                    fullWidth variant="outlined"
                    sx={{
                      py: 1.2, borderRadius: '12px', fontWeight: 600,
                      textTransform: 'none', borderColor: '#dbeafe',
                      color: '#1e4fd8', fontSize: '0.95rem',
                      '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
                    }}
                  >
                    Create an account
                  </Button>
                </>
              )}
            </Box>

            {/* Bottom note */}
            <Typography sx={{ textAlign: 'center', mt: 2.5, fontSize: '0.8rem', color: '#94a3b8' }}>
              By signing in you agree to our{' '}
              <Box component="span" sx={{ color: '#2f80ed', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Terms of Service
              </Box>
              {' '}and{' '}
              <Box component="span" sx={{ color: '#2f80ed', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Privacy Policy
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default LogIn;

