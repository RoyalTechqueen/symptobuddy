import React from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom"

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const tests = useStore((state) => state.tests);
  const handleTestStart = () => {
    navigate("/test");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-center px-4 mt-4">  
        <img
          src="/logo.jpg" // Replace with your logo file path
          alt="SymptoBuddy Logo"
          className="w-32 h-32 sm:w-16 sm:h-16 lg:w-40 lg:h-40"
        />
      </div>

      {/* Intro Section */}
      <div className="w-full max-w-4xl mt-10 px-4 text-center">
        <p className="text-lg sm:text-xl text-gray-700">
          Welcome to SymptoBuddy, your trusted partner in monitoring and managing symptoms with ease. Stay informed and prepared, no matter the situation.
        </p>
      </div>

      {/* Alert Section */}
      <div className="w-full max-w-4xl mt-8 px-4 flex-1">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-5 rounded-lg shadow-md flex flex-col h-full mt-4">
          {tests.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Available Tests
              </h2>
              <ul className="space-y-3">
                {tests.map((test) => (
                  <li
                    key={test.id}
                    className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow-sm border border-gray-200"
                  >
                    <span className="text-gray-800 font-medium">{test.name}</span>
                    <button
                      className="text-yellow-600 font-semibold hover:underline"
                      onClick={() => console.log(`View test: ${test.name}`)}
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center flex items-center justify-center space-x-3">
              <div className="text-yellow-600 text-2xl lg:text-3xl">⚠️</div>
              <p className="text-black text-xl lg:text-2xl">
                No tests available at the moment. Start a new test by clicking the button below!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-4xl px-4 fixed bottom-6">
        <button className="w-full flex items-center justify-between bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg shadow-lg" onClick={handleTestStart}>
          <span className="flex items-center text-lg lg:text-xl">
            Start a New Test
          </span>
          <span className="text-xl lg:text-2xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
