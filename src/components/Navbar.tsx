import type React from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  PlusSquare,
  User,
  LogOut,
  Moon,
  Sun,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../lib/auth-provider";
import { useTheme } from "./theme-provider";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Don't show navbar on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // If auth is still loading, show a simplified navbar
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-foreground hover:text-primary">
                TravelGram
              </span>
            </Link>
          </div>
          <div className="animate-pulse h-8 w-32 bg-muted rounded-md"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground hover:text-primary">
              TravelGram
            </span>
          </Link>
        </div>

        {user && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex md:w-1/3 lg:w-1/4"
          >
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search travelers or locations..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2 hover:bg-accent"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
              >
                <Link to="/create">
                  <PlusSquare className="h-5 w-5" />
                  <span className="sr-only">Create post</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-accent hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="mr-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
