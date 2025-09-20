import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Transactions: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت تراکنش‌ها
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید تراکنش‌های مالی خود را ثبت و مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Transactions;