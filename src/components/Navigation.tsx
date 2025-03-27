import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const Navigation: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAnimalTheme } = useAppTheme();

  const pages = [
    { path: '/recording', label: isAnimalTheme ? 'ろくおん 🎤' : '音声録音', description: isAnimalTheme ? 'おはなしをろくおんしてみよう' : '音声を録音して分析します' },
    { path: '/practice', label: isAnimalTheme ? 'おんどく 📖' : '音読練習', description: isAnimalTheme ? 'いっしょによんでみよう' : '効果的な音読トレーニング' },
    { path: '/diary', label: isAnimalTheme ? 'にっき 📝' : '進捗管理', description: isAnimalTheme ? 'きょうのできごとをかこう' : 'トレーニング記録の管理' },
    { path: '/ai-chat', label: isAnimalTheme ? 'AIとはなす 💭' : 'AI会話支援', description: isAnimalTheme ? 'AIとおしゃべりしよう' : 'AIによる専門的アドバイス' },
    { path: '/video-learning', label: isAnimalTheme ? 'どうが 📺' : '動画学習', description: isAnimalTheme ? 'どうがをみてべんきょうしよう' : '専門家による学習コンテンツ' },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontFamily: 'Mochiy Pop One' }}>
        {isAnimalTheme ? 'どうぶつと れんしゅう！' : '吃音改善トレーニング'}
      </Typography>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem button key={page.path} onClick={() => handleNavigate(page.path)}>
            <ListItemText 
              primary={page.label} 
              secondary={page.description}
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontFamily: 'Mochiy Pop One',
                  fontSize: '0.9rem',
                },
                '& .MuiListItemText-secondary': {
                  fontFamily: 'Mochiy Pop One',
                  fontSize: '0.8rem',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ borderRadius: 0 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Mochiy Pop One',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {isAnimalTheme ? '🐼 どうぶつと いっしょに れんしゅうしよう！' : '吃音改善トレーニング'}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label={isAnimalTheme ? 'めにゅー' : 'メニュー'}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.path} 
                    onClick={() => handleNavigate(page.path)}
                    sx={{
                      fontFamily: 'Mochiy Pop One',
                      fontSize: '0.9rem',
                    }}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Mochiy Pop One',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {isAnimalTheme ? '🐼 どうぶつと れんしゅう！' : '吃音改善'}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.path}
                  onClick={() => handleNavigate(page.path)}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    fontFamily: 'Mochiy Pop One',
                    fontSize: '0.9rem',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {auth.currentUser ? (
                <Tooltip title={isAnimalTheme ? 'あかうんと せってい' : 'アカウント設定'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={auth.currentUser.email || ''} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  startIcon={<LoginIcon />}
                  sx={{ fontFamily: 'Mochiy Pop One' }}
                >
                  {isAnimalTheme ? 'ろぐいん' : 'ログイン'}
                </Button>
              )}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography 
                    textAlign="center"
                    sx={{ fontFamily: 'Mochiy Pop One' }}
                  >
                    {isAnimalTheme ? 'ろぐあうと' : 'ログアウト'}
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation; 