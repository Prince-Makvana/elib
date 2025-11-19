import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 overflow-x-hidden">
      {/* Blobs for decoration */}
      <div className="absolute -top-44 -left-40 w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-44 right-20 w-[36rem] h-[36rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-32 right-[35%] w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card/Hero */}
      <div className="relative z-10 mt-10 md:mt-0">
        <div className="bg-white/70 backdrop-blur-[5px] px-10 py-12 rounded-3xl shadow-2xl border border-white/30 max-w-xl mx-auto flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4 shadow hover:scale-110 transition-transform">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-center">
              Welcome to BookWave
            </h1>
            <p className="text-lg text-gray-700 mt-4 text-center max-w-md">
              Discover, add and manage your favorite books.  
              Log in to get started or sign up to join <span className="font-semibold text-blue-500">BookWave</span>!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition"
            >
              <Sparkles className="w-5 h-5" /> Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-bold shadow-md transition"
            >
              <ArrowRight className="w-5 h-5" /> Get Started
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">Made with <span className="text-pink-400 animate-pulse">♥</span> for book lovers</div>
      </div>

      {/* Animations for blobs */}
      <style>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1);}
          33%  { transform: translate(30px, -50px) scale(1.1);}
          66%  { transform: translate(-20px, 20px) scale(0.9);}
          100% { transform: translate(0px, 0px) scale(1);}
        }
        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Home;
