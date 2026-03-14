import { useState } from "react";
import { useGetOrdersByPhone } from "@workspace/api-client-react";
import { formatPKR } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { Search, Package, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  pending:    { label: "Pending",    icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  processing: { label: "Processing", icon: Loader2,       color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  completed:  { label: "Completed",  icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  cancelled:  { label: "Cancelled",  icon: XCircle,       color: "text-red-600",    bg: "bg-red-50 border-red-200" },
};

export default function OrderHistory() {
  const [phoneInput, setPhoneInput] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const { data: orders, isLoading, isFetched } = useGetOrdersByPhone(
    { phone: searchPhone },
    { query: { enabled: !!searchPhone } as any }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPhone(phoneInput.trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">Enter your phone number to see all your past orders.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          type="tel"
          placeholder="e.g. 03001234567"
          value={phoneInput}
          onChange={e => setPhoneInput(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={!phoneInput.trim()}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isFetched && !isLoading && orders?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No orders found</p>
          <p className="text-sm mt-1">No orders were placed with this phone number.</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
          {orders.map(order => {
            const status = statusConfig[order.status] ?? statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Order #{order.id}</p>
                    <p className="font-semibold text-lg">{order.productName}</p>
                    <p className="text-primary font-bold text-xl">{formatPKR(order.productPrice)}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Delivery Address</p>
                    <p className="text-foreground/80">{order.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">Payment TID</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">{order.receiptId}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
