import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Companies from '../../components/Students/Companies';
import Hero from '../../components/Students/Hero';
import Courses from '../../components/Students/Courses';
import CircleCard from '../../components/Students/CircleCard';
import ThreeCardLayout from '../../components/Students/CircleCard';

const Home = () => {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message);
  const [error, setError] = useState(location.state?.error);

  // Toast timers
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Toast Notifications */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <FaCheck className="text-green-500 text-xl" />
            <span>{message}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <FaTimes className="text-red-500 text-xl" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <Hero />
      <ThreeCardLayout/>
   

      {/* Concept Section */}
      <motion.div
        className="relative flex flex-col justify-center items-center text-center my-16 px-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        <div className="absolute top-[90vh] left-1/2 transform -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <p className="text-3xl sm:text-4xl md:text-5xl font-light leading-snug z-10">
          We do whatever it takes to help you
          <br className="hidden sm:block" />
          <span className="text-teal-400 font-medium block mt-2 sm:mt-0">
            understand the concepts
          </span>
        </p>
      </motion.div>

      {/* Courses Section with stagger */}
      <motion.div
        className="px-3 sm:px-6 md:px-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.p
          variants={fadeLeft}
          className="font-extralight text-[40px] ml-12"
        >
          Courses Offered.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Courses />
        </motion.div>
      </motion.div>

      {/* Companies Section */}
      <motion.div
        className="mt-12 sm:mt-16 px-3 sm:px-6 md:px-12"
        variants={fadeRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <Companies />
      </motion.div>
    </div>
  );
};

export default Home;
