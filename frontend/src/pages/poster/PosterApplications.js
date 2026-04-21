import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
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

const COMMON_ANSWER_FIELDS = new Set(['fullName', 'email', 'phone', 'resume', 'location', 'experienceLevel']);

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
  const [success, setSuccess] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState('');

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

  const updateApplicationStatus = async (applicationId, status) => {
    setUpdatingStatusId(applicationId);
    setError('');
    setSuccess('');

    try {
      const { data } = await axios.patch(`/api/applications/${applicationId}/status`, { status });
      setApplications((prev) => prev.map((application) => (
        application._id === applicationId
          ? { ...application, status: data?.application?.status || status }
          : application
      )));
      setSuccess(data?.message || `Application marked as ${status}.`);
    } catch (err) {
      const statusCode = err?.response?.status;
      const message = err?.response?.data?.error || err?.response?.data?.message;
      setError(message || (statusCode ? `Failed to update status (HTTP ${statusCode})` : 'Failed to update status'));
    } finally {
      setUpdatingStatusId('');
    }
  };

  const renderStatusChip = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    if (normalized === 'shortlisted') {
      return <Chip label="Shortlisted" size="small" color="success" />;
    }
    if (normalized === 'rejected') {
      return <Chip label="Rejected" size="small" color="error" />;
    }
    return <Chip label="Pending" size="small" color="warning" />;
  };

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

  const getResumeTypeLabel = (resume) => {
    if (!resume) return 'Resume unavailable';
    return String(resume).startsWith('data:') ? 'Download Resume' : 'Open Resume';
  };

  const getResumeDownloadName = (app) => {
    const name = (app.fullName || app.firstName || 'candidate')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'candidate';
    const mime = String(app.resume || '').match(/^data:([^;,]+)/)?.[1] || '';
    const extension = mime.includes('pdf')
      ? 'pdf'
      : mime.includes('wordprocessingml')
        ? 'docx'
        : mime.includes('msword')
          ? 'doc'
          : 'resume';
    return `${name}-resume.${extension}`;
  };

  const downloadDataResume = (app) => {
    const resume = String(app.resume || '');
    const [header, payload = ''] = resume.split(',');
    const mime = header.match(/^data:([^;,]+)/)?.[1] || 'application/octet-stream';
    const binary = window.atob(payload);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const objectUrl = window.URL.createObjectURL(new Blob([bytes], { type: mime }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = getResumeDownloadName(app);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
  };

  const handleResumeClick = (event, app) => {
    if (!String(app.resume || '').startsWith('data:')) return;
    event.preventDefault();
    try {
      downloadDataResume(app);
    } catch {
      setError('Resume file could not be downloaded. Please ask the candidate to upload it again.');
    }
  };

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

      {!loading && success && <Alert severity="success" sx={{ mb: 1.5 }}>{success}</Alert>}
      {!loading && error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

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
            {group.applications.map((app) => {
              const resume = String(app.resume || '').trim();
              const isDataResume = resume.startsWith('data:');

              return (
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
                    {(app.fullName || app.firstName || app.lastName)
                      ? (app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim())
                      : 'Applicant'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {renderStatusChip(app.status)}
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Applied on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Stack>
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
                  {app.location && (
                    <Typography sx={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
                      {app.location}
                    </Typography>
                  )}
                  {app.experienceLevel && (
                    <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                      Experience: {app.experienceLevel}
                    </Typography>
                  )}
                </Stack>

                {Array.isArray(app.answers) && app.answers.some((answer) => !COMMON_ANSWER_FIELDS.has(answer.fieldId)) && (
                  <Box sx={{ mb: 1.2, p: 1.2, borderRadius: '10px', bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: '#0a2463', mb: 0.8 }}>
                      Additional Answers
                    </Typography>
                    <Stack spacing={0.7}>
                      {app.answers.filter((answer) => !COMMON_ANSWER_FIELDS.has(answer.fieldId)).map((answer) => (
                        <Typography key={`${app._id}-${answer.fieldId}`} sx={{ fontSize: '0.8rem', color: '#475569' }}>
                          <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{answer.label}:</Box> {answer.value || 'Not provided'}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap>
                  <Button
                    component={isDataResume ? 'button' : 'a'}
                    href={!isDataResume ? resume : undefined}
                    target={!isDataResume ? '_blank' : undefined}
                    rel={!isDataResume ? 'noreferrer' : undefined}
                    onClick={(event) => handleResumeClick(event, app)}
                    variant="outlined"
                    size="small"
                    startIcon={<DescriptionOutlinedIcon sx={{ fontSize: '15px !important' }} />}
                    endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                    disabled={!resume}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '9px',
                      fontWeight: 600,
                      borderColor: '#bfdbfe',
                      color: '#1e4fd8',
                      '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
                    }}
                  >
                    {getResumeTypeLabel(app.resume)}
                  </Button>

                  <Button
                    size="small"
                    variant={app.status === 'pending' || !app.status ? 'contained' : 'outlined'}
                    onClick={() => updateApplicationStatus(app._id, 'pending')}
                    disabled={updatingStatusId === app._id}
                    sx={{ textTransform: 'none', borderRadius: '9px', fontWeight: 600 }}
                  >
                    Pending
                  </Button>
                  <Button
                    size="small"
                    color="success"
                    variant={app.status === 'shortlisted' ? 'contained' : 'outlined'}
                    onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                    disabled={updatingStatusId === app._id}
                    sx={{ textTransform: 'none', borderRadius: '9px', fontWeight: 600 }}
                  >
                    Shortlist
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant={app.status === 'rejected' ? 'contained' : 'outlined'}
                    onClick={() => updateApplicationStatus(app._id, 'rejected')}
                    disabled={updatingStatusId === app._id}
                    sx={{ textTransform: 'none', borderRadius: '9px', fontWeight: 600 }}
                  >
                    Reject
                  </Button>
                </Stack>
              </Box>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default PosterApplications;
