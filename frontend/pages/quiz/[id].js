import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { apiFetch } from '../../services/api';
import toast from 'react-hot-toast';

export default function Quiz() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for taking the quiz
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const data = await apiFetch(`/quizzes/${id}`);
        setQuiz(data);
        // Simplistic check to see if we've taken it, assuming score=0 & answers={} is fresh
        if (data.score > 0) setSubmitted(true);
      } catch (error) {
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!quiz) return <div className="text-center py-20 text-gray-500">Quiz not found.</div>;

  const currentQuestion = quiz.questions[currentQuestionIdx];

  const handleSelectOption = (option) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentQuestionIdx]: option });
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions answered
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm("You have unanswered questions. Submit anyway?")) return;
    }

    setSubmitting(true);
    try {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) score += 1;
      });

      await apiFetch(`/quizzes/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ score })
      });
      
      setSubmitted(true);
      setQuiz({ ...quiz, score });
      toast.success(`You scored ${score} out of ${quiz.total}!`);
    } catch (error) {
      toast.error('Failed to submit results');
    } finally {
      setSubmitting(false);
    }
  };

  const percentage = Math.round((quiz.score / quiz.total) * 100) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Quiz: {quiz.topic}</h1>
          <p className="text-gray-500 font-semibold">{quiz.subject?.name || 'General Knowledge'}</p>
        </div>
        {submitted ? (
          <div className={`px-5 py-2.5 rounded-2xl text-xl font-black shadow-sm border ${percentage >= 80 ? 'bg-green-50 text-green-700 border-green-200' : percentage >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            Score: {quiz.score} / {quiz.total}
          </div>
        ) : (
          <div className="px-5 py-2.5 rounded-2xl text-xl font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
            Evaluating
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-blue-600 h-2 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex justify-between text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest bg-gray-50 inline-block px-4 py-1.5 rounded-full border border-gray-200">
            <span>Question {currentQuestionIdx + 1} of {quiz.total}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">{currentQuestion.question}</h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentQuestionIdx] === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let btnClass = "w-full text-left px-6 py-5 rounded-2xl border-2 transition-all duration-200 font-medium focus:outline-none text-lg ";
              
              if (!submitted) {
                btnClass += isSelected ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md shadow-blue-500/10" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 text-gray-700";
              } else {
                if (isCorrect) {
                  btnClass += "border-green-500 bg-green-50 text-green-800 shadow-sm";
                } else if (isSelected && !isCorrect) {
                  btnClass += "border-red-500 bg-red-50 text-red-800 shadow-sm";
                } else {
                  btnClass += "border-gray-200 bg-gray-50 opacity-60 text-gray-500";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(option)}
                  disabled={submitted}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mr-5 shrink-0 transition-colors ${
                      !submitted && isSelected ? 'border-blue-600 bg-blue-600 text-white' : 
                      submitted && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                      submitted && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                      'border-gray-300'
                    }`}>
                      {submitted && isCorrect && "✓"}
                      {submitted && isSelected && !isCorrect && "✗"}
                      {!submitted && isSelected && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
                    </span>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`mt-8 p-6 rounded-2xl border ${answers[currentQuestionIdx] === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} shadow-sm`}>
              <h4 className={`font-black uppercase tracking-wider text-sm mb-2 opacity-80 ${answers[currentQuestionIdx] === currentQuestion.correctAnswer ? 'text-green-800' : 'text-blue-800'}`}>
                {answers[currentQuestionIdx] === currentQuestion.correctAnswer ? 'Correct!' : 'Explanation'}
              </h4>
              <p className={`font-medium ${answers[currentQuestionIdx] === currentQuestion.correctAnswer ? 'text-green-900' : 'text-blue-900'}`}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-6 py-3 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold disabled:opacity-50"
            >
              Previous
            </Button>
            
            {currentQuestionIdx < quiz.questions.length - 1 ? (
              <Button 
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-8 py-3 rounded-xl shadow-md font-bold text-lg hover:shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Next Question
              </Button>
            ) : !submitted ? (
              <Button 
                onClick={handleSubmitQuiz} 
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-bold text-lg bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-500/30 transition-transform hover:-translate-y-0.5"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz 🚀'}
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/quiz/history')}
                className="px-8 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg"
              >
                Return to History
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Quiz.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
