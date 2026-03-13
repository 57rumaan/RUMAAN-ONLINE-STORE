import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingBag, X, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/admin" className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <button className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center border-2 border-background">
                0
              </span>
            </button>
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
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-display font-bold">R</div>
                  <span className="font-display font-bold">Menu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
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
                  <div className="my-4 border-t border-border" />
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
             <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white font-display font-bold text-xs">R</div>
             <span className="font-display font-bold tracking-wider">RUMAAN STORE</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Your premium destination for mobile phones, gaming accessories, and exclusive deals in Pakistan.
          </p>
          <div className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Rumaan Online Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
