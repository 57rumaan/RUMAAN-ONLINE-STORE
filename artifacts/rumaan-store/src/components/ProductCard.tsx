import { Link } from "wouter";
import { formatPKR } from "@/lib/utils";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const isDeal = product.categoryName?.toLowerCase().includes("deal");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted/30">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Featured
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
          {product.categoryName}
        </div>
        <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-display font-semibold text-lg line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>
        </Link>
        
        {!isDeal && (
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-foreground">4.8</span>
                <span className="text-xs text-muted-foreground">(24)</span>
              </div>
              <div className="font-display font-bold text-xl text-primary">
                {formatPKR(product.price)}
              </div>
            </div>
            <Link 
              href={`/product/${product.id}`}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        )}

        {isDeal && (
          <div className="mt-auto pt-4">
             <Link 
              href={`/product/${product.id}`}
              className="block w-full text-center py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              View Deal
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
