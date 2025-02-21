import React, { useRef, useState, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom"; // For dynamic routing
import Header from "../../components/Header";
import axios from "axios";

const NEW_EVENT_ID = "0";
const DetailedEventPage = () => {
  const quillRefTitle = useRef();
  const quillRefDescription = useRef();
  const quillRefLocation = useRef();
  const { eventId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // State for PDF and ICS extraction
  const [pdfFile, setPdfFile] = useState(null);
  const [icsFile, setIcsFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDataExtracted, setIsDataExtracted] = useState(false);

  // Refs for hidden file inputs
  const hiddenFileInputPDF = useRef(null);
  const hiddenFileInputICS = useRef(null);

  useEffect(() => {
    if (eventId !== NEW_EVENT_ID) {
      console.log("useEffect is running");
      console.log("event id received was", eventId);
      setIsEditing(false); // initially view preview when clicking box
      const token = localStorage.getItem("token");
      // Fetch article data when editing an existing article
      axios
        .get(`http://127.0.0.1:8000/events/${eventId}/`, {
          headers: { Authorization: `Bearer ${token}` },  // ✅ Include token
      })
        .then((response) => {
          const event = response.data;
          console.log("API response:", event); // Log the API response
          setTitle(event.title || "");
          console.log("Title set ", event.title);
          setTime(event.time || "");
          setDate(event.date || "");
          setDescription(event.description || "");
          setLocation(event.location || "");
          if (event.main_image) {
            setUploadedFiles([event.main_image]);
          }
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
          alert("Failed to fetch article data. Please try again.");
        });
    }
  }, [eventId]);

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

  const handleSave = async () => {
    const token=localStorage.getItem('token');
    console.log("Save button clicked");

    if (!title || !date || !time || !description || !location) {
      alert("Please fill in all fields before saving.");
      return;
    }

    // Prepare the form data to be sent to the backend
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("location", location);

    // Add uploaded files to formData (only one image)
    if (uploadedFiles.length > 0 && typeof uploadedFiles[0] !== "string") {
      formData.append("main_image", uploadedFiles[0]);
    }

    try {
      if (eventId !== NEW_EVENT_ID) {
        const token = localStorage.getItem("token");
        // PUT operation for updating an existing article
        await axios.put(
          `http://127.0.0.1:8000/events/${eventId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        alert("Event updated successfully!");
      } else {
        // POST operation for creating a new article
        await axios.post(
          "http://127.0.0.1:8000/events/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        alert("Event saved successfully!");
      }
    } catch (error) {
      console.error("Error saving or updating event:", error);
      alert("Error saving or updating event. Please try again.");
    }
  };

  const handleExtractFromPDFClick = () => {
    hiddenFileInputPDF.current.click();
    setIsDataExtracted(false);
  };

  const handleExtractFromICSClick = () => {
    hiddenFileInputICS.current.click();
    setIsDataExtracted(false);
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleICSUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/calendar") {
      setIcsFile(file);
    }
  };

  const handleUploadPDF = async () => {
    if (!pdfFile) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf_file", pdfFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/event/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setExtractedData(data);
      populateFields(data);
      setIsDataExtracted(true);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadICS = async () => {
    if (!icsFile) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("ics_file", icsFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload_ics/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setExtractedData(data);
      populateFields(data);
      setIsDataExtracted(true);
    } catch (error) {
      console.error("Error uploading ICS:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const populateFields = (data) => {
    if (quillRefTitle.current) {
      quillRefTitle.current.setContents([{ insert: data.title || "" }]);
    }
    if (quillRefDescription.current) {
      quillRefDescription.current.setContents([{ insert: data.description || "" }]);
    }
    if (quillRefLocation.current) {
      quillRefLocation.current.setContents([{ insert: data.location || "" }]);
    }

    if (data.date_of_event) {
      // Convert date from dd/mm/yyyy to yyyy-mm-dd format for the date picker
      const [day, month, year] = data.date_of_event.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }

    if (data.time_of_event) {
      setTime(data.time_of_event);
    }

    if (data.images && data.images.length > 0) {
      setUploadedFiles(data.images);
    }
  };

  useEffect(() => {
    if (isEditing && extractedData) {
      populateFields(extractedData);
    }
  }, [isEditing, extractedData]);

  return (
    <div>
      <Header />            
      <div className="pt-20"></div>
      <div className="p-6">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={handleExtractFromPDFClick}
          className="bg-purple-500 text-white px-4 py-2 rounded ml-4"
        >
          Extract From PDF
        </button>
        <button
          onClick={handleExtractFromICSClick}
          className="bg-teal-500 text-white px-4 py-2 rounded ml-4"
        >
          Extract From ICS
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={hiddenFileInputPDF}
          onChange={handlePDFUpload}
          style={{ display: "none" }}
        />
        <input
          type="file"
          accept="text/calendar"
          ref={hiddenFileInputICS}
          onChange={handleICSUpload}
          style={{ display: "none" }}
        />
      </div>

      {pdfFile && (
        <div className="p-6">
          <p>
            <strong>Selected PDF:</strong> {pdfFile.name}
          </p>
          <button
            onClick={handleUploadPDF}
            disabled={isUploading}
            className={`${
              isDataExtracted ? "bg-green-500" : "bg-orange-500"
            } text-white px-4 py-2 rounded`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload PDF"}
          </button>
        </div>
      )}

      {icsFile && (
        <div className="p-6">
          <p>
            <strong>Selected ICS:</strong> {icsFile.name}
          </p>
          <button
            onClick={handleUploadICS}
            disabled={isUploading}
            className={`${
              isDataExtracted ? "bg-green-500" : "bg-orange-500"
            } text-white px-4 py-2 rounded`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload ICS"}
          </button>
        </div>
      )}

      <div className="flex justify-center items-center overflow-hidden relative">
        {isEditing ? (
          <div>
            <TitleEditor
              ref={quillRefTitle}
              placeholderText="Title"
              fontSize="16px"
              defaultValue={title}
              onTextChange={setTitle}
            />
            <DateTime
              date={date}
              time={time}
              onDateChange={setDate}
              onTimeChange={setTime}
            />

            <NoToolbarEditor
              ref={quillRefDescription}
              placeholderText="Description"
              fontSize="16px"
              defaultValue={description}
              onTextChange={setDescription}
            />
            <MainImage onFilesUploaded={handleFilesUploaded} />
            <NoToolbarEditor
              ref={quillRefLocation}
              placeholderText="Location"
              fontSize="16px"
              defaultValue={location}
              onTextChange={setLocation}
            />
          </div>
        ) : (
          <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="max-w-3xl w-full bg-white p-6 rounded-md shadow-md">
              {/* Title and Author Section */}
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
                  {title}
                </h1>
                <p className="text-lg text-gray-500 ml-4">
                  {date} {time}
                </p>
              </div>

              <div className="mt-4">
                {uploadedFiles.length > 0 && uploadedFiles[0] && (
                  <img
                    src={
                      typeof uploadedFiles[0] === "string"
                        ? uploadedFiles[0]
                        : URL.createObjectURL(uploadedFiles[0])
                    }
                    alt="Main"
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                )}
              </div>

              {/* Description Section */}
              <p className="text-lg mt-6 text-gray-600 italic text-center">
                {description}
              </p>

              {/* Main Content Section */}
              <p className="text-lg mt-4 text-gray-700 text-center">
                {location}
              </p>

              {/* Images */}
              <div className="mt-6 flex justify-center flex-wrap gap-6">
                {uploadedFiles.length > 1 &&
                  uploadedFiles.slice(1).map((file, index) => (
                    <div
                      key={index}
                      className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                    >
                      <p className="text-sm text-gray-700">{file.name}</p>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded File"
                        className="w-full h-48 object-cover rounded-md mt-2"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedEventPage;





