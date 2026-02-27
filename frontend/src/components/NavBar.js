import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogoutAction } from '../redux/actions/userAction';
import logoDashboard from '../images/hr-project.png';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.signIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElNav,  setAnchorElNav]  = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu   = (e) => setAnchorElNav(e.currentTarget);
  const handleOpenUserMenu  = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseNavMenu  = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const getHomePath = () => {
    if (!userInfo) return '/';
    if (userInfo.role === 1) return '/';
    if (userInfo.role === 2) return '/';
    return '/user/info';
  };

  const getDisplayName = () => {
    if (!userInfo) return 'User';
    const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
    return userInfo.name || fullName || userInfo.email || 'User';
  };

  const logOut = async () => {
    await dispatch(userLogoutAction());
    navigate('/', { replace: true });
  };

  const getInitials = () => {
    return getDisplayName().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = () => {
    if (!userInfo) return null;
    if (userInfo.role === 1) return 'Admin';
    if (userInfo.role === 2) return 'Job Poster';
    return 'Job Seeker';
  };

  const LogoMark = ({ size = 52 }) => (
    <Box sx={{
      width: size, height: size,
      borderRadius: `${size * 0.26}px`,
      overflow: 'hidden',
      border: '1.5px solid rgba(31,79,216,0.15)',
      flexShrink: 0,
    }}>
      <Box
        component="img"
        src={logoDashboard}
        alt="TalentSphere"
        sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', transformOrigin: 'center' }}
      />
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(31,79,216,0.1)',
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg">
        {/* ↑ Toolbar height bumped from 78 → 90px */}
        <Toolbar disableGutters sx={{ height: 90 }}>

          {/* ── LOGO (desktop) ── */}
          <Box
            component={Link}
            to={getHomePath()}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center', gap: 1.2,
              textDecoration: 'none', mr: 5,
            }}
          >
            {/* logo size: 56 → 64 */}
            <LogoMark size={64} />
            <Typography sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: '1.65rem',   // was 1.45rem
              letterSpacing: '-0.5px', color: '#0a2463',
              '& span': { color: '#2f80ed' },
            }}>
              Talent<span>Sphere</span>
            </Typography>
          </Box>

          {/* ── MOBILE hamburger ── */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <IconButton onClick={handleOpenNavMenu} sx={{ color: '#0a2463' }}>
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{
                sx: {
                  mt: 1, borderRadius: '14px', minWidth: 200,
                  boxShadow: '0 8px 32px rgba(10,36,99,0.12)',
                  border: '1px solid #dbeafe',
                },
              }}
            >
              <MenuItem component={Link} to={getHomePath()} onClick={handleCloseNavMenu}>Home</MenuItem>
              <MenuItem component={Link} to="/jobs" onClick={handleCloseNavMenu}>Browse Jobs</MenuItem>
            </Menu>
          </Box>

          {/* ── LOGO (mobile) ── */}
          <Box
            component={Link}
            to={getHomePath()}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center', gap: 1,
              textDecoration: 'none', flexGrow: 1,
            }}
          >
            <LogoMark size={46} />
            <Typography sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: '1.25rem',
              letterSpacing: '-0.5px', color: '#0a2463',
              '& span': { color: '#2f80ed' },
            }}>
              Talent<span>Sphere</span>
            </Typography>
          </Box>

          {/* ── DESKTOP NAV LINKS ── */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {[
              { label: 'Home',        to: getHomePath() },
              { label: 'Browse Jobs', to: '/jobs'       },
            ].map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  color: '#334155', fontWeight: 600,
                  fontSize: '1rem',       // was 0.92rem
                  textTransform: 'none', borderRadius: '10px',
                  px: 2, py: 1,           // slightly more padding
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* ── RIGHT SIDE ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

            {!userInfo && (
              <>
                <Button
                  component={Link} to="/login"
                  variant="outlined"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    textTransform: 'none', fontWeight: 600,
                    fontSize: '0.95rem',   // bigger
                    borderRadius: '10px', borderColor: '#1e4fd8',
                    color: '#1e4fd8', px: 2.5, py: 0.9,
                    '&:hover': { bgcolor: '#eff6ff', borderColor: '#0a2463', color: '#0a2463' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link} to="/register"
                  variant="contained"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    textTransform: 'none', fontWeight: 600,
                    fontSize: '0.95rem',   // bigger
                    borderRadius: '10px', px: 2.5, py: 0.9,
                    background: 'linear-gradient(135deg, #2f80ed, #1e4fd8)',
                    boxShadow: '0 2px 10px rgba(31,79,216,0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e4fd8, #0a2463)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Avatar — slightly bigger */}
            <Tooltip title={userInfo ? getDisplayName() : 'Account'}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                <Avatar
                  src={userInfo?.avatar || ''}
                  sx={{
                    width: 44, height: 44,   // was 38
                    background: userInfo
                      ? 'linear-gradient(135deg, #2f80ed, #0a2463)'
                      : '#e2e8f0',
                    color: '#fff',
                    fontWeight: 700, fontSize: '0.95rem',
                    border: '2px solid',
                    borderColor: userInfo ? '#dbeafe' : '#e2e8f0',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: '#2f80ed' },
                  }}
                >
                  {userInfo
                    ? getInitials()
                    : <PersonOutlineIcon sx={{ fontSize: 22, color: '#94a3b8' }} />}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Dropdown */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5, borderRadius: '16px', minWidth: 230,
                  boxShadow: '0 12px 40px rgba(10,36,99,0.14)',
                  border: '1px solid #dbeafe', overflow: 'visible',
                  '&::before': {
                    content: '""', display: 'block', position: 'absolute',
                    top: -6, right: 16, width: 12, height: 12,
                    bgcolor: '#fff', transform: 'rotate(45deg)',
                    borderTop: '1px solid #dbeafe', borderLeft: '1px solid #dbeafe',
                  },
                },
              }}
            >
              {userInfo && (
                <Box sx={{ px: 2.5, py: 1.8 }}>
                  <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '1rem' }}>
                    {getDisplayName()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {getRoleLabel()}
                  </Typography>
                </Box>
              )}
              {userInfo && <Divider sx={{ borderColor: '#dbeafe' }} />}

              {userInfo?.role === 1 && (
                <MenuItem component={Link} to="/admin/dashboard" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <DashboardOutlinedIcon fontSize="small" /> Admin Dashboard
                </MenuItem>
              )}
              {userInfo?.role === 0 && (
                <MenuItem component={Link} to="/user/info" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <DashboardOutlinedIcon fontSize="small" /> My Dashboard
                </MenuItem>
              )}
              {userInfo?.role === 2 && (
                <MenuItem component={Link} to="/poster/dashboard" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <DashboardOutlinedIcon fontSize="small" /> Poster Dashboard
                </MenuItem>
              )}

              {!userInfo && (
                <MenuItem component={Link} to="/login" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <LoginIcon fontSize="small" /> Sign In
                </MenuItem>
              )}
              {!userInfo && (
                <MenuItem component={Link} to="/admin/login" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <LoginIcon fontSize="small" /> Admin Sign In
                </MenuItem>
              )}
              {!userInfo && (
                <MenuItem component={Link} to="/register" onClick={handleCloseUserMenu}
                  sx={{ gap: 1.5, py: 1.3, color: '#334155', fontSize: '0.92rem', '&:hover': { bgcolor: '#eff6ff', color: '#1e4fd8' } }}>
                  <AppRegistrationIcon fontSize="small" /> Register
                </MenuItem>
              )}

              {userInfo && <Divider sx={{ borderColor: '#dbeafe' }} />}
              {userInfo && (
                <MenuItem
                  onClick={async () => { handleCloseUserMenu(); await logOut(); }}
                  sx={{ gap: 1.5, py: 1.3, color: '#ef4444', fontSize: '0.92rem', '&:hover': { bgcolor: '#fef2f2' } }}
                >
                  <LogoutIcon fontSize="small" /> Log Out
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;