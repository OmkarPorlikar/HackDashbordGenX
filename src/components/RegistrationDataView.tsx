import { useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { fetchRegistrations, RegistrationData } from "../api";
import React from "react";
import { Users, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

export function RegistrationDataView() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    RegistrationData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
      setFilteredRegistrations(data); // Set initial filtered data
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Search Function
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter based on multiple fields
    const filtered = registrations.filter(
      (entry) =>
        entry.fullName.toLowerCase().includes(term) ||
        entry.mobileNumber.toLowerCase().includes(term) ||
        entry.teamName.toLowerCase().includes(term) ||
        entry.teamId?.toLowerCase().includes(term) || // Ensure optional chaining
        entry.city.toLowerCase().includes(term)
    );

    setFilteredRegistrations(filtered);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        {/* Total Registrations Section */}
        <h2 className="text-xl text-center font-semibold mb-4">
          Registration Data
        </h2>

        <div className="flex items-center xs:w-[80%] md:w-[40%] mb-5  m-auto my-0 justify-center gap-4 bg-slate-100/30 backdrop-blur-lg p-8 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-gray-400">Total Registrations</p>
            <p className="text-2xl font-bold">{filteredRegistrations.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mb-4 bg-gray-700 px-4 py-2 rounded-lg shadow-md">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search by name, mobile, team name, ID, city..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Navigation and Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center my-4">
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition"
          >
            ← Back to Dashboard
          </button>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => console.log("Export to Excel logic")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.length === 0 ? (
            <p className="text-center text-gray-400">No results found.</p>
          ) : (
            filteredRegistrations.map((entry, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">{entry.fullName}</h3>
                    <p className="text-sm text-gray-400">{entry.email}</p>
                    <p className="text-sm text-gray-400">{entry.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-400">Team:</span>{" "}
                      {entry.teamName}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Team ID:</span>{" "}
                      {entry.teamId}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Team Size:</span>{" "}
                      {entry.teamSize}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">College:</span>{" "}
                      {entry.collegeName}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Branch:</span>{" "}
                      {entry.branch}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">City:</span> {entry.city}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Reason:</span>{" "}
                      {entry?.reasonForParticipation}
                    </p>

                     <p className="text-sm">
                      <span className="text-gray-400">Problem Statement</span>{" "}
                      {entry?.problemStatement}
                    </p>
                    
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
