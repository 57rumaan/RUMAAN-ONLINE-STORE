import { useGetReviews, useDeleteReview } from "@workspace/api-client-react";
import { Button } from "@/components/ui";
import { Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReviewsTab() {
  const { data: reviews, refetch } = useGetReviews();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (confirm("Delete this review?")) {
      await deleteReview.mutateAsync({ id });
      toast({ title: "Review deleted" });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Manage Reviews</h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Reviewer</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold w-1/3">Comment</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews?.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{r.productName}</td>
                  <td className="p-4">{r.reviewerName}</td>
                  <td className="p-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'fill-muted text-muted'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground line-clamp-2">{r.comment}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
