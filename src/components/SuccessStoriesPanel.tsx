import { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { successStories } from '../lib/successStories';

interface SuccessStoriesPanelProps {
  onClose: () => void;
}

export const SuccessStoriesPanel = ({ onClose }: SuccessStoriesPanelProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const story = selectedIndex !== null ? successStories[selectedIndex] : null;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-stories-title"
        className="relative w-full max-w-6xl bg-gray-50 rounded-2xl shadow-2xl my-8 sm:my-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close success stories"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 rounded-full text-gray-600 bg-white border border-red-200 hover:text-white hover:bg-red-600 hover:border-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {story === null ? (
          <div className="px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Success Stories</p>
            <h2 id="success-stories-title" className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Real journeys, told by the children themselves
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-10">
              Every story below is about a young person who received support from the Foundation. Select a story to read
              the full account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {successStories.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIndex(index)}
                  className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.name}, featured in success story`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-gray-900/80 px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500 mb-2">
                      {item.name}, {item.age} &middot; {item.city}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-grow">{item.summary}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      Read story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <article className="px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14">
            <button
              onClick={() => setSelectedIndex(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All stories
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                <img
                  src={story.image}
                  alt={`${story.name}, featured in success story`}
                  className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg"
                />
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="font-bold text-gray-900">
                    {story.name}, {story.age}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {story.city}
                  </span>
                  <span className="text-xs font-semibold text-white bg-gray-800 px-3 py-1 rounded-full">
                    {story.tag}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3">
                <h2 id="success-stories-title" className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {story.title}
                </h2>
                <div className="space-y-5">
                  {story.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedIndex((selectedIndex! - 1 + successStories.length) % successStories.length)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-semibold hover:border-red-300 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setSelectedIndex((selectedIndex! + 1) % successStories.length)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors"
              >
                Next story
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
