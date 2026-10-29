import { Search, UserPlus, Sparkles, Users, Building2, Briefcase } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Browse urgent needs and volunteer opportunities across the country, filtered by category and location.',
  },
  {
    icon: UserPlus,
    title: 'Connect',
    description: 'Sign up as a volunteer, care facility, NGO, or business partner and get matched with the right people.',
  },
  {
    icon: Sparkles,
    title: 'Make an impact',
    description: 'Join workshops and events, track your engagements, and see the difference you make for children.',
  },
];

const beneficiaries = [
  {
    icon: Users,
    title: 'For volunteers',
    points: ['Find causes that match your skills', 'Earn recognition and a volunteer ranking', 'Get reminders for upcoming events'],
  },
  {
    icon: Building2,
    title: 'For care facilities and NGOs',
    points: ['Publish urgent needs in minutes', 'Reach a ready pool of trained volunteers', 'Keep all your activity in one dashboard'],
  },
  {
    icon: Briefcase,
    title: 'For business partners',
    points: ['Run team volunteering programmes', 'Share skills that change young lives', 'Show measurable social impact'],
  },
];

export const FeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">How the platform works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            One place to give children a better start
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hearty connects charities, volunteers, and companies so that every hour of support reaches the children who
            need it most.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-red-500 flex items-center justify-center shadow-md mb-6">
                  <Icon className="w-7 h-7 text-red-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beneficiaries.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.title}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{group.title}</h3>
                <ul className="space-y-3">
                  {group.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
