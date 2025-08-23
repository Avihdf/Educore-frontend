import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BsPersonFillAdd } from 'react-icons/bs';
import googlelogo from '../../assets/images/Google-logo.png';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useauth } from '../../context/AppContext'



const Login = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { admindetails, userdetails } = useauth();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);


    const [emaillogin, setemaillogin] = useState({
        email: '',
        password: ''
    });

    const [activeform, setactiveform] = useState('form2')
    const [message, setMessage] = useState(location.state?.message || '');
    const [error, seterror] = useState(location.state?.error || '')
    const [isLoading, setIsLoading] = useState(false);

    const api_url = import.meta.env.VITE_API_BASE_URL;

    const handlechange = (e) => {
        setemaillogin({
            ...emaillogin,
            [e.target.name]: e.target.value
        });
    }

    const emailhandelSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            const res = await axios.post(`${api_url}/api/auth/login`,
                emaillogin,
                { withCredentials: true }
            );

            const role = res.data.role?.toLowerCase();

            if (res.data.success) {
                if (role === 'educator') {
                    await admindetails();// admin will be set later, and effect will handle navigation
                    setTimeout(() => {
                        navigate('/educator/dashboard', { state: { message: res.data.message } });
                    }, 50);
                } else {
                    await userdetails();
                    setTimeout(() => {
                        navigate('/', { state: { message: res.data.message } });
                    }, 50);

                }
            }

        } catch (err) {
            console.log(err);
            seterror(err.response?.data?.error || 'Error logging in user:' + err.error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 4000);
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
        <div className='flex flex-col items-center justify-center min-h-fit text-white p-3 pt-[15px]'>
            <h1 className='text-4xl font-light mb-4'>Sign In</h1>

            <div className='flex justify-center gap-6 mt-[5px]'>
                <div className='flex flex-col items-center gap-2 group  '>
                    <button onClick={() => setactiveform('form1')} className='-mb-2 text-[18px]'>Phone</button>
                    <span className="-bottom-1 left-1/2 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </div>
                <div className='flex flex-col items-center gap-2 group'>
                    <button onClick={() => setactiveform('form2')} className='-mb-2 text-[18px]'>E-mail</button>
                    <span className=' -bottom-1 left-1/2 w-0 h-0.5 bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
                </div>
            </div>

            {/* Form for Mobile Number Login */}
            {activeform === 'form1' && (
                <div className='flex flex-col items-start max-w-sm w-full gap-[-30px] mt-[60px] '>
                    {/* Phone Input */}
                    <label htmlFor=""
                        className='text-sm text-gray-300 '
                    >Mobile Number *</label><br />
                    <input
                        type="tel"
                        placeholder="Enter 10 digit Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full max-w-md p-3 rounded-[10px] border-none -mt-4 focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                        maxLength={10}
                    />

                    {!otpSent ? (
                        <button
                            onClick={async () => {
                                try {
                                    const res = await axios.post(`${api_url}/api/auth/send-otp`, { phone }, { withCredentials: true });
                                    if (res.data.success) {
                                        setOtpSent(true);
                                        setMessage("OTP sent successfully");
                                    } else {
                                        seterror(res.data.error || "Failed to send OTP");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    seterror(err.response?.data?.error || "Failed to send OTP");
                                }
                            }}
                            className="flex justify-center mt-5 py-2 w-full max-w-md border-1 rounded-full font-light text-xl transition duration-200"
                        >
                            Send OTP
                        </button>
                    ) : (
                        <>
                            {/* OTP Input */}
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full mt-3 p-2 rounded bg-gray-800 text-white"
                            />

                            <button
                                onClick={async () => {
                                    try {
                                        const res = await axios.post(
                                            `${api_url}/api/auth/verify-mobile-otp`,
                                            { phone, otp },
                                            { withCredentials: true }
                                        );

                                        if (res.data.success) {
                                            const role = res.data.role?.toLowerCase();

                                            if (role === 'educator') {
                                                await admindetails();
                                                navigate('/educator/dashboard', { state: { message: res.data.message } });
                                            } else {
                                                await userdetails();
                                                navigate('/', { state: { message: res.data.message } });
                                            }
                                        } else {
                                            seterror(res.data.error || "Invalid OTP");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        seterror(err.response?.data?.error || "Invalid OTP");
                                    }
                                }}
                                className="w-full mt-3 bg-green-500 p-2 rounded"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </div>
            )}



            {/* Form for E-mail Login   */}
            {activeform === 'form2' && (
                <form onSubmit={emailhandelSubmit} method="post" className='flex flex-col items-start max-w-sm w-full gap-[-30px] mt-[20px] '>
                    <label htmlFor=""
                        className='text-sm text-gray-300 '
                    >E-mail *</label><br />

                    <input
                        type='email'
                        name='email'
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none -mt-5 focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                        placeholder="Enter your E-mail Address"
                        value={emaillogin.email.toLowerCase()}
                        onChange={handlechange}
                        required
                    />

                    <label htmlFor=""
                        className='text-sm text-gray-300 mt-3 '
                    >Password *</label>

                    <input
                        type="password"
                        name='password'
                        className="w-full max-w-md p-2.5 rounded-[10px] border-none mt-1 focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                        placeholder="Enter your Password"
                        onChange={handlechange}
                        required
                    />

                    <Link className='hover:text-blue-400 ' to='/forget-password'>Forget Password?</Link>

                    {error && (
                        <div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50'>
                            <FaTimes className='text-red-500 text-[25px]' />
                            <span>{error}</span>
                        </div>
                    )}


                    {/* <div className='flex justify-end items-center w-full mt-4'>
                        <button className=' justify- py-2 w-full max-w-40 bg-black border-1 rounded-full font-light text-xl  '>Continue</button>
                    </div> */}

                    <div className='flex justify-end items-center w-full mt-4'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`justify-center py-2 w-full max-w-40 border-1 rounded-full font-light text-xl transition duration-200 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Logging in...
                                </div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>




                </form>
            )}


            <div className='flex items-center gap-1 my-[40px]'>
                <hr className='bg-white opacity-20 w-[170px] h-0.5' />
                <p className='text-gray-600'>OR</p>
                <hr className='bg-white opacity-20 w-[170px] h-0.5' />
            </div>

            <div className='flex flex-col items-center max-w-sm w-full gap-5'>
                <button className='flex justify-center items-center cursor-not-allowed w-full max-w-md p-1 border-1 rounded-2xl hover:scale-[1.02] transition duration-200 ' >
                    <img src={googlelogo} alt="logo" className='h-[40px] w-[40px] mr-1.5 -ml-1.5 ' />
                    Continue with Google</button>
                <Link to='/register' className='flex justify-center items-center cursor-pointer w-full max-w-md p-3 border-1 rounded-2xl hover:scale-[1.02] transition duration-200'><BsPersonFillAdd className='text-[22px] mt-0.5 mr-4' /> Create a New Account</Link>
            </div>


            {/* successfully register message */}
            {message && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50">
                    <FaCheck className='text-green-500 text-[25px]' />
                    <span>{message}</span>
                </div>
            )}

        </div>
    )
}

export default Login
