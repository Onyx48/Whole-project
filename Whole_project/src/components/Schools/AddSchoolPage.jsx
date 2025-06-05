// src/components/Schools/EditSchoolPage.jsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format, isValid } from "date-fns";

// Reusable SVG icons
const ChevronDownIcon = () => (
  <svg
    className="fill-current h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

function EditSchoolPage({ schoolToEdit, onUpdateSchool, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    control,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      schoolName: "",
      shortDescription: "",
      emailAddress: "",
      subscriptionType: "Premium",
      duration: "",
      startDate: null,
      endDate: null,
      status: "Active",
      permissions: "Read Only",
    },
  });

  useEffect(() => {
    if (schoolToEdit) {
      // Backend stores dates as ISO strings (or Date objects), convert to Date objects for DatePicker
      const parsedStartDate = schoolToEdit.startDate
        ? new Date(schoolToEdit.startDate)
        : null;
      const parsedEndDate = schoolToEdit.expireDate
        ? new Date(schoolToEdit.expireDate)
        : null;

      // Extract duration from subscription string if it contains it
      let initialDuration = "";
      if (
        schoolToEdit.subscription &&
        schoolToEdit.subscription.includes("Subscription (")
      ) {
        const match = schoolToEdit.subscription.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          initialDuration = match[1]; // e.g., "1 Year"
        }
      } else if (schoolToEdit.duration) {
        // Fallback if backend sends 'duration' directly
        initialDuration = schoolToEdit.duration;
      }

      reset({
        schoolName: schoolToEdit.schoolName,
        shortDescription: schoolToEdit.description,
        emailAddress: schoolToEdit.email,
        subscriptionType: schoolToEdit.subscriptionType || "Premium",
        duration: initialDuration,
        startDate: isValid(parsedStartDate) ? parsedStartDate : null,
        endDate: isValid(parsedEndDate) ? parsedEndDate : null,
        status: schoolToEdit.status || "Active",
        permissions: schoolToEdit.permissions || "Read Only",
      });
    } else {
      console.warn(
        "EditSchoolPage rendered without schoolToEdit prop. Closing."
      );
      onClose(); // Automatically close if no school is provided for editing
    }
  }, [schoolToEdit, reset, onClose]); // Added onClose to dependency array

  const onSubmit = (data) => {
    if (
      isValid(data.startDate) &&
      isValid(data.endDate) &&
      data.endDate < data.startDate
    ) {
      alert("End Date cannot be before Start Date. Please correct the dates.");
      return;
    }
    const submissionData = {
      _id: schoolToEdit._id, // Use MongoDB's _id for update operations
      schoolName: data.schoolName,
      description: data.shortDescription,
      email: data.emailAddress,
      subscriptionType: data.subscriptionType,
      duration: data.duration,
      startDate: data.startDate,
      expireDate: data.endDate,
      status: data.status,
      permissions: data.permissions,
    };
    if (onUpdateSchool) {
      onUpdateSchool(submissionData);
    }
  };

  const handleDiscardOrClose = () => {
    // A proper "Discard Changes" for edit form usually resets to original schoolToEdit values.
    // To do that, you'd store schoolToEdit in a useRef or use a separate state variable initialized with it.
    reset(); // Resets to defaultValues or the last values set by useEffect
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 p-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-2 text-gray-800">
              Edit School
            </h2>
            {isDirty && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                Unsaved
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleDiscardOrClose}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 px-6"
        >
          {/* School Name */}
          <div className="grid gap-2">
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium text-gray-700"
            >
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              {...register("schoolName", {
                required: "School Name is required",
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            {errors.schoolName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="grid gap-2">
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <textarea
              id="shortDescription"
              {...register("shortDescription")}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900"
            ></textarea>
          </div>

          {/* Subscription Type & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="subscriptionType"
                className="block text-sm font-medium text-gray-700"
              >
                Subscription Type
              </label>
              <div className="relative">
                <select
                  id="subscriptionType"
                  {...register("subscriptionType")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Premium">Premium</option>
                  {/* Add other options */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration
              </label>
              <div className="relative">
                <select
                  id="duration"
                  {...register("duration")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="">Select Duration</option>
                  <option value="1 Year">1 Year</option>
                  {/* Add other options */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="grid gap-2">
            <label
              htmlFor="emailAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              {...register("emailAddress", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            {errors.emailAddress && (
              <p className="mt-1 text-xs text-red-600">
                {errors.emailAddress.message}
              </p>
            )}
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <Controller
                control={control}
                name="startDate"
                rules={{ required: "Start Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    id="startDate"
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    popperPlacement="bottom-start"
                  />
                )}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <Controller
                control={control}
                name="endDate"
                rules={{ required: "End Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    id="endDate"
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    popperPlacement="bottom-end"
                  />
                )}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="permissions-read"
                  value="Read Only"
                  {...register("permissions")}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="permissions-read"
                  className="text-sm font-medium text-gray-700"
                >
                  Read Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="permissions-write"
                  value="Write Only"
                  {...register("permissions")}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="permissions-write"
                  className="text-sm font-medium text-gray-700"
                >
                  Write Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="permissions-both"
                  value="Both"
                  {...register("permissions")}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="permissions-both"
                  className="text-sm font-medium text-gray-700"
                >
                  Both
                </label>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                {...register("status")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end space-x-4 mt-6 p-6 border-t">
            <button
              type="button"
              onClick={handleDiscardOrClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              disabled={isSubmitting} // Disable during submission
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              disabled={isSubmitting} // Disable during submission
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSchoolPage;
