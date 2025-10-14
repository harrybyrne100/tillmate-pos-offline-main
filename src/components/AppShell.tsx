import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ShoppingCart, Package, History, Settings, TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'POS', icon: ShoppingCart },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/sales', label: 'Sales', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">TillMate</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors touch-manipulation',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">TillMate POS</h3>
              <p className="text-sm text-muted-foreground">
                Offline-first point of sale system
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Works offline</li>
                <li>• IndexedDB storage</li>
                <li>• PWA installable</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <nav className="flex flex-col gap-1 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TillMate. Built with React + Vite.
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-3 rounded-lg font-medium transition-colors text-xs touch-manipulation min-h-[60px]',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
