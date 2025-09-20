import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Register: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ثبت نام
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          فرم ثبت نام کاربر جدید
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;