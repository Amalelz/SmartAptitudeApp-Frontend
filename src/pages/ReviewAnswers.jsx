import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const ReviewAnswers = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.RESULT_BY_ID(resultId), {
        headers: { "x-auth-token": token },
      });
      setResult(response.data.result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching result:", err);
      alert("Failed to load result");
      navigate("/history");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading answers...</p>
        </div>
      </div>
    );
  }

  const getAnswerStatus = (question) => {
    const userAnswer = result.answers.get ? result.answers.get(question.id) : result.answers[question.id];
    const correctAnswer = result.correctAnswers.find((ca) => ca.id === question.id)?.answer;
    const isCorrect = userAnswer === correctAnswer;

    return { userAnswer, correctAnswer, isCorrect };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{result.testName}</h1>
              <p className="text-gray-500">Answer Review</p>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              ← Back to History
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{result.score}/{result.totalQuestions}</div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-orange-600'}`}>
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-500">Percentage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.score}
              </div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {result.totalQuestions - result.score}
              </div>
              <div className="text-sm text-gray-500">Wrong</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {result.questions.map((question, index) => {
            const { userAnswer, correctAnswer, isCorrect } = getAnswerStatus(question);

            return (
              <div
                key={question.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  isCorrect ? "border-green-500" : "border-red-500"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {question.question}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isCorrect ? "✓ Correct" : "✗ Wrong"}
                  </span>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => {
                    const isUserAnswer = option === userAnswer;
                    const isCorrectAnswer = option === correctAnswer;

                    let optionClass = "bg-gray-50 border-gray-200";
                    if (isCorrectAnswer) {
                      optionClass = "bg-green-50 border-green-500 border-2";
                    } else if (isUserAnswer && !isCorrect) {
                      optionClass = "bg-red-50 border-red-500 border-2";
                    }

                    return (
                      <div
                        key={optIndex}
                        className={`p-4 rounded-xl border ${optionClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">{option}</span>
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-semibold text-sm">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-red-600 font-semibold text-sm">
                                Your Answer
                              </span>
                            )}
                            {isUserAnswer && isCorrect && (
                              <span className="text-green-600 font-semibold text-sm">
                                ✓ Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* No Answer Given */}
                {!userAnswer && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <p className="text-orange-700 text-sm font-semibold">
                      ⚠️ You didn't answer this question
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/history")}
            className="px-8 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
          >
            Back to History
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            Take Another Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnswers;
