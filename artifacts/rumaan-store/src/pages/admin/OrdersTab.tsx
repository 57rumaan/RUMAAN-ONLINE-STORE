import { useGetOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { Badge } from "@/components/ui";
import { formatPKR } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function OrdersTab() {
  const { data: orders, refetch } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast({ title: "Order status updated" });
      refetch();
    } catch (e) {
      toast({ variant: "destructive", title: "Update failed" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Bank Transfer Orders</h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Receipt (TID)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map(o => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">#{o.id}</td>
                  <td className="p-4">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-muted-foreground">{o.customerPhone}</div>
                  </td>
                  <td className="p-4">{o.productName}</td>
                  <td className="p-4">{formatPKR(o.productPrice)}</td>
                  <td className="p-4 font-mono text-xs bg-muted/50 rounded px-2 py-1 inline-block mt-3">{o.receiptId}</td>
                  <td className="p-4">
                    <select 
                      className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
