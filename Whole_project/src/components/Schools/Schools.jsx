import React, { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import SchoolManagementHeader from "./SchoolManagement";
import SchoolTable from "./SchoolTable";

import EditSchoolPage from "./EditSchoolPage";

import AddSchoolPageModal from "./AddSchoolPage";

import { parse } from "date-fns";

const initialSchools = [
  {
    id: 1,
    schoolName: "Singapore Institute Of Technology",
    email: "Ptorres@Icloud.Com",
    description: "A Patient Arrives With Chest Pain.",
    subscription: "Active (1 Year)",
    expireDate: "31/12/2027",
    startDate: "31/12/2026",
    timeSpent: "10h",
    status: "Active",
    permissions: "Read Only",
  },
  {
    id: 2,
    schoolName: "National University Of Singapore",
    email: "Qadams@Gmail.Com",
    description: "Monitoring A Patient After Surgery.",
    subscription: "Expired",
    expireDate: "31/12/2027",
    startDate: "31/12/2026",
    timeSpent: "9h",
    status: "Expired",
    permissions: "Write Only",
  },
  {
    id: 3,
    schoolName: "Shinshu University Japan",
    email: "Nnelson@Yahoo.Com",
    description: "Diagnosing A Child With High Fever.",
    subscription: "Active (1 Year)",
    expireDate: "31/12/2027",
    startDate: "31/12/2026",
    timeSpent: "12h",
    status: "Active",
    permissions: "Both",
  },
  {
    id: 4,
    schoolName: "Another School Test",
    email: "info@another.com",
    description: "Some description here.",
    subscription: "Active (1 Year)",
    expireDate: "01/01/2028",
    startDate: "01/01/2027",
    timeSpent: "5h",
    status: "Active",
    permissions: "Read Only",
  },
  {
    id: 5,
    schoolName: "Final School Data",
    email: "contact@final.com",
    description: "Yet another description.",
    subscription: "Expired",
    expireDate: "15/02/2027",
    startDate: "15/02/2026",
    timeSpent: "2h",
    status: "Expired",
    permissions: "Read Only",
  },
];

function SchoolPage() {
  const [schools, setSchools] = useState(initialSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const [editingSchool, setEditingSchool] = useState(null);

  const [isAddingSchool, setIsAddingSchool] = useState(false);

  const handleAddSchool = (newSchoolData) => {
    console.log("Adding new school:", newSchoolData);
    const newSchoolWithId = {
      ...newSchoolData,
      id: Date.now() + Math.random(),
    };
    setSchools((prevSchools) => [...prevSchools, newSchoolWithId]);

    setIsAddingSchool(false);
  };

  const handleUpdateSchool = (updatedSchoolData) => {
    console.log("Updating school:", updatedSchoolData);
    setSchools((prevSchools) =>
      prevSchools.map((school) =>
        school.id === updatedSchoolData.id
          ? { ...school, ...updatedSchoolData }
          : school
      )
    );

    setEditingSchool(null);
  };

  const handleDeleteSchool = (schoolId) => {
    console.log(`Deleting school with ID: ${schoolId}`);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this school?"
    );
    if (confirmDelete) {
      setSchools((prevSchools) =>
        prevSchools.filter((school) => school.id !== schoolId)
      );
    }
  };

  const filteredSchools = useMemo(() => {
    if (!searchTerm) {
      return schools;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return schools.filter(
      (school) =>
        school.schoolName.toLowerCase().includes(lowerCaseSearchTerm) ||
        school.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        school.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [schools, searchTerm]);

  const filteredAndSortedSchools = useMemo(() => {
    let sortableItems = [...filteredSchools];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;

        if (sortConfig.key === "startDate" || sortConfig.key === "expireDate") {
          try {
            const dateA = parse(aValue, "dd/MM/yyyy", new Date());
            const dateB = parse(bValue, "dd/MM/yyyy", new Date());

            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
              if (isNaN(dateA.getTime()))
                return sortConfig.direction === "asc" ? 1 : -1;
              if (isNaN(dateB.getTime()))
                return sortConfig.direction === "asc" ? -1 : 1;
            }

            if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
          } catch (error) {
            console.error("Error parsing date for sorting:", error);
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
          }
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSchools, sortConfig]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (school) => {
    setEditingSchool(school);
  };

  const handleDeleteClick = (schoolId) => {
    handleDeleteSchool(schoolId);
  };

  const handleAddNewClick = () => {
    setIsAddingSchool(true);
  };

  const handleCloseEditDialog = () => {
    setEditingSchool(null);
  };

  const handleCloseAddDialog = () => {
    setIsAddingSchool(false);
  };

  return (
    <div className="p-4">
      <SchoolManagementHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNewClick={handleAddNewClick}
      />

      <SchoolTable
        data={filteredAndSortedSchools}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <Routes>
        <Route index element={null} />
      </Routes>

      {editingSchool && (
        <EditSchoolPage
          schoolToEdit={editingSchool}
          onUpdateSchool={handleUpdateSchool}
          onClose={handleCloseEditDialog}
        />
      )}

      {isAddingSchool && (
        <AddSchoolPageModal
          onAddSchool={handleAddSchool}
          onClose={handleCloseAddDialog}
        />
      )}
    </div>
  );
}

export default SchoolPage;
