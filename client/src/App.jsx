import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signup/Signup.jsx';
import Dashboard from './pages/admin/dashboard/Dashboard.jsx';
import UsersManagement from './pages/admin/users/UsersManagement.jsx';
import AddUser from './pages/admin/users/adduser/AddUser.jsx';
import NewInvoice from './pages/invoice/new_invoice/NewInvoice.jsx';
import InvoicesManagement from './pages/invoice/InvoiceManagement.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import Index from './pages/index/Index.jsx';
import Product from './pages/product/ProductManagement.jsx';
import AddProduct from './pages/product/addproduct/AddProduct.jsx';
import CustomerManagement from './pages/customers/CustomerManagement.jsx';
import AddCustomer from './pages/customers/add_customer/AddCustomer.jsx';



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin']}><Dashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UsersManagement /></PrivateRoute>} />
      <Route path="/admin/users/adduser" element={<PrivateRoute allowedRoles={['admin']}><AddUser /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute allowedRoles={['pharmacist', 'pharmacist technician', 'admin']}><Index /></PrivateRoute>} />
      <Route path="/app" element={<PrivateRoute allowedRoles={['pharmacist', 'pharmacist technician', 'admin']}><Index /></PrivateRoute>} />
      <Route path="/app/products/*" element={<PrivateRoute allowedRoles={['pharmacist technician', 'admin']}><Product /></PrivateRoute>} />
      <Route path="/app/products/addproduct" element={<PrivateRoute allowedRoles={['pharmacist technician', 'admin']}><AddProduct /></PrivateRoute>} />
      <Route path="/app/invoices/*" element={<PrivateRoute allowedRoles={['pharmacist', 'admin']}><InvoicesManagement /></PrivateRoute>} />
      <Route path="/app/invoices/newinvoice" element={<PrivateRoute allowedRoles={['pharmacist', 'admin']}><NewInvoice /></PrivateRoute>} />
      <Route path="/app/customers" element={<PrivateRoute allowedRoles={['pharmacist', 'admin']}><CustomerManagement /></PrivateRoute>} />
      <Route path="/app/customers/addcustomer" element={<PrivateRoute allowedRoles={['pharmacist', 'admin']}><AddCustomer /></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
  
);

export default App;
