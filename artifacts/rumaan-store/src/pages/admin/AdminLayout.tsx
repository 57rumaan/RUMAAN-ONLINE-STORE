import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, ListOrdered, MessageSquare, Tags, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const tabs = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Orders", href: "/admin/orders", icon: ListOrdered },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-display font-bold text-lg text-primary">Store Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {tabs.map(tab => (
            <Link 
              key={tab.href} 
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                location === tab.href ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <LogOut className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
           <span className="font-display font-bold text-primary">Admin</span>
           <Link href="/" className="text-sm font-medium">Exit</Link>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
