"use client";

import { Save, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Admin settings</h1>
            <p className="text-slate-500">Control marketplace visibility, moderation, and access rules.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Guest access</p>
            <p className="text-sm text-slate-300">Guests can browse with limited source access.</p>
            <Button variant="outline" className="h-11 gap-2 rounded-xl border-white/10 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Review access
            </Button>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Marketplace moderation</p>
            <p className="text-sm text-slate-300">
              Approve uploads, remove stale listings, and keep the catalog clean.
            </p>
            <Button className="h-11 gap-2 rounded-xl bg-primary font-bold text-white hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
