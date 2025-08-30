import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  category: 'buildings' | 'people' | 'nature';
  imageUrl: string;
  location?: string;
  width: number;
  height: number;
}

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard = ({ photo }: PhotoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group block relative overflow-hidden bg-sand transition-all duration-300 hover:shadow-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className={`w-full h-auto object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-sand animate-pulse" />
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Content overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}>
          <h3 className="font-serif text-lg font-medium mb-1 relative">
            {photo.title}
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-mustard transition-all duration-300" />
          </h3>
          {photo.location && (
            <div className="flex items-center text-sm text-white/80">
              <MapPin className="h-3 w-3 mr-1" />
              {photo.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PhotoCard;