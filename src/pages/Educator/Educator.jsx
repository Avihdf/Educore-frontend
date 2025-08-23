import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Edu_Navbar from '../../components/Educator/Navbar';
import Sidenavbar from '../../components/Educator/Sidenavbar';

const Educator = () => {
     const location=useLocation();
     
    

    return (

        <div>
            <Edu_Navbar />
            <Sidenavbar />

            {/* Main Content Area */}
            <div className="pt-[15px] md:ml-64 p-4  text-white min-h-screen bg-gray-950 scroll-smooth ">
                <Outlet />
                
            </div>
        </div>
    );
};

export default Educator;
