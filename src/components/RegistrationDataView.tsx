

import { useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { fetchRegistrations, RegistrationData } from "../api";
import React from "react";
import { Search, RefreshCw, FileText, ArrowLeft, UserPlus, Mail, Phone, Building, MapPin, BookOpen, Users2, HelpCircle, Heart } from "lucide-react";
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

  const handleClick = (pptId:string) =>{

    console.log("navigated" );
   
    navigate('/pptStatus' , {state:{pptId}})
    
  }


  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
      setFilteredRegistrations(data);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = registrations.filter(
      (entry) =>
        entry.fullName.toLowerCase().includes(term) ||
        entry.mobileNumber.toLowerCase().includes(term) ||
        entry.teamName.toLowerCase().includes(term) ||
        entry.teamId?.toLowerCase().includes(term) ||
        entry.city.toLowerCase().includes(term)
    );

    setFilteredRegistrations(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRegistrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "registrations_data.xlsx");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-300 animate-pulse">Loading registration data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Registration Dashboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            View and manage all participant registrations in one place
          </p>
        </div>

        {/* Stats & Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700/50 flex items-center transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="p-4 rounded-full bg-blue-500/20 mr-4">
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Registrations</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                {filteredRegistrations.length}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-gray-700/50 transition-all focus-within:border-blue-500/50 focus-within:shadow-blue-500/20">
              <div className="flex items-center">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Search by name, mobile, team name, ID, city..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/home")}
            className="px-5 py-3 bg-gray-700/80 hover:bg-gray-600/80 rounded-xl text-white font-medium transition-all flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchData}
              className="px-5 py-3 bg-indigo-600/90 hover:bg-indigo-500/90 rounded-xl text-white font-medium transition-all flex items-center gap-2 flex-1 justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button
              onClick={exportToExcel}
              className="px-5 py-3 bg-emerald-600/90 hover:bg-emerald-500/90 rounded-xl text-white font-medium transition-all flex items-center gap-2 flex-1 justify-center shadow-lg hover:shadow-xl"
            >
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-6">
          {filteredRegistrations.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-700/50 text-center">
              <div className="inline-flex justify-center items-center p-4 rounded-full bg-gray-700/50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search criteria or refresh the data.
              </p>
            </div>
          ) : (
            filteredRegistrations.map((entry, index) => (
<>   
              {/* // <a href={`/getSingleRegistration/${entry?.teamId}`}>   */}
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden transition-all hover:border-gray-600/50 hover:shadow-xl"
              >
                <div className="p-1">
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-5 rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {/* Left Section - Personal Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{entry.fullName}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300">
                            <Mail className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-sm">{entry.email}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Phone className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-sm">{entry.mobileNumber}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Building className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-sm">{entry.collegeName}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-sm">{entry.branch}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-sm">{entry.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Team Info */}
                      <div className="flex-1 bg-gray-700/30 p-4 rounded-lg">

                        <div className="flex justify-between items-center">
                          
                          <div className="flex items-center mb-3">
                            <Users2 className="w-5 h-5 mr-2 text-purple-400" />
                            <h4 className="text-lg font-medium text-white">Team Information</h4>
                          </div>
                           
                           <button className="bg-orange-400 px-4 py-2 rounded-sm " key={index} onClick={()=>handleClick(entry.teamId)}>  PPT Status    </button>

                        </div>



                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-400">Team Name:</span>
                            <span className="text-sm text-white col-span-2">{entry.teamName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-400">Team ID:</span>
                            <span className="text-sm text-white col-span-2">{entry.teamId}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-400">Team Size:</span>
                            <span className="text-sm text-white col-span-2">{entry.teamSize}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-400">Problem:</span>
                            <span className="text-sm text-white col-span-2">{entry?.problemStatement}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-400">Reason:</span>
                            <div className="text-sm text-white col-span-2 flex items-start">
                              <Heart className="w-3 h-3 text-pink-400 mr-1 mt-1 flex-shrink-0" />
                              <span className="line-clamp-2">{entry?.reasonForParticipation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </a> */}
              </>
            ))
          )}
        </div>

        {/* Pagination - Optional, can be added if needed */}
        {/* {filteredRegistrations.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600">2</button>
              <button className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600">3</button>
              <button className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600">
                Next
              </button>
            </nav>
          </div>
        )} */}
      </div>
    </div>


  );
}
