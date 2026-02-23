import * as React from 'react';
import { Box, Button, Chip, Typography, TextField, InputAdornment, Avatar } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { Link } from 'react-router-dom';

const CardElement = ({ jobTitle, description, category, location, companyName, companyLogo, id, canApply, onApply }) => {
  const [resume, setResume] = React.useState('');

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
          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1e4fd8', lineHeight: 1.2 }}>
            {companyName || 'Company not specified'}
          </Typography>
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

      {/* Resume input */}
      {canApply && (
        <TextField
          fullWidth size="small"
          placeholder="Paste your resume link..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkOutlinedIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px', bgcolor: '#f8faff', fontSize: '0.82rem',
              '&:hover fieldset': { borderColor: '#2f80ed' },
              '&.Mui-focused fieldset': { borderColor: '#1e4fd8' },
            },
          }}
        />
      )}

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          component={Link} to={`/job/${id}`}
          variant="outlined" size="small"
          endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: '13px !important' }} />}
          sx={{
            flex: canApply ? 1 : 'unset',
            borderRadius: '10px', textTransform: 'none',
            fontWeight: 600, fontSize: '0.82rem',
            borderColor: '#dbeafe', color: '#1e4fd8',
            px: 2,
            '&:hover': { bgcolor: '#eff6ff', borderColor: '#2f80ed' },
          }}
        >
          Details
        </Button>

        {canApply && (
          <Button
            variant="contained" size="small"
            disabled={!resume.trim()}
            onClick={() => onApply && onApply(id, resume, () => setResume(''))}
            endIcon={<SendOutlinedIcon sx={{ fontSize: '13px !important' }} />}
            sx={{
              flex: 1, borderRadius: '10px',
              textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
              boxShadow: '0 2px 8px rgba(31,79,216,0.2)',
              '&:hover': { background: 'linear-gradient(135deg, #1e4fd8, #0a2463)' },
              '&:disabled': { background: '#bfdbfe', boxShadow: 'none' },
              transition: 'all 0.2s',
            }}
          >
            Apply
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CardElement;