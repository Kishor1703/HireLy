import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Stack, Pagination, Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { jobLoadAction } from '../../redux/actions/jobAction';
import { jobTypeLoadAction } from '../../redux/actions/jobTypeAction';
import SelectComponent from '../../components/SelectComponent';
import CardElement from '../../components/CardElement';
import LoadingBox from '../../components/LoadingBox';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import LocationFilterGroup from '../../components/LocationFilterGroup';

const EmployeeApplyJobs = () => {
  const { jobs, setUniqueLocation, pages, loading } = useSelector((state) => state.loadJobs);
  const dispatch = useDispatch();

  const [page, setPage]         = useState(1);
  const [cat, setCat]           = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [keyword]               = useState('');

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, selectedLocations));
  }, [dispatch, page, keyword, cat, selectedLocations]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [dispatch]);

  const handleChangeCategory = (e) => { setCat(e.target.value); setPage(1); };
  const handleToggleLocation = (locationId) => {
    setSelectedLocations((prev) => (
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    ));
    setPage(1);
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
            Browse & Apply Jobs
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            {loading ? 'Loading...' : `${jobs?.length || 0} job${jobs?.length !== 1 ? 's' : ''} found`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="flex-start">

        {/* ── SIDEBAR FILTERS ── */}
        <Box sx={{ width: { xs: '100%', sm: 220 }, flexShrink: 0 }}>

          {/* Filter header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2 }}>
            <TuneOutlinedIcon sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Filters
            </Typography>
          </Box>

          {/* Category filter */}
          <Box sx={{
            bgcolor: '#fff', borderRadius: '14px',
            border: '1.5px solid #dbeafe', p: 2, mb: 2,
          }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0a2463', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Category
            </Typography>
            <SelectComponent handleChangeCategory={handleChangeCategory} cat={cat} />
          </Box>

          {/* Location filter */}
          <Box sx={{
            bgcolor: '#fff', borderRadius: '14px',
            border: '1.5px solid #dbeafe', p: 2,
          }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0a2463', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Location
            </Typography>
            <LocationFilterGroup
              options={setUniqueLocation || []}
              selectedIds={selectedLocations}
              onToggle={handleToggleLocation}
              onClear={() => { setSelectedLocations([]); setPage(1); }}
            />
          </Box>
        </Box>

        {/* ── JOB LISTINGS ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <LoadingBox />
          ) : jobs && jobs.length === 0 ? (
            <Box sx={{
              textAlign: 'center', py: 10,
              bgcolor: '#f8faff', borderRadius: '16px',
              border: '1.5px dashed #dbeafe',
            }}>
              <Box sx={{
                width: 60, height: 60, borderRadius: '14px',
                bgcolor: '#dbeafe', mx: 'auto', mb: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SearchOffOutlinedIcon sx={{ fontSize: 28, color: '#1e4fd8' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '1.05rem', mb: 0.5 }}>
                No jobs found
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Try adjusting your filters or check back later
              </Typography>
            </Box>
          ) : (
            jobs && jobs.map((job, i) => (
              <CardElement
                key={i}
                id={job._id}
                jobTitle={job.title}
                description={job.description}
                category={job.jobType ? job.jobType.jobTypeName : 'No category'}
                location={job.location}
                companyName={job.companyName || job?.user?.companyName}
                companyLogo={job.companyLogo || job?.user?.companyLogo}
              />
            ))
          )}

          {/* Pagination */}
          {!loading && jobs && jobs.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                page={page}
                count={pages === 0 ? 1 : pages}
                onChange={(event, value) => setPage(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '10px',
                    fontWeight: 600, fontSize: '0.85rem',
                    color: '#64748b',
                    border: '1px solid #dbeafe',
                    '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8', borderColor: '#2f80ed' },
                    '&.Mui-selected': {
                      bgcolor: '#1e4fd8', color: '#fff',
                      borderColor: '#1e4fd8',
                      '&:hover': { bgcolor: '#0a2463' },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeApplyJobs;
