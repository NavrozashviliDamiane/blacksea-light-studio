import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useHomeImages } from '@/hooks/useHomeImages';
import buildingSample from '@/assets/building-sample.jpg';
import personSample from '@/assets/person-sample.jpg';
import natureSample from '@/assets/nature-sample.jpg';

const defaultCategories = [
  {
    id: 'building',
    title: 'Architecture',
    subtitle: 'Walls that listen',
    image: buildingSample,
    href: '/gallery/building',
  },
  {
    id: 'people',
    title: 'People',
    subtitle: 'Faces that remember',
    image: personSample,
    href: '/gallery/people',
  },
  {
    id: 'nature',
    title: 'Nature',
    subtitle: 'Landscapes that breathe',
    image: natureSample,
    href: '/gallery/nature',
  },
];

const CategoryGateways = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { homeImages, loading } = useHomeImages();

  // Use home page images if available, fallback to default
  const getCategories = () => {
    return defaultCategories.map(category => ({
      ...category,
      image: homeImages[category.id] || category.image
    }));
  };

  const categories = getCategories();

  return (
    <section className="relative">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="relative h-screen overflow-hidden cursor-pointer group"
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
          onClick={() => window.location.href = category.href}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: hoveredCategory === category.id ? 'scale(1.1)' : 'scale(1.05)',
            }}
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            hoveredCategory === category.id 
              ? 'bg-gradient-to-r from-black/60 via-sepia/40 to-transparent' 
              : 'bg-gradient-to-r from-black/40 via-sepia/30 to-black/40'
          }`} />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className={`transform transition-all duration-700 ${
                hoveredCategory === category.id ? 'translate-x-8' : 'translate-x-0'
              }`}>
                <div className="max-w-2xl">
                  <h2 className={`font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white mb-4 transition-all duration-500 ${
                    hoveredCategory === category.id ? 'tracking-wider' : 'tracking-wide'
                  }`}>
                    {category.title}
                  </h2>
                  
                  <p className={`text-xl md:text-2xl text-white/80 font-light mb-8 transition-all duration-500 ${
                    hoveredCategory === category.id ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
                  }`}>
                    {category.subtitle}
                  </p>

                  <div className={`flex items-center text-white/60 transition-all duration-500 ${
                    hoveredCategory === category.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <span className="text-sm tracking-widest uppercase mr-4">Explore</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grain Effect on Hover */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
            hoveredCategory === category.id ? 'opacity-10' : 'opacity-0'
          }`} 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          }} />
        </div>
      ))}
    </section>
  );
};

export default CategoryGateways;