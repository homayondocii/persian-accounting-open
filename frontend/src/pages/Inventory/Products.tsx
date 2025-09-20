import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Products: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت محصولات و انبار
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید کالاها، خدمات، موجودی انبار و گزارش‌های انبارداری را مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Products;