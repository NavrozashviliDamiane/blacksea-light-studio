import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import buildingSample from '@/assets/building-sample.jpg';

const FeaturedStory = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-sand/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="overflow-hidden">
              <img
                src={buildingSample}
                alt="Featured story"
                className="w-full h-96 lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Floating Label */}
            <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-medium text-charcoal">
              Latest Story
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-charcoal leading-tight mb-6">
                Bucharest
                <br />
                <span className="text-sepia italic">Reconstructed</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                A journey through the architectural renaissance of Romania's capital, 
                where socialist concrete meets contemporary glass, and history 
                whispers through every corner.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Twelve months. Forty-seven buildings. One story of resilience 
                told through the language of light, shadow, and human presence.
              </p>
            </div>

            <div className="flex items-center space-x-12 text-sm text-muted-foreground">
              <div>
                <span className="block font-serif text-2xl text-sepia">47</span>
                <span>Buildings</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-sepia">12</span>
                <span>Months</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-sepia">156</span>
                <span>Photographs</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="lg"
              className="group border-sepia/30 text-sepia hover:bg-sepia hover:text-white transition-all duration-300"
            >
              Read & View Story
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory;