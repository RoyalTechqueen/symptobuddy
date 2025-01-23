// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import KnowYou from "./components/gettoknowyou/knowyou";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/know-you" element ={<KnowYou />} />
      </Routes>
    </Router>
  );
};

export default App;
