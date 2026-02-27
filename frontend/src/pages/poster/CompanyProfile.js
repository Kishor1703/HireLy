import React, { useEffect, useState } from 'react';
import API from '../../api';
import {
  Box, Button, Stack, TextField, Typography,
  CircularProgress, Divider,
} from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Chip from '@mui/material/Chip';

const CompanyProfile = () => {
  const [companyName,    setCompanyName]    = useState('');
  const [companyProfile, setCompanyProfile] = useState('');
  const [companyLogo,    setCompanyLogo]    = useState('');
  const [message,  setMessage]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [companyApprovalStatus, setCompanyApprovalStatus] = useState('approved');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await API.get('/me');
        setCompanyName(data?.user?.companyName || '');
        setCompanyProfile(data?.user?.companyProfile || '');
        setCompanyLogo(data?.user?.companyLogo || '');
        setCompanyApprovalStatus(data?.user?.companyApprovalStatus || 'approved');
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load company profile');
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, []);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogo(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const onLogoSelected = (e) => processFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      await API.put('/me/company-profile', { companyName, companyProfile, companyLogo });
      setMessage('Company profile updated successfully');
    } catch (err) {
      console.log('Full error:', err?.response);
      setError(err?.response?.data?.error || 'Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#f8faff',
      '&:hover fieldset': { borderColor: '#2f80ed' },
      '&.Mui-focused fieldset': { borderColor: '#1e4fd8' },
    },
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <CircularProgress sx={{ color: '#1e4fd8' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px',
          background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BusinessOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
            Company Profile
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Build your company profile — attached to all your job posts
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

      {/* Alerts */}
      <Box sx={{ mb: 2 }}>
        {companyApprovalStatus === 'approved' && <Chip label="Company Approved" color="success" size="small" />}
        {companyApprovalStatus === 'pending' && <Chip label="Approval Pending" color="warning" size="small" />}
        {companyApprovalStatus === 'rejected' && <Chip label="Approval Rejected" color="error" size="small" />}
      </Box>

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

      <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 680 }}>
        <Stack spacing={2.5}>

          {/* Company Name */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', mb: 0.75 }}>
              Company Name <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
            </Typography>
            <TextField
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required fullWidth
              placeholder="e.g. Acme Corporation"
              sx={fieldSx}
            />
          </Box>

          {/* Company Profile */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', mb: 0.75 }}>
              About the Company
            </Typography>
            <TextField
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
              fullWidth multiline minRows={5}
              placeholder="Describe your company, culture, mission, and what makes it a great place to work..."
              sx={fieldSx}
            />
          </Box>

          {/* Logo Upload */}
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', mb: 0.75 }}>
              Company Logo
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Drop zone */}
              <Box
                component="label"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                sx={{
                  flex: 1, minWidth: 200,
                  border: `2px dashed ${dragOver ? '#2f80ed' : '#bfdbfe'}`,
                  borderRadius: '14px',
                  bgcolor: dragOver ? '#eff6ff' : '#f8faff',
                  py: 3, px: 2,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 1, cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#2f80ed', bgcolor: '#eff6ff' },
                }}
              >
                <input type="file" hidden accept="image/*" onChange={onLogoSelected} />
                <Box sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: '#dbeafe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CloudUploadOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e4fd8' }}>
                  Click or drag to upload
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  PNG, JPG, GIF up to 5MB
                </Typography>
              </Box>

              {/* Logo preview */}
              {companyLogo && (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={companyLogo}
                    alt="Company logo"
                    sx={{
                      width: 100, height: 100,
                      borderRadius: '14px',
                      objectFit: 'cover',
                      border: '2px solid #dbeafe',
                      boxShadow: '0 4px 12px rgba(10,36,99,0.1)',
                      display: 'block',
                    }}
                  />
                  <Box
                    onClick={() => setCompanyLogo('')}
                    sx={{
                      position: 'absolute', top: -8, right: -8,
                      width: 24, height: 24, borderRadius: '50%',
                      bgcolor: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'transform 0.15s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ color: '#fff', fontSize: 14 }} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.4, borderRadius: '12px',
              fontWeight: 700, fontSize: '0.95rem',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
              alignSelf: 'flex-start', minWidth: 180,
              '&:hover': {
                background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 18px rgba(10,36,99,0.35)',
              },
              '&:disabled': { background: '#93c5fd', boxShadow: 'none' },
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? <><CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} /> Saving...</>
              : 'Save Company Profile'}
          </Button>

        </Stack>
      </Box>
    </Box>
  );
};

export default CompanyProfile;
