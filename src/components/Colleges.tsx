import React, { useEffect, useState } from 'react';
import { RegistrationData, fetchRegistrations } from '../api';

function Colleges() {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [collegeCounts, setCollegeCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchRegistrations();
                // console.log(res, "from colleges");
                
                setRegistrations(res);

                // Count occurrences of each college
                const counts: { [key: string]: number } = {};
                res.forEach((data) => {
                    if (data.collegeName) {
                        counts[data.collegeName] = (counts[data.collegeName] || 0) + 1;
                    }
                });
                
                setCollegeCounts(counts);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Total Colleges Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-center mx-auto max-w-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="lucide lucide-university text-blue-400">
                    <circle cx="12" cy="10" r="1" />
                    <path d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
                    <path d="M6 17v.01" />
                    <path d="M6 13v.01" />
                    <path d="M18 17v.01" />
                    <path d="M18 13v.01" />
                    <path d="M14 22v-5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" />
                </svg>
                <div className="text-center sm:text-left mt-4 sm:mt-0 sm:ml-4">
                    <p className="text-gray-400 text-lg">Total Colleges</p>
                    {/* <p className="text-2xl font-bold">{Object.keys(collegeCounts).length}</p> */}
                    <p className="text-2xl font-bold">{registrations.length}</p>
                </div>
            </div>

            {/* College List */}
            <div className="container mx-auto mt-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(collegeCounts).map(([collegeName, count], index) => (
                        <li key={collegeName} className="bg-gray-700 rounded-lg p-4 shadow-md">
                            <p className="text-white font-medium">
                                <span className="text-gray-400">#{index + 1} College Name:</span> {collegeName} 
                                <span className="ml-4 text-green-400 font-bold">({count})</span>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Colleges;
