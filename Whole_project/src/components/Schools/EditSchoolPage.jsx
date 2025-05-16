import React, { useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { parse, format, isValid } from "date-fns";

function EditSchoolPage({ schoolToEdit, onUpdateSchool, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
      const parsedStartDate = schoolToEdit.startDate
        ? parse(schoolToEdit.startDate, "dd/MM/yyyy", new Date())
        : null;
      const parsedEndDate = schoolToEdit.expireDate
        ? parse(schoolToEdit.expireDate, "dd/MM/yyyy", new Date())
        : null;

      let initialSubscriptionType = "Premium";
      let initialDuration = "";

      if (schoolToEdit.subscription) {
        if (schoolToEdit.subscription.includes("(1 Year)")) {
          initialDuration = "1 Year";
        }
      }

      reset({
        schoolName: schoolToEdit.schoolName,
        shortDescription: schoolToEdit.description,
        emailAddress: schoolToEdit.email,
        subscriptionType: initialSubscriptionType,
        duration: initialDuration,
        startDate: isValid(parsedStartDate) ? parsedStartDate : null,
        endDate: isValid(parsedEndDate) ? parsedEndDate : null,
        status: schoolToEdit.status,
        permissions: schoolToEdit.permissions || "Read Only",
      });
    } else {
      console.warn("EditSchoolPage rendered without schoolToEdit prop.");
    }
  }, [schoolToEdit, reset]);

  const onSubmit = (data) => {
    console.log("Submitting Updated Form Data:", data);

    const submissionData = {
      id: schoolToEdit.id,
      schoolName: data.schoolName,
      description: data.shortDescription,
      email: data.emailAddress,
      subscription: data.duration ? `Subscription (${data.duration})` : "",
      subscriptionType: data.subscriptionType,
      startDate: isValid(data.startDate)
        ? format(data.startDate, "dd/MM/yyyy")
        : null,
      expireDate: isValid(data.endDate)
        ? format(data.endDate, "dd/MM/yyyy")
        : null,
      status: data.status,
      permissions: data.permissions,
    };

    if (onUpdateSchool) {
      onUpdateSchool(submissionData);
    }

    onClose();
  };

  const handleDiscardOrClose = () => {
    console.log("Discarding changes or closing form");

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

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 p-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-2">Edit School</h2>
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 px-6"
        >
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.schoolName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.schoolName.message}
              </p>
            )}
          </div>

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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Premium">Premium</option>
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 appearance-none bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Duration</option>
                  <option value="1 Year">1 Year</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>

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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.emailAddress && (
              <p className="mt-1 text-xs text-red-600">
                {errors.emailAddress.message}
              </p>
            )}
          </div>

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
                render={({ field }) => (
                  <DatePicker
                    id="startDate"
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    popperPlacement="bottom-start"
                  />
                )}
              />
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
                render={({ field }) => (
                  <DatePicker
                    id="endDate"
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none"
                    popperPlacement="bottom-end"
                  />
                )}
              />
            </div>
          </div>

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
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          <div className="grid gap-2 mt-4">
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

        <div className="flex justify-end space-x-4 mt-6 p-6 border-t">
          <button
            type="button"
            onClick={handleDiscardOrClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            disabled={!isDirty}
          >
            Discard Changes
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            disabled={!isDirty}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSchoolPage;
