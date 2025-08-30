import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import CategoryPills from '@/components/CategoryPills';
import buildingSample from '@/assets/building-sample.jpg';
import personSample from '@/assets/person-sample.jpg';
import natureSample from '@/assets/nature-sample.jpg';

// Mock data - would come from API/database
const allPhotos = [
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
  {
    id: '7',
    title: 'Modern Architecture',
    category: 'buildings' as const,
    imageUrl: buildingSample,
    location: 'Timișoara, Romania',
    width: 800,
    height: 1200,
  },
  {
    id: '8',
    title: 'Evening Portrait',
    category: 'people' as const,
    imageUrl: personSample,
    location: 'Brașov, Romania',
    width: 800,
    height: 1200,
  },
];

const categoryTitles = {
  buildings: 'Architecture',
  people: 'Portraits',
  nature: 'Nature',
};

const categoryDescriptions = {
  buildings: 'Exploring the interplay between light, shadow, and architectural form in urban environments.',
  people: 'Capturing authentic moments and emotions in natural light, revealing the beauty of human connection.',
  nature: 'Finding poetry in landscapes where golden light transforms the ordinary into extraordinary.',
};

const Gallery = () => {
  const { category } = useParams<{ category: 'buildings' | 'people' | 'nature' }>();
  
  const filteredPhotos = category 
    ? allPhotos.filter(photo => photo.category === category)
    : allPhotos;

  const title = category ? categoryTitles[category] : 'All Work';
  const description = category ? categoryDescriptions[category] : 'A comprehensive collection of my photographic work across all categories.';

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
          
          <MasonryGrid photos={filteredPhotos} />
          
          {filteredPhotos.length === 0 && (
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