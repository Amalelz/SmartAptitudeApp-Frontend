import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "medium";
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestData();
  }, [testId, difficulty]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const fetchTestData = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.TESTS}/${testId}?difficulty=${difficulty}`);
      
      console.log("Test data received:", response.data); // Debug log
      
      setTest(response.data.test);
      setQuestions(response.data.questions);
      setCorrectAnswers(response.data.correctAnswers);
      setTimeRemaining(response.data.test.duration * 60); // Convert to seconds
      setLoading(false);
    } catch (err) {
      console.error("Error fetching test:", err);
      console.error("Error details:", err.response?.data); // More debug info
      alert("Failed to load test: " + (err.response?.data?.msg || err.message));
      navigate("/dashboard");
    }
  };

  const handleAnswerSelect = (answer) => {
    const questionId = questions[currentQuestion]?.id;
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(1);
    const passed = percentage >= 60;
    const timeTaken = test.duration * 60 - timeRemaining; // Time taken in seconds

    try {
      const token = localStorage.getItem("token");
      
      // Save result to database with enhanced scoring
      const response = await axios.post(
        API_ENDPOINTS.RESULTS,
        {
          testId: test.id,
          testName: test.name,
          score,
          totalQuestions: questions.length,
          percentage: parseFloat(percentage),
          passed,
          timeTaken,
          totalTime: test.duration * 60, // Total time allowed in seconds
          answers: Object.fromEntries(Object.entries(answers)),
          questions,
          correctAnswers,
        },
        { headers: { "x-auth-token": token } }
      );

      // Navigate to results with enhanced scoring data
      navigate("/results", { 
        state: { 
          score, 
          total: questions.length, 
          testName: test.name,
          percentage,
          passed,
          timeTaken,
          resultId: response.data.resultId,
          enhancedScoring: response.data.enhancedScoring,
          answers,
          questions,
          correctAnswers 
        } 
      });
    } catch (err) {
      console.error("Error saving result:", err);
      // Still navigate to results even if save fails
      navigate("/results", { 
        state: { 
          score, 
          total: questions.length, 
          testName: test.name,
          percentage,
          passed,
          answers,
          questions,
          correctAnswers 
        } 
      });
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correct = correctAnswers.find(ca => ca.id === question.id);
      if (userAnswer === correct?.answer) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error loading questions. Please try again.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{test?.name}</h1>
            <p className="text-sm text-gray-500">{test?.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              difficulty === 'hard' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <div className={`px-4 py-2 rounded-lg font-bold ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                  answers[currentQuestion] === option
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[question?.id] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="w-5 h-5 text-indigo-600"
                />
                <span className="ml-3 text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
