import Navigation from '@/components/Navigation';
import CinematicHero from '@/components/CinematicHero';
import CategoryGateways from '@/components/CategoryGateways';
import FeaturedStory from '@/components/FeaturedStory';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CinematicHero />
      <CategoryGateways />
      <FeaturedStory />
      
      {/* Minimal Footer */}
      <footer className="py-16 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="font-serif text-2xl text-white font-light mb-2">Elena Volkov</h3>
              <p className="text-white/60 italic">Stories in warm light</p>
            </div>
            
            <div className="flex items-center space-x-8">
              <a 
                href="mailto:elena@volkov-photo.com" 
                className="text-white/80 hover:text-mustard transition-colors duration-300 text-sm tracking-wider uppercase"
              >
                Email
              </a>
              <a 
                href="https://instagram.com/elenavolkov" 
                className="text-white/80 hover:text-mustard transition-colors duration-300 text-sm tracking-wider uppercase"
              >
                Instagram
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">© 2024 Elena Volkov Photography. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Index;
