import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ItemGrid } from '@/components/ItemGrid';
import { ReceiptPanel } from '@/components/ReceiptPanel';
import { FooterBar } from '@/components/FooterBar';
import { DailySalesDialog } from '@/components/DailySalesDialog';
import { OfflineBanner } from '@/components/OfflineBanner';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useBasketStore } from '@/stores/basket';
import { useProductStore } from '@/store/products';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

export default function PosPage() {
  const { products, loading, fetchProducts } = useProductStore();
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [dailySalesDialogOpen, setDailySalesDialogOpen] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState('');
  const visibleItemsRef = useRef<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    basket,
    customerName,
    runningTotalCents,
    addItem,
    clearEntry,
    cancelAll,
    setCustomerName,
    checkout,
    loadDailySales,
  } = useBasketStore();

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number keys 1-9: Add first 9 visible products
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        const product = visibleItemsRef.current[index];
        if (product) {
          addItem(product);
          toast.success(`Added ${product.name}`);
        }
      }

      // Backspace: Clear last entry
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (basket.length > 0) {
          clearEntry();
          toast.info('Removed last item');
        }
      }

      // Escape: Cancel all
      if (e.key === 'Escape') {
        e.preventDefault();
        if (basket.length > 0) {
          cancelAll();
          toast.info('Basket cleared');
        }
      }

      // Enter: Open checkout
      if (e.key === 'Enter') {
        e.preventDefault();
        if (basket.length > 0) {
          openCheckoutDialog();
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [basket, addItem, clearEntry, cancelAll]);

  function openCheckoutDialog() {
    setCustomerNameInput(customerName || '');
    setCheckoutDialogOpen(true);
  }

  async function handleCheckout() {
    try {
      // Set customer name before checkout
      setCustomerName(customerNameInput);
      
      // Perform atomic checkout transaction
      await checkout();
      
      // Success: close dialog and reset
      setCheckoutDialogOpen(false);
      setCustomerNameInput('');
      
      // Success toast
      toast.success('Checkout completed successfully!', {
        description: 'Receipt saved to local database',
      });
      
      // Focus search input for next transaction
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Checkout failed:', error);
      
      // Show destructive error toast
      toast.error('Checkout Failed', {
        description: error instanceof Error 
          ? error.message 
          : 'Transaction rolled back. Please try again.',
        duration: 5000,
      });
      
      // Don't close dialog on error - let user retry
    }
  }

  async function handleDailySales() {
    setDailySalesDialogOpen(true);
  }

  async function handleClearAll() {
    toast.info('Clear All feature is now managed in Settings page');
  }

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 pb-24 md:pb-4">
      <OfflineBanner />
      <InstallPrompt />
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left: Product Grid */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <ItemGrid
            items={products}
            onItemClick={(product) => {
              addItem(product);
              toast.success(`Added ${product.name}`);
            }}
            visibleItemsRef={visibleItemsRef}
            searchInputRef={searchInputRef}
          />
        </div>

        {/* Right: Receipt Panel */}
        <div className="flex flex-col min-h-0">
          <ReceiptPanel
            items={basket}
            totalCents={runningTotalCents()}
            customerName={customerName}
          />
        </div>
      </main>

      {/* Footer Toolbar */}
      <FooterBar
        basketCount={basket.length}
        onClearEntry={() => {
          clearEntry();
          if (basket.length > 0) toast.info('Removed last item');
        }}
        onCancelAll={() => {
          if (basket.length > 0) {
            cancelAll();
            toast.info('Basket cleared');
          }
        }}
        onCheckout={openCheckoutDialog}
        onDailySales={handleDailySales}
        onClearAll={handleClearAll}
      />

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Checkout</DialogTitle>
            <DialogDescription>
              Total: <span className="text-2xl font-bold text-primary">{runningTotalCents()} cents</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name (Optional)</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customerNameInput}
                onChange={(e) => setCustomerNameInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              className="bg-success hover:bg-success/90"
            >
              Complete Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Daily Sales Dialog */}
      <DailySalesDialog
        open={dailySalesDialogOpen}
        onOpenChange={setDailySalesDialogOpen}
      />
    </div>
  );
}
