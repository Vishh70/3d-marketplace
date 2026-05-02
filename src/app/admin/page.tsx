"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, PackagePlus, Trash2, Users, ShoppingBag, Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type ModelItem = {
  id: string;
  title: string;
  price?: { digital?: number; physical?: number };
  stats?: { downloads?: number; likes?: number };
  author?: { name?: string };
};

export default function AdminDashboardPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await fetch("/api/models?limit=20", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Unable to load products");
        }
        setModels(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    void loadModels();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/models", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }
      setModels((current) => current.filter((model) => model.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-primary/15 via-white/[0.03] to-transparent p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Admin access
            </div>
            <h1 className="text-4xl font-black tracking-tighter md:text-5xl">
              Manage products, uploads, and marketplace access
            </h1>
            <p className="max-w-2xl text-slate-400">
              Use this dashboard to add products, review the latest uploads, and remove listings when needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              <PackagePlus className="h-4 w-4" />
              Add product
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white transition hover:bg-white/5"
            >
              <ShoppingBag className="h-4 w-4" />
              View orders
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Product count</p>
              <p className="mt-2 text-3xl font-black text-white">{loading ? "..." : models.length}</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Access level</p>
              <p className="mt-2 text-3xl font-black text-white">Full</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Admin tools</p>
              <p className="mt-2 text-3xl font-black text-white">Delete + add</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="rounded-[28px] border-white/10 bg-white/[0.02]">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Recent products</h2>
                <p className="text-sm text-slate-500">Delete any listing directly from the dashboard.</p>
              </div>
              <Settings2 className="h-5 w-5 text-primary" />
            </div>

            {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}

            <div className="space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-slate-400">
                  Loading products...
                </div>
              ) : models.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-slate-400">
                  No products found yet. Use Add product to start a new listing.
                </div>
              ) : (
                models.map((model) => (
                  <div key={model.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">{model.title}</p>
                        <p className="text-sm text-slate-500">
                          By {model.author?.name ?? "Unknown"} · {model.stats?.downloads ?? 0} downloads · {model.stats?.likes ?? 0} likes
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="h-11 gap-2 rounded-xl border-rose-500/20 font-bold text-rose-200 hover:border-rose-400/40 hover:text-white"
                        onClick={() => handleDelete(model.id)}
                        disabled={deletingId === model.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === model.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/10 bg-white/[0.02]">
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Quick actions</h2>
              <p className="text-sm text-slate-500">Jump into the most common admin tasks.</p>
            </div>

            <div className="space-y-3">
              <Link href="/upload" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-primary/40">
                  <div>
                    <p className="font-bold text-white">Add a product</p>
                    <p className="text-sm text-slate-500">Open the upload flow and create a new listing.</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
              <Link href="/admin/orders" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-primary/40">
                  <div>
                    <p className="font-bold text-white">Review orders</p>
                    <p className="text-sm text-slate-500">Check incoming order activity and statuses.</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
              <Link href="/admin/settings" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-primary/40">
                  <div>
                    <p className="font-bold text-white">Admin settings</p>
                    <p className="text-sm text-slate-500">Adjust platform-level controls and preferences.</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
              <Link href="/admin/users" className="block">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-primary/40">
                  <div>
                    <p className="font-bold text-white">User management</p>
                    <p className="text-sm text-slate-500">Review customer and creator accounts.</p>
                  </div>
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
