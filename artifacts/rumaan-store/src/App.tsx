import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";
import AdminLayout from "@/pages/admin/AdminLayout";

// Pages
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import ContactUs from "@/pages/ContactUs";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

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
      <StoreRoute path="/sign-in" component={SignIn} />
      <StoreRoute path="/sign-up" component={SignUp} />

      {/* Admin Routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />

      {/* 404 */}
      <StoreRoute component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
