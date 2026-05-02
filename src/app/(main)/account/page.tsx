import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountPageClient } from "@/components/account/AccountPageClient";
import { CalendarDays, ShoppingBag, PackageCheck, ShieldCheck, Layers3, Printer, Sparkles } from "lucide-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      models: {
        select: {
          id: true,
          title: true,
          downloads: true,
          likes: true,
          createdAt: true,
          thumbnail: true,
        },
      },
      orders: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  // Manually fetch items for each order to bypass stale client include validation
  const ordersWithItems = await Promise.all(
    user.orders.map(async (order) => {
      const items = await (prisma as any).orderItem.findMany({
        where: { orderId: order.id },
        include: { model: true },
      });
      return { ...order, items };
    })
  );

  // Re-assign orders with items for the client component
  const userWithOrders = { ...user, orders: ordersWithItems };

  const totalDownloads = userWithOrders.models.reduce((sum, model) => sum + model.downloads, 0);
  const totalLikes = userWithOrders.models.reduce((sum, model) => sum + model.likes, 0);
  const totalSpent = userWithOrders.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const roleLabel =
    userWithOrders.role === "ADMIN" ? "Administrator" : userWithOrders.role === "CREATOR" ? "Creator" : "Customer";

  const metrics =
    userWithOrders.role === "CREATOR"
      ? [
          { label: "Published Models", value: String(userWithOrders.models.length), iconName: "Layers3" as const },
          { label: "Total Downloads", value: totalDownloads.toLocaleString(), iconName: "Printer" as const },
          { label: "Community Likes", value: totalLikes.toLocaleString(), iconName: "Sparkles" as const },
          { label: "Account Status", value: "Verified", iconName: "ShieldCheck" as const },
        ]
      : [
          { label: "Total Orders", value: String(userWithOrders.orders.length), iconName: "ShoppingBag" as const },
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, iconName: "PackageCheck" as const },
          { label: "Saved Models", value: "0", iconName: "Sparkles" as const },
          { label: "Account Role", value: roleLabel, iconName: "ShieldCheck" as const },
        ];

  const latestActivity = userWithOrders.role === "CREATOR" 
    ? userWithOrders.models.map(m => ({ ...m, formattedDate: formatDate(m.createdAt) }))
    : userWithOrders.orders.map(o => ({ ...o, formattedDate: formatDate(o.createdAt) }));

  return (
    <div className="relative min-h-screen bg-background pb-20">
      {/* Visual Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,104,49,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 md:px-6">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <ShieldCheck className="h-3 w-3" />
              Secure Dashboard
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Hello, <span className="text-primary">{user.name?.split(" ")[0] || "User"}</span>
            </h1>
            <p className="text-slate-400 max-w-xl font-medium">
              Manage your 3D models, track your orders, and customize your creator profile from one centralized hub.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
             <CalendarDays className="h-4 w-4 text-primary" />
             {formatDate(new Date())}
          </div>
        </div>

        {/* Client Dashboard Component */}
        <AccountPageClient 
          user={userWithOrders as any} 
          metrics={metrics} 
          latestActivity={latestActivity.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)}
          roleLabel={roleLabel}
        />
      </div>
    </div>
  );
}
