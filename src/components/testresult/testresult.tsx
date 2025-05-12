import React, { useState, useEffect } from "react";
import useStore, { Test } from "../../store/store";
import { useNavigate } from "react-router-dom";

//  function to calculate age from DOB
const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0;
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const TestResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const tests = useStore((state) => state.tests);
  const loadUserProfile = useStore((state) => state.loadUserProfile);
  const loadTests = useStore((state) => state.loadTests);
  const deleteTest = useStore((state) => state.deleteTest);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  useEffect(() => {
    loadUserProfile();
    loadTests();
  }, [loadUserProfile, loadTests]);

  // Filter tests for the logged-in user only
  const userTests = user?.id
    ? tests.filter((test) => test.userId && test.userId === user.id)
    : [];

  const handleDeleteTest = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test history?"
    );
    if (confirmed && selectedTest?.id) {
      deleteTest(selectedTest.id);
      setIsModalOpen(false);
      setSelectedTest(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-primary text-white p-4">
        <div className="flex items-center">
          <img
            src="/logo.jpg"
            alt="SymptoBuddy Logo"
            className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
          />
          <div className="ml-4">
            <p className="font-semibold text-lg">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p>{user?.gender || "Gender not set"}</p>
            <p>
              {user?.dateOfBirth
                ? `${calculateAge(user.dateOfBirth)} years old`
                : "Age not available"}
            </p>
          </div>
        </div>
        <button
          className="bg-secondary hover:bg-secondary-dark text-white py-2 px-1 rounded-lg"
          onClick={() => navigate("/test")}
        >
          Start New Test
        </button>
      </div>

      {/* Test Results Section */}
      <div className="w-full max-w-4xl mt-8 px-4 flex-1">
        {userTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTests.map((test) => (
              <div
                key={test.id}
                className="bg-white shadow-md rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">
                      Date: {test.date}
                    </p>
                    <p className="text-gray-700 font-medium">
                      Time: {test.time}
                    </p>
                  </div>
                  <button
                    className="text-yellow-600 font-semibold hover:underline"
                    onClick={() => {
                      setSelectedTest(test);
                      setIsModalOpen(true);
                    }}
                  >
                    View
                  </button>
                </div>
                <div>
                  <div className="px-3 py-1 m-1 text-green-800 border border-green-500 rounded-lg text-sm font-medium">
                    <h3 className="text-lg font-medium text-center text-black">
                      Predicted Condition:
                    </h3>
                    <p className="text-2xl font-extrabold text-center text-green-700">
                      {test.prediction || "N/A"}
                    </p>
                  </div>
                  <div className="px-3 py-1 m-1 text-green-800 border border-green-500 rounded-lg text-sm font-medium">
                    <p className="font-semibold text-gray-700 text-center">
                      Symptoms Entered:
                    </p>
                    <h3 className="text-center">
                      {test.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className=" p-1 inline-block text-green-800 text-sm font-medium"
                        >
                          {symptom}
                        </span>
                      ))}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-700">
            No test results available.
          </p>
        )}
      </div>

      {/* Modal for Test Details */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-3">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg max-h-[85vh] overflow-y-auto">
            <div className="text-black mb-2 flex items-center justify-between">
              <p>
                <strong>Date:</strong> {selectedTest.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedTest.time}
              </p>
            </div>
            <div className="px-3 py-1 m-1 mt-2 text-green-800 border border-green-500 rounded-lg text-sm font-medium">
              <h3 className="text-xl font-medium text-center text-black">
                Predicted Condition
              </h3>
              <p className="text-2xl font-extrabold text-center text-green-700">
                {selectedTest.prediction || "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Symptoms Entered:</p>

              {selectedTest.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 m-1 bg-green-100 text-green-800 border border-green-500 rounded-lg text-sm font-medium"
                >
                  {symptom}
                </span>
              ))}
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-xl font-bold text-center text-green-700 mb-6">
                Disease Information:
              </p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Overview:
              </h3>
              <p>{selectedTest.diseaseInfo?.overview || "N/A"}</p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Causes:
              </h3>
              <p>{selectedTest.diseaseInfo?.causes || "N/A"}</p>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Symptoms:
              </h3>
              <ul className="list-disc ml-5">
                {selectedTest.diseaseInfo?.symptoms ? (
                  selectedTest.diseaseInfo?.symptoms
                    .split(", ")
                    .map((step, index) => <li key={index}>{step}</li>)
                ) : (
                  <li>No next steps information available</li>
                )}
              </ul>
              <h3 className="text-lg font-bold text-left text-green-700 mb-6">
                Next Steps:
              </h3>
              <ul className="list-disc ml-5">
                {selectedTest.diseaseInfo?.next_steps ? (
                  selectedTest.diseaseInfo?.next_steps
                    .split(", ")
                    .map((step, index) => <li key={index}>{step}</li>)
                ) : (
                  <li>No next steps information available</li>
                )}
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-md"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTest(null);
                }}
              >
                OK
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md"
                onClick={handleDeleteTest}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResultsPage;
