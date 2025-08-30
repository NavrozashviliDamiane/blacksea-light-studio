import { useState, useRef, useEffect } from 'react';
import PhotoCard from './PhotoCard';

interface Photo {
  id: string;
  title: string;
  category: 'buildings' | 'people' | 'nature';
  imageUrl: string;
  location?: string;
  width: number;
  height: number;
}

interface MasonryGridProps {
  photos: Photo[];
  className?: string;
}

const MasonryGrid = ({ photos, className = '' }: MasonryGridProps) => {
  const [columns, setColumns] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const getColumnPhotos = (columnIndex: number) => {
    return photos.filter((_, index) => index % columns === columnIndex);
  };

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 ${className}`}
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <div key={columnIndex} className="space-y-2 sm:space-y-4">
          {getColumnPhotos(columnIndex).map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>  
      ))}
    </div>
  );
};

export default MasonryGrid;