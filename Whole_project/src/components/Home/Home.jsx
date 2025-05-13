import React from "react";
import DashbordStats from "../Dashbord/DashbordStats";
import AllSchoolsSection from "../Dashbord/AllSchoolsSection";
import SchoolManagement from "../Schools/SchoolManagement";

function DashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome back,Davis</h2>
      <p>
        This is the main home content. Display videos, recommendations, etc.
        here.
      </p>
      <DashbordStats />
      <AllSchoolsSection/>

      
    </div>
  );
}

function Schools() {
  return (
    <SchoolManagement/>
  );
}

function HistoryPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Watch History</h2>
      <p>Your watch history content.</p>
    </div>
  );
}

function LikedPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liked Videos</h2>
      <p>Videos you have liked.</p>
    </div>
  );
}

export { DashboardPage, Schools, HistoryPage, LikedPage };
