import React from "react";
import { useNavigate } from "react-router-dom";

const TestCard = ({ test }) => {
  const navigate = useNavigate();
  
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
  ];
  
  const gradient = gradients[test.id % gradients.length];

  const handleStartTest = () => {
    navigate(`/test/${test.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2">
      {/* Header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-2">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{test.name}</h3>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {test.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold">{test.numQuestions}</span> Questions
          </div>
          
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{test.duration}</span> mins
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            ● Intermediate
          </span>
        </div>

        {/* Action button */}
        <button 
          onClick={handleStartTest}
          className={`w-full bg-gradient-to-r ${gradient} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group`}
        >
          <span>Start Test</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestCard;
