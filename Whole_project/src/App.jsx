import React from "react";
import { Container } from "./components/index.js";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/*" element={<Container />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
