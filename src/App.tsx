import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import UserProfile from "./components/userprofile/userprofile";
import NewTest from "./components/symptompage/symptompage";
import TestResultsPage from "./components/testresult/testresult";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Router>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {deferredPrompt && (
          <button onClick={handleInstall} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Install SymptoBuddy
          </button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<UserProfile />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/test" element={<NewTest />} />
        <Route path="/testresult" element={<TestResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
