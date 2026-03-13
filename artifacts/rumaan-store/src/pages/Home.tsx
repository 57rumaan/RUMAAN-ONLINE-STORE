import { useMemo } from "react";
import { useGetProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { data: products, isLoading } = useGetProducts({});

  const randomProducts = useMemo(() => {
    if (!products) return [];
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [products]);

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold">All Products</h2>
        <span className="text-sm text-muted-foreground">{randomProducts.length} items</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {randomProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
