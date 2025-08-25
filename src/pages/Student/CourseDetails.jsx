import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/Students/Loading';
import { FaTimes } from 'react-icons/fa';
import { useauth } from '../../context/AppContext';
import Buybutton from '../../components/Students/Buybutton';

const api_url = import.meta.env.VITE_API_BASE_URL;

const assetURL = (path) => {
    if (!path) return '';
    const normalized = path.replace(/\\/g, '/'); // fix Windows slashes
    const filename = normalized.split('/').pop(); // only filename
    return `${api_url}/thumbnails/${filename}`;
};

const CourseDetails = () => {
    const { id } = useParams();
    const [coursedetail, setcoursedetail] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, seterror] = useState('');
    // const [message, setmessage] = useState('')

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const fetchcoursedetail = async () => {
            try {
                const res = await axios.get(`${api_url}/api/student/course/${id}`);
                setcoursedetail(res.data.coursedetail);

            } catch (err) {
                console.log(err);
                seterror(err.response?.data?.error || 'Error fetching course details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchcoursedetail();
    }, [id]);

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50">
                <FaTimes className='text-red-500 text-[25px]' />
                <span>{error}</span>
            </div>
        );
    }

    const discountedPrice =
        coursedetail.discount > 0
            ? Math.round(coursedetail.price - (coursedetail.price * coursedetail.discount) / 100)
            : coursedetail.price;

    return (
        <div className="max-w-6xl mx-auto pt-10 px-4 text-white">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-20 mb-10">

                {/* Course Info */}
                <div className="w-full lg:w-1/3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-4">
                        {coursedetail.coursetitle}
                    </h1>

                    <div className="flex flex-wrap justify-between gap-2 sm:gap-3 my-6 sm:my-10">
                        <p className="bg-gray-900 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                            Language: <span className="text-green-500 font-semibold">
                                {coursedetail.language?.toUpperCase()}
                            </span>
                        </p>
                        <p className="bg-gray-900 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                            Chapter: <span className="text-sky-400 font-semibold">
                                {coursedetail.chapters?.length || 0} Chapters
                            </span>
                        </p>
                        <p className="bg-gray-900 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                            Course Duration: <span className="text-green-500 font-semibold">
                                {coursedetail.coursetime?.toUpperCase()}
                            </span>
                        </p>
                    </div>

                    {/* Price Section */}
                    <div className="my-6">
                        <p className="text-xl sm:text-2xl font-bold text-green-500">
                            ₹{discountedPrice?.toLocaleString()}
                            <span className="text-sm sm:text-base text-gray-400 font-light"> (+ GST)</span>
                        </p>
                        {coursedetail.discount > 0 && (
                            <div className="mt-1">
                                <span className="text-gray-400 line-through mr-2">
                                    ₹{coursedetail.price?.toLocaleString()}
                                </span>
                                <span className="text-white bg-green-600 text-xs font-semibold px-2 py-1 rounded">
                                    {coursedetail.discount}% OFF
                                </span>
                                <p className="text-green-400 text-sm sm:text-lg font-semibold mt-1">
                                    {coursedetail.discount >= 50
                                        ? 'Early Bird Discount'
                                        : 'Limited Time Discount'}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-300 text-sm sm:text-lg mt-4 sm:mt-8 leading-relaxed">
                        {coursedetail.discription}
                    </p>
                </div>

                {/* Thumbnail */}
                <div className="w-full lg:w-2/3 flex justify-center items-start">
                    {coursedetail.thumbnail && (
                        <img
                            // src={assetURL(coursedetail.thumbnail)}
                            src={coursedetail.thumbnail}
                            alt={coursedetail.coursetitle}
                            className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover rounded-lg shadow-lg"
                        />
                    )}
                </div>
            </div>



            {/* Buy button */}
            <div className="sticky top-[85vh] w-full mt-[-80px] md:mt-[-100px] mb-5 z-50 px-2">
                <div className="sticky bottom-6 flex justify-center z-50 transition-all duration-300">
                    <Buybutton />
                </div>
            </div>

            <div className="w-full bg-gradient-to-b from-black via-black/90 to-black flex justify-center items-center py-16 px-4 relative overflow-hidden">
                {/* Subtle Glow Effect */}
                <div className="absolute  w-[300px] h-[200px] bg-red-500/30 blur-[150px] rounded-full top-2 left-1/2 -translate-x-2 -translate-y-2 pointer-events-none"></div>



                <div className="text-center relative ">
                    <h1 className="text-4xl md:text-[100px] font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <span

                            className="bg-gradient-to-r from-red-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                            From Beginner to Pro
                        </span>
                    </h1>
                    <div className="absolute   w-[300px] h-[200px] bg-red-500/30 blur-[150px] rounded-full top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <p className="text-white text-xl md:text-[60px] mt-4 font-light drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                        In {coursedetail.coursetime}<span className="align-super text-sm">*</span>
                    </p>
                </div>



            </div>

            <hr />

            {/* Chapters */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light mb-3 text-center text-shadow-white py-6 sm:py-10">
                Chapters
            </h2>

            {coursedetail.chapters?.length > 0 ? (
                <ul className="pl-4 sm:pl-6 space-y-2">
                    {coursedetail.chapters.map((chap, idx) => (
                        <li key={idx} className="flex justify-center items-center text-base sm:text-xl md:text-2xl">
                            <span>{idx + 1}{'. '}</span>
                            <span className="font-extralight text-white ml-2">{chap.chaptername}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center">No chapters available.</p>
            )}






            {/* Stactic for every course */}
            <div className="w-full bg-black flex justify-center items-center py-20 px-4">
                <div className="text-left">
                    <h1 className="text-white text-5xl md:text-[150px] font-bold leading-tight">
                        Concepts
                        <br />
                        Which <span className="block md:inline">Matters.</span>
                    </h1>
                </div>
            </div>


            <div className="w-full bg-black flex justify-start items-center py-20 px-6">
                <div className="max-w-5xl text-left">
                    {/* Big Heading */}
                    <h1 className="text-white text-5xl md:text-[110px] font-extrabold leading-tight mb-6">
                        More Value,
                        <br />
                        Less Cost.
                    </h1>

                    {/* Subtext */}
                    <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-2">
                        Quality And Value Drive Us,{" "}
                        <span className="text-green-400">Delivering More</span>
                        <br />
                        For <span className="text-green-400">Less Cost.</span>
                    </p>

                    {/* Note */}
                    <p className="text-gray-400 text-xs mt-2">
                        *Course validity is for 1 year from date of purchase
                    </p>
                </div>
            </div>



        </div>
    );
};

export default CourseDetails;
