import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Accounts: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت حساب‌ها
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید حساب‌های مالی خود را مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Accounts;