import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getDB } from '@/db/schema';

export default function Settings() {
  const handleExportData = async () => {
    try {
      const db = await getDB();
      const products = await db.getAll('products');
      const sales = await db.getAll('sales');

      const data = {
        products,
        sales,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tillmate-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure? This will delete ALL products and sales data. This cannot be undone!')) {
      return;
    }

    try {
      const db = await getDB();
      await db.clear('products');
      await db.clear('sales');
      toast.success('All data cleared');
    } catch (error) {
      toast.error('Failed to clear data');
      console.error('Clear error:', error);
    }
  };

  return (
    <div className="p-6 pb-24 md:pb-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your local database and export data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                Export All Data (JSON)
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={handleClearData}
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Tillmate</CardTitle>
              <CardDescription>
                Offline-first point of sale system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Storage:</strong> IndexedDB (Local)
              </p>
              <p>
                All data is stored locally in your browser. No server required.
              </p>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
