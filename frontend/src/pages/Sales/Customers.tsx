import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Customers: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت مشتریان
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید اطلاعات مشتریان، سوابق خرید و تعاملات تجاری را مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Customers;