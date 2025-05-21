import React from "react";

import searchIconPng from "../Schools/search.png";
import sortIconPng from "../Schools/sort.png";
import plusIconPng from "../Schools/plus.png";

function StudentManagementHeader({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onAssignScenariosClick,
  onAddNewClick,
}) {
  const handleFilterClick = () => {
    if (onFilterClick) {
      onFilterClick();
    }
  };

  const handleAssignScenariosClick = () => {
    if (onAssignScenariosClick) {
      onAssignScenariosClick();
    }
  };

  const handleAddNewClick = () => {
    if (onAddNewClick) {
      onAddNewClick();
    }
  };

  return (
    <div className="flex items-center p-4 bg-gray-100 mt-4">
      <div className="flex items-center max-w-[500px] flex-grow">
        <div className="relative flex-grow">
          <img
            src={searchIconPng}
            alt="Search Icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search student name or email"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={
              "w-full pl-10 pr-4 py-2 rounded bg-white text-black border border-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-black text-sm"
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

      <div className="flex items-center space-x-4 ml-auto">
        <button
          className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 transition duration-200 ease-in-out text-sm"
          onClick={handleAssignScenariosClick}
        >
          Assign Scenarios
        </button>

        <button
          className="flex items-center bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition duration-200 ease-in-out text-sm"
          onClick={handleAddNewClick}
        >
          <img src={plusIconPng} alt="Plus Icon" className="w-4 h-4 mr-1" />
          New Student
        </button>
      </div>
    </div>
  );
}

export default StudentManagementHeader;
