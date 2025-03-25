import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { postPptStatus } from "../api";
import {toast} from 'react-toastify';
const PptStatus = () => {
    const location = useLocation();

    const id = location?.state?.pptId;
    console.log(id, "id");
    const [formData, setFormData] = useState({
        teamId: id,
        pptStatus: "",
        pptUpdatedBy: "",
        pptRemarks: "",
        pptFileUrl: "",
    });

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
            const res = await postPptStatus(formData);

            if(res)    toast.success('PPT Status Updated');
            console.log(res, "res");
        }
        catch (error) {
            // toast.error('some Error occured cannot update status')
            console.log("error is below");
            console.log(error.response , "Why the error"); // Logs "pptStatus cannot be empty"


            if (error.response) {
                // Backend responded with an error
                console.log(error.response.data.error); // Logs "pptStatus cannot be empty"
                toast.error(error.response.data.error); // Set error message in state
              } else {
                console.log("An unexpected error occurred");
                setError("An unexpected error occurred");
              }
        }
    }




    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-5 rounded-xl shadow-lg w-[400px]">
                <p className="text-center text-xl font-semibold text-white mb-4">
                    PPT Status Form
                </p>

                <form className="flex flex-col gap-4">
                    {/* Team ID */}
                    <div className="flex flex-col">
                        <label htmlFor="teamId" className="text-white font-medium">
                            Team Id
                        </label>
                        <input
                            type="text"
                            name="teamId"
                            value={formData.teamId}
                            onChange={handleChange}
                            className="p-2 rounded-lg bg-gray-800 text-white outline-none"
                        />
                    </div>

                    {/* PPT Status */}
                    <div className="flex flex-col">
                        <label htmlFor="pptStatus" className="text-white font-medium">
                            PPT Status
                        </label>
                        <select
                            name="pptStatus"
                            value={formData.pptStatus}
                            onChange={handleChange}
                            className="p-2 rounded-lg bg-gray-800 text-white outline-none"
                        >
                            <option value="">Select Status</option>
                            <option value="true">Completed</option>
                            <option value="false">Pending</option>
                        </select>
                    </div>

                    {/* Updated By */}
                    <div className="flex flex-col">
                        <label htmlFor="pptUpdatedBy" className="text-white font-medium">
                            Updated By
                        </label>
                        <input
                            type="text"
                            name="pptUpdatedBy"
                            value={formData.pptUpdatedBy}
                            onChange={handleChange}
                            className="p-2 rounded-lg bg-gray-800 text-white outline-none"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="flex flex-col">
                        <label htmlFor="pptRemarks" className="text-white font-medium">
                            Remarks
                        </label>
                        <textarea
                            name="pptRemarks"
                            value={formData.pptRemarks}
                            onChange={handleChange}
                            className="p-2 rounded-lg bg-gray-800 text-white outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* File URL */}
                    <div className="flex flex-col">
                        <label htmlFor="pptFileUrl" className="text-white font-medium">
                            PPT File URL
                        </label>
                        <input
                            type="text"
                            name="pptFileUrl"
                            value={formData.pptFileUrl}
                            onChange={handleChange}
                            className="p-2 rounded-lg bg-gray-800 text-white outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 
          text-white font-bold py-2 px-4 rounded-lg"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PptStatus;
