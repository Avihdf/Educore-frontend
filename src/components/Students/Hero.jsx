import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="bg-black text-white px-6 py-20 text-center relative overflow-hidden">
            {/* Gradient backdrop (optional visual glow) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-[Outfit] leading-tight z-10 relative">
                We only <span className="text-teal-400 font-medium">teach</span><br />
                what we are really<br />
                really <span className="italic font-semibold">good</span> at.
            </h1>

            {/* Right side mini-description (absolute for large screens) */}
            <div className="hidden lg:block absolute top-20 right-0 xl:right-30 w-72 border rounded-[10px] border-gray-900 p-4 text-sm text-right text-gray-300 z-10">
                Get ready to <span className="text-teal-400">accelerate your career</span> with customized courses<br />
                and leave your mark in the tech industry
            </div>

            {/* Call-to-action Button */}
            <div className="mt-10 z-10 relative">
                <Link
                    to="/courses"
                    className="bg-teal-400 hover:bg-teal-300 text-black font-semibold py-3 px-6 rounded-md transition-all duration-300"
                >
                    Check Courses - Make an Impact
                </Link>
            </div>

            {/* Metrics Section */}
            <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-12 z-10 relative">
                <div>
                    <h2 className="text-2xl font-extrabold">10k+</h2>
                    <p className="text-sm text-gray-400">Students taught</p>
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold">5+</h2>
                    <p className="text-sm text-gray-400">Educators</p>
                </div>
                
            </div>
        </section>
    );
};

export default Hero;
