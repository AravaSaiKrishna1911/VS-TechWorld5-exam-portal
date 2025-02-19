import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

function SeekerDashboard() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEligibleExams();
  }, []);

  const fetchEligibleExams = async () => {
    try {
      const { data: eligibleExams, error } = await supabase
        .from('exams')
        .select(`
          *,
          exam_eligibility!inner(is_eligible),
          exam_submissions(status)
        `)
        .eq('exam_eligibility.user_id', (await supabase.auth.getUser()).data.user.id)
        .eq('exam_eligibility.is_eligible', true);

      if (error) throw error;

      const formattedExams = eligibleExams.map(exam => ({
        id: exam.id,
        title: exam.title,
        type: exam.type,
        duration: exam.duration,
        scheduled: new Date(exam.start_date).toLocaleString(),
        status: getExamStatus(exam)
      }));

      setExams(formattedExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);
    const submission = exam.exam_submissions?.[0];

    if (submission?.status === 'completed') return 'Completed';
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Expired';
    return 'Available';
  };

  const canStartExam = (status) => status === 'Available';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Exams</h1>
      {exams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any eligible exams at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">{exam.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Duration: {exam.duration} minutes</p>
                  <p className="text-gray-600 dark:text-gray-400">Scheduled: {exam.scheduled}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm mb-3 ${
                    exam.status === 'Available' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : exam.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {exam.status}
                  </span>
                  <button
                    onClick={() => navigate(`/exam/${exam.id}`)}
                    disabled={!canStartExam(exam.status)}
                    className={`px-4 py-2 rounded ${
                      canStartExam(exam.status)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                    }`}
                  >
                    {exam.status === 'Completed' ? 'View Results' : 'Start Exam'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeekerDashboard;