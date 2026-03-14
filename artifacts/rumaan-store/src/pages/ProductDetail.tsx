import { useState, useRef } from "react";
import { useParams } from "wouter";
import { useGetProduct, useGetCategories, useCreateOrder, useGetReviews, useCreateReview } from "@workspace/api-client-react";
import { formatPKR } from "@/lib/utils";
import { Button, Modal, Input, Textarea, Badge } from "@/components/ui";
import { MessageCircle, ShoppingBag, Star, ChevronRight, CheckCircle2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(productId);
  const { data: categories } = useGetCategories();
  const { data: reviews, refetch: refetchReviews } = useGetReviews({ productId });
  
  const createOrder = useCreateOrder();
  const createReview = useCreateReview();

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", receiptId: ""
  });
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReceiptImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceiptImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const category = categories?.find(c => c.id === product?.categoryId);
  const isDeal = category?.name.toLowerCase().includes("deal");
  const allowPurchase = category?.allowOnlinePurchase ?? true;

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const text = `Hi! I want to order ${product.name} priced at ${formatPKR(product.price)}. Product link: ${window.location.href}`;
    window.open(`https://wa.me/${product.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder.mutateAsync({
        data: {
          productId,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          receiptId: formData.receiptId,
          ...(receiptImage ? { receiptImage } : {})
        }
      });
      setIsBuyModalOpen(false);
      setReceiptImage(null);
      setFormData({ name: "", phone: "", address: "", receiptId: "" });
      toast({
        title: "Order Placed Successfully!",
        description: "We will verify your payment and process the order.",
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to place order", description: err.message });
    }
  };

  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview.mutateAsync({
        data: { productId, reviewerName: reviewForm.name, rating: reviewForm.rating, comment: reviewForm.comment }
      });
      setReviewForm({ name: "", rating: 5, comment: "" });
      refetchReviews();
      toast({ title: "Review added successfully!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add review" });
    }
  };

  if (isLoading || !product) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Home</span> <ChevronRight className="w-4 h-4" />
        <span>{product.categoryName}</span> <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-lg flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full max-w-md h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute top-6 right-6">
              <Badge variant="destructive" className="text-sm px-4 py-1">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-4">
          <Badge variant="outline" className="w-fit mb-4 text-primary border-primary/20 bg-primary/5">
            {product.categoryName}
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'fill-muted text-muted'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground underline cursor-pointer hover:text-primary">
              {reviews?.length || 0} Reviews
            </span>
          </div>
          
          {!isDeal && (
            <div className="mb-8">
              <span className="text-4xl font-display font-bold text-primary">
                {formatPKR(product.price)}
              </span>
              <span className="text-muted-foreground ml-2 text-sm">Tax included</span>
            </div>
          )}

          <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground mb-10 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>100% Authentic Product</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            {allowPurchase && !isDeal && (
              <Button 
                size="lg" 
                className="flex-1" 
                disabled={!product.inStock}
                onClick={() => setIsBuyModalOpen(true)}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            )}
            {!isDeal && (
               <Button 
                size="lg" 
                variant="secondary"
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50" 
                disabled={!product.inStock}
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Order via WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Reviews Section */}
      <section className="max-w-4xl">
        <h2 className="text-2xl font-display font-bold mb-8">Customer Reviews</h2>
        
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          {/* Write Review */}
          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm h-fit">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Your Name</label>
                <Input required value={reviewForm.name} onChange={e => setReviewForm(prev => ({...prev, name: e.target.value}))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Rating (1-5)</label>
                <Input type="number" min="1" max="5" required value={reviewForm.rating} onChange={e => setReviewForm(prev => ({...prev, rating: parseInt(e.target.value)}))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Comment</label>
                <Textarea required value={reviewForm.comment} onChange={e => setReviewForm(prev => ({...prev, comment: e.target.value}))} />
              </div>
              <Button type="submit" className="w-full" isLoading={createReview.isPending}>Submit Review</Button>
            </form>
          </div>

          {/* List Reviews */}
          <div className="space-y-6">
            {reviews?.length === 0 ? (
              <p className="text-muted-foreground italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews?.map(review => (
                <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.reviewerName}</span>
                    <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Buy Modal */}
      <Modal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} title="Complete Purchase">
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm">
            <p className="font-semibold text-primary mb-2">Please transfer {formatPKR(product.price)} to one of the following accounts:</p>
            <ul className="space-y-1 text-foreground/80 list-disc list-inside">
              <li><strong>EASYPAISA:</strong> 03131307143 (Rumaan Khan)</li>
              <li><strong>SADAPAY:</strong> 03131307143 (Rumaan Store)</li>
            </ul>
          </div>

          <form onSubmit={handleBuySubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Your Full Name</label>
              <Input required value={formData.name} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <Input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Delivery Address</label>
              <Textarea required value={formData.address} onChange={e => setFormData(prev => ({...prev, address: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Payment Receipt ID (TID)</label>
              <Input required value={formData.receiptId} onChange={e => setFormData(prev => ({...prev, receiptId: e.target.value}))} placeholder="e.g. 123456789012" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Payment Receipt Screenshot <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReceiptImageChange}
              />
              {receiptImage ? (
                <div className="relative mt-1">
                  <img src={receiptImage} alt="Receipt preview" className="w-full max-h-48 object-contain rounded-xl border border-border bg-muted/30" />
                  <button
                    type="button"
                    onClick={() => { setReceiptImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1 border border-border hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-4 px-4 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload receipt image
                </button>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsBuyModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={createOrder.isPending}>Submit Order</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
