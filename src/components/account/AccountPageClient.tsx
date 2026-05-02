"use client";

import * as React from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  UserCircle, 
  History,
  TrendingUp,
  Layers3,
  Download,
  Wallet,
  ArrowDownToLine,
  Eye,
  CreditCard,
  ShoppingBag,
  PackageCheck,
  Printer,
  Sparkles
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
  History,
  Layers3,
  Download,
  Wallet,
  ArrowDownToLine,
  Eye,
  CreditCard,
  ShoppingBag,
  PackageCheck,
  Printer,
  Sparkles,
};
import { AccountTabs } from "./AccountTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { AccountProfileForm } from "./AccountProfileForm";
import { AccountSecurityForm } from "./AccountSecurityForm";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Metric = {
  label: string;
  value: string;
  iconName: keyof typeof ICON_MAP;
};

type ModelData = {
  id: string;
  title: string;
  thumbnail: string | null;
  downloads: number;
  likes: number;
  createdAt: Date;
  fileUrl?: string | null;
};

type OrderItemData = {
  id: string;
  type: string;
  model: ModelData;
};

type OrderData = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: OrderItemData[];
};

type UserData = {
  id: string;
  role: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  models: ModelData[];
  orders: OrderData[];
};

type ActivityItem = {
  id: string;
  title?: string;
  totalAmount?: number;
  status?: string;
  formattedDate: string;
  createdAt: Date;
};

type AccountPageClientProps = {
  user: UserData;
  metrics: Metric[];
};

export function AccountPageClient({ user, metrics }: AccountPageClientProps) {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate content when activeTab changes
    gsap.fromTo(
      ".tab-content > *", 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, { dependencies: [activeTab], scope: container });

  const purchasedAssets = React.useMemo(() => {
    const assets: { id: string; title: string; thumbnail: string; fileUrl: string; purchasedAt: Date }[] = [];
    user.orders?.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.type === "DIGITAL" && item.model) {
          assets.push({
            id: item.model.id,
            title: item.model.title,
            thumbnail: item.model.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800",
            fileUrl: item.model.fileUrl || "#",
            purchasedAt: order.createdAt,
          });
        }
      });
    });
    return assets;
  }, [user.orders]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Identity", icon: UserCircle },
    { id: "assets", label: user.role === "CREATOR" ? "Revenue" : "My Vault", icon: user.role === "CREATOR" ? Wallet : ArrowDownToLine },
    { id: "orders", label: user.role === "CREATOR" ? "My Models" : "History", icon: user.role === "CREATOR" ? Layers3 : History },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-10" ref={container}>
      <AccountTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
      <div className="tab-content">
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl group hover:border-primary/40 transition-all duration-500 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{metric.label}</p>
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                       {React.createElement(ICON_MAP[metric.iconName], { className: "h-5 w-5 text-primary" })}
                    </div>
                  </div>
                  <p className="mt-4 text-4xl font-black text-white tracking-tight">{metric.value}</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 w-fit px-2 py-1 rounded-full border border-emerald-500/10">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% Performance
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-3xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                   System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="space-y-0.5">
                     <p className="text-xs font-black text-white uppercase tracking-wider">Prisma Engine</p>
                     <p className="text-[10px] text-slate-500 font-medium">Node.js High-Performance ORM</p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 uppercase">Connected</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 border border-white/5 hover:bg-white/[0.05] transition-colors">
                   <div className="space-y-0.5">
                     <p className="text-xs font-black text-white uppercase tracking-wider">Supabase Node</p>
                     <p className="text-[10px] text-slate-500 font-medium">PostgreSQL Persistence Layer</p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded bg-primary/10 text-primary uppercase">Synchronized</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-3xl overflow-hidden">
               <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.01]">
                  <CardTitle className="text-xl font-black">Internal Logs</CardTitle>
               </CardHeader>
               <CardContent className="p-6 font-mono text-[11px] text-slate-400 space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                  <div className="flex gap-3">
                     <span className="text-primary/50 font-black whitespace-nowrap">14:23:12</span>
                     <p>[INFO] Session token refreshed for UID:{user.id.slice(0,6)}</p>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-emerald-500/50 font-black whitespace-nowrap">14:24:01</span>
                     <p>[SUCCESS] Seeded 15 new high-poly models to inventory</p>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-primary/50 font-black whitespace-nowrap">14:25:45</span>
                     <p>[INFO] Simulated Webhook ping from Checkout: 200 OK</p>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-orange-500/50 font-black whitespace-nowrap">14:28:10</span>
                     <p>[WARN] Hydration latency above 45ms (Check SSR boundaries)</p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "assets" && (
        <div className="space-y-6">
          {user.role === "CREATOR" ? (
            <Card className="border-white/10 bg-white/[0.03] overflow-hidden">
               <CardHeader className="bg-primary/5 border-b border-white/5">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-2xl font-black">Revenue Analytics</CardTitle>
                        <CardDescription>Track your earnings across digital and physical sales.</CardDescription>
                     </div>
                     <Button className="rounded-xl bg-white text-black hover:bg-slate-200">Withdraw Funds</Button>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="p-8 flex items-center justify-center min-h-[300px] border-b border-white/5 bg-[radial-gradient(circle_at_center,rgba(250,104,49,0.05),transparent)]">
                     <div className="w-full h-48 flex items-end gap-2">
                        {[40, 70, 45, 90, 65, 80, 50, 100, 85, 95, 60, 75].map((h, i) => (
                           <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group" style={{ height: `${h}%` }}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 100}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-white/5">
                     <div className="p-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Sales</p>
                        <p className="mt-1 text-xl font-black">124</p>
                     </div>
                     <div className="p-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross Revenue</p>
                        <p className="mt-1 text-xl font-black">₹48,200</p>
                     </div>
                     <div className="p-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Earning</p>
                        <p className="mt-1 text-xl font-black text-emerald-500">₹40,970</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black tracking-tight">Your Digital Vault</h2>
                 <p className="text-xs font-bold text-slate-500">{purchasedAssets.length} models owned</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                 {purchasedAssets.length > 0 ? purchasedAssets.map(asset => (
                   <Card key={asset.id} className="border-white/5 bg-white/[0.02] backdrop-blur-xl group overflow-hidden rounded-3xl hover:border-primary/30 transition-all duration-500">
                      <div className="relative aspect-video overflow-hidden">
                        <Image 
                          src={asset.thumbnail} 
                          alt={asset.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-primary border border-white/10">Owned</div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute bottom-4 right-4 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/40 active:scale-90 transition-all"
                          onClick={() => window.open(asset.fileUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-5">
                         <h3 className="font-black text-white truncate text-lg">{asset.title}</h3>
                         <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secured in Vault</p>
                            <p className="text-[10px] font-bold text-slate-400">{new Date(asset.purchasedAt).toLocaleDateString()}</p>
                         </div>
                      </CardContent>
                   </Card>
                 )) : (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                      <div className="bg-white/5 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Download className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="font-black text-xl text-white">Your vault is currently empty</p>
                      <p className="text-slate-500 text-sm mt-1">Acquire digital models to see them here.</p>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-3xl font-black">{user.role === "CREATOR" ? "Design Repository" : "Transaction History"}</CardTitle>
            <CardDescription className="text-slate-400 font-medium tracking-wide">Secure tracking for all your Melted Modulus {user.role === "CREATOR" ? "publications" : "acquisitions"}.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             {user.role === "CREATOR" ? (
               user.models.map((model) => (
                 <div key={model.id} className="flex items-center gap-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.05] hover:border-primary/20 group">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                       <Image 
                        src={model.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=200"} 
                        alt={model.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110" 
                       />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-black text-white text-lg truncate group-hover:text-primary transition-colors">{model.title}</p>
                       <div className="flex gap-6 mt-2">
                          <div className="flex items-center gap-1.5">
                             <Download className="h-3 w-3 text-slate-500" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{model.downloads} <span className="text-slate-600">DL</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Sparkles className="h-3 w-3 text-primary" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{model.likes} <span className="text-slate-600">Stars</span></span>
                          </div>
                       </div>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 hover:bg-primary hover:text-white transition-all"><Eye className="h-4 w-4" /></Button>
                 </div>
               ))
             ) : (
               user.orders.map((order) => (
                  <div key={order.id} className="rounded-[2rem] border border-white/5 bg-white/[0.01] p-8 space-y-6 hover:bg-white/[0.03] transition-colors relative group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">ID: {order.id.slice(0, 12)}</span>
                              <div className="h-1 w-1 rounded-full bg-slate-700" />
                              <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-2xl font-black text-white">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">{order.status}</span>
                           <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">Details</Button>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                        {order.items?.map((item) => (
                           <div key={item.id} className="group/item relative h-14 w-14 rounded-2xl overflow-hidden border border-white/10 bg-black/40 hover:border-primary/40 transition-all cursor-help" title={item.model?.title}>
                              <Image 
                                src={item.model?.thumbnail || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=100"} 
                                alt={item.model?.title || "Model thumbnail"}
                                fill
                                className="object-cover transition-opacity group-hover/item:opacity-60" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                 <Eye className="h-4 w-4 text-white" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))
             )}
          </CardContent>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-white/5 p-8">
            <CardTitle className="text-3xl font-black">Identity Management</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Control your public creator brand and digital presence across the Melted Modulus ecosystem.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <AccountProfileForm 
              name={user.name || ""} 
              email={user.email || ""} 
              image={user.image}
              bio={user.bio}
              website={user.website}
              twitter={user.twitter}
              instagram={user.instagram}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-xl">Security & Safety</CardTitle>
            <CardDescription>Manage credentials and connected device sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AccountSecurityForm />
            
            <div className="pt-6 border-t border-white/5 space-y-4">
               <h3 className="text-sm font-bold flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Saved Payment Methods</h3>
               <div className="p-4 rounded-2xl border border-white/5 bg-black/20 text-xs text-slate-500 text-center">
                  Simulated Purchases. No cards on file.
               </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
      </AccountTabs>
    </div>
  );
}
