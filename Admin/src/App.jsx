import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Pages from './pages/Pages';
import PageBuilder from './pages/PageBuilder';
import Media from './pages/Media';
import Blogs from './pages/Blogs';
import BlogEditor from './pages/BlogEditor';
import Services from './pages/Services';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Public Auth Routes */}
      <Route path="/admin/login" element={<Login />} />

      {/* <Route path="/admin/verify-otp" element={<VerifyOTP />} /> */}

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/pages" element={<Pages />} />
          <Route path="/admin/pages/:pageId" element={<PageBuilder />} />
          <Route path="/admin/media" element={<Media />} />
          <Route path="/admin/blogs" element={<Blogs />} />
          <Route path="/admin/blogs/:blogId" element={<BlogEditor />} />
          <Route path="/admin/services" element={<Services />} />
          {/* <Route path="/admin/media" element={<Media />} /> */}
          {/* <Route path="/admin/pages/:pageId" element={<PageBuilder />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
