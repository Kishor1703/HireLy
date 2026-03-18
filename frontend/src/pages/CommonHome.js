import React, { useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const categories = [
  'Technology',
  'Design',
  'Finance',
  'Marketing',
  'Healthcare',
  'Remote',
];

const roleCards = [
  {
    title: 'Job Seeker',
    description: 'Browse jobs, apply quickly, and keep your application history in one place.',
    buttonLabel: 'Find Jobs',
    buttonTo: '/login?role=employee',
    buttonVariant: 'contained',
    icon: <PersonOutlineIcon sx={{ color: '#fff', fontSize: 24 }} />,
    accent: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
  },
  {
    title: 'Job Poster',
    description: 'Create listings, review candidates, and manage hiring from one dashboard.',
    buttonLabel: 'Post a Job',
    buttonTo: '/register?role=poster',
    buttonVariant: 'outlined',
    icon: <BusinessCenterOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />,
    accent: 'linear-gradient(135deg, #0a2463, #1e4fd8)',
  },
];

const steps = [
  {
    num: '01',
    title: 'Create Your Profile',
    description: 'Sign up in minutes and tell employers what you do best.',
    icon: <PersonOutlineIcon sx={{ color: '#fff', fontSize: 22 }} />,
  },
  {
    num: '02',
    title: 'Search Smarter',
    description: 'Use keywords, categories, and location filters to narrow the list fast.',
    icon: <SearchOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />,
  },
  {
    num: '03',
    title: 'Apply With Confidence',
    description: 'Track your activity and stay organized while companies review applications.',
    icon: <RocketLaunchOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />,
  },
];

const highlights = [
  { label: 'Simple job search', icon: <WorkOutlineIcon fontSize="small" /> },
  { label: 'Verified employers', icon: <VerifiedOutlinedIcon fontSize="small" /> },
  { label: 'Helpful dashboards', icon: <HandshakeOutlinedIcon fontSize="small" /> },
  { label: 'Easy account setup', icon: <TaskAltOutlinedIcon fontSize="small" /> },
];

const trustItems = [
  {
    title: 'Clear next steps',
    description: 'Users can immediately choose whether they want to apply for jobs or post them.',
    icon: <TaskAltOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 22 }} />,
  },
  {
    title: 'Focused experience',
    description: 'Search, filters, and dashboards are organized so people do not feel lost.',
    icon: <VerifiedOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 22 }} />,
  },
  {
    title: 'Supportive journey',
    description: 'Helpful copy and guided actions reduce confusion for first-time visitors.',
    icon: <SupportAgentOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 22 }} />,
  },
];

const CommonHome = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <NavBar />

      <Box
        ref={heroRef}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)',
          pt: 10,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage:
              'linear-gradient(rgba(31,79,216,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {[
          { w: 500, h: 500, top: '-120px', left: '-100px', opacity: 0.18 },
          { w: 400, h: 400, bottom: '-80px', right: '-80px', opacity: 0.12 },
          { w: 280, h: 280, top: '45%', left: '65%', opacity: 0.1 },
        ].map((blob, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: blob.w,
              height: blob.h,
              borderRadius: '50%',
              background: `rgba(47,128,237,${blob.opacity})`,
              filter: 'blur(80px)',
              top: blob.top,
              left: blob.left,
              bottom: blob.bottom,
              right: blob.right,
              zIndex: 0,
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 820, mx: 'auto' }}>
            <Chip
              label="Made for job seekers and employers"
              size="small"
              sx={{
                mb: 3,
                bgcolor: '#dbeafe',
                color: '#1e4fd8',
                fontWeight: 700,
                border: '1px solid rgba(31,79,216,0.18)',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.6rem', md: '4.4rem' },
                lineHeight: 1.06,
                letterSpacing: '-2px',
                color: '#0a2463',
                mb: 2,
              }}
            >
              Find the right job,
              <br />
              hire the right people.
            </Typography>

            <Typography
              sx={{
                color: '#64748b',
                fontSize: '1.08rem',
                lineHeight: 1.75,
                maxWidth: 620,
                mx: 'auto',
                mb: 4,
              }}
            >
              TalentSphere helps job seekers discover opportunities and helps companies post roles without a confusing setup.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
              <Button
                component={Link}
                to="/jobs"
                variant="contained"
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1.3,
                  background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                  boxShadow: '0 8px 22px rgba(31,79,216,0.25)',
                }}
              >
                Browse Jobs
              </Button>
              <Button
                component={Link}
                to="/register?role=poster"
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1.3,
                  borderColor: '#93c5fd',
                  color: '#1e4fd8',
                  '&:hover': { bgcolor: '#eff6ff', borderColor: '#1e4fd8' },
                }}
              >
                Start Hiring
              </Button>
            </Stack>

            <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
              {highlights.map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.76)',
                    border: '1px solid #dbeafe',
                    color: '#334155',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: '#1e4fd8' },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 5 }}>
            {roleCards.map((card) => (
              <Grid item xs={12} sm={6} md={5} key={card.title}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: '1.5px solid #dbeafe',
                    boxShadow: '0 8px 30px rgba(10,36,99,0.08)',
                    transition: 'all 0.25s',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 18px 38px rgba(10,36,99,0.12)',
                      borderColor: '#2f80ed',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.2 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '14px',
                        mb: 1.8,
                        background: card.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0a2463', mb: 0.6 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2.2, lineHeight: 1.7 }}>
                      {card.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={card.buttonTo}
                      variant={card.buttonVariant}
                      fullWidth
                      sx={{
                        borderRadius: '10px',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1,
                        ...(card.buttonVariant === 'contained'
                          ? {
                              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                              boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
                            }
                          : {
                              borderColor: '#1e4fd8',
                              color: '#1e4fd8',
                              '&:hover': { bgcolor: '#eff6ff', borderColor: '#0a2463', color: '#0a2463' },
                            }),
                      }}
                    >
                      {card.buttonLabel}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #dbeafe', py: 5 }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#94a3b8',
              mb: 3,
            }}
          >
            Popular Categories
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                component={Link}
                to="/jobs"
                clickable
                sx={{
                  bgcolor: '#eff6ff',
                  color: '#1e4fd8',
                  border: '1px solid #dbeafe',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  borderRadius: '100px',
                  px: 0.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#dbeafe',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(31,79,216,0.15)',
                  },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#eff6ff', py: 9 }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#2f80ed',
              mb: 1,
            }}
          >
            How It Works
          </Typography>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, color: '#0a2463', letterSpacing: '-1px', mb: 1 }}>
            Get started in 3 simple steps
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#64748b', mb: 5, fontSize: '1rem' }}>
            Everything is designed to get users from landing page to action with less friction.
          </Typography>

          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid item xs={12} md={4} key={step.num}>
                <Card
                  sx={{
                    borderRadius: '18px',
                    border: '1.5px solid #dbeafe',
                    boxShadow: 'none',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #2f80ed, #1e4fd8)',
                    },
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 32px rgba(10,36,99,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 16,
                        fontWeight: 800,
                        fontSize: '2.2rem',
                        color: 'rgba(0, 0, 0, 0.07)',
                      }}
                    >
                      {step.num}
                    </Typography>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        mb: 1.5,
                        background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5, fontSize: '1rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="stretch">
            {trustItems.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card sx={{ height: '100%', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: '#0a2463', mb: 0.6 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.92rem' }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          mx: { xs: 2, md: 6 },
          my: 7,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0a2463 0%, #1e4fd8 100%)',
          p: { xs: 4, md: 6 },
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', top: -180, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', bottom: -100, left: '15%' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-1px', mb: 0.75 }}>
            Ready to take the next step?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '1rem' }}>
            Create an account, browse open roles, or start posting jobs in just a few clicks.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              bgcolor: '#fff',
              color: '#1e4fd8',
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              py: 1.2,
              '&:hover': { bgcolor: '#eff6ff', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </Button>
          <Button
            component={Link}
            to="/jobs"
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              py: 1.2,
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              transition: 'all 0.2s',
            }}
          >
            Explore Jobs
          </Button>
        </Stack>
      </Box>

      <Footer />
    </>
  );
};

export default CommonHome;
