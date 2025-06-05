// src/components/Schools/SchoolManagementHeader.jsx
import React from "react";

import searchIconPng from "./search.png"; // Assuming icons are in same folder
import sortIconPng from "./sort.png";
import plusIconPng from "./plus.png";


function SchoolManagementHeader({
  searchTerm,
  onSearchChange,
  onAddNewClick, // This is null if not SuperAdmin
  onFilterClick,
}) {
  const handleFilterClick = () => {
    console.log("Schools Filters button clicked!");
    if (onFilterClick) {
      onFilterClick();
    }
  };

  return (
    <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200"> {/* Adjusted background and border */}
      <div className="flex items-center max-w-[500px] flex-grow rounded">
        <div className="relative flex-grow">
          <img
            src={searchIconPng}
            alt="Search Icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search for School"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={
              "w-full pl-10 pr-4 py-2 rounded bg-white text-gray-700 border border-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" // Adjusted focus ring
            }
          />
        </div>

        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 ml-4 transition duration-200 ease-in-out text-sm"
          onClick={handleFilterClick}
        >
          <img src={sortIconPng} alt="Filters Icon" className="w-4 h-4 mr-1" />
          Filters
        </button>
      </div>

      {/* Conditionally render "New School" button based on onAddNewClick prop */}
      {onAddNewClick && (
        <button
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition duration-200 ease-in-out text-sm ml-auto" // Changed color
          onClick={onAddNewClick}
        >
          <img src={plusIconPng} alt="Plus Icon" className="w-4 h-4 mr-1" />
          New School
        </button>
      )}
    </div>
  );
}

export default SchoolManagementHeader;