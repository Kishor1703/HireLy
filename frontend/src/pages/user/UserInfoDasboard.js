import { Box, Typography, Divider, Chip } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileAction } from '../../redux/actions/userAction';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

const roleConfig = {
  0: { label: 'Job Seeker',  color: '#2f80ed', bg: '#eff6ff', border: '#dbeafe', icon: <WorkOutlineIcon sx={{ fontSize: 14 }} /> },
  2: { label: 'Job Poster',  color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 14 }} /> },
  1: { label: 'Admin',       color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 14 }} /> },
};

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.5,
    p: 1.8, borderRadius: '12px',
    bgcolor: '#f8faff', border: '1px solid #dbeafe',
  }}>
    <Box sx={{
      width: 36, height: 36, borderRadius: '9px',
      bgcolor: '#dbeafe', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 18, color: '#1e4fd8' } })}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a2463' }}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

const UserInfoDashboard = () => {
  const { user }   = useSelector((state) => state.userProfile);
  const dispatch   = useDispatch();

  useEffect(() => {
    if (!user) dispatch(userProfileAction());
  }, [dispatch, user]);

  const role   = user?.role ?? 0;
  const config = roleConfig[role] || roleConfig[0];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px',
          background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PersonOutlineIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
            Personal Info
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Your account details
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

      <Box sx={{ maxWidth: 520 }}>

        {/* Avatar section */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: '#fff', borderRadius: '16px',
          border: '1.5px solid #dbeafe',
          p: 2.5, mb: 2.5,
        }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: '14px',
            background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>
              {user?.firstName?.[0]?.toUpperCase() || '?'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0a2463' }}>
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>
              {user?.email || '—'}
            </Typography>
          </Box>
          <Chip
            icon={React.cloneElement(config.icon, { sx: { fontSize: '13px !important', color: `${config.color} !important` } })}
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.bg, color: config.color,
              border: `1px solid ${config.border}`,
              fontWeight: 700, fontSize: '0.72rem',
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Info rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <InfoRow icon={<BadgeOutlinedIcon />}  label="First Name" value={user?.firstName} />
          <InfoRow icon={<BadgeOutlinedIcon />}  label="Last Name"  value={user?.lastName}  />
          <InfoRow icon={<EmailOutlinedIcon />}  label="Email"      value={user?.email}     />
          <InfoRow
            icon={<PersonOutlineIcon />}
            label="Account Type"
            value={config.label}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfoDashboard;