import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'all', label: 'All', href: '/' },
  { id: 'buildings', label: 'Buildings', href: '/gallery/buildings' },
  { id: 'people', label: 'People', href: '/gallery/people' },
  { id: 'nature', label: 'Nature', href: '/gallery/nature' },
];

interface CategoryPillsProps {
  currentCategory?: string;
}

const CategoryPills = ({ currentCategory = 'all' }: CategoryPillsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => {
        const isActive = currentCategory === category.id;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            asChild
            className={`
              px-4 py-2 text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-sepia text-off-white border-sepia hover:bg-sepia/90' 
                : 'border-olive text-olive hover:bg-sand hover:text-sepia hover:border-sepia'
              }
            `}
          >
            <Link to={category.href}>
              {category.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryPills;