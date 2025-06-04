import React from "react";

import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

import searchIconPng from "./search.png";

function Header() {
  const { user, logout } = useAuth(); // Get user and logout from context
  const location = useLocation();

  let pageTitle = "Dashboard";
  if (location.pathname.startsWith("/schools")) {
    pageTitle = "Schools Management";
  } else if (location.pathname.startsWith("/scenario")) {
    pageTitle = "Scenarios Management";
  } else if (location.pathname.startsWith("/student")) {
    pageTitle = "Students Management";
  } else if (location.pathname.startsWith("/settings")) {
    pageTitle = "Account Settings";
  }

  const showSearchBar = location.pathname === "/";

  return (
    <header className="fixed top-0 left-64 right-0 bg-white text-black h-16 flex items-center justify-between px-4 z-40">
      {showSearchBar ? (
        <div className="w-80 relative">
          <img
            src={searchIconPng}
            alt="Search Icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className={
              "w-full pl-10 pr-4 py-2 rounded bg-white text-black border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-black"
            }
          />
        </div>
      ) : (
        <div className="text-xl font-bold text-gray-800">{pageTitle}</div>
      )}

      <div className="flex items-center space-x-4">
        {/* Placeholder buttons removed for clarity, add back if needed */}
        <button
          onClick={logout}
          className="px-3 py-1 rounded hover:bg-gray-100 text-gray-700 border border-gray-300"
        >
          Logout
        </button>

        <div className="h-8 border-l border-gray-300"></div>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>

        {user && (
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold text-gray-800">{user.name}</span>
            <span className="text-xs text-orange-500 font-medium capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
