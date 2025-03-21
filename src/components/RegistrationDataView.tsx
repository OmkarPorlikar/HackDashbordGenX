import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchRegistrations, RegistrationData } from '../api';
import React from 'react';
import { Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function RegistrationDataView() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to Export Data to Excel
  const exportToExcel = () => {
    if (registrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Exclude the 'id' field from the exported data
    // const formattedData = registrations.map(({ id:_, ...rest }) => rest);
    const formattedData = registrations.map(({ id, ...rest }) => rest);
const headers = Object.keys(formattedData[0]) as Array<keyof typeof formattedData[0]>;

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Get headers dynamically
    // const headers = Object.keys(formattedData[0]);

    // Manually add headers with styling
    const headerRow = headers.map((header) => ({
      v: header.toUpperCase(), // Convert header to uppercase
      s: {
        fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
        font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      },
    }));

    // Insert the styled header row
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow.map((h) => h.v)], { origin: "A1" });

    // Apply borders to all cells
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1:A1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });

        if (!worksheet[cell_address]) continue;

        // Apply black border to all cells
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
// Now safely use keyof RegistrationData
worksheet["!cols"] = headers.map((header) => ({
  wch: Math.max(
    header.length,
    ...formattedData.map((row) => {
      const value = row[header as keyof typeof formattedData[0]];
      return value ? value.toString().length : 10;
    })
  ) + 2 // Add padding
}));
    

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Write the Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "registrations.xlsx");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        {/* Total Registrations Section */}
        <h2 className="text-xl text-center font-semibold mb-4">Registration Data</h2>

        <div className="flex items-center xs:w-[80%] md:w-[40%] mb-5  m-auto my-0 justify-center gap-4 bg-slate-100/30 backdrop-blur-lg p-8 rounded-lg shadow-md">
          <Users className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-gray-400">Total Registrations</p>
            <p className="text-2xl font-bold">{registrations.length}</p>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="mb-4">
          {/* <button 
            onClick={() => navigate("/home")} 
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition"
          >
            ← Back to Dashboard
          </button> */}
        </div>

        {/* Header Section with Buttons */}
        <div className="flex items-center justify-end mb-4">
          <div className="flex xs:flex-col  md:flex-row  gap-4 mr-4" >
            <button 
              onClick={fetchData} 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button 
              onClick={exportToExcel} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-4">
          {registrations.map((entry, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">{entry.fullName}</h3>
                  <p className="text-sm text-gray-400">{entry.email}</p>
                  <p className="text-sm text-gray-400">{entry.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="text-gray-400">Team:</span> {entry.teamName}</p>
                  <p className="text-sm"><span className="text-gray-400">Team Size:</span> {entry.teamSize}</p>
                  <p className="text-sm"><span className="text-gray-400">College:</span> {entry.collegeName}</p>
                  <p className="text-sm"><span className="text-gray-400">Branch:</span> {entry.branch}</p>
                  <p className="text-sm"><span className="text-gray-400">City:</span> {entry.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
