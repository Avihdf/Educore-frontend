import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loadingeduactor from "../../components/Educator/Loadingeduactor";

const api_url = import.meta.env.VITE_API_BASE_URL;

const CourseWiseEnroll = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await axios.get(`${api_url}/api/coursewise-enrollmet`,{withCredentials: true });
                setCourses(res.data.course || []);
            } catch (err) {
                console.error("Error fetching coursewise enrollments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    if (loading) {
        return (
            <Loadingeduactor/>
        );
    }

    return (
        <div className="p-6 bg-none min-h-screen text-gray-100">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
                📊 Course-wise Enrollments
            </h2>

            {courses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((item, idx) => {
                        const c = item.coursedetail;
                        return (
                            <Link
                                to={`/educator/coursewise-enroll/${c._id}`}
                                key={idx}
                                className="bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform"
                            >
                                <img
                                    src={c.thumbnail ? `${api_url}/${c.thumbnail}` : "/placeholder.jpg"}
                                    alt={c.coursetitle}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{c.coursetitle}</h3>
                                    <p className="text-sm text-gray-300">Language: {c.language}</p>
                                    <p className="text-sm text-gray-300">
                                        Duration: {c.coursetime}
                                    </p>

                                    <p className="text-[20px] mt-1">
                                        Total Enrollments:{" "}
                                        <span className="font-semibold">{item.totalenrollments}</span>
                                    </p>
                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${c.Status?.toLowerCase() === "active"
                                                ? "bg-green-200 text-green-900"
                                                : "bg-red-200 text-red-900"
                                            }`}
                                    >
                                        {c.Status}
                                    </span>
                                    <div className="mt-4">
                                        <div

                                            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                                        >
                                            View Details
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-400">No data found</p>
            )}
        </div>
    );
};

export default CourseWiseEnroll;
