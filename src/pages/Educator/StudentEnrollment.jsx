import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle} from 'react-icons/fa';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';

const StudentEnrollment = () => {
    const [studentlist, setstudentlist] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState('');

    const api_url = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setisLoading(true)
                const response = await axios.get(`${api_url}/api/student-list`, { withCredentials: true });
                setstudentlist(response.data.student); // adjust based on your API response
            } catch (err) {
                console.error('Error fetching student data:', err);
                seterror(err.response?.data?.error || 'Error fetching student data');
            }finally{
                setisLoading(false)
            }
        };

        fetchStudentData();
    }, []);

    if (isLoading) {
        return(
            <Loadingeduactor />
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Register Students</h2>

            {studentlist.length === 0 ? (
                <p className="text-center text-white">No students found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {studentlist.map((student, index) => (
                        <div
                            key={index}
                            className="bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    
                                    {student.profile_picture ? (
                                        <img
                                            src={`${api_url}/uploads/${student.profile_picture}`}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border border-white"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-emerald-400 w-8 h-8" />
                                    )}
                                    <div className='text-xl font-semibold flex items-center gap-2'>
                                        
                                        {student.name}
                                    </div>
                                </h3>
                                <span className="text-sm bg-sky-800 text-white px-2 py-1 rounded">
                                    #{index + 1}
                                </span>
                            </div>
                            <p className="text-sm"><span className="font-semibold">Email:</span> {student.email}</p>
                            <p className="text-sm"><span className="font-semibold">Phone:</span> {student.number}</p>
                            <p className="text-sm"><span className="font-semibold">Date of Birth : </span> {student.Date_of_Birth}</p>
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default StudentEnrollment;
