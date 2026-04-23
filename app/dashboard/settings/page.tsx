"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Bell, Shield, Globe, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black mb-1">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="mb-3 block">Theme</Label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  mounted && theme === t.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <t.icon className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">{t.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            email: "Email notifications",
            push: "Push notifications",
            marketing: "Marketing emails",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-muted-foreground">
                  Receive {label.toLowerCase()} from Nexus
                </div>
              </div>
              <button
                onClick={() => {
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key as keyof typeof notifications],
                  });
                  toast.success("Preference saved");
                }}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifications[key as keyof typeof notifications]
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[key as keyof typeof notifications]
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Change password</div>
              <div className="text-xs text-muted-foreground">
                Update your account password
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Two-factor authentication</div>
              <div className="text-xs text-muted-foreground">
                Add an extra layer of security
              </div>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-4 h-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Delete account</div>
              <div className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </div>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
