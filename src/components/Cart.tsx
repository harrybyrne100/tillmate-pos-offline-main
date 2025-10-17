import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <Card className="p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Cart is empty</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Current Order</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">
                ${item.product.price.toFixed(2)} each
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <span className="font-semibold w-20 text-right">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeItem(item.product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span className="text-primary">${getTotal().toFixed(2)}</span>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </Card>
  );
}
