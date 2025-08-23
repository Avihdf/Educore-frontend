import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from 'react-icons/fa';


const api_url = import.meta.env.VITE_API_BASE_URL;

const assetURL = (path) => {
    if (!path) return '';
    const normalized = path.replace(/\\/g, '/'); // fix Windows slashes
    const filename = normalized.split('/').pop(); // only filename
    return `${api_url}/thumbnails/${filename}`;
};

const Courses = () => {
    const [courselist, setcourselist] = useState([]);
    const [error, seterror] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);


    useEffect(() => {
        const fetchcourselist = async () => {
            try {
                const res = await axios.get(`${api_url}/api/student/courselist`, { withCredentials: true });
                setcourselist(res.data.course);


            } catch (err) {
                console.error('Error fetching courses data:', err);
                seterror(err.response?.data?.error || 'Error fetching courses data');
            }
        };
        fetchcourselist();
    }, []);

    return (
        <div className="min-h-screen bg-black p-6 md:p-12">

            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50">
                        <FaTimes className='text-red-500 text-[25px]' />
                        <span>{error}</span>
                    </div>
                )}


                {courselist.length === 0 ? (
                    <div className="text-center text-gray-400 text-lg bg-gray-900/60 p-10 rounded-2xl shadow-lg">
                        No courses found.
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {courselist.map((course) => {
                            const discountedPrice =
                                course.discount > 0
                                    ? Math.round(course.price - (course.price * course.discount) / 100)
                                    : course.price;

                            return (
                                <Link key={course._id} to={`/course/${course._id}`}>
                                    <div
                                        className="bg-gray-850 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 hover:border-green-400 transition flex flex-col"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-full h-52 overflow-hidden bg-gray-800 rounded-t-2xl">
                                            <img
                                                src={assetURL(course.thumbnail)}
                                                alt={course.coursetitle}
                                                className="w-full h-full object-cover object-center hover:scale-105 transition duration-700"
                                                onError={(e) => (e.target.style.display = 'none')}
                                            />

                                            {course.discount >= 65 ? (
                                                <div className="absolute top-3 right-3 bg-purple-600 text-xs md:text-sm text-white font-semibold rounded px-3 py-1 shadow">
                                                    Special Offer
                                                </div>
                                            ) : course.discount >= 50 ? (
                                                <div className="absolute top-3 right-3 bg-green-600 text-xs md:text-sm text-white font-semibold rounded px-3 py-1 shadow">
                                                    Early Discount
                                                </div>
                                            ) : course.discount >= 30 ? (
                                                <div className="absolute top-3 right-3 bg-yellow-600 text-xs md:text-sm text-white font-semibold rounded px-3 py-1 shadow">
                                                    Save More
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col flex-1 gap-2 p-5">
                                            <h2 className="text-xl md:text-2xl font-semibold text-white line-clamp-2">
                                                {course.coursetitle}
                                            </h2>

                                            {/* Tags */}
                                            <div className="flex gap-2 mt-3">
                                                <span className="bg-red-600 text-white px-3 py-0.5 rounded text-xs font-semibold">
                                                    Full Details
                                                </span>
                                                <span className="bg-gray-700 text-white px-3 py-0.5 rounded text-xs font-semibold">
                                                    {course.language?.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Price Section */}
                                            <div className="mt-13">
                                                <p className="text-green-400 text-sm font-semibold">
                                                    {course.discount >= 50
                                                        ? 'Early Bird Discount'
                                                        : 'Limited Time Discount'}
                                                </p>
                                                <div className="flex items-center gap-3 pb-2">
                                                    <span className="text-white text-xl font-bold">
                                                        ₹{discountedPrice?.toLocaleString()} (+ GST)
                                                    </span>
                                                    {course.discount > 0 && (
                                                        <>
                                                            <span className="text-gray-400 line-through">
                                                                ₹{course.price?.toLocaleString()}
                                                            </span>
                                                            <span className="text-white bg-green-600 text-xs font-semibold px-2 py-2 rounded">
                                                                {course.discount}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Button */}

                                        </div>

                                    </div>
                                    <button className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold cursor-pointer py-2 rounded-lg shadow transition-all">
                                        View Details
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                )
                }
            </div>

        </div>
    );
};

export default Courses;
