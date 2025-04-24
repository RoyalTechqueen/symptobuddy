import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleTestStart = () => {
    navigate("/userprofile");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      {/* Logo */}
      <div className="w-full max-w-4xl flex items-center justify-center mb-8">
        <img
          src="/logo.jpg"
          alt="SymptoBuddy Logo"
          className="w-48 h-48 sm:w-36 sm:h-36 lg:w-52 lg:h-52"
        />
      </div>

      {/* Welcome Text */}
      <div className="w-full max-w-4xl px-4 text-center mb-10">
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-semibold leading-snug">
          Welcome to SymptoBuddy, your trusted companion for predicting common illnesses!
        </p>
        <p className="text-md sm:text-xl text-gray-600 mt-4">
          Quickly analyze your symptoms and gain insights on your health with ease.
        </p>
        <p className="text-md sm:text-lg text-gray-500 mt-4">
          Let’s get started and take control of your health today!
        </p>
      </div>

      {/* Start New Test Button */}
      <div className="w-full max-w-4xl px-4 mb-8">
        <button
          className="w-full flex items-center justify-between bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
          onClick={handleTestStart}
        >
          <div className="text-lg">Start New Test</div>
          <div className="text-2xl">+</div>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
