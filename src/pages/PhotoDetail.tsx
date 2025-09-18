import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  name: string;
  imageUrl: string;
  category: 'building' | 'people' | 'nature';
}

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) return;
      
      const docRef = doc(db, 'photos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure category is one of the allowed values
        const category = ['building', 'people', 'nature'].includes(data.category) 
          ? data.category as 'building' | 'people' | 'nature'
          : 'nature'; // Default to nature if category is invalid
        
        setPhoto({ 
          id: docSnap.id, 
          name: data.name, 
          imageUrl: data.imageUrl,
          category
        });
      }
    };

    fetchPhoto();
  }, [id]);

  if (!photo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img
                src={photo.imageUrl}
                alt={photo.name}
                className="w-full h-auto rounded-sm shadow-photo"
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
                {photo.name}
              </h1>
              <div className="text-muted-foreground mb-4">
                Category: {photo.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;