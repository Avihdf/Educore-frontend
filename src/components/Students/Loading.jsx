import React from 'react';

const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
    <div className="w-96 max-w-full space-y-4">
      <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-600 rounded animate-pulse w-2/3"></div>
      <div className="h-20 bg-gray-700 rounded-lg animate-pulse"></div>
      <div className="flex gap-2">
        <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
    <span className="text-sm text-gray-400 mt-4 animate-pulse">Getting your Details...</span>
  </div>
);

export default Loading;
