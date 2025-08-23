import React from 'react';
import Courses from '../../components/Students/Courses';
import { FaAngleDown } from 'react-icons/fa';

const CourseList = () => {
    return (
        <div className="relative px-4 sm:px-6 lg:px-12 py-[7vh]">

            {/* Background Glow */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[250px] sm:w-[400px] lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Title Section */}
            <div className="relative  py-25 z-10 text-center lg:text-left">
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-light font-[Outfit] leading-snug sm:leading-tight">
                    We offer <span className="text-teal-400 font-medium">courses that upscale</span>
                    <br className="hidden sm:block" /> your <span className="text-teal-400 font-medium">skills</span>.
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl mt-4">
                    We focus on courses that really help.
                </p>

                <p className="flex items-center justify-center lg:justify-start text-base sm:text-lg mt-45">
                    Courses which we offer <FaAngleDown className="text-teal-400 ml-2" />
                </p>
            </div>

            {/* Courses Section */}
            <div className="mt-10">
                <Courses />
            </div>
        </div>
    );
};

export default CourseList;
