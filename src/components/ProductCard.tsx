import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl text-muted-foreground">
            {product.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3">{product.category}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="lg"
            onClick={() => onAddToCart(product)}
            className="gap-1.5 h-11 px-4 sm:px-6 touch-manipulation"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
