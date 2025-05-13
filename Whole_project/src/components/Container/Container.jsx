import React, { useState } from "react";
import { ContentArea, Sidebar, Header } from "../index";

function Container() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        onMenuItemClick={handleMenuItemClick}
        activeItem={selectedMenuItem}
      />

      <Header />

      <ContentArea selectedMenuItem={selectedMenuItem} />
    </div>
  );
}

export default Container;
