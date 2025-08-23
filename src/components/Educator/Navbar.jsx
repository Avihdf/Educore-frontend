import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaCircleUser } from 'react-icons/fa6';
import { useauth } from '../../context/AppContext'

const Edu_Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { admin, loading } = useauth();

     const api_url = import.meta.env.VITE_API_BASE_URL;


    

    return (
        <div className="fixed left-0 top-0 w-full z-50">
            {/* Main Navbar */}
            <nav className="flex justify-end items-center p-[22px]  border-b border-gray-700 text-white transition-all duration-300 bg-gray-900 backdrop-blur-md webkit-backdrop-blur-[10px] 
    md:ml-64 sm:px-10 lg:px-15">


                {admin && (
                    <Link
                        to={`/educator/educator-profile/${admin._id}`}
                    >
                        <div className='flex gap-2 items-center'>
                            {admin.profile_picture ? (
                                <img
                                    src={`${api_url}/uploads/${admin.profile_picture}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ):(
                                <FaCircleUser className="text-[30px]" />
                            )}
                            <span>{admin.name}</span>
                        </div>
                    </Link>

                
                )}

            </nav>

        </div >
    );
};

export default Edu_Navbar;
