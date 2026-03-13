import { useState } from "react";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input, Button } from "@/components/ui";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocation } from "wouter";

export default function CategoryPage() {
  const [searchParams] = useLocation();
  const initialCatId = new URLSearchParams(window.location.search).get("id");
  
  const [activeCategory, setActiveCategory] = useState<number | undefined>(initialCatId ? parseInt(initialCatId) : undefined);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useGetCategories();
  const { data: products, isLoading } = useGetProducts({
    categoryId: activeCategory,
    search: search || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-24 space-y-8 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h3 className="font-display font-semibold mb-4 text-lg">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory(undefined)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  activeCategory === undefined ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                All Products
              </button>
              {categories?.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-lg">Price Range (PKR)</h3>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-10 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input 
                type="number" 
                placeholder="Max" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {activeCategory ? categories?.find(c => c.id === activeCategory)?.name : 'All Products'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Showing {products?.length || 0} results
            </p>
          </div>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 bg-card border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden flex-shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            <Button onClick={() => { setSearch(''); setMinPrice(''); setMaxPrice(''); setActiveCategory(undefined); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
