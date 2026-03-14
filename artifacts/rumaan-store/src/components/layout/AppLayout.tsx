import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingBag, X, ChevronRight, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useGetProducts } from "@workspace/api-client-react";
import { formatPKR } from "@/lib/utils";

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { user, logout, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: searchLoading } = useGetProducts(
    { search: debouncedSearch || undefined },
    { query: { enabled: debouncedSearch.length >= 2 } as any }
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectResult = (productId: number) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const showResults = debouncedSearch.length >= 2;

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
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth area */}
            {!loading && (
              user ? (
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Input row */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {!showResults && (
                    <p className="text-sm text-muted-foreground text-center py-8 px-4">
                      Type at least 2 characters to search
                    </p>
                  )}

                  {showResults && searchLoading && (
                    <div className="space-y-1 p-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                      ))}
                    </div>
                  )}

                  {showResults && !searchLoading && searchResults?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8 px-4">
                      No products found for "<strong>{debouncedSearch}</strong>"
                    </p>
                  )}

                  {showResults && !searchLoading && searchResults && searchResults.length > 0 && (
                    <ul className="p-2">
                      {searchResults.map(product => (
                        <li key={product.id}>
                          <button
                            onClick={() => handleSelectResult(product.id)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                            </div>
                            {product.categoryName?.toLowerCase() !== "deals" && (
                              <span className="text-sm font-semibold text-primary shrink-0">
                                {formatPKR(product.price)}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
