// src/components/Settings/AccountSettingsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <<< ADD THIS IMPORT
import { useAuth } from "../../AuthContext"; // Adjust path if needed
import axios from "axios"; // For API calls later

// Icons (example using Heroicons, install if needed: npm install @heroicons/react)
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  UserCircleIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function AccountSettingsPage() {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);

  const [personalInfoMessage, setPersonalInfoMessage] = useState({
    text: "",
    type: "",
  });
  const [securityMessage, setSecurityMessage] = useState({
    text: "",
    type: "",
  });

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmailAddress(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setProfilePicturePreview(user.profilePictureUrl || null);
    }
  }, [user]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = async () => {
    // TODO: API call to remove profile picture from backend
    setProfilePicture(null);
    setProfilePicturePreview(null);
    alert("Profile picture removal to be implemented with backend.");
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePicture) {
      alert("Please select an image file first.");
      return;
    }
    // TODO: API call to upload profile picture
    alert("Profile picture upload to be implemented with backend.");
  };

  const handleSaveFullName = async () => {
    // TODO: API call to update full name
    setIsEditingFullName(false);
    alert(`Full name update to "${fullName}" to be implemented with backend.`);
  };

  const handleSavePhoneNumber = async () => {
    // TODO: API call to update phone number
    setIsEditingPhoneNumber(false);
    alert(
      `Phone number update to "${phoneNumber}" to be implemented with backend.`
    );
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityMessage({ text: "", type: "" });
    if (newPassword !== confirmNewPassword) {
      setSecurityMessage({
        text: "New passwords do not match.",
        type: "error",
      });
      return;
    }
    if (newPassword.length < 6) {
      setSecurityMessage({
        text: "New password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    // TODO: API call to update password
    alert("Password update to be implemented with backend.");
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Profile Picture Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Picture
        </h2>
        <div className="flex items-center space-x-6">
          {profilePicturePreview ? (
            <img
              src={profilePicturePreview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-24 h-24 text-gray-400" />
          )}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <label
                htmlFor="profile-picture-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Upload Image
              </label>
              <input
                id="profile-picture-upload"
                name="profile-picture-upload"
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg"
                onChange={handleProfilePictureChange}
              />
              {profilePicturePreview && (
                <button
                  onClick={handleUploadProfilePicture}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Save Upload
                </button>
              )}
            </div>
            {profilePicturePreview && (
              <button
                onClick={handleRemoveProfilePicture}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TrashIcon className="w-5 h-5 mr-2 text-red-500" />
                Remove
              </button>
            )}
            <p className="text-xs text-gray-500">
              We support PNGs, JPEGs under 10MB
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-1">
          Personal Information
        </h2>
        {personalInfoMessage.text && (
          <p
            className={`text-sm mb-3 ${
              personalInfoMessage.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {personalInfoMessage.text}
          </p>
        )}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-medium text-gray-500 uppercase"
            >
              Full Name
            </label>
            {isEditingFullName ? (
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2"
                />
                <button
                  onClick={() => {
                    setIsEditingFullName(false);
                    setFullName(user.name);
                  }}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveFullName}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <p className="text-gray-900 sm:text-sm py-2">{fullName}</p>
                <button
                  onClick={() => setIsEditingFullName(true)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <hr />
          {/* Email Address (Display only for now) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">
              Email Address
            </label>
            <div className="mt-1 flex justify-between items-center">
              <p className="text-gray-900 sm:text-sm py-2">{emailAddress}</p>
            </div>
          </div>
          <hr />
          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-xs font-medium text-gray-500 uppercase"
            >
              Phone Number
            </label>
            {isEditingPhoneNumber ? (
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2"
                  placeholder="+1234567890"
                />
                <button
                  onClick={() => {
                    setIsEditingPhoneNumber(false);
                    setPhoneNumber(user.phoneNumber || "");
                  }}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  Discard
                </button>
                <button
                  onClick={handleSavePhoneNumber}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <p className="text-gray-900 sm:text-sm py-2">
                  {phoneNumber || "Not provided"}
                </p>
                <button
                  onClick={() => setIsEditingPhoneNumber(true)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Security Settings Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-1">
          Security Settings
        </h2>
        {securityMessage.text && (
          <p
            className={`text-sm mb-3 ${
              securityMessage.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {securityMessage.text}
          </p>
        )}
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter Current Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Create a New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Repeat New Password"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showConfirmNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-600 hover:text-orange-800 hover:underline"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AccountSettingsPage;
