// src/components/Dashboard/DashboardPage.jsx
import React from "react";
import DashbordStats from "../Dashbord/DashbordStats";      // Adjust path if needed, assuming sibling
import AllSchoolsSection from "../Dashbord/AllSchoolsSection"; // Adjust path if needed, assuming sibling
import { useAuth } from '../../AuthContext'; // To display user's name

function DashboardPage() {
  const { user } = useAuth(); // Get user from context

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Welcome back, {user ? user.name : 'User'}! {/* Dynamic welcome */}
      </h2>
      <p className="text-gray-600 mb-6">
        This is the main dashboard content. Display overview statistics, recent activities, etc. here.
      </p>
      {/* Assuming these are your actual dashboard content components */}
      <DashbordStats />
      <AllSchoolsSection />
    </div>
  );
}

export default DashboardPage;