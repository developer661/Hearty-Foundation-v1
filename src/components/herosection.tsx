import { VideoBackground } from './videobackground';
import { AnimatedQuotes } from './animatedquotes';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onJoinClick: () => void;
  onStoriesClick: () => void;
}

export const HeroSection = ({ onStoriesClick }: HeroSectionProps) => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '80vh' }}>
      <VideoBackground />

      <div className="relative z-20 h-full flex flex-col">
        <button
          onClick={onStoriesClick}
          className="absolute top-28 right-4 sm:right-8 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-red-600 font-semibold text-sm shadow-lg hover:bg-red-50 hover:-translate-y-0.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Success Stories
        </button>

        <div className="flex-1 flex flex-col pt-28 px-4 relative">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-fade-in mb-8 pr-36 md:pr-0">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                Inspire. Teach. <span className="text-red-300">Transform.</span>
              </h2>
              <p className="text-base md:text-lg text-white font-medium drop-shadow-lg">
                Platform to connect Charity NGO Institutions with volunteers and partners to support children
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 right-8 w-full max-w-md animate-fade-in">
            <div className="ml-auto mr-4" style={{ maxWidth: '400px' }}>
              <AnimatedQuotes />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
