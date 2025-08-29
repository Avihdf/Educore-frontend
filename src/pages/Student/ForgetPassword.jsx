import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api_url = import.meta.env.VITE_API_BASE_URL;

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, seterror] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        seterror("");

        try {
            const res = await axios.post(`${api_url}/api/auth/forget-password/${encodeURIComponent(email)}`,);
            if (res.data.success) {
                navigate(`/verification/${encodeURIComponent(email)}`,{state:{message:res.data.message}})
            }
            
        } catch (err) {
            seterror(
                err.response?.data?.error || "Failed to send OTP. Try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[89.7vh] bg-black">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    Forgot Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium text-gray-300">
                        Enter your email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email.toLowerCase()}
                        onChange={(e) => setEmail(e.target.value)}
                        
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                {error && (
                    <p className="text-center mt-4 text-sm text-red-700">{error}</p>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
