import React, { useState, useMemo } from "react";

import sortIconPng from "../Schools/sort.png";
import editIconPng from "../Schools/edit.png";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StudentTable({
  data,
  onEditClick,
  onViewTranscriptClick,
  onViewProfileClick,
  sortConfig,
  onSort,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const handleEdit = (student) => {
    if (onEditClick) {
      onEditClick(student);
    }
  };
  const handleViewTranscript = (student) => {
    if (onViewTranscriptClick) {
      onViewTranscriptClick(student);
    }
  };
  const handleViewProfile = (student) => {
    if (onViewProfileClick) {
      onViewProfileClick(student);
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
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("studentName")}
            >
              <div className="flex items-center">
                {" "}
                Student Name{" "}
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "studentName"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />{" "}
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("emailAddress")}
            >
              <div className="flex items-center">
                {" "}
                Email Address{" "}
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "emailAddress"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />{" "}
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("schoolName")}
            >
              <div className="flex items-center">
                {" "}
                School Name{" "}
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "schoolName"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />{" "}
              </div>
            </TableHead>
            <TableHead
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("progress")}
            >
              <div className="flex items-center">
                {" "}
                Progress{" "}
                <img
                  src={sortIconPng}
                  alt="Sort Icon"
                  className={`ml-1 w-3 h-3 ${
                    sortConfig?.key === "progress"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />{" "}
              </div>
            </TableHead>

            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {" "}
              Transcript{" "}
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {" "}
              Action{" "}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {student.studentName}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {student.emailAddress}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {student.schoolName}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {student.progress}
              </TableCell>

              <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleViewTranscript(student)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  View
                </button>
              </TableCell>

              <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="inline-flex items-center p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  title="Edit"
                >
                  <img src={editIconPng} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleViewProfile(student)}
                  className="inline-flex items-center p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  title="Profile"
                >
                  <svg
                    className="w-4 h-4"
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
                </button>
              </TableCell>
            </TableRow>
          ))}

          {currentStudents.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="px-4 py-4 text-center text-gray-500"
              >
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 rounded-b-lg">
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
        <div>
          <nav
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
            ></span>
            {renderPageNumbers()}
            <span
              onClick={() => handlePageChange(currentPage + 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                totalPages === 0 || currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            ></span>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default StudentTable;
