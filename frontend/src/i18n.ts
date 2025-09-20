import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fa: {
    translation: {
      // Common
      save: 'ذخیره',
      cancel: 'لغو',
      delete: 'حذف',
      edit: 'ویرایش',
      add: 'افزودن',
      search: 'جستجو',
      loading: 'در حال بارگذاری...',
      
      // Auth
      login: 'ورود',
      logout: 'خروج',
      register: 'ثبت نام',
      email: 'ایمیل',
      password: 'کلمه عبور',
      name: 'نام',
      companyName: 'نام شرکت',
      
      // Navigation
      dashboard: 'داشبورد',
      financial: 'مالی',
      transactions: 'تراکنش‌ها',
      accounts: 'حساب‌ها',
      checks: 'چک‌ها و اقساط',
      payroll: 'حقوق و دستمزد',
      employees: 'کارکنان',
      sales: 'فروش و خدمات',
      customers: 'مشتریان',
      invoices: 'فاکتورها',
      inventory: 'انبارداری',
      products: 'محصولات',
      reports: 'گزارشات',
      
      // Financial
      income: 'درآمد',
      expense: 'هزینه',
      amount: 'مبلغ',
      date: 'تاریخ',
      description: 'توضیحات',
      category: 'دسته‌بندی',
      account: 'حساب',
      balance: 'موجودی',
      
      // Messages
      loginSuccess: 'ورود با موفقیت انجام شد',
      loginError: 'خطا در ورود به سیستم',
      dataLoadError: 'خطا در بارگذاری اطلاعات',
      saveSuccess: 'اطلاعات با موفقیت ذخیره شد',
      deleteSuccess: 'اطلاعات با موفقیت حذف شد',
    }
  },
  en: {
    translation: {
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      
      // Auth
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      companyName: 'Company Name',
      
      // Navigation
      dashboard: 'Dashboard',
      financial: 'Financial',
      transactions: 'Transactions',
      accounts: 'Accounts',
      checks: 'Checks & Installments',
      payroll: 'Payroll',
      employees: 'Employees',
      sales: 'Sales & Services',
      customers: 'Customers',
      invoices: 'Invoices',
      inventory: 'Inventory',
      products: 'Products',
      reports: 'Reports',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa',
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;