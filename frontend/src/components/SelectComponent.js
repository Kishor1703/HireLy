import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const SelectComponent = ({ handleChangeCategory, cat }) => {
  const { jobType } = useSelector((state) => state.jobTypeAll);

  return (
    <Box sx={{ minWidth: 180 }}>
      {/* Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.75 }}>
        <CategoryOutlinedIcon sx={{ fontSize: 14, color: '#64748b' }} />
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
          Category
        </Typography>
      </Box>

      <FormControl fullWidth>
        <Select
          value={cat}
          onChange={handleChangeCategory}
          displayEmpty
          sx={{
            borderRadius: '12px',
            bgcolor: '#f8faff',
            fontSize: '0.88rem',
            color: '#0a2463',
            fontWeight: 500,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dbeafe',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2f80ed',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1e4fd8',
              borderWidth: '2px',
            },
            '& .MuiSelect-icon': {
              color: '#94a3b8',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '14px',
                mt: 0.75,
                boxShadow: '0 8px 32px rgba(10,36,99,0.12)',
                border: '1px solid #dbeafe',
                '& .MuiMenuItem-root': {
                  fontSize: '0.88rem',
                  color: '#334155',
                  borderRadius: '8px',
                  mx: 0.5,
                  my: 0.2,
                  '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' },
                  '&.Mui-selected': {
                    bgcolor: '#dbeafe',
                    color: '#1e4fd8',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#bfdbfe' },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94a3b8' }} />
              All Categories
            </Box>
          </MenuItem>

          {jobType && jobType.map((jt) => (
            <MenuItem key={jt._id} value={jt._id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2f80ed' }} />
                {jt.jobTypeName}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectComponent;