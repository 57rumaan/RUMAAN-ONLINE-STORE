import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { ArrowRight, Zap, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui";

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = useGetProducts({ featured: true });
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-[2rem] overflow-hidden bg-foreground text-background min-h-[500px] flex items-center shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-banner.png`}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent dark:from-background dark:via-background/90" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6 backdrop-blur-md border border-primary/20">
            <Zap className="w-4 h-4" />
            Premium Electronics & Deals
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-6 tracking-tight text-foreground">
            Upgrade Your Tech Lifestyle.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the latest mobile phones, gaming accessories, and exclusive deals crafted for the modern Pakistani consumer.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/category">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-background/50 backdrop-blur-sm border-border/50 text-foreground" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ShieldCheck, title: "Authentic Products", desc: "100% genuine guaranteed" },
          { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping" },
          { icon: Zap, title: "Best Prices", desc: "Unbeatable market rates" }
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <feat.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">{feat.title}</h4>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Shop by Category</h2>
          <Link href="/category" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {isLoadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category?id=${cat.id}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-display font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/80">{cat.productCount || 0} Products</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Products</h2>
        </div>
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
