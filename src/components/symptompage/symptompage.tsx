import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";  // Import TensorFlow.js
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

const NewTest: React.FC = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [prediction, setPrediction] = useState<string>("");  // Store model prediction
  const { user, setTests } = useStore();
  const navigate = useNavigate();

  const symptomsList = [
     "Fever", "Cough","Headache", "fatigue","Runny Nose", 
    "Stomach ache", "Sore throat", "Body ache", "Sneezing"
  ];

  // Load the ML model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/symptobuddy_model.json"); // Change path if hosted online
        setModel(loadedModel);
        console.log("Model loaded successfully!");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, []);

  // Get the current date and time
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (symptom: string) => {
    setSelectedSymptoms(prevSymptoms =>
      prevSymptoms.includes(symptom)
        ? prevSymptoms.filter(s => s !== symptom)
        : [...prevSymptoms, symptom]
    );
  };

  // Convert symptoms into model-friendly format
  const preprocessSymptoms = () => {
    return symptomsList.map(symptom => selectedSymptoms.includes(symptom) ? 1 : 0);
  };

  // Make predictions using the model
  const handleCheckResults = async () => {
    if (!model) {
      alert("Model is still loading...");
      return;
    }

    const inputTensor = tf.tensor([preprocessSymptoms()]);
    const predictionTensor = model.predict(inputTensor) as tf.Tensor;
    const predictionArray = await predictionTensor.data();

    const conditions = ["Cold", "Flu", "COVID-19", "Allergy"];  // Example labels
    const predictedCondition = conditions[predictionArray.indexOf(Math.max(...predictionArray))];

    setPrediction(predictedCondition);
    setShowModal(true);
  };

  // Save test result
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
    navigate("/homepage");
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl flex items-center justify-between px-4 mt-4">
        <div onClick={() => navigate("/homepage")} className="cursor-pointer bg-primary p-3 rounded-full shadow-md hover:bg-gray-300">
          <FaAngleLeft size={24} />
        </div>
        <h1 className="text-3xl font-bold text-center mx-auto">New Test</h1>
      </header>

      <form className="w-full max-w-4xl mt-8 px-4 space-y-4 mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{currentDate}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">{currentTime}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Symptoms</label>
          <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-3">
            {symptomsList.map(symptom => (
              <label key={symptom} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleCheckboxChange(symptom)}
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Selected Symptoms</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">
            {selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : <span>No symptoms selected</span>}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <p className="text-lg">Date: {currentDate}</p>
            <p className="text-lg">Time: {currentTime}</p>
            <p className="text-lg">Symptoms: {selectedSymptoms.join(", ")}</p>
            <p className="text-lg font-semibold">Predicted Condition: {prediction || "N/A"}</p>
            <div className="mt-4 flex justify-end">
              <button onClick={handleDone} className="px-4 py-2 bg-green-600 text-white rounded-md">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTest;
