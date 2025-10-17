import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fmt } from '@/lib/money';
import type { Product } from '@/lib/types';

interface ReceiptPanelProps {
  items: Product[];
  totalCents: number;
  customerName?: string;
}

export function ReceiptPanel({ items, totalCents, customerName }: ReceiptPanelProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Current Receipt</h2>
        {customerName && (
          <p className="text-sm text-muted-foreground mt-1">
            Customer: {customerName}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div 
            className="flex items-center justify-center h-full text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            No items selected
          </div>
        ) : (
          <div 
            role="list" 
            aria-label="Receipt items"
            className="space-y-2"
          >
            {items.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                role="listitem"
                className="flex items-start justify-between gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {product.sku || product.id.slice(0, 8)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm">
                    {fmt(product.priceCents)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator />

      <div 
        className="p-4 bg-muted/30"
        role="region"
        aria-label="Receipt total"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Items</span>
          <span className="text-sm font-medium">{items.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Total</span>
          <span 
            className="text-2xl font-bold text-primary"
            aria-live="polite"
            aria-atomic="true"
          >
            {fmt(totalCents)}
          </span>
        </div>
      </div>
    </Card>
  );
}
