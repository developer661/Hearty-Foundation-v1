export const PartnersGallery = () => {
  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md shadow-lg py-4 px-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-10 gap-3 mb-4">
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Children in education"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 bg-white flex items-center justify-center p-2">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/11/UNICEF-Logo.png"
                alt="UNICEF partner"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Children learning"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 bg-white flex items-center justify-center p-3">
              <img
                src="https://logos-world.net/wp-content/uploads/2022/01/Red-Cross-Emblem.png"
                alt="Red Cross organization"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Child studying"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/8364027/pexels-photo-8364027.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Happy children"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 bg-white flex items-center justify-center p-2">
              <img
                src="https://logos-world.net/wp-content/uploads/2023/08/Save-The-Children-Logo.jpg"
                alt="Save the Children partner"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/8364028/pexels-photo-8364028.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Children in classroom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105">
              <img
                src="https://images.pexels.com/photos/8363993/pexels-photo-8363993.jpeg?auto=compress&cs=tinysrgb&w=120"
                alt="Children learning together"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 bg-white flex items-center justify-center p-2">
              <img
                src="https://logos-download.com/wp-content/uploads/2016/12/World_Vision_logo_logotype.png"
                alt="World Vision partner"
                className="w-full h-full object-contain"
              />
            </div>
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
