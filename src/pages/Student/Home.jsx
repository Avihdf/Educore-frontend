import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheck,FaTimes } from 'react-icons/fa';
import Companies from '../../components/Students/Companies';
import Hero from '../../components/Students/Hero';
import Courses from '../../components/Students/Courses';

const Home = () => {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message);
  const [error, seterror] = useState(location.state?.error);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => seterror(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="relative overflow-hidden">
      {/* ✅ Toast Notification */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50 text-sm sm:text-base">
          <FaCheck className="text-green-500 text-xl sm:text-2xl" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50 text-sm sm:text-base">
          <FaTimes className="text-red-500 text-xl sm:text-2xl" />
          <span>{error}</span>
        </div>
      )}

      {/* ✅ Hero Section */}
      <Hero />

      {/* ✅ Concept Section */}
      <div className="relative flex flex-col justify-center items-center text-center my-16 sm:my-20 px-4">
        {/* Background Glow Circle */}
        <div className="absolute top-[85vh] sm:top-[90vh] md:top-[95vh] left-1/2 transform -translate-x-1/2 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Main Text */}
        <p className="text-3xl sm:text-4xl md:text-5xl font-light leading-snug sm:leading-snug md:leading-snug z-10">
          we do whatever it takes to help you
          <br className="hidden sm:block" />
          <span className="text-teal-400 font-medium block mt-2 sm:mt-0">
            understand the concepts
          </span>
        </p>
      </div>

      {/* ✅ Courses Section */}
      <div className="px-3 sm:px-6 md:px-12">
        <p className='font-extralight text-[40px] ml-12 '>Courses Offered.</p>
        <Courses />
      </div>

      {/* ✅ Companies Section */}
      <div className="mt-12 sm:mt-16 px-3 sm:px-6 md:px-12">
        <Companies />
      </div>
    </div>
  );
};

export default Home;
