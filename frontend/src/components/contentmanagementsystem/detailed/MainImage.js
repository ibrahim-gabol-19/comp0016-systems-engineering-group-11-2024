import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const MainImage = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // State to store the image preview
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    // Only allow one file and ensure it is an image
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }

    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      onFilesUploaded(acceptedFiles); // Trigger the parent function to handle uploaded files
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image
      alert(`Uploaded 1 file successfully!`);
    } else {
      alert("Please upload 1 valid image file.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1, // Only allow one file to be uploaded
    accept: "image/*", // Only accept image files
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      {...getRootProps()}
      className="relative w-full h-64 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex justify-center items-center"
    >
      <input {...getInputProps()} ref={fileInputRef} />
      {/* Drag-and-drop overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 pointer-events-none transition-opacity ${
          isDragging ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-gray-500 font-semibold text-center">
          Drag and drop files here to upload
        </p>
      </div>
      {/* Upload Button */}
      <button
        className="px-6 py-2 font-bold text-white bg-green-500 rounded-lg"
        onClick={handleFileUploadClick}
      >
        Upload Files
      </button>

      {/* Image preview */}
      {previewImage && (
        <div className="absolute bottom-4 left-4">
          <img
            src={previewImage}
            alt="Uploaded Preview"
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default MainImage;
