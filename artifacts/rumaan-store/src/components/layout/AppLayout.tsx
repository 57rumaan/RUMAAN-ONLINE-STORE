import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingBag, X, User, ChevronRight, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/category" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground/80 hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight">
                57 RUMAAN STORE
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted">
              <Search className="w-5 h-5" />
            </button>

            {/* Auth area */}
            {!loading && (
              user ? (
                /* Logged-in user dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={async () => { await logout(); setIsUserMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Sign in / Sign up */
                <div className="flex items-center gap-1">
                  <Link
                    href="/sign-in"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  <span className="font-display font-bold">Menu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User info in mobile menu */}
              {user && (
                <div className="px-4 py-3 border-b flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-colors",
                        location === link.href 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
                      )}
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  ))}

                  <div className="my-3 border-t border-border" />

                  {user ? (
                    <button
                      onClick={async () => { await logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 font-medium w-full text-left"
                    >
                      Sign Out
                      <LogOut className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground/80 hover:bg-muted font-medium"
                      >
                        Sign In
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                      <Link
                        href="/sign-up"
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold mt-1"
                      >
                        Sign Up
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                    </>
                  )}

                  <div className="my-3 border-t border-border" />

                  <Link
                    href="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground/80 hover:bg-muted font-medium"
                  >
                    Admin Panel
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="font-display font-bold tracking-wider">57 RUMAAN STORE</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Your premium destination for mobile phones, gaming accessories, and exclusive deals in Pakistan.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6 text-sm">
            <Link href="/sign-in" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
            <span className="text-border">•</span>
            <Link href="/sign-up" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link>
            <span className="text-border">•</span>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Rumaan Online Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
