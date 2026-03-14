import { useGetAdminAnalytics } from "@workspace/api-client-react";
import { formatPKR } from "@/lib/utils";
import { TrendingUp, ShoppingBag, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

export default function AnalyticsTab() {
  const { data, isLoading } = useGetAdminAnalytics();

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ordersPerDay = (data?.ordersPerDay ?? []).map(d => ({
    ...d,
    date: d.date ? new Date(d.date).toLocaleDateString("en-PK", { month: "short", day: "numeric" }) : "",
  }));

  const statusData = (data?.statusBreakdown ?? []).map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
    color: STATUS_COLORS[s.status] ?? "#94a3b8",
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold">Sales Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
            <p className="text-2xl font-bold">{formatPKR(data?.totalRevenue ?? 0)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
            <p className="text-2xl font-bold">{(data?.statusBreakdown ?? []).reduce((a, b) => a + b.count, 0)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Top Product</p>
            <p className="text-base font-bold leading-tight">{data?.topProducts?.[0]?.productName ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Orders Per Day Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-4">Orders (Last 7 Days)</h2>
        {ordersPerDay.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No orders in the last 7 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersPerDay} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={28} />
              <Tooltip formatter={(val: number, name: string) => name === "revenue" ? formatPKR(val) : val} />
              <Bar dataKey="count" name="Orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Order Status Breakdown</h2>
          {statusData.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Top Selling Products</h2>
          {(data?.topProducts ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data?.topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.productName}</p>
                    <p className="text-xs text-muted-foreground">{p.orderCount} orders · {formatPKR(p.revenue)}</p>
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.round((p.orderCount / (data.topProducts[0]?.orderCount || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
