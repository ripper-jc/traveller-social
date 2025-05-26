import { useTheme } from "./theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeIndicator() {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 shadow-lg backdrop-blur">
      {theme === "light" && <Sun className="h-4 w-4 text-yellow-500" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-blue-400" />}
      {theme === "system" && <Laptop className="h-4 w-4" />}
      <span className="text-xs font-medium">{theme} theme</span>
    </div>
  );
}
