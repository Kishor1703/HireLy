import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { CUSTOM_FIELD_TYPES } from '../utils/applicationForm';

const builderFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#fff',
  },
};

const createCustomField = (index) => ({
  id: `custom_field_${Date.now()}_${index}`,
  label: '',
  type: 'text',
  required: false,
  enabled: true,
  system: false,
  options: [],
  placeholder: '',
});

const ApplicationFormBuilder = ({ value = [], onChange }) => {
  const handleFieldChange = (index, updates) => {
    onChange(value.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...updates } : field)));
  };

  const addField = () => {
    onChange([...value, createCustomField(value.length + 1)]);
  };

  const removeField = (index) => {
    onChange(value.filter((_, fieldIndex) => fieldIndex !== index));
  };

  return (
    <Box sx={{ border: '1px solid #dbeafe', borderRadius: '16px', bgcolor: '#f8fbff', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TuneOutlinedIcon sx={{ color: '#1e4fd8', fontSize: 18 }} />
        <Typography sx={{ fontWeight: 700, color: '#0a2463' }}>Application Form</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mb: 2 }}>
        Default fields are ready to use. You can rename them, mark them required, hide optional ones, and add custom questions.
      </Typography>

      <Stack spacing={1.5}>
        {value.map((field, index) => (
          <Box key={`${field.id}-${index}`} sx={{ bgcolor: '#fff', border: '1px solid #dbeafe', borderRadius: '14px', p: 1.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
              <TextField
                label="Field label"
                value={field.label}
                onChange={(event) => handleFieldChange(index, { label: event.target.value })}
                fullWidth
                sx={builderFieldSx}
              />
              <TextField
                select
                label="Field type"
                value={field.type}
                onChange={(event) => handleFieldChange(index, {
                  type: event.target.value,
                  options: event.target.value === 'select' ? (field.options?.length ? field.options : ['Option 1']) : [],
                })}
                disabled={field.system}
                sx={{ minWidth: { md: 170 }, ...builderFieldSx }}
              >
                {field.system ? (
                  <MenuItem value={field.type}>{field.type}</MenuItem>
                ) : (
                  CUSTOM_FIELD_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))
                )}
              </TextField>
              {!field.system && (
                <IconButton color="error" onClick={() => removeField(index)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              )}
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 1.5 }}>
              <TextField
                label="Placeholder"
                value={field.placeholder || ''}
                onChange={(event) => handleFieldChange(index, { placeholder: event.target.value })}
                fullWidth
                sx={builderFieldSx}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { md: 280 } }}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={field.enabled}
                      onChange={(event) => handleFieldChange(index, { enabled: event.target.checked })}
                      disabled={field.id === 'email' || field.id === 'resume'}
                    />
                  )}
                  label="Show field"
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={field.required}
                      onChange={(event) => handleFieldChange(index, { required: event.target.checked })}
                      disabled={field.id === 'email' || field.id === 'resume'}
                    />
                  )}
                  label="Required"
                />
              </Stack>
            </Stack>

            {field.type === 'select' && (
              <TextField
                label="Options"
                value={(field.options || []).join(', ')}
                onChange={(event) => handleFieldChange(index, {
                  options: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                })}
                helperText="Separate options with commas"
                fullWidth
                sx={{ mt: 1.5, ...builderFieldSx }}
              />
            )}
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2, borderColor: '#dbeafe' }} />

      <Button
        variant="outlined"
        startIcon={<AddOutlinedIcon />}
        onClick={addField}
        sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
      >
        Add Custom Field
      </Button>
    </Box>
  );
};

export default ApplicationFormBuilder;
