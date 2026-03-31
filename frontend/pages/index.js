import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 mb-6 tracking-tight">
          Welcome to <span className="text-blue-600">StudyBuddy AI</span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed font-medium">
          Your personal AI-powered tutor. Generate quizzes, chat with an intelligent assistant, and track your learning progress across Math, English, Science, and Coding.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Get Started for Free
          </Link>
          <Link href="/login" className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-blue-100">
            Login to Account
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard title="AI Chat Tutor" text="Ask questions and get detailed, beginner-friendly explanations instantly." icon="🤖" />
        <FeatureCard title="Smart Quizzes" text="Generate practice quizzes on any topic to test your knowledge." icon="📝" />
        <FeatureCard title="Progress Analytics" text="Track your scores and watch your skills grow over time." icon="📈" />
      </div>
    </div>
  );
}

function FeatureCard({ title, text, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40 hover:scale-105 transition-transform duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
