import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  AccountBalance,
  Receipt,
  CheckCircle,
  People,
  ShoppingCart,
  Inventory,
  Assessment,
  ExitToApp,
  Person,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'داشبورد', icon: <Dashboard />, path: '/dashboard' },
  { text: 'مالی', icon: <AccountBalance />, path: '/financial/transactions', submenu: [
    { text: 'تراکنش‌ها', path: '/financial/transactions' },
    { text: 'حساب‌ها', path: '/financial/accounts' },
  ]},
  { text: 'چک‌ها و اقساط', icon: <CheckCircle />, path: '/checks' },
  { text: 'حقوق و دستمزد', icon: <People />, path: '/payroll/employees', submenu: [
    { text: 'کارکنان', path: '/payroll/employees' },
    { text: 'لیست حقوق', path: '/payroll/records' },
  ]},
  { text: 'فروش و خدمات', icon: <ShoppingCart />, path: '/sales/customers', submenu: [
    { text: 'مشتریان', path: '/sales/customers' },
    { text: 'فاکتورها', path: '/sales/invoices' },
  ]},
  { text: 'انبارداری', icon: <Inventory />, path: '/inventory/products' },
  { text: 'گزارشات', icon: <Assessment />, path: '/reports' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Adjust drawer width for mobile
  const drawerWidth = isMobile ? 280 : 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          سیستم حسابداری
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMenuItemClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: isMobile ? '0.875rem' : '1rem' 
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
            {item.submenu && (
              <List component="div" disablePadding>
                {item.submenu.map((subItem) => (
                  <ListItem key={subItem.text} disablePadding>
                    <ListItemButton 
                      sx={{ pl: 4 }} 
                      onClick={() => handleMenuItemClick(subItem.path)}
                    >
                      <ListItemText 
                        primary={subItem.text}
                        sx={{ 
                          '& .MuiTypography-root': { 
                            fontSize: isMobile ? '0.75rem' : '0.875rem' 
                          } 
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.company?.name || 'شرکت'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 1 }}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Person sx={{ mr: 1 }} />
                پروفایل
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                خروج
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;