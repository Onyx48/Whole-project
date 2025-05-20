import React, { useState, useMemo } from "react";
// No need for Routes/Route here if using modals
// import { Routes, Route } from "react-router-dom";

// Import components
import SchoolManagementHeader from "../components/SchoolManagementHeader"; // Assuming header is reusable
import ScenarioTable from "../components/ScenarioTable"; // The scenarios table component
import EditScenario from "../components/EditScenario"; // The edit scenario form component (modal content)
import AddScenario from "../components/AddScenario"; // The add scenario form component (modal content)

// Import date parsing if needed for sorting (though Avg. Time Spent might just be string sort)
// import { parse } from "date-fns";

// --- Sample Scenario Data ---
// Based on the screenshot columns and likely form fields (like permissions)
const initialScenarios = [
  {
    id: 1,
    scenarioName: "Emergency Room Case",
    description: "A Patient Arrives With Chest Pain.",
    creator: "Ahmad Botosh",
    avgTimeSpent: "20 Minutes", // Keep as string initially
    status: "Draft",
    permissions: "Read Only", // Example field from form screenshots
  },
  {
    id: 2,
    scenarioName: "Post-Surgery Recovery",
    description: "Monitoring A Patient After Surgery",
    creator: "Gustavo Torff",
    avgTimeSpent: "30 Minutes",
    status: "Published",
    permissions: "Write Only",
  },
  {
    id: 3,
    scenarioName: "Pediatric Fever",
    description: "Diagnosing A Child With High Fever.",
    creator: "Phillip Torff",
    avgTimeSpent: "25 Minutes",
    status: "Published",
    permissions: "Both",
  },
  {
    id: 4,
    scenarioName: "Diabetic Crisis",
    description: "Managing A Severe Diabetic Episode.",
    creator: "Marley Bergson",
    avgTimeSpent: "40 Minutes",
    status: "Published",
    permissions: "Read Only",
  },
  {
    id: 5,
    scenarioName: "Stroke Assessment",
    description: "Identifying And Treating A Stroke Patient.",
    creator: "Cooper Gouse",
    avgTimeSpent: "35 Minutes",
    status: "Archived",
    permissions: "Read Only",
  },
  // Add more sample data as needed
];

// --- Scenario Page Component ---
// This component manages the state and orchestrates the display
function ScenarioPage() {
  // State for the list of scenarios
  const [scenarios, setScenarios] = useState(initialScenarios);
  // State for the search input value in the header
  const [searchTerm, setSearchTerm] = useState("");
  // State for the current sorting configuration { key: string, direction: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState(null);

  // State to control the visibility and data for the Edit Scenario modal
  const [editingScenario, setEditingScenario] = useState(null); // Null if no scenario is being edited, otherwise the scenario object

  // State to control the visibility of the Add New Scenario modal (boolean)
  const [isAddingScenario, setIsAddingScenario] = useState(false);

  // --- Handlers for Adding/Updating Scenario Data (Called by Forms) ---
  // These functions receive data from the Add/Edit forms and update the main 'scenarios' state.
  // They are passed down to the form components as 'onSave'.

  const handleAddScenario = (newScenarioData) => {
    console.log("Adding new scenario:", newScenarioData);
    // Assign a unique ID before adding it to the state (important!)
    const newScenarioWithId = {
      ...newScenarioData,
      id: Date.now() + Math.random(), // Simple unique ID generation
    };
    // Update the main scenarios state by adding the new scenario
    setScenarios((prevScenarios) => [...prevScenarios, newScenarioWithId]);

    // Close the Add Scenario modal after saving
    setIsAddingScenario(false);
  };

  const handleUpdateScenario = (updatedScenarioData) => {
    console.log("Updating scenario:", updatedScenarioData);
    // Update the main scenarios state by mapping over the array
    setScenarios((prevScenarios) =>
      prevSchools.map(
        (scenario) =>
          scenario.id === updatedScenarioData.id // Find the scenario by ID
            ? { ...scenario, ...updatedScenarioData } // If it's the one being updated, merge the new data
            : scenario // Otherwise, keep the original scenario object
      )
    );

    // Close the Edit Scenario modal after saving
    setEditingScenario(null); // Clear the scenario being edited
  };

  // --- Filtering Logic (Memoized) ---
  // Filters the 'scenarios' state based on the 'searchTerm'.
  // Re-runs only if 'scenarios' data or 'searchTerm' changes.
  const filteredScenarios = useMemo(() => {
    if (!searchTerm) {
      return scenarios; // If no search term, return the full list
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Filter the scenarios array
    return scenarios.filter(
      (scenario) =>
        scenario.scenarioName.toLowerCase().includes(lowerCaseSearchTerm) ||
        scenario.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        scenario.creator.toLowerCase().includes(lowerCaseSearchTerm)
      // Add other fields you want to search here (e.g., avgTimeSpent, status)
    );
  }, [scenarios, searchTerm]); // Dependencies

  // --- Sorting Logic (Memoized) ---
  // Sorts the 'filteredScenarios' array based on the 'sortConfig'.
  // Re-runs only if 'filteredScenarios' data or 'sortConfig' changes.
  const filteredAndSortedScenarios = useMemo(() => {
    let sortableItems = [...filteredScenarios]; // Create a mutable copy
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values during comparison
        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;

        // --- Add Custom Sorting Logic for specific fields if needed ---
        // For 'avgTimeSpent' like "20 Minutes", simple string comparison might not sort numerically.
        // You'd need logic here to parse the number (e.g., parseInt(aValue) or parse "20 Minutes" into 20)
        // and then compare the numbers. Example (simple number parsing):
        // if (sortConfig.key === "avgTimeSpent") {
        //    const numA = parseInt(aValue);
        //    const numB = parseInt(bValue);
        //    if (numA < numB) return sortConfig.direction === "asc" ? -1 : 1;
        //    if (numA > numB) return sortConfig.direction === "asc" ? 1 : -1;
        //    return 0;
        // }
        // Date sorting would require parsing strings like "dd/MM/yyyy" into Date objects using date-fns parse
        // then comparing Date objects.

        // Default string comparison for other fields
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0; // values are equal
      });
    }
    return sortableItems;
  }, [filteredScenarios, sortConfig]); // Dependencies

  // --- Handlers Triggered by User Actions in Header/Table ---
  // These functions update the state within ScenarioPage based on user interactions.

  // Handler for search input changes in the header
  const handleSearchChange = (term) => {
    setSearchTerm(term); // Update search term state
    // Optional: reset pagination to page 1 on new search
    // You would need to pass down a handler to SchoolTable to reset its page state
  };

  // Handler for clicking sortable headers in the table
  const handleSort = (key) => {
    let direction = "asc";
    // Determine the next sorting direction based on current state
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc"; // If currently asc, next is desc
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      setSortConfig(null); // If currently desc, next is no sort
      return; // Stop here after resetting
    }
    // Otherwise, set the new key and direction to asc
    setSortConfig({ key, direction });
    // Optional: reset pagination to page 1 on new sort
  };

  // Handler for clicking the Edit button in a table row
  const handleEditClick = (scenario) => {
    setEditingScenario(scenario); // Set the scenario object to be edited
    // This state change will cause the EditScenario modal to render
  };

  // Handler for clicking the "New School" button in the header
  const handleAddNewClick = () => {
    setIsAddingScenario(true); // Set state to true, causing the AddScenario modal to render
  };

  // --- Handlers to Close Modals ---
  // These functions are passed down to the modal components as 'onClose'.

  const handleCloseEditDialog = () => {
    setEditingScenario(null); // Setting to null closes the EditScenario modal
  };

  const handleCloseAddDialog = () => {
    setIsAddingScenario(false); // Setting to false closes the AddScenario modal
  };

  // --- Rendered JSX ---
  return (
    // Main container for the page content (Header and Table)
    <div className="p-4">
      {" "}
      {/* Add padding around the content */}
      {/* Render the Header component */}
      {/* Pass search term and handler, and the add new click handler */}
      <SchoolManagementHeader // Assuming this is your Header component for School Page, maybe rename to GenericHeader or similar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNewClick={handleAddNewClick} // Pass handler to open Add modal
      />
      {/* Render the Scenario Table component */}
      {/* Pass the filtered and sorted scenario data */}
      {/* Pass handlers for actions initiated in the table (Edit, Sort) */}
      <ScenarioTable
        data={filteredAndSortedScenarios} // Pass the processed data to the table
        onEditClick={handleEditClick} // Pass handler for Edit button clicks
        // No onDeleteClick prop as per screenshot
        sortConfig={sortConfig} // Pass current sort config for icon indicators
        onSort={handleSort} // Pass handler for clicking sortable headers
      />
      {/* --- Modals (Rendered conditionally based on state) --- */}
      {/* Edit Scenario Modal */}
      {/* Render the modal overlay and the EditScenario component ONLY if editingScenario state is truthy */}
      {editingScenario && (
        // Modal Overlay: fixed position, covers the screen, semi-transparent background, centers content
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          {/* Render the EditScenario form component */}
          <EditScenario
            scenarioData={editingScenario} // Pass the scenario data to the form for pre-filling
            onSave={handleUpdateScenario} // Pass handler for saving updates
            onClose={handleCloseEditDialog} // Pass handler for closing the modal
          />
        </div>
      )}
      {/* Add New Scenario Modal */}
      {/* Render the modal overlay and the AddScenario component ONLY if isAddingScenario state is true */}
      {isAddingScenario && (
        // Modal Overlay (Same as Edit Modal)
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          {/* Render the AddScenario form component */}
          <AddScenario
            onSave={handleAddScenario} // Pass handler for adding a new scenario
            onClose={handleCloseAddDialog} // Pass handler for closing the modal
          />
        </div>
      )}
    </div>
  );
}

export default ScenarioPage; // Export the page component
