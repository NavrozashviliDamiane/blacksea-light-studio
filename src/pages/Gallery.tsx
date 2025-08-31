import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import CategoryPills from '@/components/CategoryPills';
import { usePhotos } from '@/hooks/usePhotos';
import { Loader2 } from 'lucide-react';

const categoryTitles = {
  building: 'Architecture',
  people: 'Portraits',
  nature: 'Nature',
};

const categoryDescriptions = {
  building: 'Exploring the interplay between light, shadow, and architectural form in urban environments.',
  people: 'Capturing authentic moments and emotions in natural light, revealing the beauty of human connection.',
  nature: 'Finding poetry in landscapes where golden light transforms the ordinary into extraordinary.',
};

const Gallery = () => {
  const { category } = useParams<{ category: 'building' | 'people' | 'nature' }>();
  
  const { photos, loading, error } = usePhotos(category);

  // Transform Firebase photos to match MasonryGrid expected format
  const transformedPhotos = photos.map(photo => ({
    id: photo.id,
    title: photo.name,
    category: photo.category,
    imageUrl: photo.imageUrl,
    location: 'Romania', // Default location
    width: 800,
    height: 1200,
  }));

  const title = category ? categoryTitles[category] : 'All Work';
  const description = category ? categoryDescriptions[category] : 'A comprehensive collection of my photographic work across all categories.';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Error loading photos: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <CategoryPills currentCategory={category || 'all'} />
          
          <MasonryGrid photos={transformedPhotos} />
          
          {transformedPhotos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No photos found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;