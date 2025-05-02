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
      e.preventDefault(); // Prevent the default install prompt
      setDeferredPrompt(e as BeforeInstallPromptEvent); // Cast event to correct type
      console.log("beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
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
      <div className="w-full max-w-4xl px-4 mb-1">
        <button
          className="w-full flex items-center justify-between bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
          onClick={handleTestStart}
        >
          <div className="text-lg">Start New Test</div>
          <div className="text-2xl">+</div>
        </button>
      </div>

      {/* Install Button */}
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="w-full top-0 left-0 px-3 py-2 bg-green-100 text-black text-center text-md font-medium shadow-md"
        >
          Install SymptoBuddy
        </button>
      )}
    </div>
  );
};

export default Homepage;
