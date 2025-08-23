import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaBook, FaChartLine, FaCheck,FaRupeeSign} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {

    const location = useLocation();

    const [dashboardelements, setdashboardelements] = useState({});
    const [message, setmessage] = useState(location.state?.message)

    const api_url = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setmessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    useEffect(() => {

        const fetchdashboardData = async () => {
            try {
                const response = await axios.get(`${api_url}/api/dashboard`, { withCredentials: true });
                setdashboardelements(response.data);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchdashboardData();
    }, []);

    const cards = [
        {
            title: 'Total Students',
            value: dashboardelements.user || 0,
            icon: <FaUsers className="text-4xl text-blue-500" />,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            title: 'Total Educators',
            value: dashboardelements.educator || 0,
            icon: <FaChalkboardTeacher className="text-4xl text-purple-500" />,
            color: 'from-purple-500 to-pink-600',
        },
        {
            title: 'Total Courses',
            value: dashboardelements.courses || 0,
            icon: <FaBook className="text-4xl text-green-500" />,
            color: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Total Enrolments',
            value: dashboardelements.enrollment || 0,
            icon: <FaChartLine className="text-4xl text-orange-500" />,
            color: 'from-orange-500 to-yellow-500',
        },
        {
            title: 'Total Revenue',
            value: `₹${dashboardelements.revenue || 0}`,
            icon: <FaRupeeSign className="text-4xl text-yellow-500" />,
            color: 'from-yellow-500 to-orange-600',
        }


    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 w-full max-w-7xl mx-auto">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-r ${card.color} p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                >
                    <div className="bg-white/20 p-4 rounded-full">{card.icon}</div>
                    <h2 className="text-white text-md font-medium">{card.title}</h2>
                    <p className="text-[20px] font-bold text-white">{card.value}</p>
                </div>
            ))}




            {message && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50">
                    <FaCheck className='text-green-500 text-[25px]' />
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
