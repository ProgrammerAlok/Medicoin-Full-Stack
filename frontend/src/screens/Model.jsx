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

        // localStorage.clear()

        localStorage.setItem("data", 
          JSON.stringify([
            ...(JSON.parse(localStorage.getItem("data")) || []),
            data
          ])
        )        
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  console.info(result);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight pt-10">
        MediCoin Medical Image Assistant
      </h1>
      <div
        style={{
          height: "calc(100vh - 7rem)",
        }}
        className="overflow-y-scroll w-full flex flex-col items-center"
      >
        <form
          onSubmit={handleUpload}
          className="bg-white/10 backdrop-blur-lg shadow-xl rounded-3xl px-8 pt-8 pb-8 mb-4 w-full max-w-lg border border-white/10"
        >
          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-all ${
              dragActive ? "border-white/60 bg-white/5" : "border-white/20"
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
              className="block text-center text-gray-300 cursor-pointer"
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
          <label className="block text-white text-base font-semibold mb-2">
            Select Task:
            <select
              value={task}
              onChange={handleTaskChange}
              className="block w-full mt-2 p-2 border border-white/20 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {/* <option value="segmentation">Segmentation</option> */}
              <option value="classification">Classification</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 px-4 text-black font-bold rounded-xl bg-white hover:bg-black hover:text-white border border-white transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Upload and Process"}
          </button>
        </form>
        {error && (
          <div className="flex justify-center w-full">
            <div className="bg-red-900/80 text-red-200 px-6 py-3 rounded-2xl shadow mb-4 max-w-lg text-center border border-red-700">
              Error: {error}
            </div>
          </div>
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
          <div className="mt-8 flex flex-col items-center w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-10 py-8 max-w-2xl w-full border border-white/10 shadow-xl">
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 mr-2 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  MC
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  MediCoin Assistant
                </h2>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-200 text-lg">
                  Prediction:
                </span>{" "}
                <span
                  className={`ml-2 text-2xl font-bold ${
                    result?.classification?.prediction === "Malignant"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {result?.classification?.prediction ?? (
                    <span className="text-yellow-300">N/A</span>
                  )}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-200 text-lg">
                  Probability of Malignancy:
                </span>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-white/10 rounded-full h-6 mr-3 overflow-hidden">
                    <div
                      className={`h-6 rounded-full transition-all duration-500 ${
                        (result?.classification?.probability ?? 0) >= 70
                          ? "bg-red-500"
                          : (result?.classification?.probability ?? 0) >= 30
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${result?.classification?.probability ?? 0}%`,
                        minWidth: "2rem",
                      }}
                    ></div>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      (result?.classification?.probability ?? 0) >= 70
                        ? "text-red-400"
                        : (result?.classification?.probability ?? 0) >= 30
                        ? "text-yellow-300"
                        : "text-green-400"
                    }`}
                  >
                    {typeof result?.classification?.probability === "number"
                      ? `${result.classification.probability}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2 rounded-lg mt-3">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 mb-1">Segmentation Mask</span>
                  {result?.segmentation_mask_url ? (
                    <img
                      className="rounded-lg bg-cover w-80 h-80 border border-white/10 object-contain"
                      src={`http://localhost:8000${result.segmentation_mask_url}`}
                      alt="segmentation_mask_url"
                    />
                  ) : (
                    <span className="text-yellow-300">N/A</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 mb-1">Annotated Image</span>
                  {result?.annotated_image_url ? (
                    <img
                      className="rounded-lg bg-cover w-80 h-80 border border-white/10 object-contain"
                      src={`http://localhost:8000${result.annotated_image_url}`}
                      alt="annotated_image_url"
                    />
                  ) : (
                    <span className="text-yellow-300">N/A</span>
                  )}
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
