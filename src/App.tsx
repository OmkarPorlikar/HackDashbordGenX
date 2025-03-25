import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { RegistrationDataView } from "./components/RegistrationDataView";
import { MasterClassDataView } from "./components/MasterClassDataView";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./components/Login";
import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Colleges from "./components/Colleges";
import { Link } from "react-router-dom";
import PptStatus from "./components/PptStatus";
import SingleRegistrationPage from "./components/SingleRegistrationPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isLoggedIn"));

  useEffect(() => {
    // Check authentication status on page load
    setIsAuthenticated(!!localStorage.getItem("isLoggedIn"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);  // Trigger re-render
  };

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link to="/home">
                <h1 className="xs:text-xl text-3xl text-center font-bold">Admin Dashboard</h1>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>

            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/registration"
                element={
                  <PrivateRoute>
                    <RegistrationDataView />
                  </PrivateRoute>
                }
              />

{/* 
              <Route
                path="/getSingleRegistration/:id"
                element={
                  <PrivateRoute>
                    <SingleRegistrationPage />
                  </PrivateRoute>
                }
              /> */}


              <Route
                path="/masterclass"
                element={
                  <PrivateRoute>
                    <MasterClassDataView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/colleges/:id"
                element={
                  <PrivateRoute>
                    <Colleges />
                  </PrivateRoute>
                }
              />

              <Route
                path="/pptStatus"
                element={
                  <PrivateRoute>
                    <PptStatus />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
