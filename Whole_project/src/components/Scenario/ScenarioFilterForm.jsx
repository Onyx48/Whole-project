import React from "react";
import { useForm } from "react-hook-form";

function ScenarioFilterForm({ initialFilters, onApplyFilters, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialFilters || {
      status: "",
      creator: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Applying Filters:", data);
    if (onApplyFilters) {
      onApplyFilters(data);
    }
    onClose();
  };

  const handleClearFilters = () => {
    console.log("Clearing Filters");
    reset({
      status: "",
      creator: "",
    });
    if (onApplyFilters) {
      onApplyFilters({});
    }
  };

  const ChevronDownIcon = () => (
    <svg
      className="fill-current h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-lg font-semibold">Filter Scenarios</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="filterStatus"
              {...register("status")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="filterCreator"
            className="block text-sm font-medium text-gray-700"
          >
            Creator
          </label>
          <input
            type="text"
            id="filterCreator"
            {...register("creator")}
            placeholder="Enter Creator Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default ScenarioFilterForm;
