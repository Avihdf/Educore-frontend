import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';

// Helper to resolve thumbnail URLs
const api_url = import.meta.env.VITE_API_BASE_URL;

const assetURL = (path) => {
    if (!path) return '';
    const normalized = path.replace(/\\/g, '/'); // fix Windows slashes
    const filename = normalized.split('/').pop(); // only filename
    return `${api_url}/thumbnails/${filename}`;
};




const MyCourses = () => {
    const location = useLocation();

    const [courselist, setcourselist] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState('');
    const [message, setmessage] = useState(location.state?.message || '');



    // Auto-hide messages an error
    useEffect(() => {
        if (message) {
            const t = setTimeout(() => setmessage(""), 3000);
            return () => clearTimeout(t);
        }
        if (error) {
            const t = setTimeout(() => seterror(""), 3000);
            return () => clearTimeout(t);
        }
    }, [message, error]);

    // Fetch courses
    useEffect(() => {
        const fetchcourselist = async () => {
            try {
                setisLoading(true)
                const res = await axios.get(`${api_url}/api/courselist`, { withCredentials: true });
                setcourselist(res.data.course);
                // res.data.course.forEach(c => console.log(c.discountedPrice));

            } catch (err) {
                seterror(err.response?.data?.error || 'Error fetching course data');
            } finally {
                setisLoading(false)
            }
        };
        fetchcourselist();
    }, []);

    const handleStatusChange = async (courseId, newStatus) => {
        try {
            const res = await axios.post(`${api_url}/api/coursestatus/${courseId}`,
                { status: newStatus },
                { withCredentials: true }
            );

            // Update UI without reload
            setcourselist(prev =>
                prev.map(c => c._id === courseId ? { ...c, Status: newStatus } : c)
            );

            setmessage(res.data.message || `Status updated to ${newStatus}`);
        } catch (err) {
            seterror(err.response?.data?.error || 'Error updating status');
        }
    };




    const handleDelete = async (courseId) => {
        if (
            window.confirm(
                'Are you sure you want to permanently delete this course?\nThis cannot be undone.'
            )
        ) {
            try {
                const res = await axios.delete(`${api_url}/api/deletecourse/${courseId}`, { withCredentials: true });
                setcourselist((prev) => prev.filter((c) => c._id !== courseId));
                setmessage(res.data.message)
                window.location.reload
            } catch (err) {
                console.log(err)
                seterror('Delete failed: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    if (isLoading) {
        return (
            <Loadingeduactor />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-sky-400 text-center mb-1 tracking-tight drop-shadow-xl">
                    Courses List Panel
                </h1>
                <p className="text-center text-gray-400 mb-6">
                    Manage &amp; modify all courses from one place
                </p>
                <hr className="mb-8 border-gray-700" />

                {message && (
                    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center gap-2 z-50 animate-slide-in">
                        <FaCheck className="text-green-500 text-[25px]" />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-red-500 flex items-center gap-2 z-50 animate-slide-in">
                        <FaTimes className="text-red-500 text-[25px]" />
                        <span>{error}</span>
                    </div>
                )}

                {courselist.length === 0 ? (
                    <div className="text-center text-gray-400 text-lg bg-gray-900/60 p-10 rounded-2xl shadow-lg">
                        No courses found.
                    </div>
                ) : (
                    <div
                        className="
              grid gap-8
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-1
            "
                    >
                        {courselist.map((course) => (
                            <div
                                key={course._id}
                                className="
                  relative bg-gray-900/95 rounded-2xl overflow-hidden shadow-2xl 
                  border border-gray-800 hover:border-sky-500 transition-all 
                  flex flex-col md:flex-row group
                "
                            >
                                {/* Admin Buttons */}

                                <div className="absolute top-3 right-3 z-10 flex gap-3 ">

                                    {/* Status Toggle */}
                                    <select
                                        value={course.Status}
                                        onChange={(e) => handleStatusChange(course._id, e.target.value)}
                                        className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-600 text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <Link
                                        to={`/educator/courseedit/${course._id}`}
                                        className="p-2 rounded-full bg-sky-700/90 hover:bg-sky-600 text-white shadow focus:outline-none transition"

                                        title="Edit Course"
                                    >
                                        <FiEdit />
                                    </Link>
                                    <button
                                        className="p-2 rounded-full bg-red-700/80 hover:bg-red-700 text-white shadow focus:outline-none transition"
                                        onClick={() => handleDelete(course._id)}
                                        title="Delete Course"
                                    >
                                        <FiTrash2 />
                                    </button>




                                </div>






                                {/* Thumbnail */}
                                <div className="relative w-full h-48 md:w-72 md:h-auto overflow-hidden bg-gray-800">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.coursetitle}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                                        onError={(e) => (e.target.style.display = 'none')}
                                    />
                                    <div className="absolute bottom-3 right-2 text-xs text-white rounded px-2 py-1 font-bold ">
                                        {course.Status == 'Inactive' ? (
                                            <span className="bg-red-200 text-red-500/90 px-3 py-1 rounded-2xl text-[18px] font-semibold shadow">
                                                {course.Status}
                                            </span>

                                        ) : (
                                            <span className="bg-green-200 text-emerald-600 px-3 py-1 rounded-2xl text-[18px] font-semibold shadow">
                                                {course.Status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-cyan-700 text-[14px] text-white rounded px-2 py-1 font-bold shadow">
                                        {course.language?.toUpperCase()}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col flex-1 gap-2 p-5">
                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                                        {course.coursetitle}
                                    </h2>
                                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                                        {course.discription}
                                    </p>

                                    {/* Price and Chapters */}
                                    <div className="flex items-center gap-4 mb-3">
                                        {course.discount > 0 ? (
                                            <>
                                                <span className="text-emerald-400 font-bold text-lg">Discounted Price:
                                                    ₹{course.discountedPrice?.toLocaleString()}
                                                </span>
                                                <span className=" text-[18px] text-amber-300 font-bold px-3 py-1 rounded-2xl text-sm ">
                                                    Price: ₹{course.price?.toLocaleString()}
                                                </span>
                                                <span className="ml-1 text-[16px] text-emerald-400 font-semibold">Discount :
                                                    -{course.discount}%
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-amber-300 font-bold text-lg">
                                                ₹{course.price?.toLocaleString()}
                                            </span>
                                        )}

                                        {/* <span className="bg-sky-800/70 text-sky-300 px-3 py-1 rounded-2xl text-xs font-semibold">
                                            {course.chapters?.length ?? 0} Chapters
                                        </span> */}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="bg-sky-700/30 text-sky-300 px-3 py-1 rounded-full text-xs font-bold">
                                            {course.coursetime || 'Duration N/A'}
                                        </span>
                                        <span className="bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-xs">
                                            Added: {new Date(course.Created_date).toLocaleDateString()}
                                        </span>
                                        <span className="bg-sky-800/70 text-sky-300 px-3 py-1 rounded-2xl text-xs font-semibold">
                                            {course.chapters?.length ?? 0} Chapters
                                        </span>



                                    </div>

                                    {/* Chapter Preview */}
                                    <div className="mt-3">
                                        <span className="text-gray-400 text-xs font-bold">
                                            Chapters:
                                        </span>
                                        <ul className="pl-2 space-y-0.5">
                                            {course.chapters?.slice(0, 3).map((chap, idx) => (
                                                <li
                                                    className="text-gray-200 text-sm"
                                                    key={chap._id || idx}
                                                >
                                                    <span className="font-semibold text-sky-400">
                                                        {chap.chaptername}
                                                    </span>
                                                    <span className="text-gray-400 ml-2">
                                                        ({chap.chapterduration})
                                                    </span>
                                                </li>
                                            ))}
                                            {course.chapters?.length > 3 && (
                                                <li className="text-sky-400 text-xs font-normal">
                                                    +{course.chapters.length - 3} more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
