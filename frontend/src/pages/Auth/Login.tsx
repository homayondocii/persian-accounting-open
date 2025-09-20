import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

const Login: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            سیستم حسابداری جامع
          </Typography>
          
          <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
            ورود به سیستم
          </Typography>

          <Box component="form" sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="ایمیل"
              type="email"
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="کلمه عبور"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ورود
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;