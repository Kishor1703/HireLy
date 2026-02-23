import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Chip, CircularProgress,
  Container, Divider, Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const InfoBadge = ({ icon, label, value }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.2,
    bgcolor: '#f8faff', border: '1px solid #dbeafe',
    borderRadius: '12px', px: 2, py: 1.2,
  }}>
    <Box sx={{
      width: 32, height: 32, borderRadius: '8px',
      bgcolor: '#dbeafe', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 17, color: '#1e4fd8' } })}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0a2463' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // Pull role from Redux
  const { userInfo } = useSelector((state) => state.signIn || {});
  const isJobSeeker = userInfo?.role === 0;
  const isJobPoster = userInfo?.role === 2;
  const isAdmin     = userInfo?.role === 1;
  const isLoggedOut = !userInfo;

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get(`/api/job/${id}`);
        setJob(data?.job || null);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // ── Apply section — changes based on role ──────────────
  const renderApplySection = () => {

    // ✅ Job Seeker — can apply
    if (isJobSeeker) {
      return (
        <Button
          variant="contained"
          startIcon={<SendOutlinedIcon />}
          fullWidth
          sx={{
            py: 1.4, borderRadius: '12px',
            fontWeight: 700, fontSize: '1rem', textTransform: 'none',
            background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
            boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(10,36,99,0.3)',
            },
            transition: 'all 0.2s',
          }}
        >
          Apply for this Position
        </Button>
      );
    }

    // 🚫 Job Poster or Admin — restricted
    if (isJobPoster || isAdmin) {
      return (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor: '#f8faff', border: '1.5px solid #dbeafe',
          borderRadius: '12px', px: 2.5, py: 1.8,
        }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '9px',
            bgcolor: '#dbeafe', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: '#1e4fd8' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0a2463' }}>
              {isAdmin ? 'Admins cannot apply for jobs' : 'Job Posters cannot apply for jobs'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Only job seekers can submit applications
            </Typography>
          </Box>
          <Chip
            label={isAdmin ? 'Admin' : 'Job Poster'}
            size="small"
            sx={{
              ml: 'auto', bgcolor: '#eff6ff', color: '#1e4fd8',
              fontWeight: 600, fontSize: '0.7rem',
              border: '1px solid #dbeafe', borderRadius: '8px',
            }}
          />
        </Box>
      );
    }

    // 🔐 Not logged in — prompt to sign in / register
    return (
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5,
        bgcolor: '#eff6ff', border: '1.5px solid #dbeafe',
        borderRadius: '12px', px: 2.5, py: 1.8,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '9px',
            bgcolor: '#dbeafe', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: '#1e4fd8' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0a2463' }}>
              Sign in to apply for this role
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
              Create a free account or sign in as a job seeker
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link} to="/login?role=employee"
            variant="outlined" size="small"
            sx={{
              textTransform: 'none', fontWeight: 600,
              borderRadius: '9px', borderColor: '#1e4fd8',
              color: '#1e4fd8', px: 2,
              '&:hover': { bgcolor: '#dbeafe' },
            }}
          >
            Sign In
          </Button>
          <Button
            component={Link} to="/register"
            variant="contained" size="small"
            sx={{
              textTransform: 'none', fontWeight: 600,
              borderRadius: '9px', px: 2,
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              '&:hover': { background: 'linear-gradient(135deg, #1e4fd8, #0a2463)' },
            }}
          >
            Register Free
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <NavBar />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #eff6ff 0%, #ffffff 55%, #dbeafe 100%)',
        position: 'relative', overflow: 'hidden',
        pt: { xs: 10, md: 11 }, pb: 8,
      }}>
        {/* Grid overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(31,79,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

          {/* Back */}
          <Button
            component={Link} to="/jobs"
            startIcon={<ArrowBackOutlinedIcon />}
            sx={{
              mb: 3, textTransform: 'none', fontWeight: 600,
              color: '#1e4fd8', borderRadius: '10px', px: 1.5, py: 0.75,
              '&:hover': { bgcolor: '#eff6ff' },
            }}
          >
            Back to Jobs
          </Button>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress sx={{ color: '#1e4fd8' }} />
            </Box>
          )}

          {/* Error */}
          {!loading && error && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              bgcolor: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '16px', px: 3, py: 2.5,
            }}>
              <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#dc2626' }}>Failed to load job</Typography>
                <Typography sx={{ fontSize: '0.88rem', color: '#ef4444' }}>{error}</Typography>
              </Box>
            </Box>
          )}

          {/* Not found */}
          {!loading && !error && !job && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              bgcolor: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: '16px', px: 3, py: 2.5,
            }}>
              <WarningAmberOutlinedIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography sx={{ fontWeight: 600, color: '#92400e' }}>Job not found</Typography>
            </Box>
          )}

          {/* Job content */}
          {!loading && !error && job && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Hero card */}
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                borderRadius: '20px', border: '1.5px solid #dbeafe',
                boxShadow: '0 8px 32px rgba(10,36,99,0.08)',
                p: { xs: 2.5, sm: 3.5 },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                  <Box sx={{
                    width: 60, height: 60, borderRadius: '14px', flexShrink: 0,
                    border: '1.5px solid #dbeafe', overflow: 'hidden', bgcolor: '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {(job.companyLogo || job?.user?.companyLogo)
                      ? <Box component="img"
                          src={job.companyLogo || job?.user?.companyLogo}
                          alt={job.companyName || 'Company'}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 28 }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: '#0a2463', lineHeight: 1.2, mb: 0.5 }}>
                      {job.title}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e4fd8', fontSize: '1rem' }}>
                      {job.companyName || job?.user?.companyName || 'Company not specified'}
                    </Typography>
                  </Box>
                  <Chip label="Hiring" size="small" sx={{
                    bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700,
                    fontSize: '0.72rem', border: '1px solid #bbf7d0',
                    borderRadius: '8px', flexShrink: 0,
                  }} />
                </Box>

                {/* Info badges */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                  gap: 1.5, mb: 3,
                }}>
                  <InfoBadge icon={<LocationOnOutlinedIcon />}  label="Location" value={job.location || 'Not specified'} />
                  <InfoBadge icon={<AttachMoneyOutlinedIcon />} label="Salary"   value={job.salary   || 'Not specified'} />
                  <InfoBadge icon={<CategoryOutlinedIcon />}    label="Category" value={job?.jobType?.jobTypeName || 'Not specified'} />
                </Box>

                {/* Role-based apply section */}
                {renderApplySection()}
              </Box>

              {/* Description card */}
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                borderRadius: '20px', border: '1.5px solid #dbeafe',
                boxShadow: '0 4px 20px rgba(10,36,99,0.06)',
                p: { xs: 2.5, sm: 3.5 },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkOutlineIcon sx={{ color: '#1e4fd8', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0a2463' }}>
                    Job Description
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: '#dbeafe', mb: 2 }} />
                <Typography sx={{ color: '#475569', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {job.description || 'No description available'}
                </Typography>
              </Box>

              {/* Company profile card */}
              {job?.user?.companyProfile && (
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                  borderRadius: '20px', border: '1.5px solid #dbeafe',
                  boxShadow: '0 4px 20px rgba(10,36,99,0.06)',
                  p: { xs: 2.5, sm: 3.5 },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0a2463' }}>
                      About {job.companyName || job?.user?.companyName || 'the Company'}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#dbeafe', mb: 2 }} />
                  <Typography sx={{ color: '#475569', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                    {job.user.companyProfile}
                  </Typography>
                </Box>
              )}

            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default JobDetails;