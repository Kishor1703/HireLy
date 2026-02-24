import React, { useEffect, useRef } from 'react';
import {
  Box, Button, Card, CardContent, Container,
  Stack, Typography, Chip, Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const stats = [
  { value: '1.2M+', label: 'Active Jobs' },
  { value: '340K+', label: 'Companies' },
  { value: '5M+',   label: 'Job Seekers' },
];

const categories = [
  { icon: '💻', label: 'Technology' },
  { icon: '🎨', label: 'Design' },
  { icon: '📊', label: 'Finance' },
  { icon: '📣', label: 'Marketing' },
  { icon: '🏥', label: 'Healthcare' },
  { icon: '🌐', label: 'Remote' },
];

const CommonHome = () => {
  const heroRef = useRef(null);

  // subtle parallax on scroll
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

      {/* ── HERO ──────────────────────────────────────── */}
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
        {/* Grid overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(31,79,216,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(31,79,216,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Blobs */}
        {[
          { w: 500, h: 500, top: '-120px', left: '-100px', opacity: 0.18 },
          { w: 400, h: 400, bottom: '-80px', right: '-80px', opacity: 0.12 },
          { w: 280, h: 280, top: '45%',  left: '65%',  opacity: 0.1 },
        ].map((b, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: b.w, height: b.h,
            borderRadius: '50%',
            background: `rgba(47,128,237,${b.opacity})`,
            filter: 'blur(80px)',
            top: b.top, left: b.left,
            bottom: b.bottom, right: b.right,
            zIndex: 0,
            animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
            '@keyframes float0': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-28px)' } },
            '@keyframes float1': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(28px)' } },
            '@keyframes float2': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
          }} />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 6 }}>

          {/* Badge */}
          <Chip
            label="✦  50,000+ Jobs Added This Week"
            size="small"
            sx={{
              mb: 3,
              bgcolor: '#dbeafe', color: '#1e4fd8',
              fontWeight: 600, fontSize: '0.8rem',
              border: '1px solid rgba(31,79,216,0.2)',
              borderRadius: '100px', px: 1,
              animation: 'fadeUp 0.7s 0.1s both',
              '@keyframes fadeUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to:   { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          />

          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              lineHeight: 1.08,
              letterSpacing: '-2px',
              color: '#0a2463',
              mb: 2,
              animation: 'fadeUp 0.7s 0.25s both',
            }}
          >
            Welcome to{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              TalentSphere
            </Box>
            <br />Your Career Awaits
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b', fontSize: '1.1rem', lineHeight: 1.75,
              maxWidth: 520, mx: 'auto', mb: 4,
              animation: 'fadeUp 0.7s 0.4s both',
            }}
          >
            One portal for Job Seekers and Job Posters. Browse thousands of opportunities,
            manage postings, and find the perfect match — all in one place.
          </Typography>

          {/* Role Cards */}
          <Grid
            container spacing={2}
            justifyContent="center"
            sx={{ mb: 4, animation: 'fadeUp 0.7s 0.55s both' }}
          >
            {/* Employee Card */}
            <Grid item xs={12} sm={5}>
              <Card sx={{
                borderRadius: '18px',
                border: '1.5px solid #dbeafe',
                boxShadow: '0 4px 30px rgba(10,36,99,0.08)',
                transition: 'all 0.25s',
                cursor: 'pointer',
                textAlign: 'left',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 40px rgba(10,36,99,0.14)',
                  borderColor: '#2f80ed',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '12px', mb: 1.5,
                    background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>👤</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5 }}>
                    Job Seeker
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.6 }}>
                    Browse jobs, apply in one click, and track your application history.
                  </Typography>
                  <Button
                    component={Link}
                    to="/login?role=employee"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '10px', fontWeight: 600,
                      background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                      textTransform: 'none', py: 1,
                      boxShadow: '0 4px 14px rgba(31,79,216,0.3)',
                      '&:hover': { background: 'linear-gradient(135deg, #1e4fd8, #0a2463)' },
                    }}
                  >
                    Employee Login
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Job Poster Card */}
            <Grid item xs={12} sm={5}>
              <Card sx={{
                borderRadius: '18px',
                border: '1.5px solid #dbeafe',
                boxShadow: '0 4px 30px rgba(10,36,99,0.08)',
                transition: 'all 0.25s',
                cursor: 'pointer',
                textAlign: 'left',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 40px rgba(10,36,99,0.14)',
                  borderColor: '#2f80ed',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '12px', mb: 1.5,
                    background: 'linear-gradient(135deg, #0a2463, #1e4fd8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>🏢</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5 }}>
                    Job Poster
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.6 }}>
                    Post jobs, manage listings, and find the right candidates fast.
                  </Typography>
                  <Button
                    component={Link}
                    to="/login?role=jobPoster"
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderRadius: '10px', fontWeight: 600,
                      borderColor: '#1e4fd8', color: '#1e4fd8',
                      textTransform: 'none', py: 1,
                      '&:hover': { bgcolor: '#eff6ff', borderColor: '#0a2463', color: '#0a2463' },
                    }}
                  >
                    Job Poster Login
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Browse Jobs CTA */}
          <Box sx={{ animation: 'fadeUp 0.7s 0.7s both' }}>
            <Button
              component={Link}
              to="/jobs"
              variant="text"
              sx={{
                color: '#1e4fd8', fontWeight: 600, fontSize: '0.95rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Or browse jobs without signing in →
            </Button>
          </Box>

          {/* Stats */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={{ xs: 3, md: 6 }}
            sx={{ mt: 6, animation: 'fadeUp 0.7s 0.85s both' }}
          >
            {stats.map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{
                  fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' },
                  color: '#0a2463', lineHeight: 1,
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.4 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── CATEGORIES STRIP ──────────────────────────── */}
      <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #dbeafe', py: 5 }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              textAlign: 'center', fontSize: '0.75rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '3px',
              color: '#94a3b8', mb: 3,
            }}
          >
            Popular Categories
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {categories.map((c) => (
              <Chip
                key={c.label}
                label={`${c.icon}  ${c.label}`}
                component={Link}
                to="/jobs"
                clickable
                sx={{
                  bgcolor: '#eff6ff', color: '#1e4fd8',
                  border: '1px solid #dbeafe',
                  fontWeight: 500, fontSize: '0.88rem',
                  borderRadius: '100px', px: 0.5,
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

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <Box sx={{ bgcolor: '#eff6ff', py: 9 }}>
        <Container maxWidth="md">
          <Typography sx={{
            textAlign: 'center', fontSize: '0.75rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '3px',
            color: '#2f80ed', mb: 1,
          }}>
            How It Works
          </Typography>
          <Typography variant="h4" sx={{
            textAlign: 'center', fontWeight: 800,
            color: '#0a2463', letterSpacing: '-1px', mb: 1,
          }}>
            Get hired in 3 simple steps
          </Typography>
          <Typography sx={{
            textAlign: 'center', color: '#64748b',
            mb: 5, fontSize: '1rem',
          }}>
            TalentSphere makes finding your next role fast and effortless.
          </Typography>

          <Grid container spacing={3}>
            {[
              { icon: '👤', num: '01', title: 'Create Your Profile', desc: 'Sign up and build a profile that showcases your skills and experience in minutes.' },
              { icon: '🔍', num: '02', title: 'Discover Opportunities', desc: 'Browse thousands of curated listings matched to your skills and location.' },
              { icon: '🚀', num: '03', title: 'Apply & Get Hired', desc: 'One-click apply, track applications, and land interviews at top companies.' },
            ].map((step) => (
              <Grid item xs={12} sm={4} key={step.num}>
                <Card sx={{
                  borderRadius: '18px',
                  border: '1.5px solid #dbeafe',
                  boxShadow: 'none',
                  height: '100%',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.25s',
                  '&::before': {
                    content: '""', position: 'absolute',
                    top: 0, left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg, #2f80ed, #1e4fd8)',
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 32px rgba(10,36,99,0.1)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{
                      position: 'absolute', top: 12, right: 16,
                      fontWeight: 800, fontSize: '2.2rem',
                      color: 'rgba(31,79,216,0.07)',
                    }}>
                      {step.num}
                    </Typography>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '12px', mb: 1.5,
                      background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0a2463', mb: 0.5, fontSize: '1rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <Box sx={{
        mx: { xs: 2, md: 6 }, my: 7,
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #0a2463 0%, #1e4fd8 100%)',
        p: { xs: 4, md: 6 },
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between',
        gap: 3, position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', top: -180, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', bottom: -100, left: '15%' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-1px', mb: 0.75 }}>
            Ready to land your dream job?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
            Join 5 million professionals who found their next opportunity on TalentSphere.
          </Typography>
        </Box>

        <Stack direction="row" gap={1.5} sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            component={Link} to="/login?role=employee"
            variant="contained"
            sx={{
              bgcolor: '#fff', color: '#1e4fd8',
              borderRadius: '10px', fontWeight: 700,
              textTransform: 'none', px: 3, py: 1.2,
              '&:hover': { bgcolor: '#eff6ff', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
              transition: 'all 0.2s',
            }}
          >
            Get Started Free
          </Button>
          <Button
            component={Link} to="/jobs"
            variant="outlined"
            sx={{
              color: '#fff', borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: '10px', fontWeight: 700,
              textTransform: 'none', px: 3, py: 1.2,
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              transition: 'all 0.2s',
            }}
          >
            Browse Jobs
          </Button>
        </Stack>
      </Box>

      <Footer />
    </>
  );
};

export default CommonHome;
