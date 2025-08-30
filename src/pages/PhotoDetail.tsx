import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Calendar, Camera, Aperture, Timer, Zap } from 'lucide-react';
import buildingSample from '@/assets/building-sample.jpg';
import personSample from '@/assets/person-sample.jpg';
import natureSample from '@/assets/nature-sample.jpg';

// Mock data - would come from API/database
const photoData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Urban Geometry',
    category: 'buildings',
    imageUrl: buildingSample,
    location: 'Bucharest, Romania',
    description: 'The interplay of light and shadow on modernist architecture, captured during the golden hour when the building transforms into a canvas of warm geometric patterns.',
    takenAt: '2024-03-15',
    exif: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      focal: 35,
      aperture: 'f/5.6',
      iso: 200,
      shutter: '1/250s'
    },
    tags: ['architecture', 'urban', 'geometry', 'golden hour'],
    width: 800,
    height: 1200,
  },
  '2': {
    id: '2',
    title: 'Golden Hour Portrait',
    category: 'people',
    imageUrl: personSample,
    location: 'Constanța, Romania',
    description: 'A moment of quiet contemplation captured as the day\'s last light creates a natural halo, revealing the subject\'s inner grace.',
    takenAt: '2024-02-28',
    exif: {
      camera: 'Canon EOS R5',
      lens: '85mm f/1.4',
      focal: 85,
      aperture: 'f/2.8',
      iso: 400,
      shutter: '1/320s'
    },
    tags: ['portrait', 'natural light', 'golden hour', 'emotion'],
    width: 800,
    height: 1200,
  },
  '3': {
    id: '3',
    title: 'Forest Silhouette',
    category: 'nature',
    imageUrl: natureSample,
    location: 'Black Sea Coast',
    description: 'Trees become guardians of the setting sun, their silhouettes creating a natural cathedral where light and shadow dance in perfect harmony.',
    takenAt: '2024-01-20',
    exif: {
      camera: 'Canon EOS R5',
      lens: '70-200mm f/2.8',
      focal: 135,
      aperture: 'f/8',
      iso: 100,
      shutter: '1/125s'
    },
    tags: ['landscape', 'sunset', 'silhouette', 'trees'],
    width: 1200,
    height: 800,
  },
};

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const photo = photoData[id || '1'];

  if (!photo) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-2xl text-foreground">Photo not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-auto rounded-sm shadow-photo"
              />
            </div>

            {/* Photo Details */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
                  {photo.title}
                </h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {photo.location}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {photo.description}
                </p>
              </div>

              {/* EXIF Data */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                    Technical Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Camera className="h-4 w-4 text-sepia mr-3" />
                      <span className="text-sm">
                        <strong>{photo.exif.camera}</strong> + {photo.exif.lens}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Aperture className="h-4 w-4 text-sepia mr-3" />
                      <span className="text-sm">{photo.exif.aperture}</span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 text-sepia mr-3" />
                      <span className="text-sm">{photo.exif.shutter}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-sepia mr-3" />
                      <span className="text-sm">ISO {photo.exif.iso}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-sepia mr-3" />
                      <span className="text-sm">
                        {new Date(photo.takenAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-sand text-olive text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button className="w-full bg-sepia hover:bg-sepia/90">
                  License This Photo
                </Button>
                <Button variant="outline" className="w-full border-olive text-olive hover:bg-sand">
                  View in Lightbox
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;