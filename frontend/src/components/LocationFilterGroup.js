import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';

const LocationFilterGroup = ({ options = [], selectedIds = [], onToggle, onClear, emptyLabel = 'No locations available' }) => (
  <Box>
    <Box
      onClick={onClear}
      sx={{
        cursor: 'pointer',
        mb: 1,
        px: 1,
        py: 0.8,
        borderRadius: '8px',
        bgcolor: selectedIds.length === 0 ? '#dbeafe' : '#f8faff',
        border: `1px solid ${selectedIds.length === 0 ? '#bfdbfe' : '#e2e8f0'}`,
      }}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: selectedIds.length === 0 ? '#1e4fd8' : '#64748b' }}>
        All Locations
      </Typography>
    </Box>

    {options.length === 0 ? (
      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
        {emptyLabel}
      </Typography>
    ) : (
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option._id}
            control={(
              <Checkbox
                checked={selectedIds.includes(option._id)}
                onChange={() => onToggle(option._id)}
                size="small"
              />
            )}
            label={option.locationName}
            sx={{
              alignItems: 'flex-start',
              m: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.82rem',
                color: '#475569',
                pt: '2px',
              },
            }}
          />
        ))}
      </FormGroup>
    )}
  </Box>
);

export default LocationFilterGroup;
