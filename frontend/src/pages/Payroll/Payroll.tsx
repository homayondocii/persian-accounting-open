import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Payroll: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        حقوق و دستمزد
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید محاسبه حقوق، مزایا، کسورات و گزارش‌های حقوقی را انجام دهید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payroll;