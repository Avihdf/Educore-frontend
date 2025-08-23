import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaInstagram,
    FaLinkedin,
    FaDiscord,
    FaYoutube,
    FaTwitter,
} from 'react-icons/fa';

const NewFooter = () => {
    return (
        <footer className="bg-black text-white px-8 py-12 ">
            <div className="border-t border-gray-800 pt-10 pb-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Logo and Socials */}
                <div className="flex flex-col gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-extrabold text-4xl font-[Outfit] text-transparent bg-clip-text bg-gradient-to-r from-[#00f7ff] via-[#7f5af0] to-[#5eead4] tracking-tight hover:brightness-125 transition-all duration-300"
                    >
                        <svg
                            className="w-8 h-8 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 14v7m0 0H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2h-7zm0 0v-7"
                            />
                        </svg>
                        Educore
                    </Link>
                    <p className="text-sm">Let's connect with our socials</p>
                    <div className="flex gap-4 text-2xl">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer"><FaDiscord /></a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-bold mb-4">COMPANY</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/page-not-found">About Us</Link></li>
                        <li><Link to="/page-not-found">Support</Link></li>
                        <li><Link to="/page-not-found">Privacy Policy</Link></li>
                        <li><Link to="/page-not-found">Terms and Condition</Link></li>
                        <li><Link to="/page-not-found">Pricing and Refund</Link></li>
                        <li><Link to="/page-not-found">Hire From Us</Link></li>
                        <li><Link to="/page-not-found">Submit Projects</Link></li>
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h3 className="font-bold mb-4">COMMUNITY</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                        <li><a href="https://reddit.com" target="_blank" rel="noreferrer">Reddit</a></li>

                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold mb-4">Get In Touch</h3>
                    <ul className="space-y-2 text-sm">
                        <li>+91 9876567888</li>
                        <li>+91 8765678688</li>
                        <li><a href="mailto:educore@gmail.com">educore@gmail.com</a></li>
                        <li>Dwarka Mor,Delhi<br />New Delhi - 110059</li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
                <p>Copyright © 2025 Educore Pvt. Ltd.</p>
                <p>All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default NewFooter;
