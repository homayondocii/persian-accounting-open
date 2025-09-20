import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  People,
  Inventory,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data - In real app, this would come from API
const monthlyData = [
  { month: 'فروردین', income: 4000000, expense: 2400000 },
  { month: 'اردیبهشت', income: 3000000, expense: 1398000 },
  { month: 'خرداد', income: 2000000, expense: 9800000 },
  { month: 'تیر', income: 2780000, expense: 3908000 },
  { month: 'مرداد', income: 1890000, expense: 4800000 },
  { month: 'شهریور', income: 2390000, expense: 3800000 },
];

const expenseCategories = [
  { name: 'حقوق و دستمزد', value: 4000000, color: '#0088FE' },
  { name: 'خدمات', value: 3000000, color: '#00C49F' },
  { name: 'خرید کالا', value: 2000000, color: '#FFBB28' },
  { name: 'سایر', value: 1000000, color: '#FF8042' },
];

const recentActivities = [
  { id: 1, text: 'فاکتور جدید ثبت شد', icon: <Receipt />, color: 'success' },
  { id: 2, text: 'چک سررسید دارد', icon: <Warning />, color: 'warning' },
  { id: 3, text: 'پرداخت حقوق انجام شد', icon: <CheckCircle />, color: 'success' },
  { id: 4, text: 'موجودی کالا کم است', icon: <Warning />, color: 'error' },
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        داشبورد
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    کل درآمد
                  </Typography>
                  <Typography variant="h5">
                    ۱۵،۰۰۰،۰۰۰ ریال
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    کل هزینه
                  </Typography>
                  <Typography variant="h5">
                    ۱۰،۰۰۰،۰۰۰ ریال
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    موجودی حساب‌ها
                  </Typography>
                  <Typography variant="h5">
                    ۵،۰۰۰،۰۰۰ ریال
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    تعداد کارکنان
                  </Typography>
                  <Typography variant="h5">
                    ۱۵ نفر
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Income/Expense Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              نمودار درآمد و هزینه ماهانه
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} ریال`} />
                <Line type="monotone" dataKey="income" stroke="#4caf50" name="درآمد" />
                <Line type="monotone" dataKey="expense" stroke="#f44336" name="هزینه" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Expense Categories */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              دسته‌بندی هزینه‌ها
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} ریال`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              فعالیت‌های اخیر
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemIcon>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText primary={activity.text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              دسترسی سریع
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Receipt sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">ثبت تراکنش</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <People sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">مدیریت کارکنان</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box display="flex" gap={2}>
                <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Inventory sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">انبارداری</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">گزارشات</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;