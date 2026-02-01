import { VideoBackground } from './videobackground';
import { AnimatedQuotes } from './animatedquotes';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export const HeroSection = ({}: HeroSectionProps) => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '80vh' }}>
      <VideoBackground />

      <div className="relative z-20 h-full flex flex-col">
        <div className="flex-1 flex flex-col pt-28 px-4 relative">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-fade-in mb-8">
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
