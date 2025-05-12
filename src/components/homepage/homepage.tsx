import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> | undefined;
};

const Homepage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const navigate = useNavigate();

  const handleTestStart = () => {
    navigate("/userprofile");
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log("beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice?.then((choiceResult) => {
        if (choiceResult?.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-4 px-2">
      {/* Install Button at the Top */}
      {deferredPrompt && (
        <div className="w-full  max-w-4xl mb-4">
          <button
            onClick={handleInstall}
            className="w-full px-3 py-1 bg-green-100 text-black rounded-md shadow hover:bg-green-200"
          >
            Install SymptoBuddy
          </button>
        </div>
      )}

      {/* Logo */}
      <div className="max-w-4xl flex justify-center">
        <img src="/logo.jpg" alt="SymptoBuddy Logo" className="w-36 h-36 sm:w-48 sm:h-48" />
      </div>

      {/* Welcome Text */}
      <div className="text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700">Welcome to SymptoBuddy</h1>
        <p className="mt-4 text-gray-700 text-lg sm:text-xl">
          Your trusted companion for predicting common illnesses based on your symptoms.
        </p>
        <p className="mt-2 text-gray-600">
          Get insights on your health instantly and take the first step toward recovery.
        </p>
      </div>

      {/* Diagnosable Illnesses */}
      <div className="max-w-4xl w-full px-4">
        <h2 className="text-2xl font-semibold text-green-600 mb-4 mt-2  text-center">What We Can Diagnose</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {["Malaria", "Typhoid", "Common Cold", "Stomach Flu", "Sore Throat", "Respiratory Infection"].map((disease, index) => (
            <div
              key={index}
              className="border border-green-300 bg-green-50 text-green-800 text-center py-4 px-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              {disease}
            </div>
          ))}
        </div>
      </div>

      {/* How to Use SymptoBuddy */}
      <div className="max-w-4xl w-full px-4 mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">How to Use SymptoBuddy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border rounded-lg shadow hover:shadow-md transition-all">
            <div className="text-3xl mb-2">🧪</div>
            <h3 className="font-bold text-lg"> 1. Start New Test</h3>
            <p className="text-sm text-gray-600">Click the button to begin.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-md transition-all">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold text-lg"> 2. Enter Details</h3>
            <p className="text-sm text-gray-600">Fill in your basic information</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-md transition-all">
            <div className="text-3xl mb-2">🤒</div>
            <h3 className="font-bold text-lg"> 3. Select Symptoms</h3>
            <p className="text-sm text-gray-600">Choose what you're feeling.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-md transition-all">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold text-lg"> 4. View Result and Recommendations</h3>
            <p className="text-sm text-gray-600">See your possible condition and disease information.</p>
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <div className="w-full max-w-4xl px-4 mb-1">
        <button
          className="w-full flex items-center justify-between bg-green-600 mt-4 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
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
