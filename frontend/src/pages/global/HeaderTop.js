import * as React from 'react';
import { styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
// import WorkIcon from '@mui/icons-material/Work';
// import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
// import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useProSidebar } from 'react-pro-sidebar';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  transition: 'all 0.2s ease',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.6)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  fontSize: '0.88rem',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1.5, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    '&::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
    [theme.breakpoints.up('sm')]: {
      width: '14ch',
      '&:focus': { width: '22ch' },
    },
  },
}));

const HeaderTop = () => {
  const { collapseSidebar } = useProSidebar();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #0a2463 0%, #1e4fd8 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ height: 64, px: { xs: 1.5, sm: 2.5 } }}>

          {/* Sidebar toggle */}
          <Tooltip title="Toggle sidebar">
            <IconButton
              onClick={() => collapseSidebar()}
              size="medium"
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              sx={{
                mr: 1.5,
                borderRadius: '10px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {/* Logo */}
          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center', gap: 1, mr: 3,
          }}>
            {/* <Box sx={{
              width: 30, height: 30, borderRadius: '8px',
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <WorkIcon sx={{ fontSize: 17, color: '#fff' }} />
            </Box> */}
            <Typography sx={{
              fontWeight: 800, fontSize: '1.1rem',
              letterSpacing: '-0.5px', color: '#fff',
              '& span': { color: '#2f80ed' },
            }}>
              Hire<span>Ly</span>
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon sx={{ fontSize: 18 }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchWrapper>

          {/* Notification bell */}
          {/* <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              sx={{
                ml: 1.5, borderRadius: '10px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                transition: 'all 0.2s',
              }}
            >
              <Badge badgeContent={3} color="error" sx={{
                '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 }
              }}>
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </Tooltip> */}

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderTop;