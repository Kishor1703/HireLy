import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminCategory = () => {
  const [jobTypeName, setJobTypeName] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get('/api/type/jobs');
      setCategories(data?.jobT || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await axios.post('/api/type/create', { jobTypeName });
      setMessage('Category added successfully');
      setJobTypeName('');
      loadCategories();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setError('');
    setMessage('');
    try {
      await axios.delete(`/api/type/delete/${id}`);
      setMessage('Category deleted');
      loadCategories();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#fafafa', mb: 2 }}>
        Category Management
      </Typography>
      {message && <Typography sx={{ color: '#4caf50', mb: 2 }}>{message}</Typography>}
      {error && <Typography sx={{ color: '#ff5252', mb: 2 }}>{error}</Typography>}

      <Box component="form" onSubmit={createCategory} sx={{ mb: 3, maxWidth: 500 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Category Name"
            value={jobTypeName}
            onChange={(e) => setJobTypeName(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </Stack>
      </Box>

      <List sx={{ bgcolor: '#ffffff', borderRadius: 1 }}>
        {categories.map((cat) => (
          <ListItem
            key={cat._id}
            secondaryAction={
              <IconButton edge="end" color="error" onClick={() => deleteCategory(cat._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={cat.jobTypeName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminCategory;
