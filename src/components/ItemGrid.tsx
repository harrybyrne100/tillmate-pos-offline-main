import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { fmt } from '@/lib/money';
import type { Product } from '@/lib/types';

interface ItemGridProps {
  items: Product[];
  onItemClick: (product: Product) => void;
  visibleItemsRef?: React.MutableRefObject<Product[]>;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export function ItemGrid({ items, onItemClick, visibleItemsRef, searchInputRef }: ItemGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract categories from SKUs (e.g., "BEV-001" -> "Beverages")
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  // Filter products based on search and category
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, searchQuery, selectedCategory]);

  // Update ref for keyboard shortcuts
  if (visibleItemsRef) {
    visibleItemsRef.current = filteredItems;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and Category Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search items"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
              size="sm"
              aria-pressed={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Item Grid */}
      <div 
        className="flex-1 overflow-y-auto"
        role="grid"
        aria-label="Available items"
      >
        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No items found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredItems.map((product, index) => (
              <Card
                key={product.id}
                role="gridcell"
                tabIndex={0}
                onClick={() => onItemClick(product)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onItemClick(product);
                  }
                }}
                className="p-4 cursor-pointer hover:bg-accent transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label={`Add ${product.name} for ${fmt(product.priceCents)}`}
              >
                {product.image && (
                  <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">
                    {product.sku || product.id.slice(0, 8)}
                  </p>
                  <h3 className="font-semibold text-sm leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    {fmt(product.priceCents)}
                  </p>
                </div>
                
                {index < 9 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Press {index + 1}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
