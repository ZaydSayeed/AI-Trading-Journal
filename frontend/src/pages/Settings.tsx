import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Key, Moon, Sun } from "lucide-react";
import { getTheme, setTheme } from "@/api/settings";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load theme on mount
    const loadTheme = async () => {
      try {
        // Try to get theme from backend
        const theme = await getTheme();
        setCurrentTheme(theme);
        
        // Also check localStorage as fallback
        const localTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (localTheme && localTheme !== theme) {
          // If localStorage has different theme, use it and sync to backend
          setCurrentTheme(localTheme);
          await saveTheme(localTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to localStorage
        const localTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (localTheme) {
          setCurrentTheme(localTheme);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const saveTheme = async (theme: "dark" | "light") => {
    try {
      // Save to backend
      await setTheme(theme);
      
      // Also save to localStorage as backup
      localStorage.setItem("theme", theme);
      
      setCurrentTheme(theme);
      
      toast({
        variant: "success",
        title: "Theme Updated",
        description: `Theme changed to ${theme} mode`,
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      // Fallback: just save to localStorage
      localStorage.setItem("theme", theme);
      setCurrentTheme(theme);
      
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Theme saved locally. Backend sync failed.",
      });
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setSaving(true);
    await saveTheme(newTheme);
    setSaving(false);
  };

  return (
    <PageWrapper>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              API keys and integrations (managed by backend)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Backend API</Label>
              <Input
                value="http://127.0.0.1:8000"
                disabled
                className="opacity-50 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                API endpoint is configured in the application
              </p>
            </div>
            <div className="space-y-2">
              <Label>AI Service</Label>
              <Input
                value="Groq / Llama-3 (Backend Managed)"
                disabled
                className="opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                AI service is configured on the backend
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentTheme === "dark" ? (
                  <Moon className="h-5 w-5 text-neon-cyan" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    {currentTheme === "dark" ? "Dark mode" : "Light mode"} (Currently {currentTheme === "dark" ? "enabled" : "not fully supported"})
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleThemeToggle}
                disabled={loading || saving}
                className="min-w-[100px]"
              >
                {loading ? (
                  "Loading..."
                ) : saving ? (
                  "Saving..."
                ) : (
                  <>
                    {currentTheme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your trades
                </p>
              </div>
              <Button variant="outline" disabled className="opacity-50">
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-refresh Dashboard</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh dashboard data
                </p>
              </div>
              <Button variant="outline" disabled className="opacity-50">
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
