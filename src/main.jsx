import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signup/Signup.jsx';
import Dashboard from './pages/admin/dashboard/Dashboard.jsx';
import UsersManagement from './pages/admin/users/UsersManagement.jsx';
import AddUser from './pages/admin/users/adduser/AddUser.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/users/adduser" element={<AddUser />} />
    </Routes>
  </BrowserRouter>
);