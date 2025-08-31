import { useEffect, useState } from 'react';
import { useHomeImages } from '@/hooks/useHomeImages';
import buildingSample from '@/assets/building-sample.jpg';
import personSample from '@/assets/person-sample.jpg';
import natureSample from '@/assets/nature-sample.jpg';

const defaultSlides = [
  {
    category: 'building',
    image: buildingSample,
    text: "Where stone holds memory",
  },
  {
    category: 'people',
    image: personSample,
    text: "Where faces whisper light",
  },
  {
    category: 'nature',
    image: natureSample,
    text: "Where nature breathes in gold",
  },
];

const CinematicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const { homeImages } = useHomeImages();

  // Use Firebase home images if available, fallback to defaults
  const heroSlides = defaultSlides.map(slide => ({
    ...slide,
    image: homeImages[slide.category] || slide.image
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTextVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 4s ease-out',
            }}
          />
        ))}
        
        {/* Sepia Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sepia/60 via-mustard/30 to-olive/40" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Poetic Text Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className={`transform transition-all duration-1000 ${
            isTextVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-light leading-tight mb-8">
              {heroSlides[currentSlide].text}
            </p>
            <div className="w-24 h-px bg-mustard/60 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-white/60 animate-bounce">
          <div className="w-px h-12 bg-white/30 mb-2"></div>
          <span className="text-xs tracking-widest uppercase">Explore</span>
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;