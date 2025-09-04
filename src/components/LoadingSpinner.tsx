import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="pl-container">
          <svg viewBox="0 0 240 240" height="240" width="240" className="pl">
            <circle 
              strokeLinecap="round" 
              strokeDashoffset="-330" 
              strokeDasharray="0 660" 
              strokeWidth="20" 
              stroke="#f97316" 
              fill="none" 
              r="105" 
              cy="120" 
              cx="120" 
              className="pl__ring pl__ring--a"
            />
            <circle 
              strokeLinecap="round" 
              strokeDashoffset="-110" 
              strokeDasharray="0 220" 
              strokeWidth="20" 
              stroke="#ea580c" 
              fill="none" 
              r="35" 
              cy="120" 
              cx="120" 
              className="pl__ring pl__ring--b"
            />
            <circle 
              strokeLinecap="round" 
              strokeDasharray="0 440" 
              strokeWidth="20" 
              stroke="#fb923c" 
              fill="none" 
              r="70" 
              cy="120" 
              cx="85" 
              className="pl__ring pl__ring--c"
            />
            <circle 
              strokeLinecap="round" 
              strokeDasharray="0 440" 
              strokeWidth="20" 
              stroke="#f97316" 
              fill="none" 
              r="70" 
              cy="120" 
              cx="155" 
              className="pl__ring pl__ring--d"
            />
          </svg>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;