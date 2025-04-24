import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { Test } from '../../store/store';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const tests = useStore((state) => state.tests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  useEffect(() => {
    if (tests.length > 0) {
      navigate("/testresult");
    }
  }, [tests.length, navigate, tests]);

  const handleTestStart = () => {
    navigate("/userprofile");
  };

  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Logo */}
      <div className="w-full max-w-4xl flex items-center justify-center px-4 mt-4">
        <img
          src="/logo.jpg"
          alt="SymptoBuddy Logo"
          className="w-48 h-48 sm:w-36 sm:h-36 lg:w-52 lg:h-52"
        />
      </div>

      {/* Welcome Text */}
      <div className="w-full max-w-4xl mt-10 px-4 text-center">
  <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-semibold leading-snug">
    Welcome to SymptoBuddy, your trusted companion for predicting  common illnesses!
  </p>
  <p className="text-lg sm:text-xl text-gray-600 mt-4">
    Get quick insights on your symptoms and take control of your health with ease.
  </p>
</div>



      {/* Test State */}
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

      {/* Start New Test Button (original style preserved) */}
      <div className="w-full max-w-4xl px-4 fixed bottom-6">
        <button
          className="w-full flex items-center justify-between bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg shadow-lg"
          onClick={handleTestStart}
        >
          <div className="text-lg">Start New Test</div>
          <div className="text-2xl">+</div>
        </button>
      </div>

      {/* Modal */}
      {selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-4">{selectedTest.name}</h3>
            <p className="mb-4">Test Date: {selectedTest.date}</p>
            <p className="mb-4">Symptoms:</p>
            <ul>
              {selectedTest.symptoms.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
            <button
              className="mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
