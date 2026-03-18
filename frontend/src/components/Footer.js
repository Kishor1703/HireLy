import { Box, Typography, Divider, IconButton, Stack } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import logoDashboard from '../images/hr-project.png';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const footerLinks = [
  { label: 'Browse Jobs', to: '/jobs' },
  { label: 'Post a Job', to: '/register?role=poster' },
  { label: 'Sign In', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'Admin Login', to: '/admin/login' },
];

const helpLinks = [
  { label: 'Job Seeker Login', to: '/login?role=employee' },
  { label: 'Employer Access', to: '/login?role=jobPoster' },
  { label: 'Create Employer Account', to: '/register?role=poster' },
];

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #0a2463 0%, #061848 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          filter: 'blur(100px)',
          background: 'rgba(47,128,237,0.12)',
          bottom: -120,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 8 }, pt: 5, pb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4, mb: 4 }}>
          <Box sx={{ maxWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }}
              >
                <Box component="img" src={logoDashboard} alt="TalentSphere" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.5px', '& span': { color: 'rgba(255,255,255,0.45)' } }}>
                Talent<span>Sphere</span>
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.8 }}>
              A simpler hiring experience for job seekers, employers, and teams that need a clean path from visit to action.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[LinkedInIcon, TwitterIcon, InstagramIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.45)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    p: 0.8,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#fff',
                      bgcolor: 'rgba(47,128,237,0.25)',
                      borderColor: 'rgba(47,128,237,0.4)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2px', mb: 1.5 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {footerLinks.map((link) => (
                <Box
                  key={link.label}
                  component={Link}
                  to={link.to}
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': { color: '#fff', pl: 0.5 },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2px', mb: 1.5 }}>
              Helpful Starts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {helpLinks.map((link) => (
                <Box
                  key={link.label}
                  component={Link}
                  to={link.to}
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': { color: '#fff', pl: 0.5 },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.34)' }}>
            Copyright {new Date().getFullYear()} TalentSphere. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Typography
                key={item}
                sx={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.34)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'rgba(255,255,255,0.7)' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
