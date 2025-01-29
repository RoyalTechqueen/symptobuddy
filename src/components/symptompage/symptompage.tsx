import React, { useState, useEffect } from "react";

const NewTest: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Nausea",
    "Runny Nose",
    "Stomach ache",
    "Sore throat",
    "Body ache",
    "Sneezing",
  ];

  useEffect(() => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentDate(date);
    setCurrentTime(time);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCheckboxChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="bg-white flex items-center justify-between px-4 py-3 w-full max-w-3xl">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-green-600"
        >
          <span className="ml-2">Back</span>
        </button>
        <h1 className="text-lg font-semibold text-center">New Test</h1>
      </header>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-between px-6 py-4 w-full max-w-3xl lg:max-w-5xl">
        {/* Date and Time */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">
            {currentDate || "Loading..."}
          </div>
        </div>
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">
            {currentTime || "Loading..."}
          </div>
        </div>

        {/* Dropdown */}
        <div className="w-full mb-4">
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100"
          >
            Select Symptoms
          </button>
          {showDropdown && (
            <div className="mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
              {symptoms.map((symptom) => (
                <label key={symptom} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-green-500"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleCheckboxChange(symptom)}
                  />
                  <span>{symptom}</span>
                </label>
              ))}
              <button
                onClick={toggleDropdown}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md w-full"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Selected Symptoms */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selected Symptoms
          </label>
          <div className="mt-1 flex flex-wrap gap-2 border border-gray-300 p-2 rounded-md bg-gray-100">
            {selectedSymptoms.length > 0 ? (
              selectedSymptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No symptoms selected</span>
            )}
          </div>
        </div>

        {/* View Results Button */}
        <div className="w-full">
          <button className="w-full p-3 bg-green-600 text-white rounded-md text-lg font-semibold">
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTest;
