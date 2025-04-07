import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updatePPTStatus, getRegisterDataByTeamId } from "../api"; // Assume you've created this API
import { toast } from "react-toastify";

const PptStatus = () => {
  const location = useLocation();
  const teamId = location?.state?.pptId;

  const [formData, setFormData] = useState({
    teamId: "",
    fullName: "",
    teamName: "",
    pptStatus: "",
  });

  useEffect(() => {
    if (teamId) {
      fetchRegisterData();
    }
  }, [teamId]);

  const fetchRegisterData = async () => {
    try {
      const data = await getRegisterDataByTeamId(teamId);
      if (data) {
        setFormData({
          teamId: data.teamId,
          fullName: data.fullName,
          teamName: data.teamName,
          pptStatus: data.pptStatus ?? "", // default fallback
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch registration data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData.teamId, formData.pptStatus , "ppt status");
      const res = await updatePPTStatus(formData.teamId, formData.pptStatus);
      if (res) toast.success("PPT Status Updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating PPT status");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-5 rounded-xl shadow-lg w-[400px]">
        <p className="text-center text-xl font-semibold text-white mb-4">
          PPT Status Form
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Team ID */}
          <div className="flex flex-col">
            <label className="text-white font-medium">Team ID</label>
            <input
              type="text"
              value={formData.teamId}
              disabled
              className="p-2 rounded-lg bg-gray-800 text-white"
            />
          </div>

          {/* Team Leader */}
          <div className="flex flex-col">
            <label className="text-white font-medium">Team Leader</label>
            <input
              type="text"
              value={formData.fullName}
              disabled
              className="p-2 rounded-lg bg-gray-800 text-white"
            />
          </div>

          {/* Team Name */}
          <div className="flex flex-col">
            <label className="text-white font-medium">Team Name</label>
            <input
              type="text"
              value={formData.teamName}
              disabled
              className="p-2 rounded-lg bg-gray-800 text-white"
            />
          </div>

          {/* PPT Status */}
          <div className="flex flex-col">
            <label className="text-white font-medium">PPT Status</label>
            <select
              name="pptStatus"
              value={formData.pptStatus}
              onChange={handleChange}
              required
              className="p-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default PptStatus;
