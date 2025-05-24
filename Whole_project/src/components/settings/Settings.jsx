import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const initialUserData = {
  profilePictureUrl: "https://via.placeholder.com/150/FF5733/FFFFFF?text=JD",
  fullName: "John Doe",
  email: "johndoe123@gmail.com",
  phoneNumber: "+123456789",
  twoFactorEnabled: true,
};

const EditIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    ></path>
  </svg>
);

const EyeIcon = ({ isVisible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
  >
    {isVisible ? (
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
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        ></path>
      </svg>
    ) : (
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
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.07 10.07 0 01.681-1.11l-.003-.002A1.105 1.105 0 013.3 9.242m2.292 5.46a3 3 0 104.243-4.243m1.765 2.47a1.313 1.313 0 01-.776-.5V7.071c0-1.006.811-1.817 1.817-1.817.552 0 1.053.247 1.406.665m0 0a1.997 1.997 0 011.414-.665C18.281 5.254 19 6.065 19 7.071v1.07a1.147 1.147 0 01-.776.51l-.776-.51zM7.172 7.172A7 7 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.07 10.07 0 01-.681 1.11l-.003.002A1.105 1.105 0 0120.7 14.758l-2.292-5.46z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    )}
  </button>
);

const ToggleSwitch = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      enabled ? "bg-blue-600" : "bg-gray-200"
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    ></span>
  </button>
);

function SettingsPage() {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    initialUserData.twoFactorEnabled
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmConfirmPassword] = useState(false);

  const personalForm = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: initialUserData.fullName,
      email: initialUserData.email,
      phoneNumber: initialUserData.phoneNumber,
    },
  });

  useEffect(() => {
    personalForm.reset({
      fullName: initialUserData.fullName,
      email: initialUserData.email,
      phoneNumber: initialUserData.phoneNumber,
    });
  }, [initialUserData, personalForm.reset]);

  const onPersonalSubmit = (data) => {
    console.log("Personal Info Saved:", data);
  };

  const handlePersonalDiscard = () => {
    console.log("Personal Info Discarded");
    personalForm.reset();
  };

  const securityForm = useForm({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSecuritySubmit = (data) => {
    console.log("Password Updated:", data);
    if (data.newPassword !== data.confirmPassword) {
      console.error("New password and confirm password do not match!");
      securityForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    securityForm.reset();
  };

  const handleTwoFactorToggle = () => {
    console.log("Two-Factor toggled to:", !isTwoFactorEnabled);
    setIsTwoFactorEnabled((prev) => !prev);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <img
            src={initialUserData.profilePictureUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="flex space-x-3 mb-2">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Upload Image
              </button>
              <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                Remove
              </button>
            </div>
            <p className="text-xs text-gray-500">
              We support PNGs, JPEGs under 10MB
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <form
          onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
          className="grid gap-4"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 flex-shrink-0 mr-4"
            >
              FULL NAME
            </label>
            <div className="flex items-center flex-grow relative">
              <input
                type="text"
                id="fullName"
                {...personalForm.register("fullName", {
                  required: "Full Name is required",
                })}
                className="flex-grow px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
              />
              {personalForm.formState.isDirty && (
                <div className="flex space-x-2 absolute right-0 top-0 bottom-0 items-center bg-white pr-2">
                  <button
                    type="button"
                    onClick={handlePersonalDiscard}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
                    disabled={!personalForm.formState.isDirty}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            {personalForm.formState.errors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {personalForm.formState.errors.fullName.message}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 flex-shrink-0 mr-4"
            >
              EMAIL ADDRESS
            </label>
            <div className="flex items-center flex-grow">
              <input
                type="email"
                id="email"
                {...personalForm.register("email", {
                  required: "Email is required",
                  pattern: /^\S+@\S+\.\S+$/i,
                })}
                className="flex-grow px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              >
                <EditIcon />
              </button>
            </div>
            {personalForm.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600 col-span-2">
                {personalForm.formState.errors.email.message ||
                  "Invalid email format"}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 flex-shrink-0 mr-4"
            >
              PHONE NUMBER
            </label>
            <div className="flex items-center flex-grow">
              <input
                type="text"
                id="phoneNumber"
                {...personalForm.register("phoneNumber")}
                className="flex-grow px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              >
                <EditIcon />
              </button>
            </div>
            {personalForm.formState.errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600 col-span-2">
                {personalForm.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <form
          onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                {...securityForm.register("currentPassword", {
                  required: "Current password is required",
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon
                  isVisible={showCurrentPassword}
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                />
              </div>
            </div>
            {securityForm.formState.errors.currentPassword && (
              <p className="mt-1 text-xs text-red-600">
                {securityForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                {...securityForm.register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon
                  isVisible={showNewPassword}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                />
              </div>
            </div>
            {securityForm.formState.errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">
                {securityForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...securityForm.register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === securityForm.getValues("newPassword") ||
                    "Passwords do not match",
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon
                  isVisible={showConfirmPassword}
                  onClick={() => setShowConfirmConfirmPassword((prev) => !prev)}
                />
              </div>
            </div>
            {securityForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {securityForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              disabled={
                !securityForm.formState.isDirty ||
                !securityForm.formState.isValid
              }
            >
              Update Password
            </button>
          </div>
        </form>
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="block text-sm font-medium text-gray-700">
              Two-Factor Authentication
            </span>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Lorem ipsum dolor sit amet consectetur vitae pellentesque egestas.
            </p>
          </div>
          <ToggleSwitch
            enabled={isTwoFactorEnabled}
            onToggle={handleTwoFactorToggle}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
