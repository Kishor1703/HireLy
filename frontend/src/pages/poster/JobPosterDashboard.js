import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Checkbox, ListItemText, MenuItem, Stack, TextField, Typography,
  Divider, CircularProgress, Grid, Chip,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ApplicationFormBuilder from '../../components/ApplicationFormBuilder';
import { getDefaultApplicationForm, normalizeApplicationForm } from '../../utils/applicationForm';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#f8faff',
    '&:hover fieldset': { borderColor: '#2f80ed' },
    '&.Mui-focused fieldset': { borderColor: '#1e4fd8', borderWidth: '2px' },
    '&.Mui-disabled': { bgcolor: '#f1f5f9' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1e4fd8' },
};

const FieldLabel = ({ icon, children, required }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.75 }}>
    {React.cloneElement(icon, { sx: { fontSize: 15, color: '#64748b' } })}
    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
      {children}
      {required && <Box component="span" sx={{ color: '#ef4444', ml: 0.3 }}>*</Box>}
    </Typography>
  </Box>
);

const JobPosterDashboard = () => {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [salary,      setSalary]      = useState('');
  const [locations,   setLocations]   = useState([]);
  const [jobType,     setJobType]     = useState('');
  const [jobTypes,    setJobTypes]    = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [message,     setMessage]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyApprovalStatus, setCompanyApprovalStatus] = useState('approved');
  const [applicationForm, setApplicationForm] = useState(getDefaultApplicationForm());

  useEffect(() => {
    Promise.all([
      axios.get('/api/type/jobs'),
      axios.get('/api/location/jobs'),
    ])
      .then(([{ data: typeData }, { data: locationData }]) => {
        setJobTypes(typeData?.jobT || []);
        setLocationOptions(locationData?.jobLocations || []);
      })
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load categories and locations'));
  }, []);

  useEffect(() => {
    axios.get('/api/me')
      .then(({ data }) => {
        setCompanyName(data?.user?.companyName || '');
        setCompanyLogo(data?.user?.companyLogo || '');
        setCompanyApprovalStatus(data?.user?.companyApprovalStatus || 'approved');
      })
      .catch(() => {});
  }, []);

  const submitJob = async (e) => {
    e.preventDefault();
    if (companyApprovalStatus !== 'approved') {
      setError('Your company is not approved yet. Please wait for admin approval.');
      return;
    }
    setMessage(''); setError(''); setLoading(true);
    try {
      await axios.post('/api/job/create', {
        title, description, salary, locations, jobType, companyName, companyLogo, applicationForm,
      });
      setMessage('Job posted successfully!');
      setTitle(''); setDescription(''); setSalary(''); setLocations([]); setJobType(''); setApplicationForm(getDefaultApplicationForm());
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Job posting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px',
          background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <WorkOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
            Post a Job
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Fill in the details below to publish a new job listing
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

      {/* Company missing warning */}
      {!companyName && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.2,
          bgcolor: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: '12px', px: 2, py: 1.5, mb: 3,
        }}>
          <WarningAmberOutlinedIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#92400e' }}>
              Company profile missing
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#b45309' }}>
              Please complete your company profile before posting jobs.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Company banner (when loaded) */}
      {companyName && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor: '#eff6ff', border: '1px solid #dbeafe',
          borderRadius: '12px', px: 2, py: 1.5, mb: 3,
        }}>
          {companyLogo
            ? <Box component="img" src={companyLogo} alt="logo"
                sx={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover', border: '1px solid #bfdbfe' }} />
            : <Box sx={{
                width: 36, height: 36, borderRadius: '8px',
                bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 18 }} />
              </Box>
          }
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a2463' }}>
              {companyName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              Posting as this company
            </Typography>
          </Box>
          {companyApprovalStatus === 'approved' && (
            <Chip label="Approved" size="small" sx={{
              ml: 'auto', bgcolor: '#dcfce7', color: '#16a34a',
              fontWeight: 600, fontSize: '0.7rem', border: '1px solid #bbf7d0',
            }} />
          )}
          {companyApprovalStatus === 'pending' && (
            <Chip label="Pending Approval" size="small" sx={{
              ml: 'auto', bgcolor: '#fffbeb', color: '#b45309',
              fontWeight: 600, fontSize: '0.7rem', border: '1px solid #fde68a',
            }} />
          )}
          {companyApprovalStatus === 'rejected' && (
            <Chip label="Rejected" size="small" sx={{
              ml: 'auto', bgcolor: '#fef2f2', color: '#ef4444',
              fontWeight: 600, fontSize: '0.7rem', border: '1px solid #fecaca',
            }} />
          )}
        </Box>
      )}

      {companyName && companyApprovalStatus !== 'approved' && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.2,
          bgcolor: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: '12px', px: 2, py: 1.5, mb: 3,
        }}>
          <WarningAmberOutlinedIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#92400e' }}>
              Company approval required
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#b45309' }}>
              You can post jobs only after an admin approves your company.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Alerts */}
      {message && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: '12px', px: 2, py: 1.5, mb: 3,
        }}>
          <CheckCircleOutlineIcon sx={{ color: '#22c55e', fontSize: 20 }} />
          <Typography sx={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 500 }}>
            {message}
          </Typography>
        </Box>
      )}
      {error && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '12px', px: 2, py: 1.5, mb: 3,
        }}>
          <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 20 }} />
          <Typography sx={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Form */}
      <Box component="form" onSubmit={submitJob} sx={{ maxWidth: 700 }}>
        <Stack spacing={2.5}>

          {/* Title */}
          <Box>
            <FieldLabel icon={<WorkOutlineIcon />} required>Job Title</FieldLabel>
            <TextField
              value={title} onChange={(e) => setTitle(e.target.value)}
              required fullWidth placeholder="e.g. Senior Frontend Engineer"
              sx={fieldSx}
            />
          </Box>

          {/* Description */}
          <Box>
            <FieldLabel icon={<WorkOutlineIcon />} required>Job Description</FieldLabel>
            <TextField
              value={description} onChange={(e) => setDescription(e.target.value)}
              required fullWidth multiline minRows={5}
              placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity great..."
              sx={fieldSx}
            />
          </Box>

          {/* Salary + Location side by side — FIXED ALIGNMENT */}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={6}>
              <FieldLabel icon={<AttachMoneyOutlinedIcon />} required>Salary</FieldLabel>
              <TextField
                value={salary} onChange={(e) => setSalary(e.target.value)}
                required fullWidth placeholder="e.g. $80,000 – $100,000"
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root': {
                    ...fieldSx['& .MuiOutlinedInput-root'],
                    height: '56px',         // ← fixed height to match select
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel icon={<LocationOnOutlinedIcon />} required>Location</FieldLabel>
              <TextField
                select
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                required
                fullWidth
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root': {
                    ...fieldSx['& .MuiOutlinedInput-root'],
                    height: '56px',         // ← same fixed height
                    alignItems: 'center',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    py: '14px',
                  },
                }}
                SelectProps={{
                  multiple: true,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return (
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                          Select one or more locations
                        </Typography>
                      );
                    }
                    return locationOptions
                      .filter((o) => selected.includes(o._id))
                      .map((o) => o.locationName)
                      .join(', ');
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Select one or more locations
                  </Typography>
                </MenuItem>
                {locationOptions.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    <Checkbox checked={locations.includes(option._id)} size="small" />
                    <ListItemText primary={option.locationName} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Category */}
          <Box>
            <FieldLabel icon={<CategoryOutlinedIcon />} required>Category</FieldLabel>
            <TextField
              select value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required fullWidth
              sx={fieldSx}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select a category</Typography>
              </MenuItem>
              {jobTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}
                  sx={{ fontSize: '0.9rem', '&:hover': { bgcolor: '#eff6ff' } }}>
                  {type.jobTypeName}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <ApplicationFormBuilder
            value={normalizeApplicationForm(applicationForm)}
            onChange={setApplicationForm}
          />

          {/* Submit */}
          <Box sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !companyName || companyApprovalStatus !== 'approved'}
              startIcon={loading
                ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                : <SendOutlinedIcon />}
              sx={{
                py: 1.4, px: 4, borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 18px rgba(10,36,99,0.35)',
                },
                '&:disabled': { background: '#93c5fd', boxShadow: 'none', transform: 'none' },
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </Box>

        </Stack>
      </Box>
    </Box>
  );
};

export default JobPosterDashboard;
