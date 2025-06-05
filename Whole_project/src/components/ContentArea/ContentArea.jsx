// src/components/Container/ContentArea.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Don't forget Routes and Route

// Import your actual page components
import DashboardPage from '../Home/Home'; // Assuming this is src/components/Dashboard/DashboardPage.jsx
import SchoolsPage from '../Schools/Schools';       // Assuming this is src/components/Schools/SchoolsPage.jsx
import ScenarioPage from '../Scenario/Scenario';     // Assuming this is src/components/Scenario/ScenarioPage.jsx
import StudentPage from '../Students/Student';       // Assuming this is src/components/Students/StudentsPage.jsx
import AccountSettingsPage from '../UserSettings/AccountSettings'; // Assuming this is src/components/Settings/AccountSettingsPage.jsx

// You'll also need a RoleBasedRoute if you want to reuse it here
import { useAuth } from '../../AuthContext'; // To import useAuth for RoleBasedRoute

// RoleBasedRoute component (re-defined here for clarity, centralize if possible)
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading content...</div>; // Smaller loading message for inner routes

  if (!user) return <Navigate to="/login" replace />; // Should be caught by App.jsx's ProtectedRoute, but good fallback

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`User role "${user.role}" not authorized for this inner route. Allowed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; // Redirect unauthorized users to dashboard/home
  }
  return children;
};

// Placeholder components for Help & Center and Report pages
// These should eventually be in their own files like:
// src/components/HelpCenter/HelpCenterPage.jsx
// src/components/Report/ReportPage.jsx
const HelpCenterPage = () => <div className="p-6 text-2xl font-bold text-gray-800">Help & Center Page</div>;
const ReportPage = () => <div className="p-6 text-2xl font-bold text-gray-800">Report Page</div>;


function ContentArea() {
  return (
    <main className="absolute top-16 left-64 right-0 bottom-0 overflow-y-auto bg-gray-50 p-4">
      <Routes>
        {/* Dashboard - Accessible by all authenticated roles */}
        <Route path="/" element={<DashboardPage />} />

        {/* Schools - Example: Accessible by Superadmin and Educator */}
        <Route path="/schools/*" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'educator']}> {/* Note 'educator' role */}
            <SchoolsPage />
          </RoleBasedRoute>
        }/>

        {/* Scenario - Example: Accessible by Superadmin and Educator */}
        <Route path="/scenario/*" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'educator']}>
            <ScenarioPage />
          </RoleBasedRoute>
        }/>

        {/* Students - Example: Accessible by Superadmin and Educator */}
        <Route path="/students/*" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'educator']}>
            <StudentPage />
          </RoleBasedRoute>
        }/>

        {/* Settings - Example: Only accessible by Superadmin */}
        <Route path="/settings/*" element={
          <RoleBasedRoute allowedRoles={['superadmin']}>
            <AccountSettingsPage />
          </RoleBasedRoute>
        }/>

        {/* Help & Center - Accessible by all roles */}
        <Route path="/help-center" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'educator', 'student', 'school_admin']}> {/* Allow all roles */}
            <HelpCenterPage />
          </RoleBasedRoute>
        }/>

        {/* Report - Example: Accessible by Superadmin and Educator */}
        <Route path="/report" element={
          <RoleBasedRoute allowedRoles={['superadmin', 'educator']}>
            <ReportPage />
          </RoleBasedRoute>
        }/>

        {/* Fallback for any unknown route within the authenticated section */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default ContentArea;