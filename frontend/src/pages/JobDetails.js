import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Chip, CircularProgress,
  Container, Divider, TextField, Typography, InputAdornment,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const NAVBAR_HEIGHT = 90;

// ── Reusable field label ──────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', mb: 0.6 }}>
    {children}
    {required && <Box component="span" sx={{ color: '#ef4444', ml: 0.3 }}>*</Box>}
  </Typography>
);

// ── Shared field style ────────────────────────────────────
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', bgcolor: '#f8faff', fontSize: '0.88rem',
    '&:hover fieldset': { borderColor: '#2f80ed' },
    '&.Mui-focused fieldset': { borderColor: '#1e4fd8', borderWidth: '2px' },
  },
  '& .MuiInputAdornment-root svg': { fontSize: 18, color: '#94a3b8' },
};

// ── Info badge (location / salary / category) ─────────────
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

// ─────────────────────────────────────────────────────────
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob]                       = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [applying, setApplying]             = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyError, setApplyError]         = useState('');
  const [applySuccess, setApplySuccess]     = useState('');
  const [dragOver, setDragOver]             = useState(false);
  const [formData, setFormData]             = useState({ firstName: '', lastName: '', email: '', phone: '', resume: '' });
  const [resumeFileName, setResumeFileName] = useState('');

  const { userInfo } = useSelector((state) => state.signIn || {});
  const isJobSeeker = userInfo?.role === 0;
  const isJobPoster = userInfo?.role === 2;
  const isAdmin     = userInfo?.role === 1;

  useEffect(() => {
    if (!userInfo) return;
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || userInfo.firstName || '',
      lastName:  prev.lastName  || userInfo.lastName  || '',
      email:     prev.email     || userInfo.email     || '',
    }));
  }, [userInfo]);

  useEffect(() => {
    const prefill = async () => {
      if (!userInfo || userInfo.role !== 0) return;
      try {
        const [profileResult, applicationsResult] = await Promise.allSettled([
          axios.get('/api/me'),
          axios.get('/api/applications/me'),
        ]);
        const profile      = profileResult.status === 'fulfilled' ? (profileResult.value?.data?.user || {}) : {};
        const applications = applicationsResult.status === 'fulfilled' ? (applicationsResult.value?.data?.applications || []) : [];
        const latest       = applications[0] || {};
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || latest.firstName || profile.firstName || '',
          lastName:  prev.lastName  || latest.lastName  || profile.lastName  || '',
          email:     prev.email     || latest.email     || profile.email     || '',
          phone:     prev.phone     || latest.phone     || profile.phone     || '',
          resume:    prev.resume    || latest.resume    || profile.resume    || '',
        }));
      } catch {}
    };
    prefill();
  }, [userInfo]);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get(`/api/job/${id}`);
        setJob(data?.job || null);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load job details');
      } finally { setLoading(false); }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!userInfo || userInfo.role !== 0) { setAlreadyApplied(false); return; }
      try {
        const { data } = await axios.get('/api/applications/me');
        setAlreadyApplied((data?.applications || []).some((a) => String(a?.job?._id || '') === String(id)));
      } catch {
        try {
          const profile = await axios.get('/api/me');
          const history = profile?.data?.user?.jobsHistory || [];
          setAlreadyApplied(history.some((e) =>
            String(e?.jobId || '') === String(id) ||
            (job && (e?.title || '').trim().toLowerCase() === (job?.title || '').trim().toLowerCase())
          ));
        } catch { setAlreadyApplied(false); }
      }
    };
    checkApplied();
  }, [id, job, userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setApplyError('Only PDF, DOC, or DOCX files are accepted.'); return; }
    const reader = new FileReader();
    reader.onload = () => { setFormData((prev) => ({ ...prev, resume: String(reader.result || '') })); setResumeFileName(file.name); setApplyError(''); };
    reader.onerror = () => { setApplyError('Failed to read file. Please try again.'); setResumeFileName(''); setFormData((prev) => ({ ...prev, resume: '' })); };
    reader.readAsDataURL(file);
  };

  const handleResumeFileChange = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files?.[0]); };
  const clearResume = () => { setResumeFileName(''); setFormData((prev) => ({ ...prev, resume: '' })); };

  const handleApply = async () => {
    if (!userInfo) { navigate('/login?role=employee'); return; }
    if (userInfo.role !== 0) { setApplyError('Only job seekers can apply.'); return; }
    if (alreadyApplied) { setApplySuccess('You have already applied for this job.'); return; }
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.resume.trim()) {
      setApplyError('Please fill all fields and upload your resume.'); return;
    }
    setApplying(true); setApplyError(''); setApplySuccess('');
    try {
      const { data } = await axios.post('/api/applications', {
        jobId: id,
        firstName: formData.firstName.trim(), lastName: formData.lastName.trim(),
        email: formData.email.trim(), phone: formData.phone.trim(), resume: formData.resume.trim(),
      });
      setApplySuccess(data?.message || 'Application submitted successfully.');
      setAlreadyApplied(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Application failed';
      if (String(msg).toLowerCase().includes('already applied')) { setAlreadyApplied(true); setApplySuccess('You have already applied for this job.'); }
      else { setApplyError(msg); }
    } finally { setApplying(false); }
  };

  // ── Apply section ─────────────────────────────────────
  const renderApplySection = () => {

    if (isJobSeeker) {
      if (alreadyApplied) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', px: 2.5, py: 2 }}>
            <CheckCircleOutlineIcon sx={{ color: '#22c55e', fontSize: 24, flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#16a34a' }}>Application Submitted</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#4ade80' }}>You have already applied for this position</Typography>
            </Box>
          </Box>
        );
      }

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Section title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 20, borderRadius: '4px', background: 'linear-gradient(#2f80ed, #1e4fd8)' }} />
            <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '0.95rem' }}>
              Apply for this Position
            </Typography>
          </Box>

          {/* Alerts */}
          {applyError && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', px: 2, py: 1.2 }}>
              <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: '#ef4444', fontSize: '0.84rem', fontWeight: 500 }}>{applyError}</Typography>
            </Box>
          )}
          {applySuccess && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', px: 2, py: 1.2 }}>
              <CheckCircleOutlineIcon sx={{ color: '#22c55e', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: '#16a34a', fontSize: '0.84rem', fontWeight: 500 }}>{applySuccess}</Typography>
            </Box>
          )}

          {/* Name row */}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <Box>
              <FieldLabel required>First Name</FieldLabel>
              <TextField
                fullWidth size="small"
                name="firstName" value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. John"
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
            <Box>
              <FieldLabel required>Last Name</FieldLabel>
              <TextField
                fullWidth size="small"
                name="lastName" value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Doe"
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Email + Phone row */}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <Box>
              <FieldLabel required>Email Address</FieldLabel>
              <TextField
                fullWidth size="small" type="email"
                name="email" value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
            <Box>
              <FieldLabel required>Phone Number</FieldLabel>
              <TextField
                fullWidth size="small"
                name="phone" value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment> }}
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Resume upload */}
          <Box>
            <FieldLabel required>Resume</FieldLabel>
            {!resumeFileName ? (
              <Box
                component="label"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 1.2, py: 3.5, px: 2,
                  border: `2px dashed ${dragOver ? '#2f80ed' : '#bfdbfe'}`,
                  borderRadius: '14px',
                  bgcolor: dragOver ? '#eff6ff' : '#f8faff',
                  cursor: 'pointer', transition: 'all 0.2s',
                  '&:hover': { borderColor: '#2f80ed', bgcolor: '#eff6ff' },
                }}
              >
                <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleResumeFileChange} />
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 24, color: '#1e4fd8' }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e4fd8' }}>
                    Click to upload or drag & drop
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.3 }}>
                    PDF, DOC, or DOCX — Max 5MB
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', px: 2, py: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <InsertDriveFileOutlinedIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0a2463', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {resumeFileName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 500 }}>✓ Ready to submit</Typography>
                </Box>
                <Box onClick={clearResume} sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, '&:hover': { bgcolor: '#fecaca' }, transition: 'all 0.15s' }}>
                  <DeleteOutlineIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                </Box>
              </Box>
            )}
          </Box>

          {/* Submit */}
          <Button
            variant="contained"
            startIcon={applying ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SendOutlinedIcon />}
            onClick={handleApply}
            disabled={applying}
            fullWidth
            sx={{
              py: 1.4, borderRadius: '12px', fontWeight: 700,
              fontSize: '1rem', textTransform: 'none', mt: 0.5,
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #1e4fd8, #0a2463)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(10,36,99,0.3)' },
              '&:disabled': { background: '#93c5fd', boxShadow: 'none', transform: 'none' },
              transition: 'all 0.2s',
            }}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </Box>
      );
    }

    if (isJobPoster || isAdmin) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f8faff', border: '1.5px solid #dbeafe', borderRadius: '12px', px: 2.5, py: 1.8 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: '#1e4fd8' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0a2463' }}>
              {isAdmin ? 'Admins cannot apply for jobs' : 'Job Posters cannot apply for jobs'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>Only job seekers can submit applications</Typography>
          </Box>
          <Chip label={isAdmin ? 'Admin' : 'Job Poster'} size="small" sx={{ ml: 'auto', bgcolor: '#eff6ff', color: '#1e4fd8', fontWeight: 600, fontSize: '0.7rem', border: '1px solid #dbeafe', borderRadius: '8px' }} />
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, bgcolor: '#eff6ff', border: '1.5px solid #dbeafe', borderRadius: '12px', px: 2.5, py: 1.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: '#1e4fd8' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0a2463' }}>Sign in to apply for this role</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>Create a free account or sign in as a job seeker</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/login?role=employee" variant="outlined" size="small"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '9px', borderColor: '#1e4fd8', color: '#1e4fd8', px: 2, '&:hover': { bgcolor: '#dbeafe' } }}>
            Sign In
          </Button>
          <Button component={Link} to="/register" variant="contained" size="small"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '9px', px: 2, background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)', '&:hover': { background: 'linear-gradient(135deg, #1e4fd8, #0a2463)' } }}>
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
        pt: `calc(${NAVBAR_HEIGHT}px + 20px)`, pb: 8,
      }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(31,79,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Button component={Link} to="/jobs" startIcon={<ArrowBackOutlinedIcon />}
            sx={{ mb: 3, textTransform: 'none', fontWeight: 600, color: '#1e4fd8', borderRadius: '10px', px: 1.5, py: 0.75, '&:hover': { bgcolor: '#eff6ff' } }}>
            Back to Jobs
          </Button>

          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: '#1e4fd8' }} /></Box>}

          {!loading && error && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', px: 3, py: 2.5 }}>
              <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#dc2626' }}>Failed to load job</Typography>
                <Typography sx={{ fontSize: '0.88rem', color: '#ef4444' }}>{error}</Typography>
              </Box>
            </Box>
          )}

          {!loading && !error && !job && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', px: 3, py: 2.5 }}>
              <WarningAmberOutlinedIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography sx={{ fontWeight: 600, color: '#92400e' }}>Job not found</Typography>
            </Box>
          )}

          {!loading && !error && job && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Hero card */}
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1.5px solid #dbeafe', boxShadow: '0 8px 32px rgba(10,36,99,0.08)', p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                  <Box sx={{ width: 60, height: 60, borderRadius: '14px', flexShrink: 0, border: '1.5px solid #dbeafe', overflow: 'hidden', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(job.companyLogo || job?.user?.companyLogo)
                      ? <Box component="img" src={job.companyLogo || job?.user?.companyLogo} alt={job.companyName} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 28 }} />}
                  </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: '#0a2463', lineHeight: 1.2, mb: 0.5 }}>
                        {job.title}
                      </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 600, color: '#1e4fd8', fontSize: '1rem' }}>
                        {job.companyName || job?.user?.companyName || 'Company not specified'}
                      </Typography>
                      {job?.user?.companyVerified && (
                        <Chip
                          size="small"
                          icon={<VerifiedOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                          label="Verified Company"
                          sx={{
                            height: 24,
                            fontWeight: 700,
                            bgcolor: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Chip label="Hiring" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #bbf7d0', borderRadius: '8px', flexShrink: 0 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, mb: 3 }}>
                  <InfoBadge icon={<LocationOnOutlinedIcon />}  label="Location" value={job.location || 'Not specified'} />
                  <InfoBadge icon={<AttachMoneyOutlinedIcon />} label="Salary"   value={job.salary   || 'Not specified'} />
                  <InfoBadge icon={<CategoryOutlinedIcon />}    label="Category" value={job?.jobType?.jobTypeName || 'Not specified'} />
                </Box>

              </Box>

              {/* Description card */}
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 20px rgba(10,36,99,0.06)', p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkOutlineIcon sx={{ color: '#1e4fd8', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0a2463' }}>Job Description</Typography>
                </Box>
                <Divider sx={{ borderColor: '#dbeafe', mb: 2 }} />
                <Typography sx={{ color: '#475569', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {job.description || 'No description available'}
                </Typography>
              </Box>

              {/* Application card */}
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 20px rgba(10,36,99,0.06)', p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SendOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0a2463' }}>
                    Apply Now
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: '#dbeafe', mb: 2 }} />
                {renderApplySection()}
              </Box>

              {/* Company profile card */}
              {job?.user?.companyProfile && (
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1.5px solid #dbeafe', boxShadow: '0 4px 20px rgba(10,36,99,0.06)', p: { xs: 2.5, sm: 3.5 } }}>
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
