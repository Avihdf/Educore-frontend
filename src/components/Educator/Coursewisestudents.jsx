import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';

const Coursewisestudents = () => {
    const { id } = useParams(); // course ID from URL
    const [studentList, setStudentList] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const api_url = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (id) {
            fetchCourseStudents();
        }
    }, [id]);

    const fetchCourseStudents = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${api_url}/api/students-in-course/${id}`,{withCredentials: true });
            setStudentList(response.data.students || []);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError(err.response?.data?.error || 'Error fetching course students');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50'>
                <FaTimes className='text-red-500 text-[25px]' />
                <span>{error}</span>
            </div>
        );
    }

    if (isLoading) {
        return <Loadingeduactor />;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-3 justify-center items-center">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Students in Course
                </h2>
            </div>

            {studentList.length === 0 ? (
                <p className="text-center text-white mt-4">No students found for this course.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {studentList.map((item, index) => (
                        <div
                            key={item.enrollment._id}
                            className="bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    {item.student.profile_picture ? (
                                        <img
                                            // src={`${api_url}/uploads/${item.student.profile_picture}`}
                                            src={item.student.profile_picture}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border border-white"
                                        />
                                    ) : (
                                        <FaUserGraduate className="text-sky-400 w-8 h-8" />
                                    )}
                                    {item.student.name}
                                </h3>
                                <span className="text-sm bg-sky-800 text-white px-2 py-1 rounded">
                                    #{index + 1}
                                </span>
                            </div>

                            <p className="text-sm">
                                <span className="font-semibold">Email:</span> {item.student.email}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Phone:</span> {item.student.number}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Purchase Date:</span>{' '}
                                {new Date(item.enrollment.Purchase_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Time Left:</span>{' '}
                                {item.enrollment.Time_left} days
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Coursewisestudents;
