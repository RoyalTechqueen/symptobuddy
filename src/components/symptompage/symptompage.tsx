import React, { useState, useEffect } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

const NewTest: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [prediction, setPrediction] = useState<string>("");

  const { user, setTests } = useStore();
  const navigate = useNavigate();

  const symptomsList = [
    "Fever",
    "Chills",
    "Headache",
    "Muscle Pain",
    "Nausea",
    "Vomiting",
    "Fatigue",
    "Diarrhoea",
    "Phlegm",
    "Throat Irritation",
  ];

  // Set current date and time
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const handleCheckboxChange = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Call FastAPI backend to get prediction
  const handleCheckResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_disease);
      setShowModal(true);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("An error occurred while getting the prediction.");
    }
  };

  const handleDone = () => {
    const newTest = {
      id: Date.now().toString(),
      name: `${user.firstName} ${user.lastName} Test`,
      date: currentDate,
      time: currentTime,
      symptoms: selectedSymptoms,
      prediction,
    };

    setTests(newTest);
    navigate("/testresult");
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex items-center justify-center px-4 mt-4">
        <img
          src="/logo.jpg"
          alt="SymptoBuddy Logo"
          className="w-48 h-48 sm:w-36 sm:h-36 lg:w-52 lg:h-52"
        />
      </div>

      <header className="w-full max-w-4xl flex items-center justify-between px-4 mt-4">
        <div
          onClick={() => navigate("/testresult")}
          className="cursor-pointer bg-primary p-2 rounded-full shadow-md hover:bg-green-600"
        >
          <FaAngleLeft size={12} />
        </div>
        <div className="ml-auto bg-green-600 text-white p-2 rounded-md flex items-center space-x-2">
          <p>{currentDate}</p>
          <p>{currentTime}</p>
        </div>
      </header>

      <h1 className="sm:text-3xl text-lg font-bold text-center mx-auto">
        Start New Test
      </h1>

      <form className="w-full max-w-4xl mt-2 px-4 space-y-4 mx-auto">
        <div>
          <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-3">
            {symptomsList.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  className="peer"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleCheckboxChange(symptom)}
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selected Symptoms
          </label>
          <div className="mt-1 p-2">
            {selectedSymptoms.length > 0 ? (
              selectedSymptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-block px-4 py-2 m-1 bg-green-600 text-white rounded-md font-semibold"
                >
                  {symptom}
                </span>
              ))
            ) : (
              <span>No symptoms selected</span>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleCheckResults}
            className="w-full p-3 bg-green-600 text-white rounded-md text-lg font-semibold"
          >
            Check Results
          </button>
        </div>
      </form>

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-3">
    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
    <div className="text-black mb-2 flex items-center justify-between">
          <p>{currentDate}</p>
          <p>{currentTime}</p>
        </div>
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Predicted Condition
      </h2>
      <p className="text-2xl font-extrabold text-center text-black mb-4">
        {prediction || "N/A"}
      </p>

      <div className="mb-4">
        <p className="text-md font-semibold text-gray-700">Selected Symptoms:</p>
        <div className="flex flex-wrap mt-2">
          {selectedSymptoms.length > 0 ? (
            selectedSymptoms.map((symptom, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 m-1 bg-green-100 text-green-800 border border-green-500 rounded-lg text-sm font-medium"
              >
                {symptom}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No symptoms selected</span>
          )}
        </div>
      </div>
     
      <div className="flex justify-center">
        <button
          onClick={handleDone}
          className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-md shadow hover:bg-green-700"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default NewTest;
