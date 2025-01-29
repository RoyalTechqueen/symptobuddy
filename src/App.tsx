// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import KnowYou from "./components/gettoknowyou/knowyou";
import NewTest from "./components/symptompage/symptompage";
import TestResultsPage from "./components/testresult/testresult";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KnowYou />} />
        <Route path="/homepage" element ={<HomePage />} />
        <Route path="/test" element ={<NewTest/>} />
        <Route path="/testresult" element ={<TestResultsPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
