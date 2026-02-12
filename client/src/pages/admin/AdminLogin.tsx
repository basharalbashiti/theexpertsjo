import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useAdminLang } from "@/hooks/useAdminLang";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin");
    },
    onError: (err: Error) => {
      setError(err.message || t("login_failed"));
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      setLocation("/admin");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={lang === "AR" ? "rtl" : "ltr"}>
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" dir={lang === "AR" ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">{t("admin_login")}</CardTitle>
          <CardDescription>{t("sign_in_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                data-testid="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("enter_username")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enter_password")}
                required
              />
            </div>
            {error && (
              <p data-testid="text-login-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              data-testid="button-login"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t("signing_in") : t("sign_in")}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              data-testid="button-login-lang-toggle"
              onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
              className="text-xs text-neutral-500 hover:text-neutral-700 underline"
            >
              {lang === "EN" ? "العربية" : "English"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
