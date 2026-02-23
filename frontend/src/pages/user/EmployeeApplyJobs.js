import React, { useEffect, useState } from 'react';
import { Box, Card, ListItemIcon, MenuItem, MenuList, Pagination, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { jobLoadAction } from '../../redux/actions/jobAction';
import { jobTypeLoadAction } from '../../redux/actions/jobTypeAction';
import SelectComponent from '../../components/SelectComponent';
import CardElement from '../../components/CardElement';
import LoadingBox from '../../components/LoadingBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EmployeeApplyJobs = () => {
  const { jobs, setUniqueLocation, pages, loading } = useSelector((state) => state.loadJobs);
  const { userInfo } = useSelector((state) => state.signIn || {});
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [cat, setCat] = useState('');
  const [location, setLocation] = useState('');
  const [keyword] = useState('');

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, location));
  }, [dispatch, page, keyword, cat, location]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [dispatch]);

  const handleChangeCategory = (e) => {
    setCat(e.target.value);
    setPage(1);
  };

  const applyToJob = async (jobId, resume, clearForm) => {
    try {
      await axios.post('/api/applications', { jobId, resume });
      alert('Application submitted successfully.');
      clearForm();
    } catch (error) {
      alert(error?.response?.data?.message || error?.response?.data?.error || 'Application failed');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#fafafa', mb: 2 }}>
        Apply Jobs
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
        <Box sx={{ flex: 2 }}>
          <Card sx={{ minWidth: 150, mb: 3, p: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                Filter by category
              </Typography>
            </Box>
            <SelectComponent handleChangeCategory={handleChangeCategory} cat={cat} />
          </Card>
          <Card sx={{ minWidth: 150, mb: 3, p: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                Filter by location
              </Typography>
              <MenuList>
                {setUniqueLocation &&
                  setUniqueLocation.map((loc, i) => (
                    <MenuItem key={i} onClick={() => { setLocation(loc); setPage(1); }}>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: palette.secondary.main, fontSize: 18 }} />
                      </ListItemIcon>
                      <Link to="#" onClick={(e) => e.preventDefault()}>{loc}</Link>
                    </MenuItem>
                  ))}
                <MenuItem onClick={() => { setLocation(''); setPage(1); }}>
                  <ListItemIcon>
                    <LocationOnIcon sx={{ color: palette.secondary.main, fontSize: 18 }} />
                  </ListItemIcon>
                  <Link to="#" onClick={(e) => e.preventDefault()}>All Locations</Link>
                </MenuItem>
              </MenuList>
            </Box>
          </Card>
        </Box>
        <Box sx={{ flex: 5 }}>
          {loading ? (
            <LoadingBox />
          ) : jobs && jobs.length === 0 ? (
            <Box
              sx={{
                minHeight: '250px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#fff',
              }}
            >
              <h2>No result found!</h2>
            </Box>
          ) : (
            jobs &&
            jobs.map((job, i) => (
              <CardElement
                key={i}
                id={job._id}
                jobTitle={job.title}
                description={job.description}
                category={job.jobType ? job.jobType.jobTypeName : 'No category'}
                location={job.location}
                canApply={userInfo && userInfo.role === 0}
                onApply={applyToJob}
              />
            ))
          )}
          <Stack spacing={2}>
            <Pagination page={page} count={pages === 0 ? 1 : pages} onChange={(event, value) => setPage(value)} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeApplyJobs;
