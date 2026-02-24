import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const StatCard = ({ label, value }) => (
  <Box sx={{
    bgcolor: '#f8faff',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    p: 1.5,
    minWidth: 140,
  }}>
    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1.2rem', color: '#0a2463', fontWeight: 800, lineHeight: 1.1 }}>
      {value}
    </Typography>
  </Box>
);

const PosterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        try {
          const response = await axios.get('/api/applications/poster');
          data = response.data;
        } catch (firstErr) {
          const fallback = await axios.get('/api/applications');
          data = fallback.data;
        }
        setApplications(data?.applications || []);
      } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.error || err?.response?.data?.message;
        setError(message || (status ? `Failed to load applications (HTTP ${status})` : 'Failed to load applications'));
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map();
    applications.forEach((app) => {
      const job = app.job || {};
      const key = job._id || app._id;
      if (!map.has(key)) {
        map.set(key, { job, applications: [] });
      }
      map.get(key).applications.push(app);
    });
    return Array.from(map.values());
  }, [applications]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px',
          background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GroupOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
            Applications Received
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            View candidates who applied to your posted jobs
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 2, mt: 2 }} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 2.5 }}>
        <StatCard label="Total Applications" value={applications.length} />
        <StatCard label="Jobs with Applicants" value={grouped.length} />
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#1e4fd8' }} />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && grouped.length === 0 && (
        <Box sx={{
          bgcolor: '#f8faff',
          border: '1.5px dashed #bfdbfe',
          borderRadius: '14px',
          p: 3,
          textAlign: 'center',
        }}>
          <Typography sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5 }}>
            No applications yet
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#64748b' }}>
            Applications will appear here after candidates apply to your jobs.
          </Typography>
        </Box>
      )}

      {!loading && !error && grouped.map((group, idx) => (
        <Box
          key={group.job?._id || `job-group-${idx}`}
          sx={{
            mb: 2.2,
            bgcolor: '#fff',
            border: '1.5px solid #dbeafe',
            borderRadius: '14px',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
            {group.job?.companyLogo
              ? (
                <Avatar src={group.job.companyLogo} alt={group.job?.companyName || 'Company'} />
              ) : (
                <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e4fd8' }}>
                  <WorkOutlineIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, color: '#0a2463', lineHeight: 1.2 }}>
                {group.job?.title || 'Job'}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                {group.job?.companyName || 'Company'}
              </Typography>
            </Box>
            <Typography sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1e4fd8',
              bgcolor: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: '8px',
              px: 1.2,
              py: 0.4,
            }}>
              {group.applications.length} applicant{group.applications.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
              {group.job?.location || 'Location not specified'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachMoneyOutlinedIcon sx={{ fontSize: 14 }} />
              {group.job?.salary || 'Salary not specified'}
            </Typography>
          </Stack>

          <Stack spacing={1.2}>
            {group.applications.map((app) => (
              <Box
                key={app._id}
                sx={{
                  p: 1.5,
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  bgcolor: '#f8fafc',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0a2463' }}>
                    {(app.firstName || app.lastName)
                      ? `${app.firstName || ''} ${app.lastName || ''}`.trim()
                      : 'Applicant'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Applied on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4} sx={{ mt: 0.8, mb: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MailOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                    {app.email || 'Email not provided'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                    {app.phone || 'Phone not provided'}
                  </Typography>
                </Stack>

                <Button
                  component="a"
                  href={app.resume}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="small"
                  startIcon={<DescriptionOutlinedIcon sx={{ fontSize: '15px !important' }} />}
                  endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '9px',
                    fontWeight: 600,
                    borderColor: '#bfdbfe',
                    color: '#1e4fd8',
                    '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
                  }}
                >
                  Open Resume
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default PosterApplications;
