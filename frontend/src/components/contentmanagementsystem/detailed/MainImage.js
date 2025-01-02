import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const MainImage = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // State to store the image preview
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }

    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      onFilesUploaded([file]); // Notify parent about the uploaded file
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: "image/*",
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      {...getRootProps()}
      className={`relative w-full h-64 bg-gray-200 border-2 border-dashed rounded-lg flex justify-center items-center ${
        isDragging ? "border-green-500" : "border-gray-400"
      }`}
    >
      <input {...getInputProps()} ref={fileInputRef} />
      <div className="text-center">
        {!previewImage ? (
          <p className="text-gray-500 font-semibold">
            Drag & drop an image, or{" "}
            <span
              onClick={handleFileUploadClick}
              className="text-blue-500 underline cursor-pointer"
            >
              click to upload
            </span>
          </p>
        ) : (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <p className="text-gray-500 mt-2 text-sm">Preview of uploaded image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainImage;
