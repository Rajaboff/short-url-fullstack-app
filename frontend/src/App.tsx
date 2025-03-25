import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ShortenUrlForm from "./components/Shorten/ShortenUrlForm";
import AnalyticsList from "./components/Analytics/AnalyticsList";
import Header from "./components/Header/Header";
import ShortenUrlInfoForm from "./components/Info/ShortenUrlInfoForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
