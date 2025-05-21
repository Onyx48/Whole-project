import React from "react";
import DashbordStats from "../Dashbord/DashbordStats";
import AllSchoolsSection from "../Dashbord/AllSchoolsSection";

import SchoolsPage from "../Schools/Schools";
import ScenarioPage from "../Scenario/Scenario";

import StudentPage from "../Students/Student";

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
  return <SchoolsPage />;
}
function Scenario() {
  return <ScenarioPage />;
}
function Student() {
  return <StudentPage />;
}
export { DashboardPage, Schools, Scenario ,Student};
