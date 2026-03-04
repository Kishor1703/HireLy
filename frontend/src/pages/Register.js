import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, Divider,TextField, Typography, InputAdornment, IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import WorkIcon from '@mui/icons-material/Work';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName:  yup.string().required('Last name is required'),
  email:     yup.string().email('Enter a valid email').required('Email is required'),
  password:  yup.string().min(6, 'At least 6 characters').required('Password is required'),
  role:      yup.number().oneOf([0, 2], 'Invalid role').required('Role is required'),
  companyName: yup.string().when('role', {
    is: (v) => Number(v) === 2,
    then: (s) => s.required('Company name is required for job poster'),
    otherwise: (s) => s.notRequired(),
  }),
});

const roleCards = [
  { value: 0, label: 'Job Seeker',  icon: <PersonOutlineIcon />,         desc: 'Find & apply for jobs' },
  { value: 2, label: 'Job Poster',  icon: <BusinessCenterOutlinedIcon />, desc: 'Post & manage listings' },
];

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '', role: 0, companyName: '' },
    validationSchema,
    onSubmit: async (values, actions) => {
      actions.setStatus(null);
      try {
        const payload = { ...values, role: Number(values.role) };
        try {
          await axios.post('/api/signup', payload);
        } catch (err) {
          if (err?.response?.status === 404) {
            await axios.post('/api/users/register', payload);
          } else throw err;
        }
        const loginRole = Number(values.role) === 2 ? 'jobPoster' : 'employee';
        navigate(`/login?role=${loginRole}&verify=pending&email=${encodeURIComponent(values.email)}`);
      } catch (err) {
        actions.setStatus(
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          `Registration failed${err?.response?.status ? ` (HTTP ${err.response.status})` : ''}`
        );
      }
    },
  });

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(160deg, #eff6ff 0%, #ffffff 55%, #dbeafe 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(31,79,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(47,128,237,0.12)', filter: 'blur(80px)', top: -100, right: -80, zIndex: 0 }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(10,36,99,0.08)', filter: 'blur(80px)', bottom: -60, left: -60, zIndex: 0 }} />

        <Box sx={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', px: 2, py: 12, position: 'relative', zIndex: 1,
        }}>
          <Box sx={{ width: '100%', maxWidth: 480 }}>

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
                  <WorkIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#0a2463',
                  '& span': { color: '#2f80ed' } }}>
                  Talent<span>Sphere</span>
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0a2463', letterSpacing: '-0.5px', mb: 0.5 }}>
                Create your account
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 3 }}>
                Join TalentSphere and find your next opportunity
              </Typography>

              {/* Error message */}
              {formik.status && (
                <Box sx={{
                  bgcolor: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', px: 2, py: 1.2, mb: 2.5,
                }}>
                  <Typography sx={{ color: '#ef4444', fontSize: '0.88rem' }}>
                    {formik.status}
                  </Typography>
                </Box>
              )}

              {/* Role selector */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                {roleCards.map((r) => (
                  <Box
                    key={r.value}
                    onClick={() => formik.setFieldValue('role', r.value)}
                    sx={{
                      flex: 1, p: 1.5, borderRadius: '14px', cursor: 'pointer',
                      border: '1.5px solid',
                      borderColor: Number(formik.values.role) === r.value ? '#2f80ed' : '#dbeafe',
                      bgcolor: Number(formik.values.role) === r.value ? '#eff6ff' : '#fff',
                      transition: 'all 0.2s', textAlign: 'center',
                      '&:hover': { borderColor: '#2f80ed', bgcolor: '#eff6ff' },
                    }}
                  >
                    <Box sx={{
                      color: Number(formik.values.role) === r.value ? '#1e4fd8' : '#94a3b8',
                      mb: 0.3, transition: 'color 0.2s',
                    }}>
                      {r.icon}
                    </Box>
                    <Typography sx={{
                      fontWeight: 700, fontSize: '0.82rem',
                      color: Number(formik.values.role) === r.value ? '#0a2463' : '#64748b',
                    }}>
                      {r.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {r.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box component="form" onSubmit={formik.handleSubmit}>
                {/* Name row */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                  <TextField
                    fullWidth label="First Name" name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  <TextField
                    fullWidth label="Last Name" name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Box>

                <TextField
                  fullWidth label="Email address" name="email" type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                {/* Company name for job poster */}
                {Number(formik.values.role) === 2 && (
                  <TextField
                    fullWidth label="Company Name" name="companyName"
                    value={formik.values.companyName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                    helperText={formik.touched.companyName && formik.errors.companyName}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                )}

                <Button
                  fullWidth type="submit" variant="contained"
                  sx={{
                    py: 1.4, borderRadius: '12px', fontWeight: 700,
                    fontSize: '1rem', textTransform: 'none', mt: 1,
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
                  Create Account
                </Button>
              </Box>

              <Divider sx={{ my: 2.5, borderColor: '#dbeafe' }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', px: 1 }}>
                  Already have an account?
                </Typography>
              </Divider>
              <Button
                component={Link} to="/login"
                fullWidth variant="outlined"
                sx={{
                  py: 1.2, borderRadius: '12px', fontWeight: 600,
                  textTransform: 'none', borderColor: '#dbeafe',
                  color: '#1e4fd8', fontSize: '0.95rem',
                  '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
                }}
              >
                Sign in instead
              </Button>
            </Box>

            <Typography sx={{ textAlign: 'center', mt: 2.5, fontSize: '0.8rem', color: '#94a3b8' }}>
              By registering you agree to our{' '}
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
}

export default Register;

