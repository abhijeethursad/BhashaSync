import Link from 'next/link';

export const metadata = {
  title: 'Platform Features | BhashaSync',
  description: 'Discover the next-generation tools powering your language learning journey.',
};

export default function FeaturesPage() {
  const features = [
    {
      id: 1,
      title: "AI-Powered Conversations",
      desc: "Practice real-world scenarios with our intelligent voice bots that adapt to your skill level and correct your pronunciation instantly.",
      icon: "🤖",
      color: "from-blue-500 to-indigo-600",
      span: "md:col-span-2"
    },
    {
      id: 2,
      title: "Native Speaker Audio",
      desc: "Train your ear with 10,000+ hours of crystal-clear, studio-recorded audio from actual native speakers.",
      icon: "🎧",
      color: "from-emerald-400 to-teal-600",
      span: "md:col-span-1"
    },
    {
      id: 3,
      title: "Smart Spaced Repetition",
      desc: "Our algorithm predicts exactly when you are about to forget a word, and tests you on it to lock it into your long-term memory.",
      icon: "🧠",
      color: "from-purple-500 to-fuchsia-600",
      span: "md:col-span-1"
    },
    {
      id: 4,
      title: "Cinematic Video Lessons",
      desc: "Learn grammar and culture through high-definition, interactive video courses taught by world-class instructors.",
      icon: "🎥",
      color: "from-rose-500 to-red-600",
      span: "md:col-span-2"
    },
    {
      id: 5,
      title: "Real-Time Analytics",
      desc: "Track your fluency, vocabulary size, and daily streaks with beautiful, interactive dashboards.",
      icon: "📊",
      color: "from-amber-400 to-orange-500",
      span: "md:col-span-3"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 transition-colors duration-500 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 xl:px-16 mb-24 md:mb-32">
        {/* Ambient Glowing Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center relative z-10 max-w-4xl mx-auto pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            BhashaSync Engine v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            Learn a language. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Not just vocabulary.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Traditional apps treat languages like a matching game. BhashaSync immerses you in real-world scenarios, powered by adaptive AI and world-class instructors.
          </p>
        </div>
      </div>

      {/* --- BENTO BOX FEATURE GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-blue-900/10 transition-all duration-500 group relative overflow-hidden ${feature.span}`}
            >
              {/* Card Hover Glow */}
              <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${feature.color} opacity-5 dark:opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-3xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-lg mt-auto">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- THE FINAL CTA (Call To Action) --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 shadow-2xl">
          {/* CTA Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent blur-3xl"></div>

          <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Ready to speak fluently?
              </h2>
              <p className="text-xl text-blue-100 font-medium opacity-90">
                Join thousands of students who have already transformed their careers and travels.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-white text-blue-900 hover:bg-gray-50 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-center"
              >
                Create Free Account
              </Link>
              <Link 
                href="/courses" 
                className="px-8 py-4 bg-blue-800/50 hover:bg-blue-800/80 text-white border border-blue-400/30 rounded-2xl font-black text-lg backdrop-blur-sm hover:-translate-y-1 active:scale-95 transition-all text-center"
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}