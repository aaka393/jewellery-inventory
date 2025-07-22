import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 z-40">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#aa732f] mx-auto mb-6"></div>
        <p className="text-[#4A3F36] text-lg font-serif italic">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;