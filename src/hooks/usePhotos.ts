import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Photo {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  uploadedBy: string;
  createdAt: any;
}

export const usePhotos = (category?: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const photosRef = collection(db, 'photos');
        
        let q;
        if (category) {
          q = query(
            photosRef, 
            where('category', '==', category)
          );
        } else {
          q = query(photosRef);
        }

        const querySnapshot = await getDocs(q);
        const photosData: Photo[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Photo, 'id'>;
          photosData.push({
            id: doc.id,
            ...data
          });
        });

        setPhotos(photosData);
        setError(null);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [category]);

  return { photos, loading, error };
};

export const usePhotosByCategory = () => {
  const [photosByCategory, setPhotosByCategory] = useState<Record<string, Photo[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotosByCategory = async () => {
      try {
        setLoading(true);
        const photosRef = collection(db, 'photos');
        const q = query(photosRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const categorizedPhotos: Record<string, Photo[]> = {
          people: [],
          building: [],
          nature: []
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Photo, 'id'>;
          const photo: Photo = {
            id: doc.id,
            ...data
          };
          
          if (categorizedPhotos[photo.category]) {
            categorizedPhotos[photo.category].push(photo);
          }
        });

        setPhotosByCategory(categorizedPhotos);
        setError(null);
      } catch (err) {
        console.error('Error fetching photos by category:', err);
        setError('Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotosByCategory();
  }, []);

  return { photosByCategory, loading, error };
};
