import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaSearch, FaTimes } from 'react-icons/fa';
import Loading from '../../components/Students/Loading';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';

const EnrollStudent = () => {
    const [enrollstudentlist, setEnrollStudentList] = useState([]);
    const [error, seterror] = useState('');
    const [isLoading, setisLoading] = useState(false)
    const [searchEmail, setSearchEmail] = useState('');
    const api_url = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);


    // Fetch all students initially
    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            setisLoading(true)
            const response = await axios.get(`${api_url}/api/enrollstudent-list`, { withCredentials: true });
            setEnrollStudentList(response.data.students || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            seterror(err.response?.data?.error || 'Error fetching student data');
        } finally {
            setisLoading(false)
        }
    };

    // Search handler
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmail.trim()) {
            fetchStudentData();
            return;
        }
        try {
            setisLoading(true)
            const response = await axios.get(
                `${api_url}/api/enrollstudent-search?email=${encodeURIComponent(searchEmail)}`,
                { withCredentials: true }
            );
            setEnrollStudentList(response.data.students || []);
            seterror('');
        } catch (err) {
            console.error('Search error:', err);
            setEnrollStudentList([]);
            seterror(err.response?.data?.error || 'No students found with this email');
        } finally {
            setisLoading(false)
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
        return (
            <Loadingeduactor />
        )
    }

    return (

        <div className="p-6">
            <div className="flex flex-col gap-3 justify-center items-center">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Enroll Students</h2>

                {/* Search Form */}
                <form
                    className="flex items-center w-full max-w-md bg-gray-800 rounded-full overflow-hidden shadow-md"
                    onSubmit={handleSearch}
                >
                    <input
                        type="text"
                        placeholder="Search by student email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="flex-1 bg-transparent text-gray-200 px-4 py-2 outline-none placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="bg-none text-white text-[17px] px-4 py-2 flex items-center justify-center"
                    >
                        <FaSearch />
                    </button>
                </form>
            </div>





            {enrollstudentlist.length === 0 ? (
                <p className="text-center text-white mt-4">No students found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {enrollstudentlist.map((item, index) => (
                        <div
                            key={item?.enrollment?._id || index}
                            className="bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    {item?.student?.profile_picture ? (
                                        <img
                                            src={item.student.profile_picture}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border border-white"
                                        />
                                    ) : (
                                        <FaUserGraduate className="text-sky-400 w-8 h-8" />
                                    )}
                                    {item?.student?.name || 'Unknown Student'}
                                </h3>
                                <span className="text-sm bg-sky-800 text-white px-2 py-1 rounded">
                                    #{index + 1}
                                </span>
                            </div>

                            <p className="text-sm">
                                <span className="font-semibold">Email:</span> {item?.student?.email || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Phone:</span> {item?.student?.number || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Course:</span> {item?.course?.coursetitle || 'Course Deleted'}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Purchase Date:</span>{' '}
                                {item?.enrollment?.Purchase_date
                                    ? new Date(item.enrollment.Purchase_date).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Time Left:</span>{' '}
                                {item?.enrollment?.Time_left ?? 'N/A'} days
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrollStudent;
