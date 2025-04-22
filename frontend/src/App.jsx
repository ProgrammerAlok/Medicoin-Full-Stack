import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [task, setTask] = useState("segmentation");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTaskChange = (event) => {
    setTask(event.target.value);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("task", task);

      // Adjust the URL if your FastAPI server is hosted elsewhere.
      const response = await fetch("http://localhost:8000/process/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      if (task === "segmentation") {
        // For segmentation, the backend returns an image file.
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResult(imageUrl);
      } else if (task === "classification") {
        // For classification, the backend returns JSON.
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1
        className="text-4xl font-bold text-blue-600 mb-6"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        Advanced Medical Image Processing Platform
      </h1>
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div
          className={`border-2 border-dashed rounded-lg p-4 mb-4 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="block text-center text-gray-500 cursor-pointer"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-40 object-contain mx-auto"
              />
            ) : selectedFile ? (
              `Selected File: ${selectedFile.name}`
            ) : (
              "Drag and drop an image here, or click to select one"
            )}
          </label>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Task:
          <select
            value={task}
            onChange={handleTaskChange}
            className="block w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="segmentation">Segmentation</option>
            <option value="classification">Classification</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 text-white font-bold rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Upload and Process"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-sm font-semibold mt-4">
          Error: {error}
        </p>
      )}
      {result && task === "segmentation" && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Segmented Image:
          </h2>
          <img
            src={result}
            alt="Segmented result"
            className="max-w-full rounded shadow-lg"
          />
        </div>
      )}
      {result && task === "classification" && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Classification Result:
          </h2>
          <p className="text-gray-600">
            <span className="font-semibold">Prediction:</span>{" "}
            {result.prediction} <br />
            <span className="font-semibold">
              Probability of Malignancy:
            </span>{" "}
            {result.probability}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
