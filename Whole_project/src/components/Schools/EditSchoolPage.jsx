import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

function EditSchoolPage({ schools, onUpdateSchool }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const schoolId = parseInt(id, 10);
    const schoolToEdit = schools.find((school) => school.id === schoolId);

    if (schoolToEdit) {
      reset({
        schoolName: schoolToEdit.schoolName,
        shortDescription: schoolToEdit.description,
        emailAddress: schoolToEdit.email,
        duration: schoolToEdit.subscription.includes("(1 Year)")
          ? "1 Year"
          : "",
        startDate: schoolToEdit.startDate,
        endDate: schoolToEdit.expireDate,
        status: schoolToEdit.status,
      });
    } else {
      console.error(`School with ID ${id} not found.`);
      navigate("/schools");
    }
  }, [id, schools, navigate, reset]);

  const onSubmit = (data) => {
    console.log("Updated Form Data:", data);
    if (onUpdateSchool) {
      onUpdateSchool({ ...data, id: parseInt(id, 10) });
    }
    navigate("/schools");
  };

  const handleDiscardOrClose = () => {
    console.log("Discarding changes or closing form");
    navigate("/schools");
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
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-2">Edit School</h2>
            {isDirty && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                Unsaved
              </span>
            )}
          </div>
          <button
            onClick={handleDiscardOrClose}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium text-gray-700 mb-1"
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

          <div className="mb-4">
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
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

          <div className="mb-4">
            <label
              htmlFor="emailAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              {...register("emailAddress", {
                required: "Email is required",
                pattern: /^\S+@\S+$/i,
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.emailAddress && (
              <p className="mt-1 text-xs text-red-600">
                {errors.emailAddress.message || "Invalid email format"}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
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

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="startDate"
                  {...register("startDate")}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="endDate"
                  {...register("endDate")}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleDiscardOrClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              disabled={!isDirty}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSchoolPage;
