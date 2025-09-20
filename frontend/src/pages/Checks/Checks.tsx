import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Checks: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت چک‌ها و اقساط
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید چک‌های دریافتی و پرداختی، اقساط و یادآوری‌ها را مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Checks;