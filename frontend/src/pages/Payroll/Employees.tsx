import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Employees: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        مدیریت کارکنان
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>
          در این بخش می‌توانید اطلاعات کارکنان، سوابق شغلی و مدارک آن‌ها را مدیریت کنید.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Employees;