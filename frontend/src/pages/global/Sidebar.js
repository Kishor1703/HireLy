import React from 'react';
import { Sidebar, Menu, MenuItem, menuClasses } from 'react-pro-sidebar';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import Person3OutlinedIcon from '@mui/icons-material/Person3Outlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogoutAction } from '../../redux/actions/userAction';
import { useNavigate } from 'react-router-dom';
import { useProSidebar } from 'react-pro-sidebar';
import logoDashboard from '../../images/hr-project.png';

const roleConfig = {
  1: {
    label: 'Admin',
    color: '#f59e0b',
    items: [
      { to: '/admin/dashboard',  icon: <DashboardOutlinedIcon />,    label: 'Dashboard'  },
      { to: '/admin/users',      icon: <GroupAddOutlinedIcon />,     label: 'Users'      },
      { to: '/admin/jobs',       icon: <WorkOutlineIcon />,          label: 'Jobs'       },
      { to: '/admin/category',   icon: <CategoryOutlinedIcon />,     label: 'Category'   },
    ],
  },
  2: {
    label: 'Job Poster',
    color: '#10b981',
    items: [
      { to: '/poster/dashboard',        icon: <BusinessCenterOutlinedIcon />, label: 'Post a Job'      },
      { to: '/jobs',                    icon: <WorkOutlineIcon />,            label: 'Browse Jobs'     },
      { to: '/poster/company-profile',  icon: <Person3OutlinedIcon />,       label: 'Company Profile' },
    ],
  },
  0: {
    label: 'Job Seeker',
    color: '#2f80ed',
    items: [
      { to: '/user/dashboard', icon: <DashboardOutlinedIcon />,    label: 'Dashboard'    },
      { to: '/jobs',           icon: <SendOutlinedIcon />,         label: 'Apply Jobs'   },
      { to: '/user/jobs',      icon: <WorkHistoryOutlinedIcon />,  label: 'Applied Jobs' },
      { to: '/user/info',      icon: <Person3OutlinedIcon />,      label: 'Profile'      },
    ],
  },
};

const SidebarAdm = () => {
  const { userInfo } = useSelector((state) => state.signIn);
  const { collapsed } = useProSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = userInfo?.role ?? 0;
  const config = roleConfig[role] || roleConfig[0];

  const getInitials = () => {
    if (!userInfo?.name) return 'U';
    return userInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const logOut = () => {
    dispatch(userLogoutAction());
    window.location.reload(true);
    setTimeout(() => navigate('/'), 500);
  };

  const menuItemStyles = {
    button: {
      borderRadius: '10px',
      margin: '2px 10px',
      padding: '4px 8px',
      transition: 'all 0.2s ease',
      [`&.${menuClasses.button}`]: { color: 'rgba(255,255,255,0.75)' },
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
      },
      [`&.${menuClasses.active}`]: {
        backgroundColor: 'rgba(47,128,237,0.25)',
        color: '#ffffff',
      },
    },
    icon: {
      [`&.${menuClasses.icon}`]: { color: 'rgba(255,255,255,0.6)' },
    },
    label: {
      fontSize: '0.88rem',
      fontWeight: 500,
    },
  };

  return (
    <Sidebar
      backgroundColor="transparent"
      style={{
        background: 'linear-gradient(180deg, #0a2463 0%, #0d3080 60%, #0a2463 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        height: '100vh',
      }}
    >
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        height: '100%', justifyContent: 'space-between',
      }}>

        {/* ── TOP ── */}
        <Box>
          {/* Logo area */}
          <Box sx={{
            py: 3, px: 2,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            mb: 1,
          }}>
            {collapsed ? (
              <Box sx={{
                width: 34, height: 34, borderRadius: '9px',
                background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WorkOutlineIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: '9px',
                  background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <WorkOutlineIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography sx={{
                  fontWeight: 800, fontSize: '1.2rem',
                  color: '#fff', letterSpacing: '-0.5px',
                  '& span': { color: 'rgba(255,255,255,0.5)' },
                }}>
                  Hire<span>ly</span>
                </Typography>
              </Box>
            )}
          </Box>

          {/* User info pill */}
          {!collapsed && (
            <Box sx={{
              mx: 2, mb: 2, p: 1.5,
              borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 1.2,
            }}>
              <Avatar sx={{
                width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700,
                background: `linear-gradient(135deg, ${config.color}, #1e4fd8)`,
              }}>
                {getInitials()}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography sx={{
                  fontSize: '0.82rem', fontWeight: 700, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {userInfo?.name || 'User'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: config.color,
                  }} />
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                    {config.label}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Nav label */}
          {!collapsed && (
            <Typography sx={{
              px: 3, mb: 0.5,
              fontSize: '0.65rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '2px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              Navigation
            </Typography>
          )}

          {/* Menu items */}
          <Menu menuItemStyles={menuItemStyles}>
            {config.items.map((item) => (
              <MenuItem
                key={item.to}
                component={<Link to={item.to} />}
                icon={item.icon}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* ── BOTTOM ── */}
        <Box sx={{ pb: 2 }}>
          <Box sx={{ mx: 2, mb: 1, borderTop: '1px solid rgba(255,255,255,0.07)', pt: 1 }} />
          <Menu
            menuItemStyles={{
              button: {
                borderRadius: '10px',
                margin: '2px 10px',
                color: 'rgba(255,100,100,0.8)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(239,68,68,0.12)',
                  color: '#f87171',
                },
              },
              icon: {
                [`&.${menuClasses.icon}`]: { color: 'rgba(255,100,100,0.7)' },
              },
            }}
          >
            <MenuItem onClick={logOut} icon={<LogoutOutlinedIcon />}>
              Log Out
            </MenuItem>
          </Menu>
        </Box>

      </Box>
    </Sidebar>
  );
};

export default SidebarAdm;