import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ClockIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function AdminDashboard() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([
    { 
      id: 1, 
      title: 'JavaScript Fundamentals',
      type: 'MCQ',
      scheduled: '2024-03-25 10:00 AM',
      participants: 45,
      status: 'Upcoming'
    },
    { 
      id: 2, 
      title: 'Python Programming',
      type: 'Coding',
      scheduled: '2024-03-26 2:00 PM',
      participants: 30,
      status: 'Draft'
    },
    { 
      id: 3, 
      title: 'System Design Essay',
      type: 'Essay',
      scheduled: '2024-03-27 11:00 AM',
      participants: 25,
      status: 'Upcoming'
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
        <button 
          onClick={() => navigate('/create-exam')}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Total Exams</h3>
              <p className="text-2xl font-bold text-blue-500">{exams.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Upcoming</h3>
              <p className="text-2xl font-bold text-green-500">
                {exams.filter(exam => exam.status === 'Upcoming').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Total Participants</h3>
              <p className="text-2xl font-bold text-purple-500">
                {exams.reduce((acc, exam) => acc + exam.participants, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Exams</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 dark:text-gray-300">Title</th>
                  <th className="pb-3 dark:text-gray-300">Type</th>
                  <th className="pb-3 dark:text-gray-300">Scheduled</th>
                  <th className="pb-3 dark:text-gray-300">Participants</th>
                  <th className="pb-3 dark:text-gray-300">Status</th>
                  <th className="pb-3 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id} className="border-b dark:border-gray-700">
                    <td className="py-4 dark:text-white">{exam.title}</td>
                    <td className="py-4 dark:text-white">{exam.type}</td>
                    <td className="py-4 dark:text-white">{exam.scheduled}</td>
                    <td className="py-4 dark:text-white">{exam.participants}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        exam.status === 'Upcoming' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-blue-500 hover:text-blue-600 mr-3">
                        Edit
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;