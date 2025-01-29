import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa'; // Import FaAngleLeft icon from React Icons

const NewTest: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const { user, setTests } = useStore(); // Get user data from store and setTests action
  const navigate = useNavigate();

  const symptoms = [
    'Headache', 'Fever', 'Cough', 'Nausea', 'Runny Nose', 'Stomach ache', 'Sore throat', 'Body ache', 'Sneezing'
  ];

  useEffect(() => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const handleCheckResults = () => {
    setShowModal(true); // Show modal with results
  };

  const handleDone = () => {
    // Create the new test object
    const newTest = {
      id: Date.now().toString(), // Unique ID based on timestamp
      name: `${user.firstName} ${user.lastName} Test`, // You can customize the name based on user info
      date: currentDate,
      time: currentTime,
      symptoms: selectedSymptoms,
    };

    // Save test to the store
    setTests(newTest);

    // Navigate to homepage after saving the test
    navigate('/homepage', {
      state: {
        user,
        symptoms: selectedSymptoms,
        date: currentDate,
        time: currentTime,
      },
    });
  };

  // Navigate back to the homepage
  const handleGoBack = () => {
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl flex flex-col items-center justify-center px-4 mt-4">
        <div className="flex items-center justify-between w-full">
          {/* Back button with FaAngleLeft icon */}
          <div 
            onClick={handleGoBack}
            className="cursor-pointer bg-primary p-3 rounded-full shadow-md hover:bg-gray-300"
          >
            <FaAngleLeft size={24} />
          </div>
          <h1 className="text-3xl font-bold text-center mx-auto">New Test</h1>
        </div>
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

        {/* Display selected symptoms */}
        <div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          >
            Select Symptoms
          </button>
          {showDropdown && (
            <div className="mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-3">
              {symptoms.map((symptom) => (
                <label key={symptom} className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleCheckboxChange(symptom)}
                  />
                  <span>{symptom}</span>
                </label>
              ))}
              <button
                onClick={toggleDropdown}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md w-full"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Selected Symptoms</label>
          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100">
            {selectedSymptoms.length > 0 ? (
              selectedSymptoms.join(', ')
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="space-y-2">
              <p className="text-lg">Date: {currentDate}</p>
              <p className="text-lg">Time: {currentTime}</p>
              <p className="text-lg">Symptoms:</p>
              <ul className="list-disc pl-5">
                {selectedSymptoms.length > 0 ? (
                  selectedSymptoms.map((symptom, index) => (
                    <li key={index} className="text-lg">{symptom}</li>
                  ))
                ) : (
                  <li className="text-lg">No symptoms selected</li>
                )}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
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
