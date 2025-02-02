import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage/homepage';
import UserProfile from './components/userprofile/userprofile';
import NewTest from './components/symptompage/symptompage';
import TestResultsPage from './components/testresult/testresult';

// Extending the global WindowEventMap to include the beforeinstallprompt event
declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault(); // Prevent the default install prompt
      setDeferredPrompt(e); // Store the event to prompt it later
      setIsInstallable(true); // Set flag to show install button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log('User choice: ', choiceResult.outcome); // 'accepted' or 'dismissed'
        setDeferredPrompt(null); // Reset the prompt after user choice
        setIsInstallable(false); // Hide the install button
      });
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserProfile />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/test" element={<NewTest />} />
        <Route path="/testresult" element={<TestResultsPage />} />
      </Routes>

      {isInstallable && (
        <div>
          <button onClick={handleInstallClick}>Install</button>
        </div>
      )}
    </Router>
  );
};

export default App;
