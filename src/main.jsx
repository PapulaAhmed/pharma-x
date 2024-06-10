import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signup/Signup.jsx';
import Dashboard from './pages/admin/dashboard/Dashboard.jsx';
import UsersManagement from './pages/admin/users/UsersManagement.jsx';
import AddUser from './pages/admin/users/adduser/AddUser.jsx';
import RemoveItem from './pages/remove_item/RemoveItem.jsx';
import AddItem from './pages/add_item/AddItem.jsx';
import Product from './pages/admin/product/ProductManagement.jsx';
import AddProduct from './pages/admin/product/addproduct/AddProduct.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/users/adduser" element={<AddUser />} />
      <Route path="/admin/removeitem" element={<RemoveItem />} />
      <Route path="/admin/additem" element={<AddItem />} />
      <Route path="/admin/products" element={<Product />} />
      <Route path="/admin/products/addproduct" element={<AddProduct />} />
    </Routes>
  </BrowserRouter>
);