import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-95 z-40 backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#aa732f] mx-auto mb-4 sm:mb-6"></div>
        <p className="text-[#4A3F36] text-base sm:text-lg font-serif italic px-4">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;