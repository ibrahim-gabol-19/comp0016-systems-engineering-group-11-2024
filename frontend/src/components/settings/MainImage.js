import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const MainImage = ({ onFilesUploaded, defaultLogo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // State to store the image preview
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }

    const file = acceptedFiles[0];
    const validExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (file && file.type.startsWith("image/") && validExtensions.includes(fileExtension)) {
      console.log("File accepted:", file);
      onFilesUploaded([file]); // Notify parent about the uploaded file
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image
    } else {
      alert("Please upload a valid image file (JPG, JPEG, PNG, GIF).");
    }
  };

  const {  getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/gif": [],
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
<div
  className={`flex w-3/4 h-3/4 bg-gray-200 py-6 border-2 border-dashed rounded-lg  justify-center items-center flex-col ${isDragging ? "border-green-500" : "border-gray-400"}`}
>
  <input classname="flex flex-col h-full w-full" {...getInputProps()} ref={fileInputRef} />
  
  <div className="text-center flex flex-col w-full h-full">
    {/* Image Preview */}
    {previewImage ? (
      <div className="flex w-full h-full justify-center items-center ">
        <img
          src={previewImage}
          alt="Preview"
          className="flex w-24  object-contain rounded-lg"
        />
      </div>
    ) : defaultLogo ? (
      <div className="flex w-full h-full  justify-center items-center ">
        <img
          src={defaultLogo}
          alt="Preview"
          className="flex w-24 h-20 object-contain rounded-lg"
        />
      </div>
    ) : null}

    {/* Upload Instructions */}
    <p className="w-full h-full text-gray-600 text-xs text-wrap font-semibold">
      Drag and drop, or{"\n "}
      <span
        onClick={handleFileUploadClick}
        className="text-blue-500 underline cursor-pointer"
      >
        click to upload
      </span>
    </p>
  </div>
</div>

  );
};

export default MainImage;
