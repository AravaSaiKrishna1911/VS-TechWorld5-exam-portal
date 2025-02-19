import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const exams = [
    { id: 1, title: 'Mathematics Final', duration: '2 hours', date: '2024-03-20' },
    { id: 2, title: 'Physics Midterm', duration: '1.5 hours', date: '2024-03-25' },
    { id: 3, title: 'Chemistry Quiz', duration: '45 minutes', date: '2024-03-28' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upcoming Exams</h1>
      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{exam.title}</h2>
                <p className="text-gray-600">Duration: {exam.duration}</p>
                <p className="text-gray-600">Date: {exam.date}</p>
              </div>
              <button
                onClick={() => navigate(`/exam/${exam.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Start Exam
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;