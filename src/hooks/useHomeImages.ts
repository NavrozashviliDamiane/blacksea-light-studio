import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HomeImage {
  category: string;
  imageUrl: string;
}

export const useHomeImages = () => {
  const [homeImages, setHomeImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeImages = async () => {
      try {
        setLoading(true);
        const homeImagesRef = collection(db, 'home_page_images');
        const querySnapshot = await getDocs(homeImagesRef);
        
        const images: Record<string, string> = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data() as HomeImage;
          images[data.category] = data.imageUrl;
        });

        setHomeImages(images);
        setError(null);
      } catch (err) {
        console.error('Error fetching home images:', err);
        setError('Failed to fetch home images');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeImages();
  }, []);

  return { homeImages, loading, error };
};
