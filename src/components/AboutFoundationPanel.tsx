import { useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface AboutFoundationPanelProps {
  onClose: () => void;
}

const beliefs = [
  'Every child deserves equal opportunities',
  'A steadfast and genuine connection can heal many wounds',
  'The greatest present you can offer a child is to be fully present with them, here and now',
  "What's essential to teach children TODAY are the skills of tomorrow",
  'Kindness acts like a boomerang – it always comes back',
  'One person can alter the course of our lives',
];

const values = ['Kindness', 'Openness', 'Honesty', 'Support', 'Respect'];

interface TeamMember {
  name: string;
  role: string;
}

const managementBoard: TeamMember[] = [
  { name: 'Alicja Magiera-Bąk', role: 'Foundation Director, Board Member & future-education designer' },
  { name: 'Paulina Wójtowicz', role: 'Foundation President & strategy architect' },
  { name: 'Agnieszka Hopciaś', role: 'Board Member & innovation creator' },
  { name: 'Przemek Stanisz', role: 'Vice President & development guru' },
  { name: 'Joanna Stępniewska-Janowska', role: 'Chair of the Supervisory Board & co-founder' },
];

const team: TeamMember[] = [
  { name: 'Jakub Jasek', role: 'Intern in the projects department' },
  { name: 'Karolina Chećko', role: 'Marketing Specialist' },
  { name: 'Agnieszka Sznajder', role: 'Project Manager' },
  { name: 'Filip Płoskonka', role: 'Mathematics Trainer' },
  { name: 'Kamil Molendys', role: 'Photographer' },
  { name: 'Magdalena Kurek', role: 'Mathematics Trainer' },
];

const ambassadors: TeamMember[] = [
  { name: 'Anna Dutkiewicz', role: 'Creative ideas' },
  { name: 'Anna Piwowarczyk', role: 'Project psychologist' },
  { name: 'Jagoda Lewandowska', role: 'Fundraising' },
  { name: 'Edyta Hopciaś', role: 'Graphic designer' },
  { name: 'Jakub Adamczyk', role: 'Web developer' },
  { name: 'Vitaly Tsys', role: 'Video master' },
];

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

const TeamGroup = ({ title, members }: { title: string; members: TeamMember[] }) => (
  <div>
    <h4 className="text-lg font-bold text-gray-900 mb-4">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div
          key={member.name}
          className="flex items-center gap-4 p-4 rounded-xl border border-red-100 bg-white hover:border-red-300 hover:shadow-md transition-all"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
            {initialsOf(member.name)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">{member.name}</p>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AboutFoundationPanel = ({ onClose }: AboutFoundationPanelProps) => {
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
        aria-labelledby="about-foundation-title"
        className="relative w-full max-w-6xl bg-gray-50 rounded-2xl shadow-2xl my-8 sm:my-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close about us"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 rounded-full text-gray-600 bg-white border border-red-200 hover:text-white hover:bg-red-600 hover:border-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">About Foundation</p>
          <h2 id="about-foundation-title" className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Mission and Values
          </h2>
          <p className="text-lg sm:text-xl text-gray-800 leading-relaxed max-w-3xl mb-10">
            Our mission is to empower children, youth, and young adults in their development and building their own
            agency as they enter the adult world in the rapidly evolving society.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-red-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-5">
                <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                What we believe
              </h3>
              <ul className="space-y-4">
                {beliefs.map((belief) => (
                  <li key={belief} className="text-gray-700 leading-relaxed">
                    {belief}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-red-600 text-white shadow-sm">
              <h3 className="text-xl font-bold mb-5">Our shared values</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {values.map((value) => (
                  <div key={value} className="px-4 py-3 rounded-lg bg-white/15 font-bold text-center">
                    {value}
                  </div>
                ))}
              </div>
              <p className="text-red-50 leading-relaxed">
                These values are the foundation for realizing our mission. What matters most to us: being 100% present
                when we are with those we aim to support.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">About Foundation</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">Team with a Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-10">
              Entrepreneurs, innovators, and specialists: this is the Hearty Foundation team. Meet the people who help
              children develop their passions and learn.
            </p>
          </div>

          <div className="space-y-12">
            <TeamGroup title="Management Board" members={managementBoard} />
            <TeamGroup title="Our Team" members={team} />
            <TeamGroup title="Ambassadors" members={ambassadors} />
          </div>
        </div>
      </div>
    </div>
  );
};
