import React, { useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

function Profile() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // State for previewing selected image
  const { photoUser, setPhotoUser } = useStateContext();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(file); // Store the file object
        setPhotoPreview(event.target.result); // Update preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      console.error("No avatar selected");
      return; // Prevent sending request without a file
    }

    const formData = new FormData();
    formData.append("avatar", photo); // Append the file object

    try {
      const response = await axiosClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure header for file upload
        },
      });
      if (response.status === 200) {
        const responseData = response.data;
        setPhotoPreview(responseData.avatar); // Update preview with uploaded image URL (if available)
        console.log("Avatar uploaded successfully!");
        window.location.reload();
      } else {
        console.error("Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleFormSubmit}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Information
            </h2>
            <div className="mb-6">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Photo
              </label>
              <div className="flex items-center mt-1">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <label
                  htmlFor="file-upload"
                  className="ml-4 cursor-pointer bg-white py-2 px-4 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Upload
                  <input
                    id="file-upload"
                    name="avatar"
                    type="file"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-end space-x-4">
                <button type="button" className="...">
                  Cancel
                </button>
                <button type="submit" className="...">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
