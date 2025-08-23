import React from 'react';

const Loadingeduactor = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900/30 rounded-lg">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
      {/* Loading Text */}
      <p className="mt-3 text-lg font-medium text-gray-200">Loading...</p>
    </div>
  );
};

export default Loadingeduactor;
