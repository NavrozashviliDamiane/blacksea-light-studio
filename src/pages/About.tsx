import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Mail, Instagram, MapPin } from 'lucide-react';
import photographerPortrait from '@/assets/photographer-portrait.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Portrait */}
            <div className="relative">
              <img
                src={photographerPortrait}
                alt="Elena Volkov - Photographer"
                className="w-full h-auto rounded-sm shadow-photo"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
                  Elena Volkov
                </h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 mr-2" />
                  Bucharest, Romania
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  I am a photographer drawn to the quiet moments where light transforms the ordinary into something extraordinary. My work explores the intersection of architecture, humanity, and nature, always seeking those fleeting instances when warm light reveals hidden stories.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Based along the Black Sea coast, I find endless inspiration in the way late afternoon light filters through urban landscapes and natural spaces alike. Each photograph is an invitation to pause, to notice, and to feel the subtle emotions that emerge when we truly observe our surroundings.
                </p>
              </div>

              {/* Press Mentions */}
              <div className="border-t border-border pt-6">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Press & Recognition
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Featured in <em>Romanian Photography Today</em>, 2024</p>
                  <p>Winner, Black Sea Light Festival, 2023</p>
                  <p>Published in <em>Architectural Digest Romania</em>, 2023</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-4 pt-6">
                <Button variant="default" className="bg-sepia hover:bg-sepia/90" asChild>
                  <a href="mailto:hello@elenavolkov.com" className="inline-flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Get in Touch
                  </a>
                </Button>
                <Button variant="outline" className="border-olive text-olive hover:bg-sand" asChild>
                  <a 
                    href="https://instagram.com/elenavolkov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;