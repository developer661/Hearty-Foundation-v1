import { Users, Calendar, BookOpen, Award, Heart, Globe } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Volunteer Network",
    description: "Connect with passionate individuals dedicated to making a difference in children's lives.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Access diverse teaching materials and structured programs for effective learning.",
    color: "from-red-400 to-red-500"
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Organize and participate in workshops, tutoring sessions, and community activities.",
    color: "from-red-600 to-red-700"
  },
  {
    icon: Award,
    title: "Recognition System",
    description: "Earn badges and certificates as you contribute to our mission of education.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Heart,
    title: "Impact Stories",
    description: "Read inspiring testimonials from volunteers and the families they've helped.",
    color: "from-red-600 to-red-700"
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Join a worldwide movement of volunteers transforming education.",
    color: "from-red-700 to-red-800"
  }
];

export const FeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Join Our Community?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful tools and support network that make volunteering rewarding and impactful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
