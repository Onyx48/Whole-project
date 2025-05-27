import React, { useState, useMemo } from "react";

import ScenarioManagementHeader from "./ScenarioManagementHeader";
import ScenarioTable from "./ScenarioTable";
import EditScenario from "./EditScenario";
import AddScenario from "./AddScenario";
import ScenarioFilterForm from "./ScenarioFilterForm";
import initialScenarios from "./initialScenarios"




function ScenarioPage() {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const [editingScenario, setEditingScenario] = useState(null);
  const [isAddingScenario, setIsAddingScenario] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({});

  const handleAddScenario = (newScenarioData) => {
    console.log("Adding new scenario:", newScenarioData);
    const newScenarioWithId = {
      ...newScenarioData,
      id: Date.now() + Math.random(),
    };
    setScenarios((prevScenarios) => [...prevScenarios, newScenarioWithId]);
    setIsAddingScenario(false);
  };

  const handleUpdateScenario = (updatedScenarioData) => {
    console.log("Updating scenario:", updatedScenarioData);
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario) =>
        scenario.id === updatedScenarioData.id
          ? { ...scenario, ...updatedScenarioData }
          : scenario
      )
    );
    setEditingScenario(null);
  };

  const filteredScenarios = useMemo(() => {
    let currentData = scenarios;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter(
        (scenario) =>
          scenario.scenarioName.toLowerCase().includes(lowerCaseSearchTerm) ||
          scenario.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          scenario.creator.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    const hasActiveFilters = Object.values(filterCriteria).some(
      (value) => value !== "" && value !== null && value !== undefined
    );
    if (hasActiveFilters) {
      currentData = currentData.filter((scenario) => {
        let matchesFilters = true;
        if (filterCriteria.status && filterCriteria.status !== "") {
          if (scenario.status !== filterCriteria.status) {
            matchesFilters = false;
          }
        }
        if (filterCriteria.creator && filterCriteria.creator !== "") {
          if (
            !scenario.creator
              .toLowerCase()
              .includes(filterCriteria.creator.toLowerCase())
          ) {
            matchesFilters = false;
          }
        }
        return matchesFilters;
      });
    }

    return currentData;
  }, [scenarios, searchTerm, filterCriteria]);

  const filteredAndSortedScenarios = useMemo(() => {
    let sortableItems = [...filteredScenarios];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;
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
  }, [filteredScenarios, sortConfig]);

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

  const handleEditClick = (scenario) => {
    setEditingScenario(scenario);
  };

  const handleAddNewClick = () => {
    console.log("handleAddNewClick triggered!");
    setIsAddingScenario(true);
  };

  const handleFilterClick = () => {
    console.log("Scenario Filters button clicked! Opening filter modal.");
    setIsFiltering(true);
  };

  const handleApplyFilters = (filters) => {
    console.log("Applying filter criteria:", filters);
    setFilterCriteria(filters);
    setIsFiltering(false);
  };

  const handleCloseEditDialog = () => {
    setEditingScenario(null);
  };
  const handleCloseAddDialog = () => {
    setIsAddingScenario(false);
  };
  const handleCloseFilterDialog = () => {
    setIsFiltering(false);
  };

  return (
    <div className="p-4">
      <ScenarioManagementHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNewClick={handleAddNewClick}
        onFilterClick={handleFilterClick}
      />

      <ScenarioTable
        data={filteredAndSortedScenarios}
        onEditClick={handleEditClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {editingScenario && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <EditScenario
            scenarioData={editingScenario}
            onSave={handleUpdateScenario}
            onClose={handleCloseEditDialog}
          />
        </div>
      )}

      {isAddingScenario && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <AddScenario
            onSave={handleAddScenario}
            onClose={handleCloseAddDialog}
          />
        </div>
      )}

      {isFiltering && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <ScenarioFilterForm
            initialFilters={filterCriteria}
            onApplyFilters={handleApplyFilters}
            onClose={handleCloseFilterDialog}
          />
        </div>
      )}
    </div>
  );
}

export default ScenarioPage;
