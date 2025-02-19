import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

function ExamRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(7200);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examType, setExamType] = useState('MCQ'); // MCQ, Coding, or Essay

  // Sample questions based on exam type
  const questions = {
    MCQ: [
      {
        id: 1,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
      },
      {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      },
    ],
    Coding: [
      {
        id: 1,
        question: 'Write a function to calculate the factorial of a number.',
        language: 'python',
        template: 'def factorial(n):\n    # Your code here\n    pass',
      },
    ],
    Essay: [
      {
        id: 1,
        question: 'Discuss the impact of artificial intelligence on modern society.',
        minWords: 500,
      },
    ],
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(time => time - 1), 1000);
      return () => clearInterval(timer);
    } else {
      submitExam();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitExam = () => {
    // In a real app, you would submit answers to a backend here
    navigate('/dashboard');
  };

  const renderQuestionContent = () => {
    const question = questions[examType][currentQuestion];
    if (!question) return null;

    switch (examType) {
      case 'MCQ':
        return (
          <div className="space-y-2">
            <p className="mb-4 dark:text-white">{question.question}</p>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option${index}`}
                  name={`question${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => setAnswers({
                    ...answers,
                    [question.id]: e.target.value
                  })}
                  className="mr-2"
                />
                <label htmlFor={`option${index}`} className="dark:text-white">{option}</label>
              </div>
            ))}
          </div>
        );

      case 'Coding':
        return (
          <div>
            <p className="mb-4 dark:text-white">{question.question}</p>
            <div className="h-96 mb-4">
              <Editor
                height="100%"
                defaultLanguage={question.language}
                defaultValue={question.template}
                theme={localStorage.getItem('darkMode') === 'true' ? 'vs-dark' : 'light'}
                onChange={(value) => setAnswers({
                  ...answers,
                  [question.id]: value
                })}
              />
            </div>
            <div className="h-32 bg-black rounded-md p-2">
              {/* Terminal would be initialized here in a real implementation */}
            </div>
          </div>
        );

      case 'Essay':
        return (
          <div>
            <p className="mb-4 dark:text-white">{question.question}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Minimum words required: {question.minWords}
            </p>
            <textarea
              className="w-full h-96 p-4 border rounded resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({
                ...answers,
                [question.id]: e.target.value
              })}
              placeholder="Start writing your essay here..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Exam #{id}</h1>
        <div className="text-xl font-semibold dark:text-white">{formatTime(timeLeft)}</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4 dark:text-white">
              Question {currentQuestion + 1} of {questions[examType].length}
            </h2>
            {renderQuestionContent()}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
                disabled={currentQuestion === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {currentQuestion < questions[examType].length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(q => Math.min(questions[examType].length - 1, q + 1))}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Webcam Feed</h3>
            <Webcam
              audio={false}
              className="w-full rounded"
              mirrored={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Your webcam feed is being monitored for exam integrity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamRoom;