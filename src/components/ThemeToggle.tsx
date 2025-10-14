import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 touch-manipulation"
          aria-label="Toggle theme"
        >
          {theme === 'light' && <Sun className="h-5 w-5" />}
          {theme === 'dark' && <Moon className="h-5 w-5" />}
          {theme === 'system' && <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer py-3">
          <Sun className="mr-3 h-5 w-5" />
          <span className="text-base">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer py-3">
          <Moon className="mr-3 h-5 w-5" />
          <span className="text-base">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer py-3">
          <Monitor className="mr-3 h-5 w-5" />
          <span className="text-base">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
