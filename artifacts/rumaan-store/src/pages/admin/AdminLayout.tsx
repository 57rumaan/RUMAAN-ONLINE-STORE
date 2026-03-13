import { useState } from "react";
import { Link } from "wouter";
import { Package, ListOrdered, MessageSquare, Tags, LayoutDashboard, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import OrdersTab from "./OrdersTab";
import ReviewsTab from "./ReviewsTab";

const tabs = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "products", name: "Products", icon: Package },
  { id: "categories", name: "Categories", icon: Tags },
  { id: "orders", name: "Orders", icon: ListOrdered },
  { id: "reviews", name: "Reviews", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboard />;
      case "products": return <ProductsTab />;
      case "categories": return <CategoriesTab />;
      case "orders": return <OrdersTab />;
      case "reviews": return <ReviewsTab />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">Back to Store</span>
        </Link>
        <div className="w-px h-6 bg-border" />
        <span className="font-display font-bold text-primary">Store Admin</span>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — visible on md+ */}
        <aside className="hidden md:flex flex-col w-56 bg-card border-r border-border sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
          <nav className="flex-1 py-4 px-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {renderTab()}
          </div>
        </main>
      </div>

      {/* Bottom tab bar — visible on mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around px-2 h-16">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors flex-1",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
