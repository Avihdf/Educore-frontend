import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

const api_url = import.meta.env.VITE_API_BASE_URL;

const ChangePassword = () => {
    const { email } = useParams(); // coming from route like /change-password/:email
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setmessage] = useState(location.state?.message || '');
    const [error, seterror] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



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

        if (password !== confirmPassword) {
            seterror("Passwords do not match");
            return;
        }

        setLoading(true);
        setmessage("");
        seterror('')

        try {
            const res = await axios.post(
                `${api_url}/api/auth/change-password/${encodeURIComponent(email)}`,
                { password }
            );


            // setTimeout(() => navigate("/login", { state: { message: res.data.message } }), 2000); // redirect after success
            navigate("/login", { state: { message: res.data.message } })
        } catch (err) {
            seterror(
                err.response?.data?.error ||
                "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[89.7vh] bg-black">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <label className="block mb-2 font-medium text-gray-300">
                        New Password
                    </label>
                    {/* <input
                         type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                    /> */}
                    <div className="relative w-full max-w-md">
                        <input
                            type={showNewPassword ? "text" : "password"}   // ✅ FIXED
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-3 -top-3 flex items-center text-cyan-500 hover:text-cyan-600"
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>


                    {/* Confirm Password */}
                    <label className="block mb-2 font-medium text-gray-300">
                        Confirm Password
                    </label>
                    {/* <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                    /> */}
                    <div className="relative w-full max-w-md">
                        <input
                            type={showConfirmPassword ? "text" : "password"}   // ✅ FIXED
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 -top-3 flex items-center text-cyan-500 hover:text-cyan-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </form>

                {message && (
                    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center gap-2 z-50 animate-slide-in">
                        <FaCheck className="text-green-500 text-[25px]" />
                        <span>{message}</span>
                    </div>
                )}
                {error && (
                    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-red-500 flex items-center gap-2 z-50 animate-slide-in">
                        <FaTimes className="text-red-500 text-[25px]" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
