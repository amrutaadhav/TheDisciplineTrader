import React from 'react';

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-6 lg:px-8 animate-fade-in pb-12 pt-8 md:pt-12">
      <div className="text-center max-w-3xl mb-8 md:mb-12 mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2962FF] to-cyan-400 mb-4 tracking-tight leading-tight">
          The Minds Behind The Discipline
        </h1>
        <p className="text-[#787B86] text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
          Trading is 10% strategy and 90% psychology. This platform was born from the synergy of 
          technical engineering and battle-tested trading experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl mx-auto">
        
        {/* Developer Card */}
        <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2B2B43] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(41,98,255,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2962FF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-[#1E222D] shadow-xl overflow-hidden mb-4 md:mb-6 relative transition-all duration-300">
            <img 
              src="/images/amruta.jpeg" 
              alt="Amruta Adhav" 
              className="w-full h-full object-cover object-top bg-[#1E222D]"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Amruta+Adhav&background=2962FF&color=fff&size=200"; }}
            />
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Amruta Adhav</h2>
          <span className="px-3 py-1 md:px-4 md:py-1.5 bg-[#2962FF]/10 text-[#2962FF] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#2962FF]/20 mb-3 md:mb-4">Developer</span>
          <p className="text-[#787B86] text-xs md:text-sm leading-relaxed">
            Architect of the digital ecosystem. Specializing in modern web technologies to translate complex trading methodologies into an intuitive, seamless user experience.
          </p>
        </div>

        {/* Trader Card */}
        <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2B2B43] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(38,166,154,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#26A69A] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-[#1E222D] shadow-xl overflow-hidden mb-4 md:mb-6 relative transition-all duration-300">
            <img 
              src="/images/dhiraj.jpeg" 
              alt="Dhiraj Adhav" 
              className="w-full h-full object-cover bg-[#1E222D]"
              style={{ objectPosition: '30% 10%' }}
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Dhiraj+Adhav&background=26A69A&color=fff&size=200"; }}
            />
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Dhiraj Adhav</h2>
          <span className="px-3 py-1 md:px-4 md:py-1.5 bg-[#26A69A]/10 text-[#26A69A] rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[#26A69A]/20 mb-3 md:mb-4">Trader</span>
          <p className="text-[#787B86] text-xs md:text-sm leading-relaxed">
            The visionary behind the strategies. Dedicated to mastering the psychological edge and risk management required to consistently extract capital from the markets.
          </p>
        </div>

      </div>
    </div>
  );
}
