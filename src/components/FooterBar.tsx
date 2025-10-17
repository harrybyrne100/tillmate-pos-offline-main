import { Button } from '@/components/ui/button';
import { Trash2, X, ShoppingCart, TrendingUp, RotateCcw } from 'lucide-react';

interface FooterBarProps {
  basketCount: number;
  onClearEntry: () => void;
  onCancelAll: () => void;
  onCheckout: () => void;
  onDailySales: () => void;
  onClearAll: () => void;
}

export function FooterBar({
  basketCount,
  onClearEntry,
  onCancelAll,
  onCheckout,
  onDailySales,
  onClearAll,
}: FooterBarProps) {
  return (
    <footer 
      className="mt-4 flex flex-wrap gap-2 justify-between"
      role="toolbar"
      aria-label="POS actions"
    >
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClearEntry}
          disabled={basketCount === 0}
          aria-label="Clear last entry (Backspace)"
          title="Backspace"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear Entry
        </Button>

        <Button
          variant="outline"
          onClick={onCancelAll}
          disabled={basketCount === 0}
          aria-label="Cancel all items (Escape)"
          title="Escape"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel All
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onDailySales}
          aria-label="View daily sales"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Daily Sales
        </Button>

        <Button
          variant="outline"
          onClick={onClearAll}
          aria-label="Clear all data"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>

        <Button
          onClick={onCheckout}
          disabled={basketCount === 0}
          className="bg-success hover:bg-success/90"
          aria-label="Checkout (Enter)"
          title="Enter"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Checkout
        </Button>
      </div>
    </footer>
  );
}
