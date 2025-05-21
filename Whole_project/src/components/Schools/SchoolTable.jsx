import React, { useState, useMemo } from "react";

import sortIconPng from "./sort.png";
import editIconPng from "./edit.png";
import deleteIconPng from "./delete.png";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SchoolTable({ data, onEditClick, onDeleteClick, sortConfig, onSort }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const handleEdit = (school) => {
    if (onEditClick) {
      onEditClick(school);
    }
  };
  const handleDelete = (schoolId) => {
    if (onDeleteClick) {
      onDeleteClick(schoolId);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
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

    return pageNumbers.map((number, index) => (
      <span
        key={index}
        className={`px-3 py-1 mx-1 rounded-md cursor-pointer ${
          currentPage === number
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        } ${
          typeof number !== "number"
            ? "cursor-default hover:bg-transparent"
            : ""
        }`}
        onClick={() => typeof number === "number" && handlePageChange(number)}
      >
        {number}
      </span>
    ));
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-lg border border-blue-200">
      <Table className="w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("schoolName")}
            >
              School Name
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "schoolName"
                    ? "opacity-100"
                    : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("email")}
            >
              Email
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "email" ? "opacity-100" : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("description")}
            >
              Description
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "description"
                    ? "opacity-100"
                    : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("subscription")}
            >
              Subscription
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "subscription"
                    ? "opacity-100"
                    : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("expireDate")}
            >
              Expire Date
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "expireDate"
                    ? "opacity-100"
                    : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("startDate")}
            >
              Start Date
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "startDate" ? "opacity-100" : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("timeSpent")}
            >
              Time Spent
              <img
                src={sortIconPng}
                alt="Sort Icon"
                className={`inline ml-1 w-3 h-3 ${
                  sortConfig?.key === "timeSpent" ? "opacity-100" : "opacity-40"
                }`}
              />
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {" "}
              Action{" "}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white divide-y divide-gray-200">
          {currentSchools.map((school) => (
            <TableRow key={school.id}>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {" "}
                {school.schoolName}{" "}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {" "}
                {school.email}{" "}
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-gray-500">
                {" "}
                {school.description}{" "}
              </TableCell>
              <TableCell
                className={`px-4 py-4 whitespace-nowrap text-sm ${
                  school.subscription === "Expired"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {" "}
                {school.subscription}{" "}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {" "}
                {school.expireDate}{" "}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {" "}
                {school.startDate}{" "}
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {" "}
                {school.timeSpent}{" "}
              </TableCell>

              <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(school)}
                  className="inline-flex items-center justify-center p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  title="Edit"
                >
                  <img src={editIconPng} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="inline-flex items-center justify-center p-1 rounded-full text-red-600 hover:text-red-900 hover:bg-red-100 focus:outline-none"
                  title="Delete"
                >
                  <img src={deleteIconPng} alt="Delete" className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}

          {currentSchools.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="px-4 py-4 text-center text-gray-500"
              >
                No schools found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div className="flex-1 flex justify-between sm:hidden"></div>
        <div className="flex-1 flex items-center justify-between">
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
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <span
              onClick={() => handlePageChange(currentPage - 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Previous
            </span>
            {renderPageNumbers()}
            <span
              onClick={() => handlePageChange(currentPage + 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                totalPages === 0 || currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Next
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolTable;
