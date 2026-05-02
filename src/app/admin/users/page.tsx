"use client";

import { ShieldCheck, UserCog, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const USERS = [
  { name: "Datta", role: "ADMIN", email: "admin@makerverse.local" },
  { name: "Rahul Sharma", role: "USER", email: "rahul@example.com" },
  { name: "Priya V", role: "CREATOR", email: "priya@example.com" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">User management</h1>
            <p className="text-slate-500">Review customer, creator, and admin accounts.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Admins</p>
            <p className="mt-2 text-3xl font-black">1</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Creators</p>
            <p className="mt-2 text-3xl font-black">1</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Customers</p>
            <p className="mt-2 text-3xl font-black">1</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="space-y-4 p-6">
          {USERS.map((user) => (
            <div
              key={user.email}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                  {user.role}
                </span>
                <Button variant="outline" className="h-10 gap-2 rounded-xl border-white/10 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  Review
                </Button>
              </div>
            </div>
          ))}
          <Button className="h-12 gap-2 rounded-xl bg-primary font-bold text-white hover:bg-primary/90">
            <UserPlus className="h-4 w-4" />
            Invite user
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
