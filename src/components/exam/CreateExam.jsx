import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function CreateExam() {
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    title: '',
    type: 'MCQ',
    duration: '',
    date: '',
    time: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'MCQ',
    question: '',
    options: [''],
    isMultipleCorrect: false,
    correctAnswers: [],
    programmingLanguage: 'python',
    sampleInput: '',
    sampleOutput: '',
    codeTemplate: '',
    minWords: 0
  });

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleCorrectAnswerToggle = (index) => {
    const newCorrectAnswers = currentQuestion.isMultipleCorrect
      ? currentQuestion.correctAnswers.includes(index)
        ? currentQuestion.correctAnswers.filter(i => i !== index)
        : [...currentQuestion.correctAnswers, index]
      : [index];
    
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswers: newCorrectAnswers
    });
  };

  const handleRemoveOption = (index) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index),
      correctAnswers: currentQuestion.correctAnswers
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i))
    });
  };

  const handleAddQuestion = () => {
    setExamData({
      ...examData,
      questions: [...examData.questions, currentQuestion]
    });
    setCurrentQuestion({
      type: 'MCQ',
      question: '',
      options: [''],
      isMultipleCorrect: false,
      correctAnswers: [],
      programmingLanguage: 'python',
      sampleInput: '',
      sampleOutput: '',
      codeTemplate: '',
      minWords: 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save the exam data here
    navigate('/admin');
  };

  const renderQuestionForm = () => {
    switch (currentQuestion.type) {
      case 'MCQ':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Question Text
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Multiple Correct Answers
              </label>
              <input
                type="checkbox"
                checked={currentQuestion.isMultipleCorrect}
                onChange={(e) => setCurrentQuestion({ 
                  ...currentQuestion, 
                  isMultipleCorrect: e.target.checked,
                  correctAnswers: []
                })}
                className="mr-2"
              />
            </div>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type={currentQuestion.isMultipleCorrect ? "checkbox" : "radio"}
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswers.includes(index)}
                    onChange={() => handleCorrectAnswerToggle(index)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {currentQuestion.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Option
              </button>
            </div>
          </div>
        );

      case 'Coding':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Question Text
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Programming Language
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.programmingLanguage}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, programmingLanguage: e.target.value })}
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Code Template
              </label>
              <textarea
                className="w-full h-32 p-2 border rounded font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.codeTemplate}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, codeTemplate: e.target.value })}
                placeholder="Enter starter code template..."
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Sample Input
              </label>
              <textarea
                className="w-full h-20 p-2 border rounded font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.sampleInput}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleInput: e.target.value })}
                placeholder="Enter sample input..."
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Sample Output
              </label>
              <textarea
                className="w-full h-20 p-2 border rounded font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.sampleOutput}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleOutput: e.target.value })}
                placeholder="Enter expected output..."
              />
            </div>
          </div>
        );

      case 'Essay':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Question Text
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Minimum Words Required
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.minWords}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, minWords: parseInt(e.target.value) })}
                min="0"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Create New Exam</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Exam Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={examData.title}
              onChange={(e) => setExamData({ ...examData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={examData.duration}
                onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={examData.date}
                onChange={(e) => setExamData({ ...examData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Time
              </label>
              <input
                type="time"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={examData.time}
                onChange={(e) => setExamData({ ...examData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Questions</h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Question Type
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion({ 
                  ...currentQuestion, 
                  type: e.target.value,
                  options: e.target.value === 'MCQ' ? [''] : [],
                  correctAnswers: []
                })}
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="Coding">Coding</option>
                <option value="Essay">Essay</option>
              </select>
            </div>

            {renderQuestionForm()}

            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
              >
                Add Question
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Questions Added ({examData.questions.length})</h2>
            <div className="space-y-4">
              {examData.questions.map((q, index) => (
                <div key={index} className="p-4 border rounded dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold dark:text-white">
                      {index + 1}. {q.type} Question
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {q.question.substring(0, 50)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="mr-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExam;