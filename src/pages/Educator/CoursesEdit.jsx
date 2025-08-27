import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";

const api_url = import.meta.env.VITE_API_BASE_URL;

const CoursesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coursetitle, setcoursetitle] = useState("");
    const [discription, setdiscription] = useState("");
    const [language, setlanguage] = useState("");
    const [coursetime, setcoursetime] = useState("");
    const [courseprice, setcourseprice] = useState(0);
    const [discount, setdiscount] = useState(0);
    const [thumbnail, setThumbnail] = useState(null);
    const [existingThumbnail, setExistingThumbnail] = useState('');
    const [chapters, setChapters] = useState([]);
    const [newChapters, setNewChapters] = useState([]);
    const [message, setmessage] = useState("");
    const [error, seterror] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch course details
    useEffect(() => {
        setisLoading(true);
        axios.get(`${api_url}/api/course/${id}`, { withCredentials: true })
            .then((res) => {
                const course = res.data.coursedetail;
                setcoursetitle(course.coursetitle);
                setdiscription(course.discription);
                setlanguage(course.language);
                setcoursetime(course.coursetime);
                setcourseprice(course.price);
                setdiscount(course.discount);
                setExistingThumbnail(course.thumbnail || '');
                setChapters(course.chapters || []);
            })
            .catch((err) => {
                console.error(err);
                seterror("Failed to load course details");
            })
            .finally(() => setisLoading(false));
    }, [id]);

    // Delete chapter
    const handleDeleteChapter = async (chapterId) => {
        try {
            const res = await axios.delete(`${api_url}/api/course/${id}/chapters/${chapterId}`, {
                withCredentials: true
            });
            setChapters(res.data.chapters);
        } catch (err) {
            console.log(err);
            seterror(err.response?.data?.error || "Failed to delete chapter");
        }
    };

    // Add chapter field
    const handleAddChapterField = () => {
        setNewChapters([...newChapters, { name: "", duration: "", videos: [] }]);
    };

    // Remove chapter
    const removeNewChapter = (index) => {
        setNewChapters(newChapters.filter((_, i) => i !== index));
    };

    // Handle chapter changes
    const handleChapterChange = (index, field, value) => {
        setNewChapters((prev) =>
            prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch))
        );
    };

    // Submit updated course
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadProgress(0);

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

        if (newChapters.length > 0) {
            formData.append('newChapters', JSON.stringify(
                newChapters.map(chapter => ({
                    chaptername: chapter.name,
                    chapterduration: chapter.duration
                }))
            ));

            newChapters.forEach((chapter, index) => {
                if (chapter.videos && chapter.videos.length > 0) {
                    chapter.videos.forEach(file => {
                        formData.append(`chapterVideos_${index}[]`, file);
                    });
                }
            });
        }

        try {
            const res = await axios.post(
                `${api_url}/api/updatecourse/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 600000,
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                        // console.log(`Upload Progress: ${progress}%`);
                    }
                }
            );

            setmessage(res.data.message);
            setNewChapters([]);
            setUploadProgress(100);

            // setTimeout(() => {
            //     navigate('/educator/courses-list', { state: { message: res.data.message } });
            // }, 1500);

            navigate('/educator/courses-list', { state: { message: res.data.message } });

        } catch (err) {
            console.error('Submit error:', err);
            if (err.code === 'ECONNABORTED') {
                seterror("Upload timeout. Please try uploading fewer or smaller files at once.");
            } else if (err.response?.status === 400 && err.response.data.errors) {
                seterror(err.response.data.errors.join(", "));
            } else {
                seterror(err.response?.data?.error || "Update failed");
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Auto-hide messages
    useEffect(() => {
        if (message) {
            const t = setTimeout(() => setmessage(""), 5000);
            return () => clearTimeout(t);
        }
        if (error) {
            const t = setTimeout(() => seterror(""), 5000);
            return () => clearTimeout(t);
        }
    }, [message, error]);

    // Show loading screen for initial data fetch
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                    <p className="text-gray-300 mt-4">Loading course details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-10 px-3">
            <div className="w-full max-w-3xl bg-gray-900/95 backdrop-blur rounded-3xl shadow-2xl border border-gray-700 p-6 md:p-10 relative">
                
                {/* Progress Bar Overlay - Only over the form container */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black rounded-3xl flex items-center  justify-center z-50">
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-600 max-w-md w-full mx-4">
                            <div className="text-center mb-6">
                                <div className="animate-pulse">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-2xl">📤</span>
                                    </div>
                                </div>
                                <h3 className="text-white text-xl font-semibold">
                                    Updating Course
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    Please don't close this page
                                </p>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full transition-all duration-500 ease-out relative"
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                                </div>
                            </div>
                            
                            {/* Progress Text */}
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-300 text-sm">
                                    {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                                </p>
                                <p className="text-white font-bold text-xl">
                                    {uploadProgress}%
                                </p>
                            </div>
                            
                            {/* Dynamic Status Message */}
                            <div className="text-center">
                                {uploadProgress < 10 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <p className="text-blue-400 text-xs">Preparing upload...</p>
                                    </div>
                                )}
                                {uploadProgress >= 10 && uploadProgress < 50 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <p className="text-purple-400 text-xs">Uploading course data...</p>
                                    </div>
                                )}
                                {uploadProgress >= 50 && uploadProgress < 90 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <p className="text-yellow-400 text-xs">Uploading videos to cloud...</p>
                                    </div>
                                )}
                                {uploadProgress >= 90 && uploadProgress < 100 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                        <p className="text-green-400 text-xs">Finalizing...</p>
                                    </div>
                                )}
                                {uploadProgress === 100 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <FaCheck className="text-green-400" />
                                        <p className="text-green-400 text-xs font-medium">Upload complete! Redirecting...</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload Speed Indicator */}
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Speed: Fast</span>
                                    <span>ETA: {uploadProgress < 50 ? '2-3 min' : 'Almost done'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <header className="mb-8 pb-4 border-b border-gray-700 flex flex-col md:flex-row items-center md:justify-between gap-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        Edit Course
                    </h1>
                    <span className="text-sm text-gray-400 italic">Update course details below</span>
                </header>

                {/* Form content - dimmed when uploading */}
                <div className={`transition-opacity duration-300 ${isUploading ? 'opacity-0 pointer-events-none  ' : 'opacity-100'}`}>
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Course Title & Language */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-gray-100 font-medium mb-1">Course Title *</label>
                                <input
                                    type="text"
                                    value={coursetitle || ""}
                                    onChange={(e) => setcoursetitle(e.target.value)}
                                    className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none"
                                    required
                                    disabled={isUploading}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-100 font-medium mb-1">Language *</label>
                                <select
                                    value={language || ""}
                                    onChange={(e) => setlanguage(e.target.value)}
                                    className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none"
                                    required
                                    disabled={isUploading}
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
                                <label className="block text-gray-100 font-medium mb-1">Course Price (₹) *</label>
                                <input
                                    type="number"
                                    value={courseprice || ""}
                                    onChange={(e) => setcourseprice(e.target.value)}
                                    className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none"
                                    required
                                    min="0"
                                    disabled={isUploading}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-100 font-medium mb-1">Discount (%) *</label>
                                <input
                                    type="number"
                                    value={discount || ""}
                                    onChange={(e) => setdiscount(e.target.value)}
                                    className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none"
                                    required
                                    min="0"
                                    max="100"
                                    disabled={isUploading}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-100 font-medium mb-1">Course Duration *</label>
                                <input
                                    type="text"
                                    value={coursetime || ""}
                                    onChange={(e) => setcoursetime(e.target.value)}
                                    className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none"
                                    placeholder="e.g., 4 weeks"
                                    required
                                    disabled={isUploading}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Course Description *</label>
                            <textarea
                                value={discription || ""}
                                onChange={(e) => setdiscription(e.target.value)}
                                rows={4}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 rounded-xl px-4 py-2 focus:border-sky-400 focus:outline-none resize-none"
                                placeholder="Describe your course..."
                                required
                                disabled={isUploading}
                            />
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Thumbnail Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-600 file:text-white hover:file:bg-sky-700 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUploading}
                            />
                            <p className="block text-gray-300 text-sm mb-2">Not More than 10* MB</p>
                            {existingThumbnail && !thumbnail && (
                                <div className="mt-3">
                                    <p className="text-gray-400 text-sm mb-2">Current thumbnail:</p>
                                    <img
                                        src={existingThumbnail}
                                        alt="Current Thumbnail"
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-sky-400"
                                    />
                                </div>
                            )}
                            {thumbnail && (
                                <div className="mt-3">
                                    <p className="text-gray-400 text-sm mb-2">New thumbnail preview:</p>
                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="New Preview"
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-green-400"
                                    />
                                    
                                </div>
                            )}
                        </div>

                        {/* Existing Chapters */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Current Chapters</h2>
                            {chapters.length === 0 ? (
                                <p className="text-gray-400 italic">No chapters added yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {chapters.map(ch => (
                                        <li key={ch._id} className="bg-gray-800/80 p-4 rounded-xl flex justify-between items-center border border-gray-700">
                                            <div>
                                                <p className="text-sky-200 font-medium text-lg">{ch.chaptername}</p>
                                                <p className="text-gray-400 text-sm">Duration: {ch.chapterduration}</p>
                                                <span className="text-green-400 text-sm">
                                                    📹 {ch.chaptervideos?.length || 0} video(s)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteChapter(ch._id)}
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isUploading}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* New Chapters */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold text-green-400 mb-4">Add New Chapters</h2>
                            
                            {newChapters.map((ch, index) => (
                                <div key={index} className="space-y-4 mb-6 border border-gray-600 p-5 rounded-xl bg-gray-800/60 relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-300 font-medium">Chapter {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeNewChapter(index)}
                                            className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Remove Chapter"
                                            disabled={isUploading}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    
                                    <input
                                        type="text"
                                        placeholder="Chapter Name"
                                        value={ch.name}
                                        onChange={(e) => handleChapterChange(index, "name", e.target.value)}
                                        className="w-full bg-gray-800 text-sky-200 border border-gray-600 rounded-xl px-4 py-2 focus:border-green-400 focus:outline-none disabled:opacity-50"
                                        disabled={isUploading}
                                    />
                                    
                                    <input
                                        type="text"
                                        placeholder="Duration (e.g., 2 days)"
                                        value={ch.duration}
                                        onChange={(e) => handleChapterChange(index, "duration", e.target.value)}
                                        className="w-full bg-gray-800 text-sky-200 border border-gray-600 rounded-xl px-4 py-2 focus:border-green-400 focus:outline-none disabled:opacity-50"
                                        disabled={isUploading}
                                    />
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Upload Videos</label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            onChange={(e) => handleChapterChange(index, "videos", Array.from(e.target.files))}
                                            className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isUploading}
                                        />
                                        <p className="block text-gray-300 text-sm mb-2">Not More than 100* MB.</p>
                                        {ch.videos && ch.videos.length > 0 && (
                                            <p className="text-green-400 text-sm mt-2">
                                                📹 {ch.videos.length} video(s) selected
                                            </p>
                                        )}
                                        
                                    </div>
                                    
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddChapterField}
                                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-black font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
                                disabled={isUploading}
                            >
                                <FaPlus /> Add New Chapter
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-8">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                                    isUploading 
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                                        : 'bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-xl'
                                }`}
                            >
                                {isUploading ? 'Updating Course...' : 'Update Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Message */}
            {message && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-800 text-white px-6 py-3 rounded-lg shadow-xl border border-green-600 flex items-center gap-3 z-40">
                    <FaCheck className="text-green-400 text-xl" />
                    <span>{message}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-6 py-3 rounded-lg shadow-xl border border-red-600 flex items-center gap-3 z-40">
                    <FaTimes className="text-red-400 text-xl" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default CoursesEdit;
