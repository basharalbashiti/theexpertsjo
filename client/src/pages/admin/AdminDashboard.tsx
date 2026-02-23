import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useAdminLang } from "@/hooks/useAdminLang";
import { Button } from "@/components/ui/button";
import ContentEditor from "./ContentEditor";
import PartnerManager from "./PartnerManager";
import BrandManager from "./BrandManager";
import ClientManager from "./ClientManager";
import CategoryManager from "./CategoryManager";
import ProductManager from "./ProductManager";
import SiteImageManager from "./SiteImageManager";
import QuickLinksManager from "./QuickLinksManager";
import LeadershipManager from "./LeadershipManager";
import KeyContactManager from "./KeyContactManager";
import MessageManager from "./MessageManager";
import SeoManager from "./SeoManager";
import type { Category, Product, Partner, Brand, Client, SiteContent, Leadership } from "@shared/schema";

type AdminPage = "overview" | "content" | "site-images" | "categories" | "products" | "brands" | "partners" | "clients" | "leadership" | "key-contacts" | "quick-links" | "messages" | "seo" | "settings";

interface MenuItem {
  id: AdminPage;
  label: string;
  icon: string;
  description: string;
}

function MenuIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
    ),
    "file-text": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
    ),
    folder: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
    ),
    package: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    ),
    award: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
    ),
    handshake: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    image: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    crown: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    ),
    link: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    ),
    mail: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    search: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
  };
  return icons[name] || null;
}

interface SitemapItem {
  title: string;
  path: string;
  children?: SitemapItem[];
}

function OverviewPage({ onNavigate, t }: { onNavigate: (page: AdminPage) => void; t: (key: string) => string }) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  const { data: brandsList = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  const { data: clientsList = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  const { data: contents = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const stats = [
    { label: t("content_items"), count: contents.length, page: "content" as AdminPage, color: "bg-blue-50 border-blue-200 text-blue-700", icon: "file-text" },
    { label: t("categories"), count: categories.length, page: "categories" as AdminPage, color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: "folder" },
    { label: t("products"), count: products.length, page: "products" as AdminPage, color: "bg-purple-50 border-purple-200 text-purple-700", icon: "package" },
    { label: t("our_brands"), count: brandsList.length, page: "brands" as AdminPage, color: "bg-orange-50 border-orange-200 text-orange-700", icon: "award" },
    { label: t("partners"), count: partners.length, page: "partners" as AdminPage, color: "bg-amber-50 border-amber-200 text-amber-700", icon: "handshake" },
    { label: t("clients"), count: clientsList.length, page: "clients" as AdminPage, color: "bg-rose-50 border-rose-200 text-rose-700", icon: "users" },
  ];

  const sitemap: SitemapItem[] = [
    { title: t("home_page"), path: "/" },
    { title: t("about_us"), path: "/about-us" },
    { title: t("products_categories"), path: "/categories" },
    { title: t("partners_clients"), path: "/partners" },
    { title: t("contact"), path: "/contact" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">{t("welcome_dashboard")}</h2>
        <p className="text-neutral-500">{t("manage_desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.page}
            data-testid={`quick-action-${stat.page}`}
            onClick={() => onNavigate(stat.page)}
            className={`p-6 rounded-xl border-2 text-left hover:shadow-md transition-all ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <MenuIcon name={stat.icon} />
              <span className="text-3xl font-bold">{stat.count}</span>
            </div>
            <p className="font-semibold">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">{t("website_sitemap")}</h3>
        <p className="text-sm text-neutral-500 mb-6">{t("sitemap_desc")}</p>
        <div className="space-y-2">
          {sitemap.map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-neutral-50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium text-neutral-800">{item.title}</span>
                <span className="text-xs text-neutral-400 ml-auto font-mono">{item.path}</span>
              </div>
              {item.children && (
                <div className="ml-8 border-l-2 border-neutral-100 pl-4 space-y-1">
                  {item.children.map((child, j) => (
                    <div key={j} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-neutral-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      <span className="text-sm text-neutral-600">{child.title}</span>
                      <span className="text-xs text-neutral-400 ml-auto font-mono">{child.path}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const [activePage, setActivePage] = useState<AdminPage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { id: "overview", label: t("dashboard"), icon: "grid", description: t("desc_overview") },
    { id: "content", label: t("site_content"), icon: "file-text", description: t("desc_content") },
    { id: "site-images", label: t("site_images"), icon: "image", description: t("desc_images") },
    { id: "categories", label: t("categories"), icon: "folder", description: t("desc_categories") },
    { id: "products", label: t("products"), icon: "package", description: t("desc_products") },
    { id: "brands", label: t("our_brands"), icon: "award", description: t("desc_brands") },
    { id: "partners", label: t("partners"), icon: "handshake", description: t("desc_partners") },
    { id: "clients", label: t("clients"), icon: "users", description: t("desc_clients") },
    { id: "leadership", label: t("leadership"), icon: "crown", description: t("desc_leadership") },
    { id: "key-contacts", label: t("key_contacts"), icon: "phone", description: t("desc_key_contacts") },
    { id: "quick-links", label: t("quick_links"), icon: "link", description: t("desc_quick_links") },
    { id: "messages", label: t("messages"), icon: "mail", description: t("desc_messages") },
    { id: "seo", label: "SEO", icon: "search", description: "Search engine optimization settings" },
    { id: "settings", label: t("settings"), icon: "settings", description: t("desc_settings") },
  ];

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin/login");
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-neutral-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage onNavigate={setActivePage} t={t} />;
      case "content":
        return <ContentEditor />;
      case "site-images":
        return <SiteImageManager />;
      case "categories":
        return <CategoryManager />;
      case "products":
        return <ProductManager />;
      case "brands":
        return <BrandManager />;
      case "partners":
        return <PartnerManager />;
      case "clients":
        return <ClientManager />;
      case "leadership":
        return <LeadershipManager />;
      case "key-contacts":
        return <KeyContactManager />;
      case "quick-links":
        return <QuickLinksManager />;
      case "messages":
        return <MessageManager />;
      case "seo":
        return <SeoManager />;
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">{t("account_settings")}</h2>
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-500">{t("username")}</label>
                <p className="text-lg font-semibold text-neutral-900">{user?.username}</p>
              </div>
              <p className="text-sm text-neutral-400">{t("password_change_soon")}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const activeMenuItem = menuItems.find((m) => m.id === activePage);

  return (
    <div className="min-h-screen bg-neutral-50 flex" dir={lang === "AR" ? "rtl" : "ltr"}>
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-neutral-200 flex flex-col transition-all duration-200 shrink-0`}
      >
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              data-testid="button-toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-primary truncate">{t("the_experts")}</h1>
                <p className="text-xs text-neutral-400 truncate">{t("admin_panel")}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              data-testid={`nav-${item.id}`}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activePage === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="shrink-0">
                <MenuIcon name={item.icon} />
              </div>
              {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-200">
          <button
            data-testid="button-logout"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            {sidebarOpen && <span className="text-sm">{logoutMutation.isPending ? t("logging_out") : t("logout")}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{activeMenuItem?.label || t("dashboard")}</h2>
            <p className="text-sm text-neutral-500">{activeMenuItem?.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {t("logged_in_as")} <span className="font-medium text-neutral-700">{user?.username}</span>
            </span>
            <a
              href="/"
              target="_blank"
              className="text-sm text-primary hover:underline"
              data-testid="link-view-site"
            >
              {t("view_site")}
            </a>
            <button
              data-testid="button-admin-lang-toggle"
              onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            >
              {lang === "EN" ? "العربية" : "English"}
            </button>
          </div>
        </header>

        <div className="p-6 max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
