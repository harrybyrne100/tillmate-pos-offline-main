import { useEffect, useState } from 'react';
import { useReceiptsStore } from '@/store/receipts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fmt } from '@/lib/money';
import { calculateReceiptMetrics } from '@/lib/receipts-utils';
import type { ReceiptItem } from '@/lib/types';

export default function Sales() {
  const { receipts, fetchReceipts, getTodaysReceipts, getReceiptItems, loading } = useReceiptsStore();
  const [todaysSales, setTodaysSales] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [receiptItemsMap, setReceiptItemsMap] = useState<Map<string, ReceiptItem[]>>(new Map());

  useEffect(() => {
    fetchReceipts();
    loadTodaysData();
  }, [fetchReceipts]);

  useEffect(() => {
    loadReceiptItems();
  }, [receipts]);

  const loadTodaysData = async () => {
    const today = await getTodaysReceipts();
    setTodaysSales(today.length);
    setTodaysRevenue(today.reduce((sum, receipt) => sum + receipt.totalCents, 0));
  };

  const loadReceiptItems = async () => {
    const itemsMap = new Map<string, ReceiptItem[]>();
    for (const receipt of receipts) {
      const items = await getReceiptItems(receipt.receiptId);
      itemsMap.set(receipt.receiptId, items);
    }
    setReceiptItemsMap(itemsMap);
  };

  const metrics = calculateReceiptMetrics(receipts);

  return (
    <div className="p-6 pb-24 md:pb-6">
        <h1 className="text-3xl font-bold mb-6">Sales History</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysSales}</div>
              <p className="text-xs text-muted-foreground">transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(todaysRevenue)}</div>
              <p className="text-xs text-muted-foreground">earned today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{metrics.receiptCount} transactions</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading sales...</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No sales yet
                    </TableCell>
                  </TableRow>
                ) : (
                  receipts.map((receipt) => {
                    const items = receiptItemsMap.get(receipt.receiptId) || [];
                    return (
                      <TableRow key={receipt.receiptId}>
                        <TableCell>
                          {format(new Date(receipt.createdAtISO), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {items.map((item, idx) => (
                              <div key={idx}>
                                {item.description}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{receipt.customerName || '-'}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {fmt(receipt.totalCents)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
    </div>
  );
}
