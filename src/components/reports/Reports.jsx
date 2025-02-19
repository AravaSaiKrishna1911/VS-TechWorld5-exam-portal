import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [reportData] = useState({
    labels: ['JavaScript', 'Python', 'System Design', 'Data Structures', 'Algorithms'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 82, 68, 90, 85],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Participants',
        data: [45, 30, 25, 35, 40],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exam Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const recentExams = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      date: '2024-03-20',
      participants: 45,
      avgScore: 75,
      passRate: '82%',
    },
    {
      id: 2,
      title: 'Python Programming',
      date: '2024-03-18',
      participants: 30,
      avgScore: 82,
      passRate: '90%',
    },
    {
      id: 3,
      title: 'System Design',
      date: '2024-03-15',
      participants: 25,
      avgScore: 68,
      passRate: '76%',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Exam Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Exams</h3>
          <p className="text-3xl font-bold text-blue-500">15</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Participants</h3>
          <p className="text-3xl font-bold text-green-500">175</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Average Pass Rate</h3>
          <p className="text-3xl font-bold text-purple-500">85%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Statistics</h2>
          <Bar options={options} data={reportData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Exams</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 dark:text-gray-300">Exam</th>
                  <th className="pb-3 dark:text-gray-300">Date</th>
                  <th className="pb-3 dark:text-gray-300">Participants</th>
                  <th className="pb-3 dark:text-gray-300">Avg Score</th>
                  <th className="pb-3 dark:text-gray-300">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map(exam => (
                  <tr key={exam.id} className="border-b dark:border-gray-700">
                    <td className="py-3 dark:text-white">{exam.title}</td>
                    <td className="py-3 dark:text-white">{exam.date}</td>
                    <td className="py-3 dark:text-white">{exam.participants}</td>
                    <td className="py-3 dark:text-white">{exam.avgScore}</td>
                    <td className="py-3 dark:text-white">{exam.passRate}</td>
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

export default Reports;