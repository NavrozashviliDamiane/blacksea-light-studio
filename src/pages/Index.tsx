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
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-mustard/20 border border-mustard/30 rounded-full text-mustard text-sm font-medium mb-6">
                    Fine Art Photography
                  </span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
                  Stories in
                  <br />
                  <span className="relative">
                    <em className="text-mustard">warm light</em>
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6C100 2 200 10 298 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="text-mustard"
                      />
                    </svg>
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
                  Where architecture meets humanity, where nature whispers its secrets. 
                  Each frame captures the poetry found in everyday moments.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-sepia hover:bg-sepia/90 text-white border-0"
                    asChild
                  >
                    <a href="#gallery" className="inline-flex items-center">
                      Explore Gallery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/50 text-white hover:bg-white hover:text-charcoal"
                    asChild
                  >
                    <a href="/about" className="inline-flex items-center">
                      About Elena
                      <Camera className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
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
      <section id="gallery" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Creative Layout */}
          <div className="grid md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
                Featured
                <br />
                <span className="text-sepia">Collections</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Each photograph tells a story of light, shadow, and emotion. 
                Discover how ordinary moments become extraordinary through 
                the lens of intentional observation.
              </p>
            </div>
            
            <div className="flex items-center gap-8 justify-end">
              <div className="text-right">
                <div className="text-3xl font-serif font-medium text-sepia">150+</div>
                <div className="text-sm text-muted-foreground">Captured Moments</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-serif font-medium text-sepia">3</div>
                <div className="text-sm text-muted-foreground">Collections</div>
              </div>
            </div>
          </div>

          {/* Creative Category Navigation */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { id: 'all', label: 'All Work', icon: Heart, href: '/' },
              { id: 'buildings', label: 'Architecture', icon: Camera, href: '/gallery/buildings' },
              { id: 'people', label: 'Portraits', icon: Heart, href: '/gallery/people' },
              { id: 'nature', label: 'Landscapes', icon: Camera, href: '/gallery/nature' },
            ].map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="lg"
                className="group border-olive/30 text-olive hover:bg-sepia hover:text-white hover:border-sepia transition-all duration-300"
                asChild
              >
                <a href={category.href} className="inline-flex items-center">
                  <category.icon className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {category.label}
                </a>
              </Button>
            ))}
          </div>
          
          {/* Enhanced Gallery Grid */}
          <div className="relative">
            <MasonryGrid photos={featuredPhotos} />
            
            {/* Floating CTA */}
            <div className="text-center mt-16">
              <Button 
                variant="default" 
                size="lg"
                className="bg-sepia hover:bg-sepia/90 text-white shadow-hover group"
                asChild
              >
                <a href="/gallery/all" className="inline-flex items-center">
                  View Complete Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-16 bg-sand/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-8 w-8 text-mustard mx-auto mb-4" />
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-4">
              Recognition & Awards
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: '2024',
                title: 'Romanian Photography Today',
                type: 'Featured Artist',
                color: 'text-sepia'
              },
              {
                year: '2023',
                title: 'Black Sea Light Festival',
                type: 'First Place',
                color: 'text-mustard'
              },
              {
                year: '2023',
                title: 'Architectural Digest Romania',
                type: 'Published Work',
                color: 'text-olive'
              }
            ].map((award, index) => (
              <div key={index} className="text-center p-6 bg-white/50 rounded-sm">
                <div className={`text-2xl font-serif font-medium mb-2 ${award.color}`}>
                  {award.year}
                </div>
                <h4 className="font-medium text-foreground mb-1">{award.title}</h4>
                <p className="text-sm text-muted-foreground">{award.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Newsletter Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url(${natureSample})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-sm shadow-photo">
            <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Join the Journey
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Be the first to see new work, behind-the-scenes stories, 
              and exclusive exhibition invitations.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-sepia text-foreground placeholder:text-muted-foreground"
                />
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-sepia hover:bg-sepia/90 text-white px-8"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No spam, just beautiful photography and stories. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
