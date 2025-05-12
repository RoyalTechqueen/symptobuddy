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
  const [diseaseInfo, setDiseaseInfo] = useState<{
    overview: string;
    causes: string;
    symptoms: string;
    next_steps: string;
  }>({
    overview: "",
    causes: "",
    symptoms: "",
    next_steps: "",
  });
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

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

  const handleCheckResults = async () => {
    if (selectedSymptoms.length === 0) {
      setWarningMessage(
        "Please select at least one symptom before checking results."
      );
      return;
    }
    setWarningMessage("");
    setIsLoading(true); // Start loading

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
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
      console.log("API response:", data); // Check the structure

      // Check if we are getting the correct prediction
      setPrediction(data.predicted_disease || "N/A");

      // Set disease info based on available data or fallback to "N/A"
      setDiseaseInfo({
        overview: data.overview || "No overview available.",
        causes:
          data.causes && Array.isArray(data.causes) && data.causes.length > 0
            ? data.causes.join(", ")
            : "No causes information available.",
        symptoms:
          data.symptoms &&
          Array.isArray(data.symptoms) &&
          data.symptoms.length > 0
            ? data.symptoms.join(", ")
            : "No symptoms information available.",
        next_steps:
          data.next_steps &&
          Array.isArray(data.next_steps) &&
          data.next_steps.length > 0
            ? data.next_steps.join(", ")
            : "No next steps information available.",
      });

      console.log("Disease Info:", diseaseInfo); // Verify state update

      setShowModal(true);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("An error occurred while getting the prediction.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleDone = () => {
    const newTest = {
      id: Date.now().toString(),
      userId: user.id,
      name: `${user.firstName} ${user.lastName} Test`,
      date: currentDate,
      time: currentTime,
      symptoms: selectedSymptoms,
      prediction,
      diseaseInfo, // Include diseaseInfo here
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
            {symptomsList.map((symptom: string, index: number) => (
              <label key={index} className="flex items-center space-x-2 mb-1">
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

        {warningMessage && (
          <div className="text-red-500 text-sm text-center">
            {warningMessage}
          </div>
        )}

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
            {isLoading ? <p>Loading...</p> : "Check Results"}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-3">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto">
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
              <p className="text-md font-semibold text-gray-700">
                Selected Symptoms:
              </p>
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
                  <span className="text-sm text-gray-500">
                    No symptoms selected
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <p className="text-xl font-bold text-center text-green-700 mb-6">
                Disease Information:
              </p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Overview:
              </h3>
              <p>{diseaseInfo.overview || "N/A"}</p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Causes:
              </h3>
              <p>{diseaseInfo.causes || "N/A"}</p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Symptoms:
              </h3>
              <ul className="list-disc ml-5">
                {diseaseInfo.symptoms ? (
                  diseaseInfo.symptoms
                    .split(", ")
                    .map((symptom, index) => <li key={index}>{symptom}</li>)
                ) : (
                  <li>No symptoms information available</li>
                )}
              </ul>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Next Steps:
              </h3>
              <ul className="list-disc ml-5">
                {diseaseInfo.next_steps ? (
                  diseaseInfo.next_steps
                    .split(", ")
                    .map((step, index) => <li key={index}>{step}</li>)
                ) : (
                  <li>No next steps information available</li>
                )}
              </ul>
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
