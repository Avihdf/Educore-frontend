import React from 'react';
import { motion } from 'framer-motion';
import Courses from '../../components/Students/Courses';
import { FaAngleDown } from 'react-icons/fa';

const CourseList = () => {
   
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, 
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };
    
    const coursesSectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
    };


    return (
  
        <motion.div
            className="relative px-4 sm:px-6 lg:px-12 py-28" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Glow */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[250px] sm:w-[400px] lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Title Section */}
            <div className="relative z-10 text-center lg:text-left">
                
                
                <motion.h1
                    className="text-2xl sm:text-4xl lg:text-6xl font-light font-[Outfit] leading-snug sm:leading-tight"
                    variants={itemVariants}
                >
                    We offer <span className="text-teal-400 font-medium">courses that upscale</span>
                    <br className="hidden sm:block" /> your <span className="text-teal-400 font-medium">skills</span>.
                </motion.h1>

                <motion.p
                    className="text-lg sm:text-xl lg:text-2xl mt-4"
                    variants={itemVariants}
                >
                    We focus on courses that really help.
                </motion.p>

                <motion.p
                    className="flex items-center justify-center lg:justify-start text-base sm:text-lg mt-12"
                    variants={itemVariants}
                >
                    Courses which we offer
                    <motion.span
                        animate={{ y: [0, 5, 0] }} 
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <FaAngleDown className="text-teal-400 ml-2" />
                    </motion.span>
                </motion.p>
            </div>

            {/* Courses Section */}
          
            <motion.div
                className="mt-10"
                variants={coursesSectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                <Courses />
            </motion.div>
        </motion.div>
    );
};

export default CourseList;