export const DEFAULT_APPLICATION_FIELDS = [
  { id: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, system: true, options: [], placeholder: '' },
  { id: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, system: true, options: [], placeholder: '' },
  { id: 'phone', label: 'Mobile Number', type: 'text', required: true, enabled: true, system: true, options: [], placeholder: '' },
  {
    id: 'experienceLevel',
    label: 'Experience Level',
    type: 'select',
    required: true,
    enabled: true,
    system: true,
    options: ['Fresher', 'Experienced'],
    placeholder: '',
  },
  { id: 'resume', label: 'Resume', type: 'file', required: true, enabled: true, system: true, options: [], placeholder: '' },
  { id: 'location', label: 'Current Location', type: 'text', required: true, enabled: true, system: true, options: [], placeholder: '' },
];

export const CUSTOM_FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'textarea', label: 'Long text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
];

const toKey = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);

export const getDefaultApplicationForm = () => DEFAULT_APPLICATION_FIELDS.map((field) => ({
  ...field,
  options: [...(field.options || [])],
}));

export const normalizeApplicationForm = (rawFields) => {
  const fields = Array.isArray(rawFields) && rawFields.length ? rawFields : getDefaultApplicationForm();
  const seen = new Set();
  const normalized = fields.map((field, index) => {
    const defaultField = DEFAULT_APPLICATION_FIELDS.find((item) => item.id === field?.id);
    let id = defaultField?.id || toKey(field?.id || field?.label || `custom_${index + 1}`) || `custom_${index + 1}`;
    if (seen.has(id)) id = `${id}_${index + 1}`;
    seen.add(id);

    return {
      id,
      label: String(field?.label || defaultField?.label || 'Field').trim() || 'Field',
      type: field?.type || defaultField?.type || 'text',
      required: Boolean(field?.required ?? defaultField?.required),
      enabled: Boolean(field?.enabled ?? true),
      system: Boolean(defaultField?.system),
      options: Array.isArray(field?.options) ? field.options.filter(Boolean) : [...(defaultField?.options || [])],
      placeholder: String(field?.placeholder || '').trim(),
    };
  });

  DEFAULT_APPLICATION_FIELDS.forEach((field) => {
    if (!normalized.some((item) => item.id === field.id)) {
      normalized.push({ ...field, options: [...(field.options || [])] });
    }
  });

  return normalized;
};

export const getEnabledApplicationForm = (rawFields) => normalizeApplicationForm(rawFields).filter((field) => field.enabled);

export const buildInitialAnswers = ({ formFields, userInfo, profile, latestApplication }) => {
  const fullName = [profile?.firstName || latestApplication?.firstName || userInfo?.firstName || '', profile?.lastName || latestApplication?.lastName || userInfo?.lastName || '']
    .join(' ')
    .trim();
  const previousAnswers = Array.isArray(latestApplication?.answers)
    ? Object.fromEntries(latestApplication.answers.map((item) => [item.fieldId, item.value]))
    : {};

  return (formFields || []).reduce((acc, field) => {
    if (field.id === 'fullName') acc[field.id] = previousAnswers[field.id] || fullName;
    else if (field.id === 'email') acc[field.id] = previousAnswers[field.id] || profile?.email || latestApplication?.email || userInfo?.email || '';
    else if (field.id === 'phone') acc[field.id] = previousAnswers[field.id] || profile?.phone || latestApplication?.phone || '';
    else if (field.id === 'location') acc[field.id] = previousAnswers[field.id] || latestApplication?.location || '';
    else if (field.id === 'experienceLevel') acc[field.id] = previousAnswers[field.id] || latestApplication?.experienceLevel || '';
    else if (field.id === 'resume') acc[field.id] = previousAnswers[field.id] || profile?.resume || latestApplication?.resume || '';
    else acc[field.id] = previousAnswers[field.id] || '';
    return acc;
  }, {});
};
