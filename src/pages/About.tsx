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
                alt="Elene Gvasalia - Photographer"
                className="w-full h-auto rounded-sm shadow-photo"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
                  Elene Gvasalia
                </h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 mr-2" />
                  Tbilisi, Georgia
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Born in the heart of the Caucasus, I am a photographer who finds poetry in the interplay between ancient Georgian architecture and contemporary life. My lens captures the soul of Tbilisi—where cobblestone streets whisper centuries-old stories and golden hour light dances across weathered facades.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  From the sulfur baths of Abanotubani to the modern glass towers of Saburtalo, I seek moments where tradition meets modernity. Each frame is a love letter to Georgia—its resilient people, breathtaking landscapes, and the unique quality of Caucasian light that transforms ordinary scenes into timeless narratives.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  My work celebrates the authentic Georgian spirit: the warmth of supra gatherings, the dignity of mountain shepherds, and the quiet strength found in everyday moments across this ancient land.
                </p>
              </div>

              {/* Press Mentions */}
              <div className="border-t border-border pt-6">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Press & Recognition
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Featured in <em>Georgian Photography Today</em>, 2024</p>
                  <p>Winner, Caucasus Light Festival, 2023</p>
                  <p>Published in <em>Tbilisi Architecture Quarterly</em>, 2023</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-4 pt-6">
                <Button variant="default" className="bg-sepia hover:bg-sepia/90" asChild>
                  <a href="mailto:elene@gvasalia-photo.com" className="inline-flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Get in Touch
                  </a>
                </Button>
                <Button variant="outline" className="border-olive text-olive hover:bg-sand" asChild>
                  <a 
                    href="https://instagram.com/elenegvasalia" 
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