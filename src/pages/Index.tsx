import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import CategoryPills from '@/components/CategoryPills';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: `url(${natureSample})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-medium mb-6 tracking-tight">
              Stories in
              <br />
              <em className="text-mustard">warm light</em>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Capturing the quiet moments where architecture meets humanity, 
              where nature whispers its secrets in golden hour light.
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/50 text-white hover:bg-white hover:text-charcoal"
              asChild
            >
              <a href="#gallery" className="inline-flex items-center">
                Explore Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section id="gallery" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Featured Work
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A curated selection of recent photographs exploring the interplay 
              between light, space, and human connection.
            </p>
          </div>

          <CategoryPills currentCategory="all" />
          
          <MasonryGrid photos={featuredPhotos} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-warm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-4">
            Stay Connected
          </h3>
          <p className="text-muted-foreground mb-8">
            Subscribe to receive updates about new work and upcoming exhibitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-sepia"
            />
            <Button variant="default" className="bg-sepia hover:bg-sepia/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
