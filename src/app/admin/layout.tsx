"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Box } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [router, session?.user?.role, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-slate-300">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-slate-300">
          Redirecting to login...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Box className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tighter uppercase">MAKER<span className="text-primary">VERSE</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md">
          <h2 className="font-bold text-lg">Admin Control Panel</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Verse Admin</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/20" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
