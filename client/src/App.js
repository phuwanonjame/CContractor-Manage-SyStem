// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Dashboard from "./component/Dashboard";
import Assignworks from "./component/Assignworks";
import Contractos from "./component/Contractos";
import Manageworks from "./component/Manageworks";
import Login from "./component/Login";

function App() {
  return (
    <Router>
      <div className="flex">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/Assignworks" element={<Assignworks />} />
                  <Route path="/Contractors" element={<Contractos />} />
                  <Route path="/Managework" element={<Manageworks />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
