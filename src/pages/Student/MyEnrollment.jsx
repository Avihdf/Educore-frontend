import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useauth } from '../../context/AppContext';
import {
    FaCheck,
    FaBookOpen,
    FaPlayCircle,
    FaLayerGroup,
    FaClock,
    FaUserCircle,
    FaGraduationCap,
    FaCalendarAlt,
} from 'react-icons/fa';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';

const api_url = import.meta.env.VITE_API_BASE_URL;
const assetURL = (path) => {
    if (!path) return '';
    const normalized = path.replace(/\\/g, '/');
    const filename = normalized.split('/').pop();
    return `${api_url}/thumbnails/${filename}`;
};


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getTotalVideos = (chapters) => {
    if (!Array.isArray(chapters)) return 0;
    return chapters.reduce((total, chapter) => total + (chapter.chaptervideos?.length || 0), 0);
};

const daysLeft = (endDate) => {
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
};

const profileFallback = (name = '') =>
    name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export default function MyEnrollment() {
    const location = useLocation();
    const { user } = useauth();

    const [message, setMessage] = useState(location.state?.message || '');
    const [enrollments, setEnrollments] = useState([]);
    const [userdetail, setUserdetail] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user._id) return;
        const fetchEnrollments = async () => {
            try {
                const res = await axios.get(`${api_url}/api/userenrollment/${user._id}`, {withCredentials: true });
                setEnrollments(res.data.enrollments);
                setUserdetail(res.data.userdetail || {});
            } catch (err) {
                console.error('Error fetching enrollments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, [user]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 3500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (loading)
        return (
            <div>
                <Loadingeduactor />
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-8 px-2 sm:px-4">
            {/* Toast */}
            {message && (
                <div className="fixed top-5 z-50 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-4 rounded-2xl border-l-4 border-green-500 flex items-center gap-3 shadow-2xl text-base font-semibold fade-in">
                    <FaCheck className="text-green-500 text-xl" />
                    <span>{message}</span>
                </div>
            )}

            {/* User Dashboard Summary */}
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 p-6 rounded-3xl bg-black/20 backdrop-blur-xl shadow-xl border border-gray-800">
                <div className="flex items-center gap-4">
                    {userdetail?.profile_picture ? (
                        <img
                            className="w-16 h-16 rounded-full border-4 border-none object-cover"
                            src={`${api_url}/uploads/${user.profile_picture}`}
                            alt={userdetail.name}
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex justify-center items-center text-2xl font-bold">
                            <FaUserCircle className="mr-2" /> {profileFallback(userdetail?.name)}
                        </div>
                    )}
                    <div>
                        <div className="text-2xl font-bold text-white">{userdetail?.name || ''}</div>
                        <div className="text-gray-400">{userdetail?.email || ''}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="uppercase text-sm font-bold text-gray-300">Total Courses</span>
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-orange-600">
                        {enrollments.length}
                    </span>
                </div>
            </div>

            {/* Motivational Header */}
            <div className="max-w-7xl mx-auto text-center mt-2 mb-12">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 pb-1">
                    My Learning
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                    Welcome back{userdetail?.name ? `, ${userdetail?.name}` : ''}! Let's continue your journey.
                </p>
            </div>

            {/* Courses Grid */}
            <div className="max-w-7xl mx-auto w-full">
                {enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {enrollments.map((enrollment) => {
                            const course = enrollment.course_id;
                            const totalVideos = getTotalVideos(course.chapters);
                            // Calculate chapters completed (video chapters as completed proxy)
                          
                            let nextChapter = "—";
                            if (course.chapters?.length > 0) {
                                for (let chap of course.chapters) {
                                    const uncompleted = chap.chaptervideos?.find(
                                        (vid) =>
                                            !enrollment.completedVideos?.some(
                                                (cv) =>
                                                    cv.chapterId === chap._id.toString() &&
                                                    cv.video === vid.videofile
                                            )
                                    );
                                    if (uncompleted) {
                                        nextChapter = chap.chaptername;
                                        break;
                                    }
                                }
                                if (nextChapter === "—") nextChapter = course.chapters[0]?.chaptername || "—";
                            }


                            return (
                                <Link
                                    to={`/player/${course._id}`}
                                    key={enrollment._id}
                                    className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/10 group transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 overflow-hidden flex flex-col"
                                    style={{ minHeight: 400 }}
                                >
                                    {/* Card Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={assetURL(course.thumbnail)}
                                            alt={course.coursetitle}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 text-xs rounded-full flex items-center gap-2 shadow border border-pink-400 uppercase font-bold text-white">
                                            <FaBookOpen className="text-orange-400" /> {course.language?.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                            {course.coursetitle}
                                        </h2>

                                        

                                        {/* Meta Stats */}
                                        <div className="flex flex-wrap gap-2 mb-2 text-gray-400 text-xs">
                                            <div className="flex items-center gap-1"><FaLayerGroup className="text-orange-400" /> {course.chapters?.length} Chapters</div>
                                            <div className="flex items-center gap-1"><FaPlayCircle className="text-pink-500" /> {totalVideos} Videos</div>
                                            <div className="flex items-center gap-1"><FaClock className="text-purple-400" /> {enrollment.Time_left} days left</div>
                                        </div>



                                        <div className="text-gray-400 text-xs flex flex-wrap gap-4 border-t border-white/10 mt-6 pt-3">
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> Purchase: <span className="font-semibold text-green-300">{formatDate(enrollment.Purchase_date)}</span></span>
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> Ends: <span className="font-semibold text-pink-300">{formatDate(enrollment.End_date)}</span></span>
                                        </div>

                                        <span className="pt-2 text-xs text-gray-400">Next up: <span className="font-semibold text-white">{nextChapter}</span></span>
                                        <div className="mt-3 flex-1 flex items-end">
                                            <div className="w-full text-center py-3 bg-pink-600 text-white rounded-lg font-semibold group-hover:bg-gradient-to-r from-pink-500 to-orange-400 transition-colors duration-300 flex items-center justify-center gap-2 text-base">
                                                <FaPlayCircle />
                                                <span>Resume Learning</span>
                                            </div>
                                        </div>
                                    </div>


                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center mt-16 text-center">
                        <div className="p-6 bg-gray-900/50 rounded-full border-2 border-dashed border-gray-700 mb-6">
                            <FaGraduationCap className="text-7xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Courses Yet!</h2>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Your learning adventure awaits. Enroll in a course to see it appear here.
                        </p>
                        <Link
                            to="/courses"
                            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
                        >
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
