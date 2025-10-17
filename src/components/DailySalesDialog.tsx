import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { fmt, dayKeyOf } from '@/lib/money';
import { listDailySales } from '@/db/idb';
import type { ReceiptItem } from '@/lib/types';

interface DailySalesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailySalesDialog({ open, onOpenChange }: DailySalesDialogProps) {
  const [dayKey, setDayKey] = useState(dayKeyOf());
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [totalCents, setTotalCents] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadSales(dayKey);
    }
  }, [open, dayKey]);

  async function loadSales(selectedDay: string) {
    setLoading(true);
    try {
      const sales = await listDailySales(selectedDay);
      setItems(sales.items);
      setTotalCents(sales.totalCents);
    } catch (error) {
      console.error('Failed to load sales:', error);
      setItems([]);
      setTotalCents(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Daily Sales</DialogTitle>
          <DialogDescription>
            View all sales for a specific day
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="date-picker">Date</Label>
              <Input
                id="date-picker"
                type="date"
                value={dayKey}
                onChange={(e) => setDayKey(e.target.value)}
                max={dayKeyOf()}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setDayKey(dayKeyOf())}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>

          <Separator />

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No sales for this day</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.itemNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {fmt(item.unitPriceCents)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total ({items.length} items)</span>
                <span className="text-primary">{fmt(totalCents)}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
