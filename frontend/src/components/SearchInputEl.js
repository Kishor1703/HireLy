import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, InputBase, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const validationSchema = yup.object({
  search: yup.string('Enter your search query').required('Please enter a search term'),
});

const SearchInputEl = () => {
  const navigate = useNavigate();

  const onSubmit = (values, actions) => {
    const { search } = values;
    if (search.trim()) {
      navigate(`/search/${search}`);
    } else {
      navigate('/');
    }
    actions.resetForm();
  };

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues: { search: '' },
    validationSchema,
    onSubmit,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: '95%', sm: '80%', md: '640px' },
        mx: 'auto', // centres inside the flex column header
      }}
    >
      {/* Search bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(255,255,255,0.97)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(10,36,99,0.25)',
        border: `1.5px solid ${touched.search && errors.search ? '#ef4444' : 'rgba(255,255,255,0.3)'}`,
        transition: 'all 0.2s',
        '&:focus-within': {
          boxShadow: '0 8px 40px rgba(10,36,99,0.35)',
          border: '1.5px solid rgba(47,128,237,0.5)',
        },
      }}>

        {/* Search icon */}
        <Box sx={{ pl: 2.5, pr: 1, display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
          <SearchOutlinedIcon sx={{ fontSize: 22 }} />
        </Box>

        {/* Input */}
        <InputBase
          fullWidth
          id="search"
          name="search"
          placeholder="Job title, skills, or company..."
          value={values.search}
          onChange={handleChange}
          sx={{
            flex: 1,
            py: 1.8, px: 1,
            fontSize: '1rem',
            color: '#0a2463',
            '& input::placeholder': { color: '#94a3b8', opacity: 1 },
          }}
        />

        {/* Search button */}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            m: 0.7,
            px: { xs: 2, sm: 3.5 },
            py: 1.4,
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
            boxShadow: '0 4px 14px rgba(31,79,216,0.35)',
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
              transform: 'scale(1.02)',
              boxShadow: '0 6px 18px rgba(10,36,99,0.4)',
            },
            '&:disabled': { background: '#93c5fd', boxShadow: 'none' },
            transition: 'all 0.2s',
          }}
        >
          Search Jobs
        </Button>
      </Box>

      {/* Validation error */}
      {touched.search && errors.search && (
        <Typography sx={{
          mt: 1, fontSize: '0.78rem',
          color: '#fca5a5', textAlign: 'left', pl: 1,
        }}>
          ⚠ {errors.search}
        </Typography>
      )}
    </Box>
  );
};

export default SearchInputEl;