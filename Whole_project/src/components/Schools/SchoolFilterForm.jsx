// src/components/Schools/SchoolFilterForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid } from "date-fns";

// Reusable SVG icon (Full code provided)
const ChevronDownIcon = () => (
  <svg
    className="fill-current h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  </svg>
);

function SchoolFilterForm({ initialFilters, onApplyFilters, onClose }) {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: initialFilters || {
      status: "",
      subscription: "",
      permissions: "",
      startDateAfter: null,
      expireDateBefore: null,
    },
  });

  const onSubmit = (data) => {
    // Format dates to DD/MM/YYYY strings for backend API calls if needed for filter
    const formattedFilters = {
      ...data,
      startDateAfter: isValid(data.startDateAfter)
        ? format(data.startDateAfter, "dd/MM/yyyy")
        : undefined,
      expireDateBefore: isValid(data.expireDateBefore)
        ? format(data.expireDateBefore, "dd/MM/yyyy")
        : undefined,
    };

    if (onApplyFilters) {
      onApplyFilters(formattedFilters);
    }
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter Schools</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        {/* Status Filter */}
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Subscription Filter */}
        <div className="grid gap-2">
          <label
            htmlFor="filterSubscription"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription
          </label>
          <div className="relative">
            <select
              id="filterSubscription"
              {...register("subscription")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="">All Subscriptions</option>
              <option value="Subscription (1 Year)">
                Subscription (1 Year)
              </option>
              <option value="Expired">Expired</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Permissions Filter */}
        <div className="grid gap-2">
          <label
            htmlFor="filterPermissions"
            className="block text-sm font-medium text-gray-700"
          >
            Permissions
          </label>
          <div className="relative">
            <select
              id="filterPermissions"
              {...register("permissions")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="">All Permissions</option>
              <option value="Read Only">Read Only</option>
              <option value="Write Only">Write Only</option>
              <option value="Both">Both</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Start Date After Filter */}
        <div className="grid gap-2">
          <label
            htmlFor="filterStartDateAfter"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date After
          </label>
          <Controller
            control={control}
            name="startDateAfter"
            render={({ field }) => (
              <DatePicker
                id="filterStartDateAfter"
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            )}
          />
        </div>

        {/* Expire Date Before Filter */}
        <div className="grid gap-2">
          <label
            htmlFor="filterExpireDateBefore"
            className="block text-sm font-medium text-gray-700"
          >
            Expire Date Before
          </label>
          <Controller
            control={control}
            name="expireDateBefore"
            render={({ field }) => (
              <DatePicker
                id="filterExpireDateBefore"
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              />
            )}
          />
        </div>

        {/* Action Buttons */}
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

export default SchoolFilterForm;
