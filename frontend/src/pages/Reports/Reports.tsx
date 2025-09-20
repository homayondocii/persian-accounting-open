import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        گزارشات و تحلیل‌ها
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید گزارش‌های مالی، فروش، انبار و حقوقی را مشاهده و صادر کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Reports;