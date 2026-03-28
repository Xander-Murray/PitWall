import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface ExampleData {
  message: string;
  user_id: string;
  email: string;
  data: { id: number; value: string }[];
}

export function DashboardPage() {
  const { user, session } = useAuth();
  const [apiData, setApiData] = useState<ExampleData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) return;
      try {
        const res = await fetch(`${apiUrl}/api/example`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApiData(await res.json());
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  }, [session]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Signed in via Supabase Auth</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="text-muted-foreground">Email: </span>
            {user?.email}
          </p>
          <p className="text-sm mt-1">
            <span className="text-muted-foreground">User ID: </span>
            <code className="text-xs">{user?.id}</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backend response</CardTitle>
          <CardDescription>
            Result of <code className="text-xs">GET /api/example</code> with your JWT
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError ? (
            <p className="text-sm text-destructive">Error: {apiError}</p>
          ) : apiData ? (
            <pre className="text-xs bg-muted rounded-md p-4 overflow-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">Calling backend...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
