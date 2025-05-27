import React, { useState, useMemo } from "react";

import SchoolManagementHeader from "./SchoolManagement";
import SchoolTable from "./SchoolTable";
import EditSchoolPage from "./EditSchoolPage";
import AddSchoolPageModal from "./AddSchoolPage";
import SchoolFilterForm from "./SchoolFilterForm";
import schoolsData from "./schoolsData";

import { parse, isValid } from "date-fns";




function SchoolsPage() {
  const [schools, setSchools] = useState(schoolsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const [editingSchool, setEditingSchool] = useState(null);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filterCriteria, setFilterCriteria] = useState({});

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
    let currentData = schools;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter(
        (school) =>
          school.schoolName.toLowerCase().includes(lowerCaseSearchTerm) ||
          school.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          school.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    const hasActiveFilters = Object.values(filterCriteria).some(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(typeof value === "number" && isNaN(value))
    );

    if (hasActiveFilters) {
      currentData = currentData.filter((school) => {
        let matchesFilters = true;

        if (filterCriteria.status && filterCriteria.status !== "") {
          if (school.status !== filterCriteria.status) {
            matchesFilters = false;
          }
        }

        if (filterCriteria.subscription && filterCriteria.subscription !== "") {
          if (school.subscription !== filterCriteria.subscription) {
            matchesFilters = false;
          }
        }
        if (filterCriteria.permissions && filterCriteria.permissions !== "") {
          if (school.permissions !== filterCriteria.permissions) {
            matchesFilters = false;
          }
        }

        if (
          filterCriteria.startDateAfter &&
          isValid(filterCriteria.startDateAfter)
        ) {
          const schoolStartDate = isValid(
            parse(school.startDate, "dd/MM/yyyy", new Date())
          )
            ? parse(school.startDate, "dd/MM/yyyy", new Date())
            : null;
          if (
            !schoolStartDate ||
            schoolStartDate < filterCriteria.startDateAfter
          ) {
            matchesFilters = false;
          }
        }

        if (
          filterCriteria.expireDateBefore &&
          isValid(filterCriteria.expireDateBefore)
        ) {
          const schoolExpireDate = isValid(
            parse(school.expireDate, "dd/MM/yyyy", new Date())
          )
            ? parse(school.expireDate, "dd/MM/yyyy", new Date())
            : null;
          if (
            !schoolExpireDate ||
            schoolExpireDate > filterCriteria.expireDateBefore
          ) {
            matchesFilters = false;
          }
        }

        return matchesFilters;
      });
    }

    return currentData;
  }, [schools, searchTerm, filterCriteria]);

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
          const dateA = isValid(parse(aValue, "dd/MM/yyyy", new Date()))
            ? parse(aValue, "dd/MM/yyyy", new Date())
            : null;
          const dateB = isValid(parse(bValue, "dd/MM/yyyy", new Date()))
            ? parse(bValue, "dd/MM/yyyy", new Date())
            : null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return sortConfig.direction === "asc" ? 1 : -1;
          if (!dateB) return sortConfig.direction === "asc" ? -1 : 1;

          if (dateA.getTime() < dateB.getTime())
            return sortConfig.direction === "asc" ? -1 : 1;
          if (dateA.getTime() > dateB.getTime())
            return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }

        if (sortConfig.key === "timeSpent") {
          const numA = parseInt(aValue);
          const numB = parseInt(bValue);
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return sortConfig.direction === "asc" ? 1 : -1;
          if (isNaN(numB)) return sortConfig.direction === "asc" ? -1 : 1;
          if (numA < numB) return sortConfig.direction === "asc" ? -1 : 1;
          if (numA > numB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
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
    console.log("Schools: handleAddNewClick triggered!");
    setIsAddingSchool(true);
  };

  const handleFilterClick = () => {
    console.log("Schools Filters button clicked! Opening filter modal.");
    setIsFiltering(true);
  };

  const handleApplyFilters = (filters) => {
    console.log("Applying Schools filter criteria:", filters);
    setFilterCriteria(filters);
    setIsFiltering(false);
  };

  const handleCloseEditDialog = () => {
    setEditingSchool(null);
  };
  const handleCloseAddDialog = () => {
    setIsAddingSchool(false);
  };
  const handleCloseFilterDialog = () => {
    console.log("Closing Schools filter modal without applying.");
    setIsFiltering(false);
  };

  return (
    <div className="p-4">
      <SchoolManagementHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNewClick={handleAddNewClick}
        onFilterClick={handleFilterClick}
      />

      <SchoolTable
        data={filteredAndSortedSchools}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {editingSchool && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <EditSchoolPage
            schoolToEdit={editingSchool}
            onUpdateSchool={handleUpdateSchool}
            onClose={handleCloseEditDialog}
          />
        </div>
      )}

      {isAddingSchool && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <AddSchoolPageModal
            onAddSchool={handleAddSchool}
            onClose={handleCloseAddDialog}
          />
        </div>
      )}

      {isFiltering && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <SchoolFilterForm
            initialFilters={filterCriteria}
            onApplyFilters={handleApplyFilters}
            onClose={handleCloseFilterDialog}
          />
        </div>
      )}
    </div>
  );
}

export default SchoolsPage;
