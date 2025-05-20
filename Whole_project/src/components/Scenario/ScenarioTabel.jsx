import React, { useState, useMemo } from "react";

// Assuming you have these PNG icons available
import sortIconPng from "./sort.png"; // General sort indicator for headers
import editIconPng from "./edit.png"; // Edit icon for the action column

// Import Shadcn UI Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This component receives data, sort config, and handlers as props
function ScenarioTable({ data, onEditClick, sortConfig, onSort }) {
  // --- Internal State Management for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set how many items per page

  // --- Calculated Values for Pagination ---
  const totalItems = data.length; // Total number of items in the data received from parent
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Total pages needed

  // --- Memoized Data for Current Page ---
  // Efficiently slice the data to get only the items for the current page
  const currentScenarios = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index (0-based)
    const endIndex = startIndex + itemsPerPage; // Calculate end index (exclusive)
    return data.slice(startIndex, endIndex); // Slice the data array
  }, [data, currentPage, itemsPerPage]); // Re-slice when data, current page, or items per page changes

  // --- Action Handler (Triggered by Edit button click) ---
  // This function calls the parent's onEditClick handler
  const handleEdit = (scenario) => {
    // Receives the full scenario object
    if (onEditClick) {
      onEditClick(scenario); // Delegate the action to the parent component
    }
  };

  // --- Pagination Handler ---
  // This function updates the local currentPage state
  const handlePageChange = (pageNumber) => {
    // Ensure the requested page number is valid
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // Update state, which triggers currentScenarios useMemo
    }
  };

  // --- Helper Function to Render Page Number Elements ---
  // Generates the pagination spans (1, 2, 3, >, etc.)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Logic to display 1, 2, 3, and '...' if needed
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1, 2, 3);
      if (totalPages > 3) {
        pageNumbers.push("...");
      }
    }

    // Map over the page numbers/indicators array to create clickable span elements
    return pageNumbers.map((number, index) => (
      <span
        key={index} // Using index as key for simple static list
        // Apply Tailwind classes for styling: padding, margin, rounding, cursor
        // Conditional classes based on whether the number is the currentPage (blue background)
        // or if it's the '...' indicator (different cursor and hover)
        className={`px-3 py-1 mx-1 rounded-md cursor-pointer ${
          currentPage === number
            ? "bg-blue-500 text-white" // Active page styling
            : "text-gray-700 hover:bg-gray-200" // Inactive page styling
        } ${
          typeof number !== "number"
            ? "cursor-default hover:bg-transparent" // Styling for '...' indicator
            : ""
        }`}
        // Add click handler only if the item is a number
        onClick={() => typeof number === "number" && handlePageChange(number)}
      >
        {number} {/* Display the number or '...' */}
      </span>
    ));
  };

  // --- Helper Function to Render Status with Dot ---
  // Renders the status text with a colored dot based on the status value
  const renderStatus = (status) => {
    let dotColorClass = "bg-gray-400"; // Default/Draft
    let textColorClass = "text-gray-700"; // Default text color

    if (status === "Published") {
      dotColorClass = "bg-green-500"; // Green for Published
      textColorClass = "text-green-700"; // Green text for Published
    } else if (status === "Archived") {
      dotColorClass = "bg-gray-500"; // Darker gray for Archived
      textColorClass = "text-gray-700"; // Standard text for Archived
    }
    // No specific color needed for 'Draft' in screenshot, using gray-400

    return (
      <div className="flex items-center">
        {/* Colored dot */}
        <span className={`h-2 w-2 rounded-full mr-2 ${dotColorClass}`}></span>
        {/* Status text */}
        <span className={`${textColorClass}`}>{status}</span>
      </div>
    );
  };

  // --- Rendered JSX ---
  return (
    // Outer container div
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-lg border border-blue-200">
      {/* Shadcn Table component */}
      <Table className="w-full">
        {/* Shadcn TableHeader component */}
        <TableHeader className="bg-gray-50">
          {/* Shadcn TableRow for header row */}
          <TableRow>
            {/* Sortable Headers (Scenario Name, Description, Creator, Avg. Time Spent, Status) */}
            {/* Each has cursor-pointer and onClick handler for sorting */}
            {/* Icon opacity changes based on sortConfig */}
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("scenarioName")} // **INTERACTIVE**: Calls parent's onSort handler
            >
              <div className="flex items-center">
                Scenario Name
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "scenarioName"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />
              </div>
            </TableHead>

            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("description")} // **INTERACTIVE**: Calls parent's onSort handler
            >
              <div className="flex items-center">
                Description
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "description"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("creator")} // **INTERACTIVE**: Calls parent's onSort handler
            >
              <div className="flex items-center">
                Creator
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "creator" ? "opacity-100" : "opacity-40"
                  }`}
                />
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("avgTimeSpent")} // **INTERACTIVE**: Calls parent's onSort handler
            >
              <div className="flex items-center">
                Avg. Time Spent
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "avgTimeSpent"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("status")} // **INTERACTIVE**: Calls parent's onSort handler
            >
              <div className="flex items-center">
                Status
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "status" ? "opacity-100" : "opacity-40"
                  }`}
                />
              </div>
            </TableHead>
            {/* Action header - Not sortable */}
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Shadcn TableBody component */}
        <TableBody>
          {/* Map over paginated scenario data to render rows */}
          {currentScenarios.map((scenario) => (
            <TableRow key={scenario.id}>
              {/* Table data cells */}
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {scenario.scenarioName}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {scenario.description}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {scenario.creator}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {scenario.avgTimeSpent}
              </TableCell>
              {/* Status cell using the helper function */}
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {renderStatus(scenario.status)}
              </TableCell>

              {/* Action cell - Contains only the Edit button */}
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(scenario)} // **INTERACTIVE**: Calls local handleEdit, which calls parent's onEditClick
                  className="inline-flex items-center p-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none" // Styling including hover/focus states
                  title="Edit"
                >
                  <img src={editIconPng} alt="Edit" className="w-4 h-4 mr-1" />
                  Edit {/* Button text */}
                </button>
              </TableCell>
            </TableRow>
          ))}

          {/* Fallback row when no scenarios found */}
          {currentScenarios.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6} // Match number of columns
                className="px-4 py-4 text-center text-gray-500"
              >
                No scenarios found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination footer */}
      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div className="flex-1 flex justify-between sm:hidden"></div>
        <div className="flex-1 flex items-center justify-between">
          {/* Pagination Info */}
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> total
            </p>
          </div>
          {/* Pagination Controls */}
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {/* Previous button (span) */}
              <span
                onClick={() => handlePageChange(currentPage - 1)} // **INTERACTIVE**: Calls local handlePageChange
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                  currentPage === 1 // **INTERACTIVE**: Styling when disabled (on first page)
                    ? "opacity-50 cursor-not-allowed" // **INTERACTIVE**: Disabled cursor
                    : "hover:bg-gray-50 cursor-pointer" // **INTERACTIVE**: Hover effect and pointer cursor
                }`}
              ></span>
              {/* Rendered page number spans */}
              {renderPageNumbers()}{" "}
              {/* **INTERACTIVE**: The spans generated by this function are clickable */}
              {/* Next button (span) */}
              <span
                onClick={() => handlePageChange(currentPage + 1)} // **INTERACTIVE**: Calls local handlePageChange
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                  totalPages === 0 || currentPage === totalPages // **INTERACTIVE**: Styling when disabled (on last page)
                    ? "opacity-50 cursor-not-allowed" // **INTERACTIVE**: Disabled cursor
                    : "hover:bg-gray-50 cursor-pointer" // **INTERACTIVE**: Hover effect and pointer cursor
                }`}
              ></span>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScenarioTable;
