import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { FaChalkboardTeacher, FaBook, FaUserGraduate, FaChartBar, FaPlusCircle, FaSignOutAlt, FaBars, FaTimes,FaUserCircle } from 'react-icons/fa';

const Sidenavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

     const api_url = import.meta.env.VITE_API_BASE_URL;

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handlelogout = async (e) => {
        try {
            const res = await axios.get(`${api_url}/api/educator/logout`,
                { withCredentials: true, })
            navigate('/login', { state: { message: res.data.message } })
            window.location.reload
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {/* Hamburger Button (mobile only) */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleSidebar} className="text-white text-2xl bg-gray-900 p-2 rounded-md shadow-lg">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-[0] left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="p-6 text-xl font-bold border-b border-gray-700">
                    Educator Panel
                </div>
                <nav className="flex flex-col gap-2 p-4 text-sm">
                    <Link to="/educator/dashboard" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaChartBar /> Dashboard
                    </Link>
                    <Link to="/educator/add-course" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaPlusCircle /> Add Course
                    </Link>
                    <Link to="/educator/courses-list" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaBook /> Courses List
                    </Link>
                    <Link to="/educator/register-student" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaUserCircle />Register Students
                    </Link>
                    <Link to="/educator/student-enrollments" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaUserGraduate />Enroll Students
                    </Link>
                    <Link to="/educator/coursewise-student-enrollments" className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" onClick={() => setIsOpen(false)}>
                        <FaUserGraduate />Course Wise Enrollments
                    </Link>


                    <button
                    onClick={handlelogout}
                     className="flex items-center gap-3 mt-4 text-red-400 hover:bg-gray-800 px-3 py-2 rounded transition duration-200" >
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </aside>
        </>
    );
};

export default Sidenavbar;
