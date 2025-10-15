import type { Receipt, ReceiptItem } from './types';
import { fmt } from './money';

export interface ReceiptMetrics {
  totalRevenue: number;
  receiptCount: number;
  averageTransaction: number;
}

export function calculateReceiptMetrics(receipts: Receipt[]): ReceiptMetrics {
  const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.totalCents, 0);
  const receiptCount = receipts.length;
  const averageTransaction = receiptCount > 0 ? totalRevenue / receiptCount : 0;

  return {
    totalRevenue,
    receiptCount,
    averageTransaction,
  };
}

export function formatReceiptForDisplay(receipt: Receipt, items: ReceiptItem[]) {
  return {
    id: receipt.receiptId,
    date: new Date(receipt.createdAtISO),
    items: items.map(item => ({
      description: item.description,
      itemNumber: item.itemNumber,
      unitPriceCents: item.unitPriceCents,
    })),
    totalCents: receipt.totalCents,
    totalFormatted: fmt(receipt.totalCents),
    customerName: receipt.customerName,
  };
}

export function getTodayDayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function aggregateReceiptsByDay(receipts: Receipt[]): Map<string, Receipt[]> {
  const byDay = new Map<string, Receipt[]>();
  
  receipts.forEach(receipt => {
    const existing = byDay.get(receipt.dayKey) || [];
    existing.push(receipt);
    byDay.set(receipt.dayKey, existing);
  });
  
  return byDay;
}
