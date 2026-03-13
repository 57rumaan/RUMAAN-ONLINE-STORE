import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";
import AdminLayout from "@/pages/admin/AdminLayout";

// Pages
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProductsTab from "@/pages/admin/ProductsTab";
import CategoriesTab from "@/pages/admin/CategoriesTab";
import OrdersTab from "@/pages/admin/OrdersTab";
import ReviewsTab from "@/pages/admin/ReviewsTab";

const queryClient = new QueryClient();

// Helper to wrap store pages in AppLayout
const StoreRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest}>
    {(params) => (
      <AppLayout>
        <Component {...params} />
      </AppLayout>
    )}
  </Route>
);

// Helper to wrap admin pages in AdminLayout
const AdminRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest}>
    {(params) => (
      <AdminLayout>
        <Component {...params} />
      </AdminLayout>
    )}
  </Route>
);

function Router() {
  return (
    <Switch>
      {/* Public Store Routes */}
      <StoreRoute path="/" component={Home} />
      <StoreRoute path="/category" component={CategoryPage} />
      <StoreRoute path="/product/:id" component={ProductDetail} />
      <StoreRoute path="/contact" component={ContactUs} />

      {/* Admin Routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/products" component={ProductsTab} />
      <AdminRoute path="/admin/categories" component={CategoriesTab} />
      <AdminRoute path="/admin/orders" component={OrdersTab} />
      <AdminRoute path="/admin/reviews" component={ReviewsTab} />

      {/* 404 */}
      <StoreRoute component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
