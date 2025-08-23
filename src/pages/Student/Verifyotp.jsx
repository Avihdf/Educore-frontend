import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { useEffect } from "react";


const api_url = import.meta.env.VITE_API_BASE_URL;

const Verifyotp = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const { email } = useParams();
    const [otp, setOtp] = useState("");
    const [message, setmessage] = useState(location.state?.message || '');
    const [error, seterror] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (message) {
            const t = setTimeout(() => setmessage(""), 3000);
            return () => clearTimeout(t);
        }
        if (error) {
            const t = setTimeout(() => seterror(""), 3000);
            return () => clearTimeout(t);
        }
    }, [message, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        seterror("");

        try {
            // Send email in URL param, OTP in body
            const res = await axios.post(`${api_url}/api/auth/verify-otp/${email}`, {
                otp,
            });
            if (res.data.success) {
                navigate(`/change-password/${encodeURIComponent(email)}`, { state: { message: res.data.message } })
            }
           
        } catch (err) {
            seterror(
                err.response?.data?.error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[89.7vh] bg-black">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    Verify OTP
                </h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium text-gray-300">Enter OTP</label>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                {message && (
                    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center gap-2 z-50 animate-slide-in">
                        <FaCheck className="text-green-500 text-[25px]" />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <p className="text-center mt-4 text-sm text-gray-300">{error}</p>
                )}
            </div>
        </div>
    );
};

export default Verifyotp;
