import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  image?: string;
  category?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  discountPrice,
  image,
  category,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      discountPrice: discountPrice || undefined,
      image: image || '/placeholder.svg',
    });
    toast.success('Added to cart', {
      description: `${name} has been added to your cart`,
    });
  };

  const displayPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <Link to={`/product/${slug}`} className="card-product group">
      <div className="card-product-image relative">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full">
            SALE
          </span>
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        <Button
          size="icon"
          className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground shadow-card"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 space-y-2">
        {category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {category}
          </p>
        )}
        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
