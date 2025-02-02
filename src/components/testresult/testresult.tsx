import React, { useState, useEffect } from 'react';
import useStore, { Test } from '../../store/store'; // Import Test type here
import { useNavigate } from 'react-router-dom';

// Helper function to calculate age from DOB
const calculateAge = (dob: string): number => {
  if (!dob) return 0; // Handle empty dob
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0; // Invalid date handling
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth();
  if (month < birthDate.getMonth() || (month === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const TestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const tests = useStore((state) => state.tests);
  const user = useStore((state) => state.user);
  const loadTests = useStore((state) => state.loadTests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  useEffect(() => {
    loadTests(); // Load tests when component mounts
  }, [loadTests]);

  const handleTestStart = () => {
    navigate("/test"); 
  };

  const handleViewTestDetails = (test: Test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-primary text-white p-4">
        <div className="flex items-center">
          <img
            src="/logo.jpg"
            alt="SymptoBuddy Logo"
            className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
          />
          <div className="ml-4">
            <p className="font-semibold text-lg">{user?.firstName}</p>
            <p>{user?.dateOfBirth ? `${calculateAge(user.dateOfBirth)} years old` : "Age not available"}</p>
            <p>{user?.gender}</p>
          </div>
        </div>
        <button
          className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg"
          onClick={handleTestStart}
        >
          Start New Test
        </button>
      </div>

      {/* Test Results Section */}
      <div className="w-full max-w-4xl mt-8 px-4 flex-1">
        {tests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                {/* Test Info: Date & Time */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">Date: {test.date}</p>
                    <p className="text-gray-700 font-medium">Time: {test.time}</p>
                  </div>
                  <button
                    className="text-yellow-600 font-semibold hover:underline"
                    onClick={() => handleViewTestDetails(test)} 
                  >
                    View
                  </button>
                </div>

                {/* Symptoms List */}
                <div>
                  <p className="font-semibold text-gray-700">Symptoms:</p>
                  <ul className="list-disc pl-5">
                    {test.symptoms.map((symptom: string, idx: number) => (  // Properly typed `symptom` and `idx`
                      <li key={idx} className="text-gray-600">{symptom}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-700">No test results available.</p>
        )}
      </div>

      {/* Modal for Test Details */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4 text-center">Test Details</h3>
            <div className="flex justify-between mb-4">
              <div>
                <p><strong>Date:</strong> {selectedTest.date}</p>
                <p><strong>Time:</strong> {selectedTest.time}</p>
              </div>
            </div>
            <p><strong>Symptoms:</strong></p>
            <ul className="list-disc pl-5 mb-4">
              {selectedTest.symptoms.map((symptom: string, idx: number) => (  // Properly typed `symptom` and `idx`
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg"
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

export default TestResultsPage;
