import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import {
  Box, Card, Container, Stack, Typography,
  Chip, Divider, Pagination,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { jobLoadAction } from '../redux/actions/jobAction';
import { useParams } from 'react-router-dom';
import CardElement from '../components/CardElement';
import Footer from '../components/Footer';
import LoadingBox from '../components/LoadingBox';
import SelectComponent from '../components/SelectComponent';
import { jobTypeLoadAction } from '../redux/actions/jobTypeAction';
import LocationFilterGroup from '../components/LocationFilterGroup';

// Icons
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

const SidebarCard = ({ icon, title, children, accent = '#2f80ed' }) => (
  <Card
    elevation={0}
    sx={{
      mb: 2.5,
      mt: 2,
      borderRadius: '16px',
      border: '1px solid #e8f0fe',
      bgcolor: '#ffffff',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(31,79,216,0.06)',
      transition: 'box-shadow 0.2s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(31,79,216,0.1)',
      },
    }}
  >
    {/* Card header strip */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`,
        borderBottom: `1px solid ${accent}18`,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '8px',
          bgcolor: `${accent}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 15, color: accent } })}
      </Box>
      <Typography
        sx={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#0a2463',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </Typography>
    </Box>

    {/* Card body */}
    <Box sx={{ px: 2, py: 1.5 }}>{children}</Box>
  </Card>
);

const EmptyState = () => (
  <Box
    sx={{
      minHeight: '420px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      borderRadius: '20px',
      border: '1.5px dashed #dbeafe',
      bgcolor: '#f8fbff',
      mt: 2,
      p: 4,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(59,130,246,0.15)',
      }}
    >
      <SearchOffOutlinedIcon sx={{ fontSize: 30, color: '#3b82f6' }} />
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0a2463', mb: 0.5 }}>
        No jobs found
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 240 }}>
        Try adjusting your filters or search terms to find more results.
      </Typography>
    </Box>
  </Box>
);

const Home = () => {
  const { jobs, setUniqueLocation, pages, loading } = useSelector((state) => state.loadJobs);
//   const { palette } = useTheme();
  const dispatch = useDispatch();
  const { keyword, location: routeLocation } = useParams();

  const [page, setPage] = useState(1);
  const [cat, setCat] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, selectedLocations));
  }, [dispatch, page, keyword, cat, selectedLocations]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [dispatch]);

  useEffect(() => {
    if (!routeLocation || !Array.isArray(setUniqueLocation) || setUniqueLocation.length === 0) return;
    const routeNames = routeLocation.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
    const matchedIds = setUniqueLocation
      .filter((item) => routeNames.includes(item.locationName.toLowerCase()))
      .map((item) => item._id);
    setSelectedLocations(matchedIds);
    setPage(1);
  }, [routeLocation, setUniqueLocation]);

  const handleChangeCategory = (e) => {
    setCat(e.target.value);
    setPage(1);
  };

  const handleToggleLocation = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
    );
    setPage(1);
  };

  const activeFiltersCount = (cat ? 1 : 0) + selectedLocations.length;

  return (
    <>
      <Box
        sx={{
          bgcolor: '#eef5ff',
          minHeight: '100vh',
          backgroundImage: `
            radial-gradient(ellipse at 10% 20%, rgba(47,128,237,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(10,36,99,0.04) 0%, transparent 50%)
          `,
        }}
      >
        <NavBar />
        <Header />

        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems="flex-start"
          >
            {/* ── Sidebar ── */}
            <Box sx={{ flex: '0 0 260px', width: { xs: '100%', md: '260px' } }}>

              {/* Active filters badge */}
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 2,
                    mb: 0.5,
                    px: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <TuneOutlinedIcon sx={{ fontSize: 14, color: '#2f80ed' }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2f80ed' }}>
                      Active filters
                    </Typography>
                  </Box>
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      bgcolor: '#2f80ed',
                      color: '#fff',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                </Box>
              )}

              {/* Category filter card */}
              <SidebarCard icon={<CategoryOutlinedIcon />} title="Filter by Category" accent="#2f80ed">
                <SelectComponent handleChangeCategory={handleChangeCategory} cat={cat} />
              </SidebarCard>

              {/* Location filter card */}
              <SidebarCard icon={<LocationOnOutlinedIcon />} title="Filter by Location" accent="#0a2463">
                <LocationFilterGroup
                  options={setUniqueLocation || []}
                  selectedIds={selectedLocations}
                  onToggle={handleToggleLocation}
                  onClear={() => {
                    setSelectedLocations([]);
                    setPage(1);
                  }}
                />
              </SidebarCard>
            </Box>

            {/* ── Job listings ── */}
            <Box sx={{ flex: 1, minWidth: 0, pt: { xs: 0, md: 2 } }}>

              {/* Results header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  mt: { xs: 1, md: 0.5 },
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkOutlineIcon sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                    {loading
                      ? 'Loading jobs...'
                      : jobs?.length
                        ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`
                        : 'No results'}
                  </Typography>
                </Box>

                {keyword && (
                  <Chip
                    label={`"${keyword}"`}
                    size="small"
                    sx={{
                      bgcolor: '#eff6ff',
                      color: '#1e4fd8',
                      border: '1px solid #bfdbfe',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Box>

              <Divider sx={{ borderColor: '#dbeafe', mb: 2.5 }} />

              {/* Job cards or states */}
              {loading ? (
                <LoadingBox />
              ) : jobs && jobs.length === 0 ? (
                <EmptyState />
              ) : (
                <Stack spacing={2}>
                  {jobs && jobs.map((job, i) => (
                    <CardElement
                      key={i}
                      id={job._id}
                      jobTitle={job.title}
                      description={job.description}
                      companyName={job.companyName}
                      companyLogo={job.companyLogo}
                      companyVerified={Boolean(job?.user?.companyVerified)}
                      category={job.jobType ? job.jobType.jobTypeName : 'No category'}
                      location={job.location}
                    />
                  ))}
                </Stack>
              )}

              {/* Pagination */}
              {!loading && jobs && jobs.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '14px',
                      border: '1px solid #e8f0fe',
                      px: 2,
                      py: 1,
                      boxShadow: '0 2px 10px rgba(31,79,216,0.06)',
                    }}
                  >
                    <Pagination
                      page={page}
                      count={pages === 0 ? 1 : pages}
                      onChange={(_, value) => setPage(value)}
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          color: '#64748b',
                          '&:hover': { bgcolor: '#eff6ff', color: '#2f80ed' },
                        },
                        '& .Mui-selected': {
                          bgcolor: '#2f80ed !important',
                          color: '#fff !important',
                          boxShadow: '0 2px 8px rgba(47,128,237,0.3)',
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Home;