import * as React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { Link } from 'react-router-dom';

const CardElement = ({ jobTitle, description, category, location, companyName, companyLogo, companyVerified, id }) => {
  const shortDesc = description && typeof description === 'string'
    ? description.split(' ').slice(0, 20).join(' ') + '...'
    : 'No description available';

  return (
    <Box sx={{
      bgcolor: '#fff',
      borderRadius: '16px',
      border: '1.5px solid #dbeafe',
      p: 2.5,
      mb: 2,
      transition: 'all 0.22s',
      '&:hover': {
        borderColor: '#2f80ed',
        boxShadow: '0 6px 24px rgba(10,36,99,0.1)',
        transform: 'translateY(-2px)',
      },
    }}>

      {/* Header row: logo + company + category */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        {/* Logo */}
        <Box sx={{
          width: 42, height: 42, borderRadius: '10px', flexShrink: 0,
          bgcolor: '#eff6ff', border: '1px solid #dbeafe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {companyLogo
            ? <Box component="img" src={companyLogo} alt={companyName}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <BusinessOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 20 }} />
          }
        </Box>

        {/* Company + location */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1e4fd8', lineHeight: 1.2 }}>
              {companyName || 'Company not specified'}
            </Typography>
            {companyVerified && (
              <Chip
                size="small"
                icon={<VerifiedOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                label="Verified"
                sx={{
                  height: 20,
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  bgcolor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  '& .MuiChip-label': { px: 0.8 },
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.2 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {location || 'Location not specified'}
            </Typography>
          </Box>
        </Box>

        {/* Category chip */}
        {category && (
          <Chip label={category} size="small" sx={{
            bgcolor: '#eff6ff', color: '#1e4fd8', fontWeight: 600,
            fontSize: '0.7rem', border: '1px solid #dbeafe',
            borderRadius: '8px', flexShrink: 0, maxWidth: 120,
          }} />
        )}
      </Box>

      {/* Job title */}
      <Typography sx={{
        fontWeight: 700, fontSize: '1.05rem',
        color: '#0a2463', lineHeight: 1.3, mb: 1,
      }}>
        {jobTitle}
      </Typography>

      {/* Description */}
      <Typography sx={{
        fontSize: '0.82rem', color: '#64748b',
        lineHeight: 1.65, mb: 2,
      }}>
        {shortDesc}
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {id ? (
          <Button
            component={Link} to={`/job/${id}`}
            variant="outlined" size="small"
            endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: '13px !important' }} />}
            sx={{
              flex: 1,
              borderRadius: '10px', textTransform: 'none',
              fontWeight: 600, fontSize: '0.82rem',
              borderColor: '#dbeafe', color: '#1e4fd8',
              px: 2,
              '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
            }}
          >
            Details
          </Button>
        ) : (
          <Button
            variant="outlined" size="small" disabled
            sx={{
              flex: 1,
              borderRadius: '10px', textTransform: 'none',
              fontWeight: 600, fontSize: '0.82rem',
              borderColor: '#dbeafe', color: '#94a3b8',
              px: 2,
            }}
          >
            Details unavailable
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CardElement;
