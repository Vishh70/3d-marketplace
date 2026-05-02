"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, Globe, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type AccessMode = "guest" | "customer" | "admin";

const MODE_DETAILS: Record<
  AccessMode,
  { title: string; description: string; accent: string; helper: string }
> = {
  guest: {
    title: "Continue as Guest",
    description: "Browse the catalog with limited source access and no account required.",
    accent: "border-white/10 bg-white/[0.03]",
    helper: "Best for quick browsing and previews."
  },
  customer: {
    title: "Customer Login",
    description: "Sign in to unlock your full customer account and saved activity.",
    accent: "border-primary/40 bg-primary/10",
    helper: "Use this for normal shopping and custom print orders."
  },
  admin: {
    title: "Admin Login",
    description: "Open the admin panel to manage products, uploads, and marketplace content.",
    accent: "border-amber-400/40 bg-amber-400/10",
    helper: "Admin accounts are routed to the control panel."
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AccessMode>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const callbackUrl = searchParams.get("callbackUrl");

  const persistAccessMode = (nextMode: AccessMode) => {
    window.localStorage.setItem("makerverse:access-mode", nextMode);
  };

  const getSafeCallbackUrl = () => {
    if (!callbackUrl) return null;
    return callbackUrl.startsWith("/") ? callbackUrl : null;
  };

  const handleGuest = () => {
    persistAccessMode("guest");
    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role ?? "USER";

      if (mode === "admin" && role !== "ADMIN") {
        setError("This account is not an admin account. Please use an admin login.");
        return;
      }

      if (mode === "guest") {
        persistAccessMode("guest");
        router.push("/");
        router.refresh();
        return;
      }

      const safeCallbackUrl = getSafeCallbackUrl();

      if (safeCallbackUrl) {
        persistAccessMode(role === "ADMIN" ? "admin" : "customer");
        router.push(safeCallbackUrl);
        router.refresh();
        return;
      }

      if (role === "ADMIN") {
        persistAccessMode("admin");
        router.push("/admin");
      } else {
        persistAccessMode("customer");
        router.push("/");
      }

      router.refresh();
    } catch {
      setError("An error occurred while signing in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-5xl space-y-8"
    >
      <div className="text-center space-y-2 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4"
        >
          <Globe className="h-3 w-3" /> Secure Access Portal
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Imagine. <span className="text-primary">Inspire.</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto font-medium">
          Join India&apos;s premier community of makers, designers, and industrial innovators.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {(Object.keys(MODE_DETAILS) as AccessMode[]).map((item, i) => {
          const detail = MODE_DETAILS[item];
          const active = mode === item;
          return (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              type="button"
              onClick={() => setMode(item)}
              className={cn(
                "group relative rounded-[32px] border p-6 text-left transition-all duration-500",
                active 
                  ? `${detail.accent} shadow-2xl shadow-primary/20 ring-1 ring-white/20 scale-[1.02]` 
                  : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 group-hover:text-primary transition-colors">
                    Path {i + 1}
                  </p>
                  <h3 className="text-xl font-black text-white">{detail.title}</h3>
                </div>
                <div className={cn(
                  "rounded-2xl border border-white/10 p-3 text-white transition-transform duration-500",
                  active ? "bg-primary rotate-12" : "bg-black/40 group-hover:rotate-6"
                )}>
                  {item === "guest" ? <Globe className="h-5 w-5" /> : item === "admin" ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 font-medium">{detail.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{detail.helper}</span>
                {active && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Card className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-[40px] shadow-2xl shadow-black overflow-hidden relative group/card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="space-y-4 text-center pb-8 pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-black/40 text-primary shadow-inner">
              {mode === "guest" ? <Globe className="h-7 w-7" /> : mode === "admin" ? <ShieldCheck className="h-7 w-7" /> : <BadgeCheck className="h-7 w-7" />}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black tracking-tight text-white">
                {mode === "guest" ? "Guest Access" : mode === "admin" ? "Admin Auth" : "Sign In"}
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                {mode === "guest"
                  ? "Limited catalog preview mode."
                  : mode === "admin"
                    ? "Enterprise-level control panel."
                    : "Access your maker dashboard."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <AnimatePresence mode="wait">
              {mode === "guest" ? (
                <motion.div
                  key="guest"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-xs leading-relaxed text-slate-400 font-medium">
                    Browsing as a guest allows you to view our collection but restricts source file downloads and creator collaborations.
                  </div>
                  <Button
                    type="button"
                    className="h-14 w-full rounded-2xl bg-primary font-black text-white hover:bg-primary/90 shadow-xl shadow-primary/20 group/btn"
                    onClick={handleGuest}
                  >
                    UNSET ACCESS LOCK
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="auth"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold py-3 px-4 rounded-xl text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1" htmlFor="email">
                      Identify
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      placeholder="m@meltedmodulus.in" 
                      type="email" 
                      required 
                      className="h-14 bg-black/40 border-white/10 rounded-2xl px-5 focus:ring-primary focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500" htmlFor="password">
                        Passkey
                      </label>
                      <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">
                        Recover?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      className="h-14 bg-black/40 border-white/10 rounded-2xl px-5 focus:ring-primary focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="h-14 w-full mt-4 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" 
                    disabled={loading}
                  >
                    {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-[#0b0b0b] px-4 text-slate-600">Cross-Platform Sync</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <Globe className="h-4 w-4" /> Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <ShieldCheck className="h-4 w-4" /> GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-white/5 p-8 bg-black/20">
            <p className="text-center text-xs text-slate-500 font-medium">
              New to the verse?{" "}
              <Link href="/register" className="font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest ml-1">
                Initialize Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#050505]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-12 h-12 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}
