import { useState, useEffect } from 'react';

const quotes = [
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Volunteers do not necessarily have the time; they just have the heart.",
    author: "Elizabeth Andrew"
  },
  {
    text: "Every child deserves a champion – an adult who will never give up on them.",
    author: "Rita Pierson"
  },
  {
    text: "To the world you may be one person, but to one person you may be the world.",
    author: "Dr. Seuss"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "No act of kindness, no matter how small, is ever wasted.",
    author: "Aesop"
  },
  {
    text: "We make a living by what we get, but we make a life by what we give.",
    author: "Winston Churchill"
  },
  {
    text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.",
    author: "Ralph Waldo Emerson"
  }
];

export const AnimatedQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl">
          <p className="text-base md:text-lg font-light text-white leading-relaxed mb-3 text-center italic">
            "{quotes[currentQuote].text}"
          </p>
          <p className="text-sm md:text-base text-white/90 font-medium text-center">
            — {quotes[currentQuote].author}
          </p>
        </div>
      </div>
    </div>
  );
};
