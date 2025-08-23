import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/Students/Loading';
import { FaTimes } from 'react-icons/fa';
import { useauth } from '../../context/AppContext';

const api_url = import.meta.env.VITE_API_BASE_URL;

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            return resolve(true);
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            console.log("✅ Razorpay script loaded");
            resolve(true);
        };
        script.onerror = () => {
            console.log("❌ Failed to load Razorpay script");
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const Buybutton = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useauth()
    const [coursedetail, setcoursedetail] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, seterror] = useState('');
    // const [message, setmessage] = useState('')

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const fetchcoursedetail = async () => {
            try {
                const res = await axios.get(`${api_url}/api/student/course/${id}`);
                setcoursedetail(res.data.coursedetail);

            } catch (err) {
                console.log(err);
                seterror(err.response?.data?.error || 'Error fetching course details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchcoursedetail();
    }, [id]);

    const discountedPrice =
        coursedetail.discount > 0
            ? Math.round(coursedetail.price - (coursedetail.price * coursedetail.discount) / 100)
            : coursedetail.price;


    if (error) {
        return (
            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50">
                <FaTimes className='text-red-500 text-[25px]' />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!user || !user._id) {
                        navigate("/login", { state: { error: "Login first before buying" } });
                        return;
                    }

                    try {
                        // check enrollment
                        const res = await axios.post(`${api_url}/api/check-user-already-enroll`,
                            { user_id: user._id, course_id: coursedetail._id },
                            { withCredentials: true }
                        );

                        if (!res.data.success) {
                            seterror("Something went wrong");
                            return;
                        }

                        // load Razorpay
                        const scriptLoaded = await loadRazorpayScript();
                        if (!scriptLoaded || !window.Razorpay) {
                            seterror("Failed to load Razorpay SDK");
                            return;
                        }

                        // create order
                        const { data: order } = await axios.post(`${api_url}/api/payment/order`,
                            { amount: discountedPrice },
                            { withCredentials: true }
                        );

                        const options = {
                            key: import.meta.env.VITE_RAZORPAY_KEY,
                            amount: order.amount,
                            currency: order.currency,
                            name: "Educore",
                            description: coursedetail.coursetitle,
                            order_id: order.id,
                            handler: async function (response) {
                                try {
                                    const verifyRes = await axios.post(`${api_url}/api/payment/verify`, response);
                                    if (verifyRes.data.success) {
                                        await axios.post(`${api_url}/api/enrollment`,
                                            { user_id: user._id, course_id: coursedetail._id },
                                            { withCredentials: true }
                                        );
                                        navigate("/my-enrollments", { state: { message: "Enrolled successfully" } });
                                    } else {
                                        seterror("Payment verification failed");
                                    }
                                } catch (err) {
                                    seterror("Payment verification error");
                                }
                            },
                            prefill: { name: user.name, email: user.email, contact: user.number },
                            theme: { color: "#3399cc" },
                        };

                        new window.Razorpay(options).open();

                    } catch (err) {
                        seterror(err.response?.data?.error || "Something went wrong");
                    }
                }}



                className="flex justify-center w-full"
            >
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-6 sm:px-12 py-3 text-base sm:text-lg font-medium rounded-lg shadow-lg transition"
                >
                    Buy Now - Start Learning
                </button>
            </form>
        </div >
    )
}

export default Buybutton
