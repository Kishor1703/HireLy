import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Divider, Chip, Grid,
  TextField, InputAdornment, MenuItem, Select,
  FormControl, CircularProgress, Button,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobs(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) =>
    [job.title, job.location, job.description]
      .join(' ').toLowerCase()
      .includes(search.toLowerCase())
  );

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
            Job Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            {loading ? 'Loading...' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} available`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

      {/* Search + filter bar */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search jobs, location, skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            flex: 1, minWidth: 220,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', bgcolor: '#f8faff',
              '&:hover fieldset': { borderColor: '#2f80ed' },
              '&.Mui-focused fieldset': { borderColor: '#1e4fd8' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            startAdornment={<TuneOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8', mr: 0.5 }} />}
            sx={{
              borderRadius: '12px', bgcolor: '#f8faff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dbeafe' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f80ed' },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="salary">By Salary</MenuItem>
            <MenuItem value="title">By Title</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#1e4fd8' }} />
        </Box>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <Box sx={{
          textAlign: 'center', py: 10,
          bgcolor: '#f8faff', borderRadius: '16px',
          border: '1.5px dashed #dbeafe',
        }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '16px',
            bgcolor: '#dbeafe', mx: 'auto', mb: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WorkOutlineIcon sx={{ fontSize: 30, color: '#1e4fd8' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '1.1rem', mb: 0.5 }}>
            No jobs found
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            {search ? 'Try adjusting your search terms' : 'No jobs available at the moment'}
          </Typography>
          {search && (
            <Button onClick={() => setSearch('')} sx={{ mt: 2, textTransform: 'none', color: '#1e4fd8' }}>
              Clear search
            </Button>
          )}
        </Box>
      )}

      {/* Job cards grid */}
      {!loading && filtered.length > 0 && (
        <Grid container spacing={2}>
          {filtered.map((job) => (
            <Grid item xs={12} sm={6} lg={4} key={job._id}>
              <Box sx={{
                bgcolor: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #dbeafe',
                p: 2.5,
                height: '100%',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.22s',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#2f80ed',
                  boxShadow: '0 8px 28px rgba(10,36,99,0.1)',
                  transform: 'translateY(-3px)',
                },
              }}>
                {/* Card top */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '10px',
                    bgcolor: '#eff6ff', border: '1px solid #dbeafe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 22 }} />
                  </Box>
                  <Chip
                    label="Full-time"
                    size="small"
                    sx={{
                      bgcolor: '#eff6ff', color: '#1e4fd8',
                      fontWeight: 600, fontSize: '0.7rem',
                      border: '1px solid #dbeafe', borderRadius: '8px',
                    }}
                  />
                </Box>

                {/* Title + company */}
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a2463', mb: 0.3, lineHeight: 1.3 }}>
                  {job.title}
                </Typography>
                {job.companyName && (
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 1 }}>
                    {job.companyName}
                  </Typography>
                )}

                {/* Description */}
                <Typography sx={{
                  fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6,
                  mb: 1.5, flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {job.description}
                </Typography>

                {/* Skills */}
                {Array.isArray(job.skills) && job.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {job.skills.slice(0, 3).map((skill, i) => (
                      <Chip
                        key={i}
                        icon={<CodeOutlinedIcon sx={{ fontSize: '12px !important' }} />}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: '#f1f5f9', color: '#475569',
                          fontSize: '0.7rem', fontWeight: 500,
                          borderRadius: '6px', border: '1px solid #e2e8f0',
                        }}
                      />
                    ))}
                    {job.skills.length > 3 && (
                      <Chip label={`+${job.skills.length - 3}`} size="small"
                        sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontSize: '0.7rem', borderRadius: '6px' }} />
                    )}
                  </Box>
                )}

                <Divider sx={{ borderColor: '#f1f5f9', mb: 1.5 }} />

                {/* Footer: salary + location + apply */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    {job.salary && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <AttachMoneyOutlinedIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a2463' }}>
                          {job.salary}
                        </Typography>
                      </Box>
                    )}
                    {job.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {job.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none', fontWeight: 600,
                      fontSize: '0.8rem', px: 1.5, py: 0.7,
                      background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(31,79,216,0.25)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
                        transform: 'scale(1.03)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default JobList;