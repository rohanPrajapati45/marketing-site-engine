import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PagesListPage from "./pages/PagesListPage";
import PageBuilderPage from "./pages/PageBuilderPage";
import ServicesListPage from "./pages/ServicesListPage";
import WorkPortfolioPage from "./pages/WorkPortfolioPage";
import MediaPage from "./pages/MediaPage";

const App = () => {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pages" element={<PagesListPage />} />
          <Route path="/pages/:pageId" element={<PageBuilderPage />} />
          <Route path="/blogs" element={<Navigate to="/pages" replace />} />
          <Route path="/blogs/new" element={<Navigate to="/pages" replace />} />
          <Route
            path="/blogs/:blogId/edit"
            element={<Navigate to="/pages" replace />}
          />
          <Route path="/services" element={<ServicesListPage />} />
          <Route path="/work" element={<WorkPortfolioPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
