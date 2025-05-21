import React from "react";
import { useForm } from "react-hook-form";

function StudentFilterForm({ initialFilters, onApplyFilters, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialFilters || {
      studentName: "",
      schoolName: "",
      progressMin: "",
      progressMax: "",
    },
  });

  const onSubmit = (data) => {
    const formattedFilters = {
      ...data,
      progressMin:
        data.progressMin === "" ? null : parseFloat(data.progressMin),
      progressMax:
        data.progressMax === "" ? null : parseFloat(data.progressMax),
    };

    if (onApplyFilters) {
      onApplyFilters(formattedFilters);
    }
    onClose();
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
        <h3 className="text-lg font-semibold">Filter Students</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <label
            htmlFor="filterStudentName"
            className="block text-sm font-medium text-gray-700"
          >
            Student Name
          </label>
          <input
            type="text"
            id="filterStudentName"
            {...register("studentName")}
            placeholder="Enter Student Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="filterSchoolName"
            className="block text-sm font-medium text-gray-700"
          >
            School Name
          </label>
          <input
            type="text"
            id="filterSchoolName"
            {...register("schoolName")}
            placeholder="Enter School Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Progress (%)
          </label>
          <div className="flex space-x-4">
            <div className="w-1/2 grid gap-1">
              <label htmlFor="filterProgressMin" className="sr-only">
                Minimum Progress
              </label>
              <input
                type="number"
                id="filterProgressMin"
                {...register("progressMin", { min: 0, max: 100 })}
                placeholder="Min"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="w-1/2 grid gap-1">
              <label htmlFor="filterProgressMax" className="sr-only">
                Maximum Progress
              </label>
              <input
                type="number"
                id="filterProgressMax"
                {...register("progressMax", { min: 0, max: 100 })}
                placeholder="Max"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Close
          </button>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentFilterForm;
