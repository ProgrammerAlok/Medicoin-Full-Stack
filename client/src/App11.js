import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [task, setTask] = useState("segmentation");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
    setError(null);
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
      const response = await fetch("http://localhost:5000/process/", {
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
    <div className="App">
      <h1>Medical Image Processing Demo</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <label>
          Select Task:{" "}
          <select value={task} onChange={handleTaskChange}>
            <option value="segmentation">Segmentation</option>
            <option value="classification">Classification</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Process"}
        </button>
      </form>
      {error && <p className="error">Error: {error}</p>}
      {result && task === "segmentation" && (
        <div>
          <h2>Segmented Image:</h2>
          <img
            src={result}
            alt="Segmented result"
            style={{ maxWidth: "100%", marginTop: "20px" }}
          />
        </div>
      )}
      {result && task === "classification" && (
        <div>
          <h2>Classification Result:</h2>
          <p>
            Prediction: {result.prediction} <br />
            Probability of Malignancy: {result.probability}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
