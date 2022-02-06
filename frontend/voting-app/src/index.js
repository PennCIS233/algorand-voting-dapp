import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import VoterPage from "./pages/VoterPage";
import ConnectPage from "./pages/ConnectPage";
import ElectionPage from "./pages/ElectionPage";
import CreatorPage from "./pages/CreatorPage";

ReactDOM.render(
  <div>
    <Router>
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/election" element={<ElectionPage />} />
        <Route path="/voter" element={<VoterPage />} />
        <Route path="/creator" element={<CreatorPage />} />
      </Routes>
    </Router>
  </div>,
  document.getElementById("root")
);
