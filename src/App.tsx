import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import UserProfile from "./components/userprofile/userprofile";
import NewTest from "./components/symptompage/symptompage";
import TestResultsPage from "./components/testresult/testresult";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/test" element={<NewTest />} />
        <Route path="/testresult" element={<TestResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
