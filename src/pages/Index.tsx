import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import CategoryPills from '@/components/CategoryPills';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote, Camera, Heart, Award } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import buildingSample from '@/assets/building-sample.jpg';
import personSample from '@/assets/person-sample.jpg';
import natureSample from '@/assets/nature-sample.jpg';

// Sample photo data
const featuredPhotos = [
  {
    id: '1',
    title: 'Urban Geometry',
    category: 'buildings' as const,
    imageUrl: buildingSample,
    location: 'Bucharest, Romania',
    width: 800,
    height: 1200,
  },
  {
    id: '2',
    title: 'Golden Hour Portrait',
    category: 'people' as const,
    imageUrl: personSample,
    location: 'Constanța, Romania',
    width: 800,
    height: 1200,
  },
  {
    id: '3',
    title: 'Forest Silhouette',
    category: 'nature' as const,
    imageUrl: natureSample,
    location: 'Black Sea Coast',
    width: 1200,
    height: 800,
  },
  {
    id: '4',
    title: 'Architectural Lines',
    category: 'buildings' as const,
    imageUrl: buildingSample,
    location: 'Cluj-Napoca, Romania',
    width: 800,
    height: 1200,
  },
  {
    id: '5',
    title: 'Natural Light',
    category: 'people' as const,
    imageUrl: personSample,
    location: 'Sinaia, Romania',
    width: 800,
    height: 1200,
  },
  {
    id: '6',
    title: 'Sunset Through Trees',
    category: 'nature' as const,
    imageUrl: natureSample,
    location: 'Danube Delta',
    width: 1200,
    height: 800,
  },
];

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroImages = [natureSample, buildingSample, personSample];
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Creative Hero Section */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Dynamic Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        </div>

        {/* Split Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className={`text-white transform transition-all duration-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-12 leading-none">
                  <span className="block text-white/60">Elena</span>
                  <span className="relative">
                    <em className="text-mustard">Volkov</em>
                  </span>
                </h1>

                <div className="flex items-center gap-8 mb-16">
                  <div className="w-16 h-px bg-mustard/60"></div>
                  <p className="font-light text-white/80 tracking-wider uppercase text-sm">
                    Photography
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-white/80 hover:text-white border border-white/30 hover:border-white/60 bg-transparent backdrop-blur-sm"
                  asChild
                >
                  <a href="#gallery" className="inline-flex items-center tracking-wider">
                    Enter
                  </a>
                </Button>
              </div>

              {/* Right Side - Featured Photo with Stats */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                <div className="relative">
                  <img
                    src={featuredPhotos[0].imageUrl}
                    alt="Featured photography work"
                    className="w-full h-96 lg:h-[500px] object-cover rounded-sm shadow-photo"
                  />
                  
                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-6 rounded-sm shadow-hover">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-serif font-medium text-sepia">150+</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-serif font-medium text-sepia">8</div>
                        <div className="text-xs text-muted-foreground">Awards</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-serif font-medium text-sepia">5</div>
                        <div className="text-xs text-muted-foreground">Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-sm mb-2">Discover</span>
            <div className="w-0.5 h-8 bg-white/30"></div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-8 w-8 text-sepia mx-auto mb-6" />
          <blockquote className="font-serif text-2xl md:text-3xl text-foreground mb-6 leading-relaxed">
            "Every photograph is a moment of truth, where light reveals 
            the soul of its subject."
          </blockquote>
          <cite className="text-muted-foreground">— Elena Volkov</cite>
        </div>
      </section>

      {/* Creative Gallery Section */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal Gallery Grid */}
          <div className="relative">
            <MasonryGrid photos={featuredPhotos} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
