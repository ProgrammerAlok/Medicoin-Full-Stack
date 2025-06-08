import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [task, setTask] = useState("classification");
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
  console.info(result);

  return (
    <div className="bg-gray-100  size-full">
      <h1
        className="text-4xl font-bold text-blue-600 mb-6"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        Advanced Medical Image Processing Platform
      </h1>
      <div
        style={{
          height: "calc(100vh - 5rem)",
        }}
        className=" overflow-y-scroll w-full flex flex-col items-center "
      >
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
                  className="max-w-full h-10 object-contain mx-auto"
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
              {/* <option value="segmentation">Segmentation</option> */}
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
        {/* {result && task === "segmentation" && (
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
      )} */}
        {result && task === "classification" && (
          <div className="mt-6 flex flex-col items-center w-full">
            <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-lg w-full border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Classification Result
              </h2>
              <div className="mb-4">
                <span className="font-semibold text-gray-700 text-lg">
                  Prediction:
                </span>{" "}
                <span
                  className={`ml-2 text-2xl font-bold ${
                    result.classification.prediction === "Malignant"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {result.classification.prediction}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-700 text-lg">
                  Probability of Malignancy:
                </span>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-6 mr-3 overflow-hidden">
                    <div
                      className={`h-6 rounded-full transition-all duration-500 ${
                        result.classification.probability >= 70
                          ? "bg-red-500"
                          : result.classification.probability >= 30
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${result.classification.probability}%`,
                        minWidth: "2rem",
                      }}
                    ></div>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      result.classification.probability >= 70
                        ? "text-red-600"
                        : result.classification.probability >= 30
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {result.classification.probability}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 rounded-lg mt-3">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Segmentation Mask</span>
                  <img
                    className="rounded-lg bg-cover size-[20rem] border border-gray-200"
                    src={`http://localhost:8000${result.segmentation_mask_url}`}
                    alt="segmentation_mask_url"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Annotated Image</span>
                  <img
                    className="rounded-lg bg-cover size-[20rem] border border-gray-200"
                    src={`http://localhost:8000${result.annotated_image_url}`}
                    alt="annotated_image_url"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
