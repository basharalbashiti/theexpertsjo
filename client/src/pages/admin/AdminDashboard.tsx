import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentEditor from "./ContentEditor";
import PartnerManager from "./PartnerManager";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin/login");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Logged in as {user?.username}</p>
        </div>
        <Button
          variant="outline"
          data-testid="button-logout"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
            <TabsTrigger value="partners" data-testid="tab-partners">Partners</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="partners">
            <PartnerManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold">Account Settings</h3>
              <p className="text-muted-foreground">
                Username: <span className="font-medium text-foreground">{user?.username}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Account management features coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
