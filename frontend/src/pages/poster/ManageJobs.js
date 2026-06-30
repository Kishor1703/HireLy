import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ApplicationFormBuilder from '../../components/ApplicationFormBuilder';
import { getDefaultApplicationForm, normalizeApplicationForm } from '../../utils/applicationForm';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#f8faff',
    '&:hover fieldset': { borderColor: '#2f80ed' },
    '&.Mui-focused fieldset': { borderColor: '#1e4fd8', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1e4fd8' },
};

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    salary: '',
    locations: [],
    jobType: '',
    applicationForm: getDefaultApplicationForm(),
  });

  const totalJobs = useMemo(() => jobs.length, [jobs]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: jobsData }, { data: typeData }, { data: locationData }] = await Promise.all([
        axios.get('/api/poster/jobs'),
        axios.get('/api/type/jobs'),
        axios.get('/api/location/jobs'),
      ]);
      setJobs(jobsData?.jobs || []);
      setJobTypes(typeData?.jobT || []);
      setLocationOptions(locationData?.jobLocations || []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load posted jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSelectedLocationIds = (job) => {
    const populatedIds = Array.isArray(job?.locations)
      ? job.locations.map((item) => item?._id || item).filter(Boolean)
      : [];

    if (populatedIds.length) {
      return populatedIds;
    }

    const fallbackNames = String(job?.location || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return locationOptions
      .filter((option) => fallbackNames.some((name) => name.toLowerCase() === option.locationName.toLowerCase()))
      .map((option) => option._id);
  };

  const openEdit = (job) => {
    setSuccess('');
    setError('');
    setEditId(job._id);
    setEditForm({
      title: job.title || '',
      description: job.description || '',
      salary: job.salary || '',
      locations: getSelectedLocationIds(job),
      jobType: job?.jobType?._id || '',
      applicationForm: normalizeApplicationForm(job?.applicationForm),
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setEditId('');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.put(`/api/poster/jobs/${editId}`, editForm);
      const updated = data?.job;
      setJobs((prev) => prev.map((job) => (job._id === editId ? updated : job)));
      setSuccess('Job updated successfully.');
      setEditOpen(false);
      setEditId('');
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm('Delete this job post? This action cannot be undone.');
    if (!confirmDelete) return;

    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/poster/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setSuccess('Job deleted successfully.');
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to delete job');
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
          <WorkOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
            Manage Job Posts
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Edit and delete your posted jobs from one place
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 2, mt: 2 }} />

      <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        bgcolor: '#f8faff',
        border: '1px solid #dbeafe',
        borderRadius: '10px',
        px: 1.5,
        py: 0.8,
      }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          Total Posted Jobs
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: '#0a2463', fontWeight: 800 }}>
          {totalJobs}
        </Typography>
      </Box>

      {success && (
        <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#1e4fd8' }} />
        </Box>
      )}

      {!loading && jobs.length === 0 && (
        <Box sx={{
          bgcolor: '#f8faff',
          border: '1.5px dashed #bfdbfe',
          borderRadius: '14px',
          p: 3,
          textAlign: 'center',
        }}>
          <Typography sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5 }}>
            No posted jobs found
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#64748b' }}>
            Post a new job to start receiving applications.
          </Typography>
        </Box>
      )}

      {!loading && jobs.map((job) => (
        <Box
          key={job._id}
          sx={{
            mb: 2,
            p: 2,
            bgcolor: '#fff',
            border: '1.5px solid #dbeafe',
            borderRadius: '14px',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '1rem', mb: 0.4 }}>
            {job.title}
          </Typography>

          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 1.2 }}>
            {(job.description || '').split(' ').slice(0, 24).join(' ')}...
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
              {job.location || 'Location not specified'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachMoneyOutlinedIcon sx={{ fontSize: 14 }} />
              {job.salary || 'Salary not specified'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryOutlinedIcon sx={{ fontSize: 14 }} />
              {job?.jobType?.jobTypeName || 'Category not specified'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => openEdit(job)}
              sx={{
                textTransform: 'none',
                borderRadius: '9px',
                fontWeight: 600,
                borderColor: '#bfdbfe',
                color: '#1e4fd8',
                '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => handleDelete(job._id)}
              sx={{ textTransform: 'none', borderRadius: '9px', fontWeight: 600 }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      ))}

      <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Job Post</DialogTitle>
        <DialogContent sx={{ pt: '10px !important' }}>
          <Stack spacing={1.5}>
            <TextField name="title" label="Job Title" value={editForm.title} onChange={handleEditChange} fullWidth sx={fieldSx} />
            <TextField
              name="description"
              label="Description"
              value={editForm.description}
              onChange={handleEditChange}
              fullWidth
              multiline
              minRows={4}
              sx={fieldSx}
            />
            <TextField name="salary" label="Salary" value={editForm.salary} onChange={handleEditChange} fullWidth sx={fieldSx} />
            <TextField
              select
              name="locations"
              label="Locations"
              value={editForm.locations}
              onChange={handleEditChange}
              fullWidth
              sx={fieldSx}
              SelectProps={{
                multiple: true,
                renderValue: (selected) => locationOptions
                  .filter((option) => selected.includes(option._id))
                  .map((option) => option.locationName)
                  .join(', '),
              }}
            >
              {locationOptions.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  <Checkbox checked={editForm.locations.includes(option._id)} size="small" />
                  <ListItemText primary={option.locationName} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="jobType"
              label="Category"
              value={editForm.jobType}
              onChange={handleEditChange}
              fullWidth
              sx={fieldSx}
            >
              {jobTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.jobTypeName}
                </MenuItem>
              ))}
            </TextField>
            <ApplicationFormBuilder
              value={editForm.applicationForm}
              onChange={(applicationForm) => setEditForm((prev) => ({ ...prev, applicationForm }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEdit} disabled={saving} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{
              textTransform: 'none',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageJobs;
