import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, testName, resultId, answers, questions, correctAnswers } = location.state || { 
    score: 0, 
    total: 0, 
    testName: "Test" 
  };
  
  const percentage = ((score / total) * 100).toFixed(1);
  const passed = percentage >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <span className="text-5xl">{passed ? '🎉' : '📚'}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {passed ? 'Congratulations!' : 'Good Effort!'}
          </h1>
          <p className="text-gray-600">
            {passed ? 'You passed the test!' : 'Keep practicing to improve!'}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 animate-scale-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{testName}</h2>
          <p className="text-gray-500 text-center mb-6">Test Results</p>
          
          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="96" cy="96" r="88"
                  stroke={passed ? '#10b981' : '#f59e0b'}
                  strokeWidth="12" fill="none"
                  strokeDasharray={`${(percentage / 100) * 553} 553`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">{percentage}%</span>
                <span className="text-sm text-gray-500">Score</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{total - score}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>
          </div>

          {/* Message */}
          <div className={`p-4 rounded-xl ${passed ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
            <p className="text-center font-semibold">
              {passed 
                ? '✓ Great job! You have passed this test.' 
                : '✗ You need 60% to pass. Try again!'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
          {resultId && (
            <button
              onClick={() => navigate(`/review/${resultId}`)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
            >
              Review Answers
            </button>
          )}
          <button
            onClick={() => navigate('/history')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
