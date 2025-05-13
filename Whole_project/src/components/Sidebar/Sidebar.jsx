import React from "react";

function Sidebar({ onMenuItemClick, activeItem }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "schools", label: "Schools" },
    { id: "history", label: "History" },
    { id: "liked", label: "Liked Videos" },
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
              <button
                onClick={() => onMenuItemClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                  activeItem === item.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
