import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminLocation = () => {
  const [locationName, setLocationName] = useState('');
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadLocations = async () => {
    try {
      const { data } = await axios.get('/api/location/jobs');
      setLocations(data?.jobLocations || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load locations');
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const createLocation = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await axios.post('/api/location/create', { locationName });
      setMessage('Location added successfully');
      setLocationName('');
      loadLocations();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    setError('');
    setMessage('');
    try {
      await axios.delete(`/api/location/delete/${id}`);
      setMessage('Location deleted');
      loadLocations();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to delete location');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#fafafa', mb: 2 }}>
        Location Management
      </Typography>
      {message && <Typography sx={{ color: '#4caf50', mb: 2 }}>{message}</Typography>}
      {error && <Typography sx={{ color: '#ff5252', mb: 2 }}>{error}</Typography>}

      <Box component="form" onSubmit={createLocation} sx={{ mb: 3, maxWidth: 500 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Location Name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </Stack>
      </Box>

      <List sx={{ bgcolor: '#ffffff', borderRadius: 1 }}>
        {locations.map((location) => (
          <ListItem
            key={location._id}
            secondaryAction={(
              <IconButton edge="end" color="error" onClick={() => deleteLocation(location._id)}>
                <DeleteIcon />
              </IconButton>
            )}
          >
            <ListItemText primary={location.locationName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminLocation;
