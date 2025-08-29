import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiTwotoneHome } from 'react-icons/ai';

import { FaUserEdit } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { useauth } from '../../context/AppContext'
import { HiOutlineLogout } from 'react-icons/hi';


const Edu_Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, setUser, loading } = useauth()
    const [dropdownmenu, setdropdownmenu] = useState(false)
    const [mobileDropdownMenu, setMobileDropdownMenu] = useState(false);

    const api_url = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    



    const dropdownRef = useRef();
    const mobileDropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setdropdownmenu(false);
            }
            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
                setMobileDropdownMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);






    const handlelogout = async (e) => {
        try {
            const res = await axios.get(`${api_url}/api/student/logout`,
                { withCredentials: true }
            )

            // Clear user state
            setUser(null);

            // Also clear from local storage/session storage if used
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');


            navigate('/login', { state: { message: res.data.message } });
            // window.location.reload();
        } catch (err) {
            console.error('Logout error:', err);
        }
    }


    return (
        <div className="fixed left-0 top-0 w-full z-50">
            {/* Main Navbar */}
            <nav className="flex justify-between items-center px-4 sm:px-10 lg:px-36 py-4 text-white transition-all duration-300 bg-[rgba(8,8,8,0.25)] backdrop-blur-md webkit-backdrop-blur-[10px]">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 font-extrabold text-4xl font-[Outfit] text-transparent bg-clip-text bg-gradient-to-r from-[#00f7ff] via-[#7f5af0] to-[#5eead4] tracking-tight hover:brightness-125 transition-all duration-300"
                >
                    <svg
                        className="w-8 h-8 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14v7m0 0H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2h-7zm0 0v-7"
                        />
                    </svg>
                    Educore
                </Link>

                {/* Center Links - Desktop */}
                <div className="hidden md:flex items-center gap-10 font-medium text-white ">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2 group relative">
                            <Link
                                to="/"
                                className=" hover:scale-[1.05] transition duration-200"
                            >

                                Home
                            </Link>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group relative">
                            <Link
                                to="/courses"
                                className="hover:scale-[1.05] transition duration-200"
                            >
                                Courses
                            </Link>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </div>
                    </div>


                    {user ? (
                        <>
                            <button
                                onClick={() => setdropdownmenu(!dropdownmenu)}
                                className="bg-none hover:bg-none text-white px-5 py-2 rounded-full font-medium transition duration-200">
                                <div className='flex gap-2 items-center'>

                                    {user.profile_picture ? (

                                        <img
                                            src={user.profile_picture}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                    ) : (
                                        <FaCircleUser className="text-[30px]" />
                                    )}
                                    <span>{user.name}</span>
                                </div>

                            </button>

                            {dropdownmenu && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-10 mt-45 w-48 text-center bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                    <Link
                                        to={`/profile/${user._id}`}

                                        className="flex gap-2 justify-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        <FaUserEdit className='text-[20px] mt-0.5 text-emerald-700 ' />
                                        Update Profile
                                    </Link>
                                    <Link
                                        to="/my-enrollments"

                                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        My Enrollments
                                    </Link>
                                    <button
                                        onClick={handlelogout}
                                        className="w-full  text-center flex gap-2 justify-center px-4 py-2 hover:bg-red-100 text-red-600"
                                    >
                                        <HiOutlineLogout className='text-[20px] mt-0.5' />
                                        Logout
                                    </button>
                                </div>
                            )}

                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
                        >
                            Login Account
                        </Link>
                    )
                    }




                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                    >
                        {menuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div
                    ref={dropdownRef}
                    className="md:hidden absolute top-full left-0 w-full bg-black bg-opacity-95 backdrop-blur-sm pb-[1000px] text-white flex flex-col items-center gap-6 py-6 shadow-lg animate-slide-down">
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg hover:text-cyan-400 transition-colors duration-300 w-full text-center py-2"
                    >
                        Home
                    </Link>
                    <Link
                        to="/courses"
                        onClick={() => setMenuOpen(false)}
                        className="text-lg hover:text-cyan-400 transition-colors duration-300 w-full text-center py-2"
                    >
                        Courses
                    </Link>
                    {/* <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
                    >
                        Login Account
                    </Link> */}
                    {/* {user ? (
                        <Link
                            to={`/profile/${user._id}`}
                            onClick={() => setMenuOpen(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
                        >
                            {user.name}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
                        >
                            Login Account
                        </Link>
                    )} */}

                    {user ? (
                        <div className="relative flex flex-col items-center">
                            <button
                                onClick={() => setMobileDropdownMenu(!mobileDropdownMenu)}
                                className="bg-none hover:bg-none text-white px-5 py-2 rounded-full font-medium transition duration-200 flex gap-2 items-center"
                            >
                                {user.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />

                                ) : (
                                    <FaCircleUser className="text-[30px]" />
                                )}
                                <span>{user.name}</span>
                            </button>

                            {mobileDropdownMenu && (
                                <div ref={mobileDropdownRef}
                                    className="absolute top-12 w-48 text-center bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                                >
                                    <Link
                                        to={`/profile/${user._id}`}
                                        onClick={() => {
                                            setdropdownmenu(false);
                                            setMenuOpen(false);
                                        }}
                                        className="flex gap-2 justify-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        <FaUserEdit className='text-[20px] mt-0.5 text-emerald-700' />
                                        Update Profile
                                    </Link>
                                    <Link
                                        to="/my-enrollments"
                                        onClick={() => {
                                            setdropdownmenu(false);
                                            setMenuOpen(false);
                                        }}
                                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        My Enrollments
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handlelogout();
                                            setdropdownmenu(false);
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex gap-2 justify-center px-4 py-2 hover:bg-red-100 text-red-600"
                                    >
                                        <HiOutlineLogout className='text-[20px] mt-0.5' />
                                        Logout
                                    </button>

                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            onClick={() => setMenuOpen(false)}
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
                        >
                            Login Account
                        </Link>
                    )}

                </div>
            )}
        </div>
    );
};

export default Edu_Navbar;
