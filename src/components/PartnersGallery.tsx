import { useState } from 'react';

interface Partner {
  name: string;
  sector: string;
  logo: string;
  description: string;
  since: number;
}

const partners: Partner[] = [
  {
    name: 'Brightwave Software',
    sector: 'Technology',
    logo: '/partners/partner-brightwave.webp',
    description: 'Sends volunteer developers to lead coding workshops and mentor student projects every term.',
    since: 2021,
  },
  {
    name: 'Greenleaf Architects',
    sector: 'Design & Architecture',
    logo: '/partners/partner-greenleaf.webp',
    description: 'Runs design-and-build workshops that teach young people how cities and green spaces come together.',
    since: 2022,
  },
  {
    name: 'Harbor Bank',
    sector: 'Finance',
    logo: '/partners/partner-harbor.webp',
    description: 'Delivers financial literacy lessons for teenagers and funds scholarships for first-generation students.',
    since: 2020,
  },
  {
    name: 'Lumen Labs',
    sector: 'Creative Media',
    logo: '/partners/partner-lumen.webp',
    description: 'Trains young storytellers in video, photography, and podcasting, with finished work shared publicly.',
    since: 2023,
  },
  {
    name: 'Atlas Engineering',
    sector: 'Engineering',
    logo: '/partners/partner-atlas.webp',
    description: 'Mentors students on hands-on engineering challenges and hosts paid summer placements.',
    since: 2021,
  },
  {
    name: 'Sprout Foods',
    sector: 'Food & Nutrition',
    logo: '/partners/partner-sprout.webp',
    description: 'Provides healthy meals and nutrition workshops for children attending after-school clubs.',
    since: 2022,
  },
  {
    name: 'Compass Logistics',
    sector: 'Transport',
    logo: '/partners/partner-compass.webp',
    description: 'Covers transport for school trips and workshops for children living in rural communities.',
    since: 2020,
  },
  {
    name: 'Spark Analytics',
    sector: 'Data & Insights',
    logo: '/partners/partner-spark.webp',
    description: 'Volunteers help measure programme outcomes so every project can show its real impact.',
    since: 2024,
  },
];

const PartnerFlipCard = ({ partner }: { partner: Partner }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${partner.name}: show details`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setFlipped((value) => !value);
        }
      }}
      className="flip-card aspect-[4/5] cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      <div className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="flip-face flex flex-col items-center justify-center gap-4 p-6 bg-white border border-gray-200 shadow-md rounded-2xl">
          <img src={partner.logo} alt={`${partner.name} logo`} className="w-24 h-24 object-contain" />
          <p className="text-base font-bold text-gray-900 text-center">{partner.name}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{partner.sector}</p>
        </div>

        <div className="flip-face flip-back flex flex-col justify-center gap-4 p-6 bg-gray-900 text-white shadow-md rounded-2xl">
          <p className="text-base font-bold">{partner.name}</p>
          <p className="text-sm text-gray-200 leading-relaxed">{partner.description}</p>
          <p className="text-xs font-semibold text-gray-300">Partner since {partner.since}</p>
        </div>
      </div>
    </div>
  );
};

export const PartnersGallery = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600 mb-2">Our partners</p>
          <p className="text-gray-600">Hover over a partner (or tap on mobile) to learn how they support our children.</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md shadow-lg p-4 sm:p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {partners.map((partner) => (
              <PartnerFlipCard key={partner.name} partner={partner} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 text-gray-900">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">500+</div>
              <div className="text-sm font-semibold">Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-700">1,200+</div>
              <div className="text-sm font-semibold">Children</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">150+</div>
              <div className="text-sm font-semibold">Events</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
