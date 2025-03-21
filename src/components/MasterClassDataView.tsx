import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchMasterClassRegistrations, MasterClassData } from '../api';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { GraduationCap } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function MasterClassDataView() {
  const [masterClasses, setMasterClasses] = useState<MasterClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchMasterClassRegistrations();
      setMasterClasses(data);
    } catch (error) {
      console.error("Failed to fetch master class data:", error);
    } finally {
      setLoading(false);
    }
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
      classes: rest.classes.join(", "), // Convert array to string for readability
    }));

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Get headers dynamically
    const headers = Object.keys(formattedData[0]);

    // Manually add headers with styling
    const headerRow = headers.map((header) => ({
      v: header.toUpperCase(),
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
      ) + 2 // Add padding
    }));

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MasterClassRegistrations");

    // Write file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "MasterClass_Registrations.xlsx");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        {/* Registration Count Box */}
        <div className="flex items-center w-full md:w-[40%] mx-auto justify-center gap-4 bg-slate-100/30 backdrop-blur-lg p-8 rounded-lg shadow-md">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-gray-400 text-center">Total Registrations</p>
            <p className="text-2xl font-bold text-center">{masterClasses.length}</p>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
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
              onClick={exportToExcel} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Master Class Data List */}
        <div className="space-y-4">
          {masterClasses.map((entry, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">{entry.fullName}</h3>
                  <p className="text-sm text-gray-400">{entry.email}</p>
                  <p className="text-sm text-gray-400">{entry.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="text-gray-400">Age:</span> {entry.age}</p>
                  <p className="text-sm"><span className="text-gray-400">Experience:</span> {entry.exp}</p>
                  <div className="text-sm">
                    <span className="text-gray-400">Classes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.classes.map((cls, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
