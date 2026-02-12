import { LanguageProvider } from "./context/LanguageContext";
import { AdminLangProvider } from "./hooks/useAdminLang";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Categories from "@/pages/Categories";
import Contact from "@/pages/Contact";
import Partners from "@/pages/Partners";
import CategoryDetail from "@/pages/CategoryDetail";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function AdminWrapper({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminLangProvider>
      <Component />
    </AdminLangProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/partners" component={Partners} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login">{() => <AdminWrapper component={AdminLogin} />}</Route>
      <Route path="/admin">{() => <AdminWrapper component={AdminDashboard} />}</Route>
      <Route path="/:slug">{(params) => <CategoryDetail slug={params.slug} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
