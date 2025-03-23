


import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchMasterClassRegistrations, MasterClassData } from '../api';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Search, 
  RefreshCw, 
  FileText, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  Award
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function MasterClassDataView() {
  const [masterClasses, setMasterClasses] = useState<MasterClassData[]>([]);
  const [filteredMasterClasses, setFilteredMasterClasses] = useState<MasterClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchMasterClassRegistrations();
      setMasterClasses(data);
      setFilteredMasterClasses(data);
    } catch (error) {
      console.error("Failed to fetch master class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = masterClasses.filter((entry) => 
      entry.email.toLowerCase().includes(term) || 
      entry.fullName.toLowerCase().includes(term)
    );
    
    setFilteredMasterClasses(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to export data to Excel
  const exportToExcel = () => {
    if (masterClasses.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Remove 'id' field from export
    const formattedData = masterClasses.map(({ id, ...rest }) => ({
      ...rest,
      classes: rest.classes.join(", "),
    }));

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Get headers dynamically
    const headers = Object.keys(formattedData[0]);

    // Manually add headers with styling
    const headerRow = headers.map((header) => ({
      v: header.toUpperCase(),
      s: {
        fill: { fgColor: { rgb: "4F81BD" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      },
    }));

    XLSX.utils.sheet_add_aoa(worksheet, [headerRow.map((h) => h.v)], { origin: "A1" });

    // Apply black borders to all cells
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1:A1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cell_address]) continue;

        worksheet[cell_address].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Adjust column widths based on content
    worksheet["!cols"] = headers.map((header) => ({
      wch: Math.max(
        header.length,
        ...formattedData.map((row) => {
          const value = row[header as keyof typeof formattedData[0]];
          return value ? value.toString().length : 10;
        })
      ) + 2
    }));

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MasterClassRegistrations");

    // Write file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "MasterClass_Registrations.xlsx");
  };

  // Get unique class categories for filtering
  const uniqueClasses = Array.from(
    new Set(masterClasses.flatMap(entry => entry.classes))
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-indigo-200 animate-pulse">Loading masterclass data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-2">
            MasterClass Dashboard
          </h1>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Manage and view all masterclass registrations in one place
          </p>
        </div>

        {/* Stats Card & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <div className="bg-indigo-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-indigo-600/30 flex items-center transform transition-all hover:scale-105 hover:shadow-purple-600/10">
            <div className="p-4 rounded-full bg-purple-500/20 mr-4">
              <GraduationCap className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <p className="text-indigo-200 text-sm font-medium">Total Registrations</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                {filteredMasterClasses.length}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="lg:col-span-2">
            <div className="bg-indigo-800/40 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-indigo-600/30 transition-all focus-within:border-purple-400/50 focus-within:shadow-purple-500/20">
              <div className="flex items-center">
                <Search className="text-indigo-300 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-transparent text-white focus:outline-none placeholder-indigo-300/70 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button 
            onClick={() => navigate("/home")} 
            className="px-5 py-3 bg-indigo-700/80 hover:bg-indigo-600/80 rounded-xl text-white font-medium transition-all flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={fetchData} 
              className="px-5 py-3 bg-blue-600/90 hover:bg-blue-500/90 rounded-xl text-white font-medium transition-all flex items-center gap-2 flex-1 justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
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

        {/* Results count with nice styling */}
        {searchTerm && (
          <div className="mb-6 px-4 py-3 bg-indigo-800/30 rounded-xl inline-flex items-center">
            <Search className="w-4 h-4 text-indigo-300 mr-2" />
            <span className="text-indigo-200">
              Found <strong>{filteredMasterClasses.length}</strong> results for "<span className="italic">{searchTerm}</span>"
            </span>
          </div>
        )}

        {/* Category filters - horizontal scrolling chips */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <button className="px-4 py-2 bg-purple-500/90 text-white rounded-full text-sm font-medium shadow-md">
              All Classes
            </button>
            {uniqueClasses.map((cls, index) => (
              <button 
                key={index} 
                className="px-4 py-2 bg-indigo-800/40 hover:bg-indigo-700/60 text-indigo-200 rounded-full text-sm font-medium transition-all shadow-md"
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Master Class Data List */}
        <div className="space-y-6">
          {filteredMasterClasses.length > 0 ? (
            filteredMasterClasses.map((entry, index) => (
              <div 
                key={index} 
                className="bg-indigo-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-600/30 overflow-hidden transition-all hover:border-purple-500/30 hover:shadow-xl"
              >
                <div className="p-1">
                  <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-5 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Personal Info Section */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3">{entry.fullName}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-indigo-200">
                            <Mail className="w-4 h-4 mr-2 text-purple-300" />
                            <span>{entry.email}</span>
                          </div>
                          <div className="flex items-center text-indigo-200">
                            <Phone className="w-4 h-4 mr-2 text-purple-300" />
                            <span>{entry.mobileNumber}</span>
                          </div>
                          <div className="flex items-center text-indigo-200">
                            <Calendar className="w-4 h-4 mr-2 text-purple-300" />
                            <span>Age: {entry.age} years</span>
                          </div>
                          <div className="flex items-center text-indigo-200">
                            <Briefcase className="w-4 h-4 mr-2 text-purple-300" />
                            <span>Experience: {entry.exp} years</span>
                          </div>
                        </div>
                      </div>

                      {/* Class Info Section */}
                      <div className="flex-1 bg-indigo-700/30 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <BookOpen className="w-5 h-5 mr-2 text-purple-300" />
                          <h4 className="text-lg font-medium text-white">Enrolled Classes</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {entry.classes.map((cls, i) => (
                            <div key={i} className="flex items-center px-3 py-2 bg-indigo-600/50 rounded-lg">
                              <Award className="w-4 h-4 text-purple-300 mr-2" />
                              <span className="text-indigo-100">{cls}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-indigo-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-indigo-600/30 text-center">
              <div className="inline-flex justify-center items-center p-4 rounded-full bg-indigo-700/50 mb-4">
                <Search className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-medium text-indigo-200 mb-2">No results found</h3>
              <p className="text-indigo-300/70">
                Try adjusting your search criteria or refresh the data.
              </p>
            </div>
          )}
        </div>

 
      </div>
    </div>
  );
}
