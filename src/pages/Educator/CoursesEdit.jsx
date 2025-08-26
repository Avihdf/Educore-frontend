import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import Loadingeduactor from "../../components/Educator/Loadingeduactor";


const api_url = import.meta.env.VITE_API_BASE_URL;

const assetURL = (path) => {
    if (!path) return '';
    const normalized = path.replace(/\\/g, '/'); // fix Windows slashes
    const filename = normalized.split('/').pop(); // only filename
    return `${api_url}/thumbnails/${filename}`;
};

const CoursesEdit = () => {
    const { id } = useParams(); // course ID from URL
    const navigate = useNavigate();


    const [coursetitle, setcoursetitle] = useState("");
    const [discription, setdiscription] = useState("");
    const [language, setlanguage] = useState("");
    const [coursetime, setcoursetime] = useState("");
    const [courseprice, setcourseprice] = useState(0);
    const [discount, setdiscount] = useState(0);
    const [thumbnail, setThumbnail] = useState(null);
    const [existingThumbnail, setExistingThumbnail] = useState(null || '');
    const [chapters, setChapters] = useState([]);
    const [newChapters, setNewChapters] = useState([]);
    const [message, setmessage] = useState("");
    const [error, seterror] = useState("");
    const [isLoading, setisLoading] = useState(false)

    // 1. Fetch course details
    useEffect(() => {
        setisLoading(true)
        axios.get(`${api_url}/api/course/${id}`, { withCredentials: true })
            .then((res) => {
                const course = res.data.coursedetail;
                setcoursetitle(course.coursetitle);
                setdiscription(course.discription);
                setlanguage(course.language);
                setcoursetime(course.coursetime);
                setcourseprice(course.price);
                setdiscount(course.discount);
                setExistingThumbnail(course.thumbnail || ''); // existing image path
                setChapters(course.chapters || []);
            }).catch((err) => {
                console.error(err);
                seterror("Failed to load course details");
            }).finally(() => setisLoading(false));

    }, [id]);


    // Delete chapter
    const handleDeleteChapter = async (chapterId) => {

        try {
            const res = await axios.delete(`${api_url}/api/course/${id}/chapters/${chapterId}`,
                { withCredentials: true });
            setChapters(res.data.chapters);
        } catch (err) {
            console.log(err)
            seterror(err.response?.data?.error || "Failed to delete chapter");
        }
    };

    //For Add More Chapters
    const handleAddChapterField = () => {
        setNewChapters([...newChapters, { name: "", duration: "", videos: [] }]);
    };

    // Remove chapter
    const removeNewChapter = (index) => {
        setNewChapters(newChapters.filter((_, i) => i !== index));
    };


    const handleChapterChange = (index, field, value) => {
        setNewChapters((prev) =>
            prev.map((ch, i) =>
                i === index ? { ...ch, [field]: value } : ch
            )
        );
    };


    // 2. Submit updated course
    const handleSubmit = async (e) => {
        e.preventDefault();
        setisLoading(true)

        const formData = new FormData();
        formData.append("coursetitle", coursetitle);
        formData.append("discription", discription);
        formData.append("language", language);
        formData.append("coursetime", coursetime);
        formData.append("price", courseprice);
        formData.append("discount", discount);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }


        // 🔹 Add new chapters
        newChapters.forEach((ch, index) => {
            formData.append('newChapters', JSON.stringify(newChapters.map(chapter => ({
                chaptername: chapter.name,
                chapterduration: chapter.duration
            }))));

            if (ch.videos && ch.videos.length > 0) {
                ch.videos.forEach((file) => {
                    formData.append(`newChapters_${index}`, file);
                });
            }
        });



        try {
            const res = await axios.post(
                `${api_url}/api/updatecourse/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setTimeout(() => {
                navigate('/educator/courses-list', { state: { message: res.data.message } });
            }, 50);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400 && err.response.data.errors) {
                seterror(err.response.data.errors.join(", "));
            } else {
                seterror(err.response?.data?.error || "Update failed");
            }
        } finally {
            setisLoading(false)
        }
    };

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

    if (isLoading) {
        return <Loadingeduactor />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-10 px-3">
            <div className="w-full max-w-3xl bg-gray-900/95 backdrop-blur rounded-3xl shadow-2xl border border-gray-700 p-0 md:p-10 relative">
                <header className="mb-8 pb-4 border-b border-gray-700 flex flex-col md:flex-row items-center md:justify-between gap-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        Edit Course
                    </h1>
                    <span className="text-sm text-gray-400 italic">Update course details below</span>
                </header>

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Course Title & Language */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-gray-100 font-medium mb-1">Course Title *</label>
                            <input
                                type="text"
                                value={coursetitle || ""}
                                onChange={(e) => setcoursetitle(e.target.value)}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-100 font-medium mb-1">Language *</label>
                            <select
                                value={language || ""}
                                onChange={(e) => setlanguage(e.target.value)}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                            >
                                <option value="">Select</option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    {/* Price, Discount, Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Course Price (₹)</label>
                            <input
                                type="number"
                                value={courseprice || ""}
                                onChange={(e) => setcourseprice(e.target.value)}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Discount (%)</label>
                            <input
                                type="number"
                                value={discount || ""}
                                onChange={(e) => setdiscount(e.target.value)}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Course Duration</label>
                            <input
                                type="text"
                                value={coursetime || ""}
                                onChange={(e) => setcoursetime(e.target.value)}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-100 font-medium mb-1">Course Description *</label>
                        <textarea
                            value={discription || ""}
                            onChange={(e) => setdiscription(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="block text-gray-100 font-medium mb-1">Thumbnail Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            className="block w-full file:bg-sky-600 file:text-white file:px-5 file:py-2 file:rounded-xl mt-1"
                        />
                        {existingThumbnail && !thumbnail && (
                            <div className="mt-2">
                                <img
                                    // src={assetURL(existingThumbnail)}
                                    src={existingThumbnail}
                                    alt="Current Thumbnail"
                                    className="w-20 h-20 object-cover rounded-lg border border-sky-400"
                                />
                            </div>
                        )}
                        {thumbnail && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(thumbnail)}
                                    alt="New Preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-sky-400"
                                />
                            </div>
                        )}
                    </div>


                    {/* Existing Chapters */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Chapters</h2>
                        {chapters.length === 0 ? (
                            <p className="text-gray-400">No chapters added yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {chapters.map(ch => (
                                    <li key={ch._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-sky-200 font-medium">{ch.chaptername} ({ch.chapterduration})</p>
                                            <span className="text-gray-400 text-sm">{ch.chaptervideos.length} videos</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteChapter(ch._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold text-green-400 mb-4">Add New Chapters</h2>
                        {newChapters.map((ch, index) => (
                            <div
                                key={index}
                                className="space-y-4 mb-6 border p-4 rounded-xl bg-gray-800/60">

                                {/* Remove Button
                                <button
                                    type="button"
                                    onClick={() => removeNewChapter(index)}
                                    className="absolute top-0 right-0 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow"
                                    aria-label="Remove Chapter"
                                >
                                    <FaTimes />
                                </button> */}

                                <input
                                    type="text"
                                    placeholder="Chapter Name"
                                    value={ch.name}
                                    onChange={(e) => handleChapterChange(index, "name", e.target.value)}
                                    className="w-full bg-gray-800 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 3 days)"
                                    value={ch.duration}
                                    onChange={(e) => handleChapterChange(index, "duration", e.target.value)}
                                    className="w-full bg-gray-800 text-sky-200 border border-gray-700 rounded-xl px-4 py-2"
                                />
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={(e) =>
                                        handleChapterChange(index, "videos", Array.from(e.target.files))
                                    }
                                    className="block w-full file:bg-green-600 file:text-white file:px-5 file:py-2 file:rounded-xl"
                                />
                            </div>

                        ))}

                        <button
                            type="button"
                            onClick={handleAddChapterField}
                            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl text-black font-semibold"
                        >
                            + Add Chapter
                        </button>
                    </div>







                    {/* Submit */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-xl font-semibold text-black shadow-lg"
                        >
                            Update Course
                        </button>
                    </div>
                </form>
            </div>

            {/* Messages */}
            {message && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center gap-2">
                    <FaCheck className="text-green-500 text-[25px]" />
                    <span>{message}</span>
                </div>
            )}
            {error && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-red-500 flex items-center gap-2">
                    <FaTimes className="text-red-500 text-[25px]" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default CoursesEdit;
