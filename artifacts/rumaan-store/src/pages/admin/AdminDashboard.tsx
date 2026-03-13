import { useGetAdminStats } from "@workspace/api-client-react";
import { Package, ListOrdered, MessageSquare, Tags } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const cards = [
    { title: "Total Products", value: stats?.totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Pending Orders", value: stats?.pendingOrders, icon: ListOrdered, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Total Categories", value: stats?.totalCategories, icon: Tags, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Total Reviews", value: stats?.totalReviews, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
