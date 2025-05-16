import React from "react";
import DashbordStats from "../Dashbord/DashbordStats";
import AllSchoolsSection from "../Dashbord/AllSchoolsSection";

import SchoolPage from "../Schools/Schools";

function DashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome back,Davis</h2>
      <p>
        This is the main home content. Display videos, recommendations, etc.
        here.
      </p>
      <DashbordStats />
      <AllSchoolsSection />
    </div>
  );
}

function Schools() {
  return <SchoolPage />;
}

export { DashboardPage, Schools };
