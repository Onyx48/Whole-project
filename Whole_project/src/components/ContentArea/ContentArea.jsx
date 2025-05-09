import React from "react";
import {
  HomePage,
  SubscriptionsPage,
  HistoryPage,
  LikedPage,
} from "./../Home/Home";

function ContentArea({ selectedMenuItem }) {
  let ContentComponent;

  switch (selectedMenuItem) {
    case "home":
      ContentComponent = HomePage;
      break;
    case "subscriptions":
      ContentComponent = SubscriptionsPage;
      break;
    case "history":
      ContentComponent = HistoryPage;
      break;
    case "liked":
      ContentComponent = LikedPage;
      break;
    default:
      ContentComponent = HomePage;
  }

  return (
    <main className="absolute top-16 left-64 right-0 bottom-0 overflow-y-auto bg-gray-100">
      <ContentComponent />
    </main>
  );
}

export default ContentArea;
