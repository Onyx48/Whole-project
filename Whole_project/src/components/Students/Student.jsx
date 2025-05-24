import React, { useState, useMemo } from "react";

import StudentManagementHeader from "./StudentManagementHeader";
import StudentTable from "./StudentTable";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import StudentFilterForm from "./StudentFilterForm";
// import ViewTranscript from "./ViewTranscript";
// import ViewProfile from "./ViewProfile";
import AssignScenarios from "./AssignScenarios";

const initialStudents = [
  {
    id: 1,
    studentName: "Tatiana Baptista",
    emailAddress: "hcarter@hotmail.com",
    schoolName: "Maplewood High School Emergen...",
    progress: "75%",
  },
  {
    id: 2,
    studentName: "Ashlynn Septimus",
    emailAddress: "pmiller@gmail.com",
    schoolName: "Riverside Academy Post-Surgery...",
    progress: "60%",
  },
  {
    id: 3,
    studentName: "Marilyn Lipshutz",
    emailAddress: "jhill@hotmail.com",
    schoolName: "Sunnyvale School Pediatric Fever",
    progress: "50%",
  },
  {
    id: 4,
    studentName: "Emerson Bator",
    emailAddress: "privera@gmail.com",
    schoolName: "Cedar Grove Institute Diabetic Cri...",
    progress: "80%",
  },
  {
    id: 5,
    studentName: "Abram Philips",
    emailAddress: "bthompson@icloud.com",
    schoolName: "Oak Hill College Stroke Assessment",
    progress: "90%",
  },
  {
    id: 6,
    studentName: "Phillip Franci",
    emailAddress: "sbrown@yahoo.com",
    schoolName: "Maple Grove University Stroke Eva...",
    progress: "70%",
  },
  {
    id: 7,
    studentName: "Leo Geidt",
    emailAddress: "mdavis@gmail.com",
    schoolName: "Cedar Valley Institute Stroke Anal...",
    progress: "85%",
  },
  {
    id: 8,
    studentName: "Carla Herwitz",
    emailAddress: "omoore@gmail.com",
    schoolName: "Pine Ridge Academy Stroke Review",
    progress: "95%",
  },
];

function StudentPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [viewingTranscript, setViewingTranscript] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [isAssigningScenarios, setIsAssigningScenarios] = useState(false);

  const [filterCriteria, setFilterCriteria] = useState({});

  const handleAddStudent = (newStudentData) => {
    console.log("Adding new student:", newStudentData);
    const newStudentWithId = {
      ...newStudentData,
      id: Date.now() + Math.random(),
    };
    setStudents((prevStudents) => [...prevStudents, newStudentWithId]);
    setIsAddingStudent(false);
  };

  const handleUpdateStudent = (updatedStudentData) => {
    console.log("Updating student:", updatedStudentData);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudentData.id
          ? { ...student, ...updatedStudentData }
          : student
      )
    );
    setEditingStudent(null);
  };

  const handleAssignScenarios = () => {
    console.log("Assign Scenarios button clicked! Opening modal.");
    setIsAssigningScenarios(true);
  };

  const filteredStudents = useMemo(() => {
    let currentData = students;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter(
        (student) =>
          student.studentName.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.emailAddress.toLowerCase().includes(lowerCaseSearchTerm) ||
          student.schoolName.toLowerCase().includes(lowerCaseSearchTerm)
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
      currentData = currentData.filter((student) => {
        let matchesFilters = true;

        if (filterCriteria.studentName && filterCriteria.studentName !== "") {
          if (
            !student.studentName
              .toLowerCase()
              .includes(filterCriteria.studentName.toLowerCase())
          ) {
            matchesFilters = false;
          }
        }

        if (filterCriteria.schoolName && filterCriteria.schoolName !== "") {
          if (
            !student.schoolName
              .toLowerCase()
              .includes(filterCriteria.schoolName.toLowerCase())
          ) {
            matchesFilters = false;
          }
        }

        if (
          filterCriteria.progressMin !== undefined &&
          filterCriteria.progressMin !== null &&
          !isNaN(filterCriteria.progressMin)
        ) {
          const studentProgress = parseInt(student.progress);
          if (
            isNaN(studentProgress) ||
            studentProgress < filterCriteria.progressMin
          ) {
            matchesFilters = false;
          }
        }
        if (
          filterCriteria.progressMax !== undefined &&
          filterCriteria.progressMax !== null &&
          !isNaN(filterCriteria.progressMax)
        ) {
          const studentProgress = parseInt(student.progress);
          if (
            isNaN(studentProgress) ||
            studentProgress > filterCriteria.progressMax
          ) {
            matchesFilters = false;
          }
        }

        return matchesFilters;
      });
    }

    return currentData;
  }, [students, searchTerm, filterCriteria]);

  const filteredAndSortedStudents = useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;

        if (sortConfig.key === "progress") {
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
  }, [filteredStudents, sortConfig]);

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

  const handleEditClick = (student) => {
    setEditingStudent(student);
  };

  const handleViewTranscriptClick = (student) => {
    console.log("Viewing transcript for student:", student);
    setViewingTranscript(student);
  };

  const handleViewProfileClick = (student) => {
    console.log("Viewing profile for student:", student);
    setViewingProfile(student);
  };

  const handleAddNewClick = () => {
    console.log("Student Page: handleAddNewClick triggered!");
    setIsAddingStudent(true);
  };

  const handleFilterClick = () => {
    console.log("Student Filters button clicked! Opening filter modal.");
    setIsFiltering(true);
  };

  const handleAssignScenariosClick = () => {
    console.log("Assign Scenarios button clicked!");
    setIsAssigningScenarios(true);
  };

  const handleApplyFilters = (filters) => {
    console.log("Applying Student filter criteria:", filters);
    setFilterCriteria(filters);
    setIsFiltering(false);
  };

  const handleCloseEditDialog = () => {
    setEditingStudent(null);
  };
  const handleCloseAddDialog = () => {
    setIsAddingStudent(false);
  };
  const handleCloseFilterDialog = () => {
    setIsFiltering(false);
  };
  const handleCloseTranscriptView = () => {
    setViewingTranscript(null);
  };
  const handleCloseProfileView = () => {
    setViewingProfile(null);
  };
  const handleCloseAssignScenariosDialog = () => {
    setIsAssigningScenarios(false);
  };

  return (
    <div className="p-4">
      <StudentManagementHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNewClick={handleAddNewClick}
        onFilterClick={handleFilterClick}
        onAssignScenariosClick={handleAssignScenariosClick}
      />
      <StudentTable
        data={filteredAndSortedStudents}
        onEditClick={handleEditClick}
        onViewTranscriptClick={handleViewTranscriptClick}
        onViewProfileClick={handleViewProfileClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <AddStudent
            onSave={handleAddStudent}
            onClose={handleCloseAddDialog}
          />
        </div>
      )}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <EditStudent
            studentData={editingStudent}
            onSave={handleUpdateStudent}
            onClose={handleCloseEditDialog}
          />
        </div>
      )}
      {isFiltering && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <StudentFilterForm
            initialFilters={filterCriteria}
            onApplyFilters={handleApplyFilters}
            onClose={handleCloseFilterDialog}
          />
        </div>
      )}
      {viewingTranscript && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <ViewTranscript
            studentData={viewingTranscript}
            onClose={handleCloseTranscriptView}
          />
        </div>
      )}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <ViewProfile
            studentData={viewingProfile}
            onClose={handleCloseProfileView}
          />
        </div>
      )}
      {isAssigningScenarios && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <AssignScenarios onClose={handleCloseAssignScenariosDialog} />
        </div>
      )}
    </div>
  );
}

export default StudentPage;
