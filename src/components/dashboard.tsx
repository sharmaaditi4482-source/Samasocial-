import React, { useState } from 'react';
import {
  Mic,
  Briefcase,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  Sprout,
  Heart,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { darkMode } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('How can I help you today?');

  const stats = [
    { label: 'Weekly Earnings', value: '₹4,800', change: '+₹1,200', trend: 'up' },
    { label: 'Jobs Completed', value: '14', change: '89% score', trend: 'up' },
    { label: 'Profile Views', value: '142', change: '18 new', trend: 'up' },
  ];

  const suggestedJobs = [
    { title: 'Farm Harvest Hand', company: 'Verma Agriculture Farms', type: 'Daily Wage', pay: '₹450/day', location: 'Sonipat (3 km away)', date: 'Starts Tomorrow' },
    { title: 'Electrical Helper', company: 'Apex Electric Works', type: 'Temporary', pay: '₹600/day', location: 'Narela (5 km away)', date: 'Immediate' },
  ];

  const handleVoiceAssistant = () => {
    setIsVoiceActive(!isListening);
    setIsListening(!isListening);
    if (!isListening) {
      setVoiceQuery('Listening to command...');
      setTimeout(() => {
        setVoiceQuery('Recognized: "Show me plumbing jobs near me"');
      }, 1500);
      setTimeout(() => {
        setVoiceQuery('Searching jobs...');
        onNavigate('jobs');
        setIsListening(false);
      }, 3000);
    } else {
      setVoiceQuery('How can I help you today?');
    }
  };

  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200/50 dark:border-slate-800`}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-govBlue-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Namaste, Ramesh Pujari!
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                Aadhaar OK
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-1">
              Welcome back to your Rozgaar portal. Your current Trust Score is <span className="font-bold text-emerald-500">92/100</span>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('verification')}
          className="px-5 py-2.5 rounded-xl bg-govBlue-500 hover:bg-govBlue-600 text-white font-semibold text-sm transition-colors shadow-md"
        >
          Check Verification Status
        </button>
      </div>

      {/* Voice Assistant Module */}
      <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-slate-50 to-slate-50 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900 text-center flex flex-col items-center justify-center`}>
        <h2 className="text-lg font-bold text-slate-800 dark:text-teal-400 flex items-center gap-1.5">
          <Mic className="w-5 h-5 animate-pulse" />
          AI Voice Assistant
        </h2>
        
        {/* Animated Mic Ring */}
        <div className="relative my-6">
          {isVoiceActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-150 opacity-30" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-govBlue-500 to-teal-500 pulse-ring scale-125 opacity-40" />
            </>
          )}
          <button
            onClick={handleVoiceAssistant}
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-govBlue-500 to-teal-500 flex flex-col items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${
              isVoiceActive ? 'scale-105 shadow-teal-500/30' : ''
            }`}
          >
            <Mic className="w-10 h-10 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tap to command</span>
          </button>
        </div>

        <p className="text-sm font-semibold italic text-slate-500 dark:text-slate-300 min-h-[20px]">
          {voiceQuery}
        </p>

        {isVoiceActive && (
          <div className="flex gap-1 justify-center mt-3">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="w-1 h-4 bg-teal-500 rounded-full animate-wave" style={{ animationDelay: `${b * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Core Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-6 border border-slate-200/50 dark:border-slate-800`}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Main Services + Suggested Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation Core Services */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Services</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Briefcase,
                title: 'Find Jobs',
                desc: 'Discover jobs tailored to your local area.',
                color: 'from-blue-500 to-blue-600',
                target: 'jobs',
              },
              {
                icon: Sprout,
                title: 'Farmer Hub',
                desc: 'Hire farm laborers and rent implements.',
                color: 'from-emerald-500 to-teal-600',
                target: 'farmer-hub',
              },
              {
                icon: Award,
                title: 'Verify Profile',
                desc: 'Aadhaar verify to double your job match.',
                color: 'from-indigo-500 to-purple-600',
                target: 'verification',
              },
            ].map((srv, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(srv.target)}
                className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 text-left flex flex-col justify-between group hover:scale-[1.03] hover:border-teal-500/20 transition-all border border-slate-200/50 dark:border-slate-800`}
              >
                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${srv.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <srv.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-govBlue-500 dark:group-hover:text-teal-400 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{srv.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Secondary Mock features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-center`}>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Health Records</h4>
                <p className="text-xs text-slate-400 mt-0.5">Link your ABHA Card to store medical history securely.</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('government-schemes')}
              className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 flex gap-4 items-center hover:border-teal-500/30 transition-all group hover:scale-[1.02] text-left`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">Govt. Schemes</h4>
                <p className="text-xs text-slate-400 mt-0.5">PM-Kisan, PM-Shram Yogi Mandhan, eligibility check.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Suggested Local Jobs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suggested Jobs</h2>
          
          <div className="space-y-4">
            {suggestedJobs.map((job, idx) => (
              <div
                key={idx}
                className={`${darkMode ? 'glass-card-dark' : 'glass-card'} p-5 border border-slate-200/50 dark:border-slate-800 hover:border-govBlue-500/30 transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{job.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{job.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-govBlue-500/10 text-govBlue-600 dark:text-sky-400 text-[10px] font-bold uppercase">
                    {job.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('jobs')}
                  className="w-full mt-4 py-2 rounded-lg bg-slate-100 hover:bg-govBlue-500 dark:bg-slate-800 dark:hover:bg-govBlue-500 text-slate-700 hover:text-white dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Apply Now
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
export default Dashboard;
