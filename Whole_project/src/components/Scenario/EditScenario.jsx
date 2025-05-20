import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; // Import useForm and Controller

// Assuming you have icons
// import chevronDownIconPng from '../path/to/chevron-down.png';
// import closeIconPng from '../path/to/close.png';

// Accept scenarioData prop for pre-filling, onSave, and onClose
function EditScenario({ scenarioData, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // Use isDirty to track if form has been changed
    reset, // Function to reset/populate form fields
    // control, // Needed if using components like DatePicker
  } = useForm({
    // No defaultValues here, as data comes from scenarioData prop via reset
    mode: "onBlur",
  });

  // Effect to populate the form when the scenarioData prop changes (i.e., when editing a different scenario)
  useEffect(() => {
    if (scenarioData) {
      // Use reset to populate the form fields with the current scenarioData.
      // This also sets the form's initial state for isDirty tracking.
      reset({
        scenarioName: scenarioData.scenarioName || "",
        description: scenarioData.description || "",
        creator: scenarioData.creator || "",
        avgTimeSpent: scenarioData.avgTimeSpent || "",
        status: scenarioData.status || "Draft", // Default if status is missing
        permissions: scenarioData.permissions || "Read Only", // Default if permissions missing
        // Map other fields as needed
      });
    } else {
      // Handle case where component is rendered without valid scenarioData
      console.warn("EditScenario rendered without scenarioData prop.");
      // Optionally navigate away or show an error message
      onClose(); // Close the modal if no data
    }
  }, [scenarioData, reset, onClose]); // Dependencies: re-run if scenarioData changes or reset/onClose functions change

  // Function called by handleSubmit if validation passes
  const onSubmit = (data) => {
    console.log("Submitting Updated Scenario Form Data:", data);

    // Prepare data for parent component, including the original ID
    const submissionData = {
      id: scenarioData.id, // Include the original ID for updating
      scenarioName: data.scenarioName,
      description: data.description,
      creator: data.creator,
      avgTimeSpent: data.avgTimeSpent,
      status: data.status,
      permissions: data.permissions,
      // Map other fields
    };

    if (onSave) {
      onSave(submissionData); // Call the parent's save handler
    }

    onClose(); // Close the modal/form
  };

  // Function called when Discard or Close button is clicked
  const handleDiscardOrClose = () => {
    console.log("Discarding changes or closing form");
    // No need to reset state here if the parent is closing the modal and managing state
    onClose(); // Close the modal/form
  };

  // Placeholder SVG for Chevron icon
  const ChevronDownIcon = () => (
    <svg
      className="fill-current h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  );
  // Placeholder SVG for Close icon
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

  // --- Rendered JSX ---
  return (
    // Modal Overlay (Parent component should handle
    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      {/* Flex container for title, badge, and close button */}
      <div className="flex items-center justify-between border-b pb-4 p-6">
        {" "}
        {/* Added padding */}
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-2">Edit Scenario</h2>
          {/* Unsaved Badge - show only if form is dirty (changes made) */}
          {isDirty && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
              Unsaved
            </span>
          )}
        </div>
        {/* Close Button */}
        <button
          type="button" // Important for buttons not meant to submit forms
          onClick={handleDiscardOrClose} // Use discard/close handler
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          title="Close"
        >
          <CloseIcon /> {/* Use SVG component or img tag */}
        </button>
      </div>

      {/* Form Fields Section */}
      {/* Added padding and gap for fields */}
      {/* No need for onSubmit={handleSubmit(onSubmit)} on the form if calling handleSubmit on button */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 px-6">
        {/* Scenario Name Input */}
        <div className="grid gap-2">
          <label
            htmlFor="scenarioName"
            className="block text-sm font-medium text-gray-700"
          >
            Scenario Name
          </label>
          <input
            type="text"
            id="scenarioName"
            {...register("scenarioName", {
              required: "Scenario Name is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.scenarioName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.scenarioName.message}
            </p>
          )}
        </div>

        {/* Description Textarea */}
        <div className="grid gap-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Creator Input */}
        <div className="grid gap-2">
          <label
            htmlFor="creator"
            className="block text-sm font-medium text-gray-700"
          >
            Creator
          </label>
          <input
            type="text"
            id="creator"
            {...register("creator", { required: "Creator is required" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.creator && (
            <p className="mt-1 text-xs text-red-600">
              {errors.creator.message}
            </p>
          )}
        </div>

        {/* Avg. Time Spent Input */}
        <div className="grid gap-2">
          <label
            htmlFor="avgTimeSpent"
            className="block text-sm font-medium text-gray-700"
          >
            Avg. Time Spent
          </label>
          <input
            type="text"
            id="avgTimeSpent"
            {...register("avgTimeSpent")} // Add validation if needed
            placeholder="e.g., 30 Minutes"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.avgTimeSpent && (
            <p className="mt-1 text-xs text-red-600">
              {errors.avgTimeSpent.message}
            </p>
          )}
        </div>

        {/* Status Select */}
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Permissions Radio Buttons */}
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

        {/* Placeholder for All Educators section */}
        <div className="grid gap-2 mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
            All Educators
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full mr-3"
                  src="https://via.placeholder.com/150"
                  alt="Educator"
                />
                <span className="text-gray-900 text-sm font-medium">
                  Zaire Saris
                </span>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
              >
                ...
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full mr-3"
                  src="https://via.placeholder.com/150"
                  alt="Educator"
                />
                <span className="text-gray-900 text-sm font-medium">
                  Allison Schleifer
                </span>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
              >
                ...
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder for "Ask anything from AI" section */}
        <div className="grid gap-2 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything from AI"
              className="w-full px-4 pl-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 20.125v-3.38M9.663 17a3 3 0 11-2.885-3.374L3 10.35v4.63c0 .547.24.983.562 1.182a2.24 2.24 0 01.27 1.032V17h6.838zm4.674 0a3 3 0 102.885-3.374L21 10.35v4.63c0 .547-.24.983-.562 1.182a2.24 2.24 0 00-.27 1.032V17h-6.838z"
                ></path>
              </svg>
            </div>
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-600 hover:text-purple-800 focus:outline-none"
            >
              <svg
                className="h-5 w-5 transform rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-.197a1 1 0 00.937-.807l2.003-11.008a1 1 0 00-.946-1.105z"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Buttons Footer Section */}
      {/* Add padding, border-top, justify-end for button alignment */}
      <div className="flex justify-end space-x-4 mt-6 p-6 border-t border-gray-200">
        {/* Discard Changes Button */}
        <button
          type="button" // Important: type="button" prevents form submission
          onClick={handleDiscardOrClose} // Use discard/close handler
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium" // Styling
        >
          Discard Changes
        </button>
        {/* Save Changes Button */}
        <button
          type="submit" // Type="submit" works with handleSubmit on the form element
          onClick={handleSubmit(onSubmit)} // Or attach handleSubmit directly here
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50" // Styling including disabled state
          disabled={!isDirty} // Disable if the form hasn't been changed
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditScenario;
