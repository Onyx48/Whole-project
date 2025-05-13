import React from "react";
import {
  DashboardPage,
  Schools,
  HistoryPage,
  LikedPage,
} from "./../Home/Home";

function ContentArea({ selectedMenuItem }) {
  let ContentComponent;

  switch (selectedMenuItem) {
    case "dashboard":
      ContentComponent = DashboardPage;
      break;
    case "schools":
      ContentComponent = Schools;
      break;
    case "history":
      ContentComponent = HistoryPage;
      break;
    case "liked":
      ContentComponent = LikedPage;
      break;
    default:
      ContentComponent = DashboardPage;
  }

  return (
    <main className="absolute top-16 left-64 right-0 bottom-0 overflow-y-auto bg-gray-100">
      <ContentComponent />
    </main>
  );
}

export default ContentArea;
