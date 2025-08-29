import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Addcourse = () => {

    const navigate = useNavigate();

    const [coursetitle, setcoursetitle] = useState('')
    const [discription, setdiscription] = useState('')
    const [language, setlanguage] = useState('')
    const [coursetime, setcoursetime] = useState('')
    const [courseprice, setcourseprice] = useState(0)
    const [discount, setdiscount] = useState(0)
    const [thumbnail, setThumbnail] = useState(null)
    const [chapters, setChapters] = useState([])

    const [message, setmessage] = useState('')
    const [error, seterror] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);



    const api_url = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setmessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Add new chapter
    const addChapter = () => {
        setChapters([...chapters, { chaptername: '', chapterduration: '', videos: [] }])
    }

    // Remove chapter
    const removeChapter = (index) => {
        setChapters(chapters.filter((_, i) => i !== index));
    };

    // Handle input changes
    const handleChapterChange = (index, field, value) => {
        const updated = [...chapters]
        updated[index][field] = value
        setChapters(updated)
    }

    // Handle videos
    const handleChapterVideos = (index, files) => {
        const updated = [...chapters]
        updated[index].videos = Array.from(files)
        setChapters(updated)
    }

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setmessage('')
        seterror('')
        setIsSubmitting(true);
        setUploadProgress(0);

        const formData = new FormData()
        formData.append('coursetitle', coursetitle)
        formData.append('discription', discription)
        formData.append('language', language)
        formData.append('coursetime', coursetime)
        formData.append('price', courseprice)
        formData.append('discount', discount)
        if (thumbnail) formData.append('thumbnail', thumbnail)

        const chaptersData = chapters.map(ch => ({
            chaptername: ch.chaptername,
            chapterduration: ch.chapterduration
        }))
        formData.append('chapters', JSON.stringify(chaptersData))

        chapters.forEach((ch, idx) => {
            ch.videos.forEach(video => {
                formData.append(`chaptervideos_${idx}`, video)
            })
        })



        try {
            const response = await axios.post(`${api_url}/api/addcourse`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                    // console.log(`Upload Progress: ${progress}%`);
                }
            })
            setmessage(response.data.message)
            setUploadProgress(100);
            navigate('/educator/courses-list', { state: { message: response.data.message } });
        } catch (err) {
            console.error(err)
            if (err.response?.status === 400 && err.response.data.errors) {
                seterror(err.response.data.errors.join(', '))
            } else {
                seterror(err.response?.data?.error || 'Something went wrong:' + err.message)
            }
        } finally {
            setIsSubmitting(false); // Re-enable button
            setUploadProgress(0);
        }

    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-10 px-3">

            <div className="w-full max-w-3xl bg-gray-900/95 backdrop-blur rounded-3xl shadow-2xl border border-gray-700 p-0 md:p-10 relative">

                {/* Progress Bar Overlay - Only over the form container */}
                {isSubmitting && (
                    <div className="absolute inset-0 bg-black rounded-3xl flex items-center  justify-center z-50">
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-600 max-w-md w-full mx-4">
                            <div className="text-center mb-6">
                                <div className="animate-pulse">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-2xl">📤</span>
                                    </div>
                                </div>
                                <h3 className="text-white text-xl font-semibold">
                                    Adding Course
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
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <p className="text-purple-400 text-xs">Uploading course data...</p>
                                    </div>
                                )}
                                {uploadProgress >= 50 && uploadProgress < 90 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <p className="text-yellow-400 text-xs">Uploading videos to cloud...</p>
                                    </div>
                                )}
                                {uploadProgress >= 90 && uploadProgress < 100 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                        Add New Course
                    </h1>
                    <span className="text-sm text-gray-400 italic">
                        Fill out all fields to get started!
                    </span>
                </header>

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Row: Course Title & Language */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-gray-100 font-medium mb-1">Course Title *</label>
                            <input
                                type="text"
                                onChange={e => setcoursetitle(e.target.value)}
                                value={coursetitle}
                                placeholder="Enter Course Title"
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 focus:ring-2 focus:ring-sky-500 rounded-xl px-4 py-2 outline-none font-medium shadow-sm transition"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-100 font-medium mb-1">Language *</label>
                            <select
                                value={language}
                                onChange={e => setlanguage(e.target.value)}
                                className="w-full bg-gray-800/90 border border-gray-700 text-sky-200 px-4 py-2 rounded-xl font-medium shadow-sm transition focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Select</option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    {/* Row: Price & Discount & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Course Price (₹)</label>
                            <input
                                type="number"
                                min={0}
                                onChange={e => setcourseprice(e.target.value)}
                                value={courseprice}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 px-4 py-2 rounded-xl shadow-sm outline-none font-medium focus:ring-2 focus:ring-sky-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Discount (%)</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                onChange={e => setdiscount(e.target.value)}
                                value={discount}
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 px-4 py-2 rounded-xl shadow-sm outline-none font-medium focus:ring-2 focus:ring-sky-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-100 font-medium mb-1">Course Duration</label>
                            <input
                                type="text"
                                value={coursetime}
                                onChange={e => setcoursetime(e.target.value)}
                                placeholder="e.g. 4h 30min"
                                className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 px-4 py-2 rounded-xl shadow-sm outline-none font-medium focus:ring-2 focus:ring-sky-500 transition"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-100 font-medium mb-1">Course Description *</label>
                        <textarea
                            onChange={e => setdiscription(e.target.value)}
                            value={discription}
                            placeholder="Brief description about your course"
                            rows={3}
                            className="w-full bg-gray-800/90 text-sky-200 border border-gray-700 px-4 py-2 rounded-xl shadow-sm outline-none font-medium focus:ring-2 focus:ring-sky-500 transition resize-none"
                        />
                    </div>

                    {/* Course Thumbnail Upload */}
                    <div>
                        <label className="block text-gray-100 font-medium mb-1">Thumbnail Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setThumbnail(e.target.files[0])}
                            className="block w-full file:bg-sky-600 file:text-white file:px-5 file:py-2 file:rounded-xl file:mr-3 file:font-bold border border-gray-700 text-gray-300 rounded-lg bg-gray-800/90 px-2 py-1 mt-1"
                        />
                        <p className="block text-gray-300 text-sm mb-2">Not More than 10* MB</p>
                        {/* Thumbnail preview */}
                        {thumbnail && (
                            <div className="mt-2 flex items-center gap-3">
                                <img src={URL.createObjectURL(thumbnail)} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-sky-400 shadow" />
                                <span className="text-gray-400 text-sm">{thumbnail.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Chapters Section */}
                    <section className="bg-gray-800/70 rounded-xl px-4 py-6 border border-gray-700 mt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="font-extrabold text-2xl text-gradient bg-gradient-to-r from-sky-400 to-green-400 bg-clip-text text-transparent">
                                Chapters
                            </h2>
                            <button
                                type="button"
                                onClick={addChapter}
                                className="ml-2 p-2 rounded-full bg-green-600 hover:bg-green-700 transition text-white shadow focus:outline-none"
                                aria-label="Add Chapter"
                                title="Add Chapter"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        {chapters.length === 0 && (
                            <div className="text-gray-500 italic py-4">
                                No chapters added yet. Click <span className="font-semibold text-sky-400">+</span> to add your first chapter.
                            </div>
                        )}
                        {chapters.map((chapter, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-gray-700 my-4 p-6 bg-gray-900/90 shadow flex flex-col gap-4 relative">

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeChapter(idx)}
                                    className="absolute top-0 right-0 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow"
                                    aria-label="Remove Chapter"
                                >
                                    <FaTimes />
                                </button>

                                <div className="flex gap-4 flex-col md:flex-row">
                                    <input
                                        type="text"
                                        placeholder="Chapter Name"
                                        value={chapter.chaptername}
                                        onChange={e => handleChapterChange(idx, 'chaptername', e.target.value)}
                                        className="flex-1 bg-gray-800/95 border border-sky-500 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400 transition font-medium"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Duration (e.g. 10 min)"
                                        value={chapter.chapterduration}
                                        onChange={e => handleChapterChange(idx, 'chapterduration', e.target.value)}
                                        className="flex-1 bg-gray-800/95 border border-sky-500 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400 transition font-medium"
                                    />
                                </div>
                                <label className="text-gray-300 font-medium">Upload Videos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={e => handleChapterVideos(idx, e.target.files)}
                                    className="w-full border border-gray-600 bg-gray-900 text-gray-200 rounded-lg px-3 py-2 file:bg-sky-500 file:text-white file:px-4 file:py-1 mt-1"
                                />
                                <p className="block text-gray-300 text-sm mb-2">Not More than 100* MB</p>
                                {chapter.videos && chapter.videos.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {chapter.videos.map((video, vIdx) => (
                                            <span key={vIdx} className="text-xs bg-sky-500/40 text-sky-200 rounded px-2 py-1">
                                                {video.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Submit */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 text-lg rounded-xl font-semibold text-white shadow-lg focus:outline-none transition 
        ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Course'}
                        </button>

                    </div>
                </form>

            </div>
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
        </div>
    );

}

export default Addcourse
