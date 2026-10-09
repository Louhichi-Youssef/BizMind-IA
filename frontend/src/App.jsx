import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import BusinessPlanGenerator from './pages/BusinessPlanGenerator';
import BusinessPlanDetail from './pages/BusinessPlanDetail';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/generate" element={<BusinessPlanGenerator />} />
        <Route path="/dashboard/plans/:id" element={<BusinessPlanDetail />} />
        <Route path="/dashboard/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/profile" element={<SettingsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;

