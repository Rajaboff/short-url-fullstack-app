import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ShortenUrlForm from "./components/Shorten/ShortenUrlForm";
import AnalyticsList from "./components/Analytics/AnalyticsList";
import Header from "./components/Header/Header";
import ShortenUrlInfoForm from "./components/Info/ShortenUrlInfoForm";

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/shorten" element={<ShortenUrlForm />} />
          <Route path="/info" element={<ShortenUrlInfoForm />} />
          <Route path="/analytics" element={<AnalyticsList />} />
          <Route path="*" element={<Navigate to="/shorten" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
