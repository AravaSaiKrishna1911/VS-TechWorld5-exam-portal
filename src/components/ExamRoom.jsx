import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

function ExamRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Sample questions (in a real app, these would come from an API)
  const questions = [
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
    // Add more questions as needed
  ];

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Exam #{id}</h1>
        <div className="text-xl font-semibold">{formatTime(timeLeft)}</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {questions[currentQuestion] && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="mb-4">{questions[currentQuestion].question}</p>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`option${index}`}
                      name={`question${questions[currentQuestion].id}`}
                      value={option}
                      checked={answers[questions[currentQuestion].id] === option}
                      onChange={(e) => setAnswers({
                        ...answers,
                        [questions[currentQuestion].id]: e.target.value
                      })}
                      className="mr-2"
                    />
                    <label htmlFor={`option${index}`}>{option}</label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(q => Math.min(questions.length - 1, q + 1))}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitExam}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Webcam Feed</h3>
            <Webcam
              audio={false}
              className="w-full rounded"
              mirrored={true}
            />
            <p className="text-sm text-gray-600 mt-2">
              Your webcam feed is being monitored for exam integrity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamRoom;