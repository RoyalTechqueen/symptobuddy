import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const tests = useStore((state) => state.tests); // Retrieve tests from the store
  const [selectedTest, setSelectedTest] = useState<Test | null>(null); // State to manage selected test for modal

  useEffect(() => {
    if (tests.length > 0) {
      navigate("/testresult"); // Navigate to test results page if tests are available
    }
  }, [tests.length, navigate]);

  const handleTestStart = () => {
    navigate("/test");
  };

  const handleViewTest = (test: Test) => {
    setSelectedTest(test); // Set the selected test to be displayed in the modal
  };

  const handleCloseModal = () => {
    setSelectedTest(null); // Close the modal by resetting the selected test
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl flex items-center justify-center px-4 mt-4">
        <img
          src="/logo.jpg" // Replace with your logo file path
          alt="SymptoBuddy Logo"
          className="w-32 h-32 sm:w-16 sm:h-16 lg:w-40 lg:h-40"
        />
      </div>

      <div className="w-full max-w-4xl mt-10 px-4 text-center">
        <p className="text-lg sm:text-xl text-gray-700">
          Welcome to SymptoBuddy, your trusted partner in monitoring and managing symptoms with ease.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="w-full max-w-4xl mt-8 px-4 flex-1">
          <div className="p-5 rounded-lg shadow-md flex flex-col h-full mt-4 bg-yellow-100">
            <div className="text-center flex items-center justify-center space-x-3">
              <div className="text-yellow-600 text-2xl lg:text-3xl">⚠️</div>
              <p className="text-black text-xl lg:text-2xl">
                No tests available at the moment. Start a new test by clicking the button below!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mt-8 px-4 flex-1">
          <div className="p-5 rounded-lg shadow-md flex flex-col h-full mt-4 bg-primary">
            <h2 className="text-2xl font-semibold text-white mb-4">Test Results</h2>
            <ul className="space-y-3">
              {tests.map((test, index) => (
                <li
                  key={test.id}
                  className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow-sm border border-gray-200"
                >
                  <span className="text-gray-800 font-medium">{`Test ${index + 1}`}</span>
                  <button
                    className="text-yellow-600 font-semibold hover:underline"
                    onClick={() => handleViewTest(test)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl px-4 fixed bottom-6">
        <button
          className="w-full flex items-center justify-between bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg shadow-lg"
          onClick={handleTestStart}
        >
          <div className="text-lg">Start New Test</div>
          <div className="text-2xl">+</div> {/* Plus sign placed at the right end */}
        </button>
      </div>

      {/* Modal to display the selected test result history */}
      {selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-4">{selectedTest.name}</h3>
            <p><strong>Date:</strong> {selectedTest.date}</p>
            <p><strong>Time:</strong> {selectedTest.time}</p>
            <p><strong>Symptoms:</strong></p>
            <ul className="list-disc pl-5">
              {selectedTest.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                onClick={handleCloseModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
