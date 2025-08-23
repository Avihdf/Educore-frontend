import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useauth } from '../../context/AppContext';
import Loading from '../../components/Students/Loading';

const Profile = () => {
    const [form, setform] = useState('form1');
    const { user, loading, userdetails } = useauth();
    const [isUpdating, setIsUpdating] = useState(false);
    const api_url = import.meta.env.VITE_API_BASE_URL;

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    // ✅ Fix preview to show Cloudinary URL if it's already a full URL
    const [previewImage, setPreviewImage] = useState(
        user?.profile_picture
            ? user.profile_picture.startsWith('http')
                ? user.profile_picture
                : `${api_url}/uploads/${user.profile_picture}`
            : null
    );

    const [updateprofile, setupdateprofile] = useState({
        name: user?.name || '',
        dob: user?.dob ? formatDate(user.dob) : '',
        profile_picture: ''
    });

    const [updatepassword, setupdatepassword] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [message, setmessage] = useState('');
    const [error, seterror] = useState('');

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

    const handlechange = (e) => {
        setupdateprofile({
            ...updateprofile,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setupdateprofile({
                ...updateprofile,
                profile_picture: file
            });
        }
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        setmessage('');
        seterror('');
        setIsUpdating(true);

        try {
            const formData = new FormData();

            formData.append('name', updateprofile.name || user.name);
            formData.append('dob', updateprofile.dob || formatDate(user.Date_of_Birth));

            if (updateprofile.profile_picture instanceof File) {
                formData.append('profile_picture', updateprofile.profile_picture);
            } else if (user.profile_picture) {
                formData.append('profile_picture', user.profile_picture);
            }

            const res = await axios.post(
                `${api_url}/api/student/updateprofile`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setmessage(res.data.message);
            await userdetails();

            // ✅ Use Cloudinary URL directly after successful update
            if (res.data.profile_picture) {
                setPreviewImage(
                    res.data.profile_picture.startsWith('http')
                        ? res.data.profile_picture
                        : `${api_url}/uploads/${res.data.profile_picture}`
                );
            }
        } catch (err) {
            console.error(err);
            seterror(err.response?.data?.error || 'Error updating profile: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlepasswordchange = (e) => {
        setupdatepassword({
            ...updatepassword,
            [e.target.name]: e.target.value
        });
    };

    const handelpasswordSubmit = async (e) => {
        e.preventDefault();
        setmessage('');
        seterror('');
        setIsUpdating(true);

        try {
            const res = await axios.post(
                `${api_url}/api/student/updatepassword`,
                updatepassword,
                { withCredentials: true }
            );
            setmessage(res.data.message);
        } catch (err) {
            console.error(err);
            seterror(err.response?.data?.error || 'Error updating Password: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mt-5 w-full max-w-xxl">
            {isUpdating && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Loading />
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-center gap-6 mt-[5px]">
                <div className="flex flex-col items-center gap-2 group">
                    <button onClick={() => setform('form1')} className="-mb-2 text-[18px] cursor-pointer">
                        Update Profile
                    </button>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                    <button onClick={() => setform('form2')} className="-mb-2 text-[18px] cursor-pointer">
                        Update Password
                    </button>
                </div>
            </div>

            {/* Update Profile Form */}
            {form === 'form1' && (
                <form method="post" className="flex flex-col p-6 w-full max-w-lg" onSubmit={handelSubmit}>
                    {/* Name */}
                    <label className="text-sm text-gray-300">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updateprofile.name}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handlechange}
                    />
                    <br />

                    {/* Profile Picture */}
                    <label className="text-sm text-gray-300">Profile Picture</label>
                    <input
                        type="file"
                        name="profile_picture"
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <div className="flex justify-center items-center">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="mt-4 rounded-full border border-gray-500 w-40 h-40 object-cover"
                            />
                        )}
                    </div>
                    <br />

                    {/* DOB */}
                    <label className="text-sm text-gray-300">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={updateprofile.dob}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handlechange}
                    />
                    {user.Date_of_Birth && (
                        <p className="text-[13px] text-gray-300">
                            Your Current Date Of Birth: {formatDate(user.Date_of_Birth)}
                        </p>
                    )}
                    <br />

                    {/* Email */}
                    <label className="text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none cursor-not-allowed bg-gray-800 text-gray-400"
                        disabled
                    />
                    <br />

                    <button className="border-1 border-gray-800 w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                        Update Profile
                    </button>
                </form>
            )}

            {/* Update Password Form */}
            {form === 'form2' && (
                <form method="post" className="flex flex-col p-10 w-full max-w-lg" onSubmit={handelpasswordSubmit}>
                    <label className="text-sm text-gray-300">Current Password</label>
                    <input
                        type="password"
                        name="current_password"
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                    />
                    <br />

                    <label className="text-sm text-gray-300">New Password</label>
                    <input
                        type="password"
                        name="new_password"
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                    />
                    <br />

                    <label className="text-sm text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        name="confirm_password"
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                    />
                    <br />

                    <button className="border-1 border-gray-800 w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                        Change Password
                    </button>
                </form>
            )}

            {/* Toast Messages */}
            {message && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50">
                    <FaCheck className="text-green-500 text-[25px]" />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50">
                    <FaTimes className="text-red-500 text-[25px]" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default Profile;
