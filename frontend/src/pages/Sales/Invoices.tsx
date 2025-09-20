import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Invoices: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت فاکتورها
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید فاکتورهای فروش و خدمات را صادر و مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Invoices;