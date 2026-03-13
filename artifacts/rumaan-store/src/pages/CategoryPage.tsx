import { useState } from "react";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui";
import { Search, ArrowLeft } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  allowOnlinePurchase: boolean;
  showPrices: boolean;
  productCount: number;
};

export default function CategoryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");

  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const { data: products, isLoading: loadingProducts } = useGetProducts({
    categoryId: activeCategory?.id,
    search: search || undefined,
  });

  // — Category listing view —
  if (!activeCategory) {
    return (
      <div className="pb-10">
        <h1 className="text-3xl font-display font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground mb-8">Browse by category to find what you need</p>

        {loadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className="group relative h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <h3 className="text-xl font-display font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/80">{cat.productCount} Products</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // — Products view for selected category —
  return (
    <div className="pb-10">
      {/* Back + heading */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { setActiveCategory(null); setSearch(""); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          All Categories
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">{activeCategory.name}</h1>
          <p className="text-muted-foreground mt-1">
            {loadingProducts ? "Loading..." : `${products?.length ?? 0} products`}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search in this category..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
          <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
