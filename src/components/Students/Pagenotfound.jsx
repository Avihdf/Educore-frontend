import React from "react";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[89.7vh] bg-black text-white text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Pagenotfound;
