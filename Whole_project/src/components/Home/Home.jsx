import React from "react";
import DashbordStats from "../Dashbord/DashbordStats";
import AllSchoolsSection from "../Dashbord/AllSchoolsSection";

function HomePage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome back,Davis</h2>
      <p>
        This is the main home content. Display videos, recommendations, etc.
        here.
      </p>
      <DashbordStats />
      <AllSchoolsSection/>

      <div className="h-[1000px] bg-gray-200 mt-8 flex items-center justify-center text-gray-600">
        Example Scrollable Content Area
      </div>
    </div>
  );
}

function SubscriptionsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
      <p>Content related to your subscriptions goes here.</p>
    </div>
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

export { HomePage, SubscriptionsPage, HistoryPage, LikedPage };
