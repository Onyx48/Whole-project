import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/" },
    { id: "schools", label: "Schools", path: "/schools" },
    { id: "scenario", label: "Scenarios", path: "/scenario" },
    { id: "student", label: "Students", path: "/student" },
    { id: "settings", label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 overflow-y-auto">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700 flex-shrink-0">
        <span role="img" aria-label="App Icon">
          ⚡
        </span>
      </div>

      <nav className="flex-1 p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link
                to={item.path}
                className={`block w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                  location.pathname === item.path ||
                  (item.id === "schools" &&
                    location.pathname.startsWith("/schools")) ||
                  (item.id === "scenario" &&
                    location.pathname.startsWith("/scenario")) ||
                  (item.id === "student" &&
                    location.pathname.startsWith("/student")) ||
                  (item.id === "settings" &&
                    location.pathname.startsWith("/settings"))
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
