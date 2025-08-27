import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useauth } from '../../context/AppContext';
import Loadingeduactor from '../../components/Educator/Loadingeduactor';


const EducatorProfile = () => {

    const [form, setform] = useState('form1');
    const { admin, loading, admindetails } = useauth();
    const [isUpdating, setIsUpdating] = useState(false);

    const api_url = import.meta.env.VITE_API_BASE_URL;


    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const Spinner = () => (
        <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );


    const [previewImage, setPreviewImage] = useState(
        admin?.profile_picture ? admin.profile_picture : null
    );

    const [updateprofile, setupdateprofile] = useState({
        name: admin?.name || '',
        dob: admin?.dob ? formatDate(admin.dob) : '',
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

    // Handle input changes
    const handlechange = (e) => {
        setupdateprofile({
            ...updateprofile,
            [e.target.name]: e.target.value
        });
    };

    // Handle file selection
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

    // Submit profile update (Partial Update)
    const handelSubmit = async (e) => {
        e.preventDefault();
        setmessage('');
        seterror('');
        setIsUpdating(true);

        try {
            const formData = new FormData();

            // Only append fields that are updated
            if (updateprofile.name && updateprofile.name !== admin.name) {
                formData.append('name', updateprofile.name);
            } else {
                formData.append('name', admin.name);
            }

            if (updateprofile.dob && updateprofile.dob !== formatDate(admin.Date_of_Birth)) {
                formData.append('dob', updateprofile.dob);
            } else if (admin.Date_of_Birth) {
                formData.append('dob', formatDate(admin.Date_of_Birth));
            }

            // If new image is selected, append it; else send existing filename
            if (updateprofile.profile_picture instanceof File) {
                formData.append('profile_picture', updateprofile.profile_picture);
            } else if (admin.profile_picture) {
                formData.append('profile_picture', admin.profile_picture);
            }

            const res = await axios.post(
                `${api_url}/api/educator/updateprofile`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setmessage(res.data.message);
            await admindetails();
            if (res.data.profile_picture) {
                // setPreviewImage(`${api_url}/uploads/${res.data.profile_picture}`);
                setPreviewImage(res.data.profile_picture);
            }
        } catch (err) {
            console.log(err);
            seterror(err.response?.data?.error || 'Error updating profile: ' + err.message);
        } finally {
            setIsUpdating(false)
        }
    };

    // Handle password change
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
        setIsUpdating(true)

        try {
            const res = await axios.post(
                `${api_url}/api/educator/updatepassword`,
                updatepassword,
                { withCredentials: true }
            );
            setmessage(res.data.message);
        } catch (err) {
            console.log(err);
            seterror(err.response?.data?.error || 'Error updating Password: ' + err.message);
        } finally {
            setIsUpdating(false)
        }
    };


    // if (isUpdating) {
    //     <Loadingeduactor />
    // }

    return (

        <div className="flex flex-col justify-center items-center mt-5 w-full max-w-xxl">
            <div className="flex justify-center gap-6 mt-[5px]">
                <div className="flex flex-col items-center gap-2 group">
                    <button onClick={() => setform('form1')} className="-mb-2 text-[18px] cursor-pointer">
                        Update Profile
                    </button>
                    <span className="-bottom-1 left-1/2 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-1000 group-hover:w-full group-hover:left-0"></span>

                </div>
                <div className="flex flex-col items-center gap-2 group">
                    <button onClick={() => setform('form2')} className="-mb-2 text-[18px] cursor-pointer">
                        Update Password
                    </button>
                    <span className="-bottom-1 left-1/2 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-1000 group-hover:w-full group-hover:left-0"></span>
                </div>
            </div>

            {form === 'form1' && (
                <form method="post" className="flex flex-col p-6 w-full max-w-lg" onSubmit={handelSubmit}>
                    {/* Name */}
                    <label className="text-sm text-gray-300 ">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updateprofile.name}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handlechange}
                    />
                    <br />

                    {/* Profile Picture */}
                    <label className="text-sm text-gray-300 ">Profile Picture</label>
                    <input
                        type="file"
                        name="profile_picture"
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <p className="block text-gray-300 text-sm mb-2">Not More than 5* MB</p>
                    <div className="flex justify-center items-center">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="mt-4 rounded-[50%] border border-gray-500 w-40 h-40 object-cover"
                            />
                        )}
                    </div>
                    <br />

                    {/* DOB */}
                    <label className="text-sm text-gray-300 ">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={updateprofile.dob}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white"
                        onChange={handlechange}
                    />
                    {admin.Date_of_Birth && (
                        <p className='text-[13px] text-gray-300'>
                            Your Current Date Of Birth: {formatDate(admin.Date_of_Birth)}
                        </p>
                    )}
                    <br />

                    {/* Email */}
                    <label className="text-sm text-gray-300 ">Email</label>
                    <input
                        type="email"
                        value={admin?.email || ''}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none cursor-not-allowed bg-gray-800 text-gray-400"
                        disabled
                    />
                    <br />


                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={`flex items-center justify-center border-1 border-gray-800 w-full py-3 mt-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
        ${isUpdating
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
                    >
                        {isUpdating ? (
                            <>
                                <Spinner /> Updating...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </button>

                </form>
            )}

            {form === 'form2' && (
                <form method="post" className='flex flex-col p-10 w-full max-w-lg' onSubmit={handelpasswordSubmit} >
                    <label className='text-sm text-gray-300 '>Current Password</label>
                    <input
                        type="password"
                        name='current_password'
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white" /> <br />

                    <label className='text-sm text-gray-300 '>New Password</label>
                    <input
                        type="password"
                        name='new_password'
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white" /> <br />

                    <label className='text-sm text-gray-300 '>Confirm Password</label>
                    <input
                        type="password"
                        name='confirm_password'
                        onChange={handlepasswordchange}
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none focus:outline-none bg-gray-800 text-white" /> <br />


                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={`flex items-center justify-center border-1 border-gray-800 w-full py-3 mt-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
        ${isUpdating
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
                    >
                        {isUpdating ? (
                            <>
                                <Spinner /> Updating...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </button>

                </form>
            )}

            {message && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50">
                    <FaCheck className='text-green-500 text-[25px]' />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50'>
                    <FaTimes className='text-red-500 text-[25px]' />
                    <span>{error}</span>
                </div>
            )}
        </div>

    );
};

export default EducatorProfile
