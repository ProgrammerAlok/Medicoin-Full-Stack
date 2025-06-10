import React from "react";

const Card = ({ data }) => {
  if (!data) return null;

  const probability = data?.classification?.probability ?? 0;
  const prediction = data?.classification?.prediction ?? "N/A";

  const getBarColor = (prob) => {
    if (prob >= 70) return "bg-red-500";
    if (prob >= 30) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getTextColor = (prob) => {
    if (prob >= 70) return "text-red-400";
    if (prob >= 30) return "text-yellow-300";
    return "text-green-400";
  };

  return (
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
        <span className={`ml-2 text-2xl font-bold ${prediction === "Malignant" ? "text-red-400" : "text-green-400"}`}>
          {prediction}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-200 text-lg">
          Probability of Malignancy:
        </span>
        <div className="flex items-center mt-2">
          <div className="w-full bg-white/10 rounded-full h-6 mr-3 overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-500 ${getBarColor(probability)}`}
              style={{
                width: `${probability}%`,
                minWidth: "2rem",
              }}
            ></div>
          </div>
          <span className={`font-bold text-lg ${getTextColor(probability)}`}>
            {typeof probability === "number" ? `${probability}%` : "N/A"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2 rounded-lg mt-3">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-1">Segmentation Mask</span>
          {data?.segmentation_mask_url ? (
            <img
              className="rounded-lg bg-cover w-80 h-40 border border-white/10 object-contain"
              src={`http://localhost:8000${data.segmentation_mask_url}`}
              alt="segmentation_mask_url"
            />
          ) : (
            <span className="text-yellow-300">N/A</span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-1">Annotated Image</span>
          {data?.annotated_image_url ? (
            <img
              className="rounded-lg bg-cover w-80 h-40 border border-white/10 object-contain"
              src={`http://localhost:8000${data.annotated_image_url}`}
              alt="annotated_image_url"
            />
          ) : (
            <span className="text-yellow-300">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
