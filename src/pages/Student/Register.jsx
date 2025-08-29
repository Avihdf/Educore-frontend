import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import '../../style/style.css';
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';




const Register = () => {
    const navigate = useNavigate();

    const api_url = import.meta.env.VITE_API_BASE_URL;

    const [registerdata, setregisterdata] = useState({
        name: '',
        number: '',
        email: '',
        password: ''
    })
    const [message, setmessage] = useState('')
    const [error, seterror] = useState('')
    const [loading, setloading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);


    const Spinner = () => (
        <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setmessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => seterror(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    const handlechange = (e) => {
        setregisterdata({
            ...registerdata,
            [e.target.name]: e.target.value,
        })
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setmessage('');
        seterror('');
        setloading(true)
        try {
            const res = await axios.post(`${api_url}/api/auth/register`, registerdata, { withCredentials: true });
            // setmessage(res.data.message);
            navigate('/login', { state: { message: res.data.message } }); // Redirect to login page after successful registration

        } catch (err) {
            console.log(err)
            seterror(err.response?.data?.error || 'Error registering user: ' + err.error);
        } finally {
            setloading(false)
        }

    }




    return (
        <div className='flex flex-col items-center justify-center min-h-fit text-white p-4 pt-[10px]'>
            <h1 className='text-4xl font-light mb-4'>Sign In</h1>
            <p>Already Have Account?{' '}<Link to='/login' className="text-blue-500 hover:underline">Sign in</Link></p>


            <form action='/login' onSubmit={handelSubmit} method="post" className='flex flex-col justify-center items-start w-full max-w-lg p-4 mt-2 '>
                <label htmlFor="name" className='text-sm text-gray-300'>Name *</label>
                <input
                    type="text"
                    name="name"
                    className="w-full max-w-md p-3 rounded-[10px]  border-none focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                    onChange={handlechange}
                    placeholder="Enter your Name"
                    required
                />

                <br />

                <label htmlFor="email" className='text-sm text-gray-300'>Mobile Number *</label>
                <input
                    type="tel"
                    name="number"
                    className="w-full max-w-md p-3 rounded-[10px] border-none focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                    onChange={handlechange}
                    placeholder="Enter your Mobile Number"
                    maxLength={'10'}
                    required
                />
                <br />

                <label htmlFor="email" className='text-sm text-gray-300'>E-mail *</label>
                <input
                    type="email"
                    name="email"
                    className="w-full max-w-md p-3 rounded-[10px] border-none focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                    onChange={handlechange}
                    value={registerdata.email.toLowerCase()}
                    placeholder="Enter your E-mail Address"
                    required

                />
                <br />

                <label htmlFor="password" className='text-sm text-gray-300'>Password *</label>
                {/* <input
                    type="password"
                    name="password"
                    className="w-full max-w-md p-3 rounded-[10px] border-none focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                    onChange={handlechange}
                    placeholder="Enter your Password"
                    required
                />  */}
                <div className="relative w-full max-w-md">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full p-2.5 pr-10 rounded-[10px] border-none mt-1 focus:outline-none focus:ring-1 focus:ring-sky-300 bg-gray-800 text-white"
                        placeholder="Enter your Password"
                        onChange={handlechange}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 top-1.5 flex items-center  text-cyan-500 hover:text-cyan-600"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <br />

                {message && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-green-500 flex items-center gap-2 z-50">
                        <FaCheck className='text-green-500 text-[25px]' />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-md border-l-4 border-red-500 flex items-center gap-2 z-50'>
                        <FaTimes className='text-red-500 text-[25px]' />
                        <span>{error}</span>
                    </div>
                )}


                {/* <button className='flex justify-center items-center  cursor-pointer w-full max-w-md p-3 border-1 rounded-2xl hover:scale-[1.02] transition duration-200 text-[18px] font-semibold'>
                    Sign Up</button> */}

                <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center items-center  cursor-pointer w-full max-w-md p-3 border-1 rounded-2xl hover:scale-[1.02] transition duration-200 text-[18px] font-semibold
        ${loading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
                >
                    {loading ? (
                        <>
                            <Spinner /> Registering...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>

            </form>



        </div>
    )
}

export default Register
