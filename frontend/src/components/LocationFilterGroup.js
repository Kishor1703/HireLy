import React, { useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckIcon from '@mui/icons-material/Check';

const LocationFilterGroup = ({
  options = [],
  selectedIds = [],
  onToggle,
  onClear,
  emptyLabel = 'No locations available',
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>

      {/* All Locations pill */}
      <Box
        onClick={onClear}
        onMouseEnter={() => setHoveredId('all')}
        onMouseLeave={() => setHoveredId(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          px: 1.5,
          py: 1,
          borderRadius: '10px',
          mb: 0.5,
          transition: 'all 0.18s ease',
          bgcolor: selectedIds.length === 0
            ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
            : hoveredId === 'all' ? '#f1f5f9' : 'transparent',
          background: selectedIds.length === 0
            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
            : hoveredId === 'all' ? '#f1f5f9' : 'transparent',
          border: `1.5px solid ${selectedIds.length === 0 ? '#93c5fd' : 'transparent'}`,
          boxShadow: selectedIds.length === 0 ? '0 2px 8px rgba(59,130,246,0.12)' : 'none',
        }}
      >
        {/* Dot indicator */}
        <Box sx={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${selectedIds.length === 0 ? '#2f80ed' : '#cbd5e1'}`,
          bgcolor: selectedIds.length === 0 ? '#2f80ed' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.18s ease',
        }}>
          {selectedIds.length === 0 && (
            <CheckIcon sx={{ fontSize: 11, color: '#fff' }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          <LocationOnIcon sx={{
            fontSize: 13,
            color: selectedIds.length === 0 ? '#2f80ed' : '#94a3b8',
            transition: 'color 0.18s ease',
          }} />
          <Typography sx={{
            fontSize: '0.82rem',
            fontWeight: selectedIds.length === 0 ? 700 : 500,
            color: selectedIds.length === 0 ? '#1e4fd8' : '#64748b',
            transition: 'all 0.18s ease',
          }}>
            All Locations
          </Typography>
        </Box>

        {selectedIds.length === 0 && (
          <Box sx={{
            px: 0.8,
            py: 0.2,
            borderRadius: '6px',
            bgcolor: '#2f80ed',
            ml: 'auto',
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
              ALL
            </Typography>
          </Box>
        )}
      </Box>

      {/* Subtle divider */}
      <Box sx={{ height: '1px', bgcolor: '#f1f5f9', mx: 1, mb: 0.5 }} />

      {/* Location options */}
      {options.length === 0 ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          gap: 1,
        }}>
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LocationOnIcon sx={{ fontSize: 18, color: '#cbd5e1' }} />
          </Box>
          <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            {emptyLabel}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {options.map((option) => {
            const isSelected = selectedIds.includes(option._id);
            const isHovered = hoveredId === option._id;

            return (
              <Box
                key={option._id}
                onClick={() => onToggle(option._id)}
                onMouseEnter={() => setHoveredId(option._id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  px: 1.5,
                  py: 0.9,
                  borderRadius: '10px',
                  transition: 'all 0.18s ease',
                  background: isSelected
                    ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                    : isHovered ? '#f8faff' : 'transparent',
                  border: `1.5px solid ${isSelected ? '#93c5fd' : isHovered ? '#e2e8f0' : 'transparent'}`,
                  boxShadow: isSelected ? '0 2px 6px rgba(59,130,246,0.1)' : 'none',
                }}
              >
                {/* Custom checkbox */}
                <Box sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '5px',
                  border: `2px solid ${isSelected ? '#2f80ed' : isHovered ? '#94a3b8' : '#cbd5e1'}`,
                  bgcolor: isSelected ? '#2f80ed' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}>
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 11, color: '#fff' }} />
                  )}
                </Box>

                {/* Location dot accent */}
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: isSelected ? '#2f80ed' : '#cbd5e1',
                  flexShrink: 0,
                  transition: 'background-color 0.18s ease',
                }} />

                <Typography sx={{
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#1e4fd8' : '#475569',
                  flex: 1,
                  transition: 'all 0.18s ease',
                  userSelect: 'none',
                }}>
                  {option.locationName}
                </Typography>

                {/* Selected count badge (optional visual flourish) */}
                {isSelected && (
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#2f80ed',
                    ml: 'auto',
                    flexShrink: 0,
                  }} />
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Footer: selected count */}
      {selectedIds.length > 0 && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1,
          pt: 1,
          borderTop: '1px solid #f1f5f9',
          px: 0.5,
        }}>
          <Typography sx={{ fontSize: '0.73rem', color: '#94a3b8' }}>
            {selectedIds.length} selected
          </Typography>
          <Box
            onClick={onClear}
            sx={{
              cursor: 'pointer',
              fontSize: '0.73rem',
              fontWeight: 600,
              color: '#2f80ed',
              '&:hover': { color: '#1e4fd8', textDecoration: 'underline' },
              transition: 'color 0.15s',
            }}
          >
            <Typography sx={{ fontSize: '0.73rem', fontWeight: 600, color: 'inherit' }}>
              Clear all
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LocationFilterGroup;