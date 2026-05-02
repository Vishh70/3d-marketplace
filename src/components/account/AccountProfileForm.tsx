"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, PencilLine, RotateCcw, Save, Loader2, Globe, Link2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

type AccountProfileFormProps = {
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
};

export function AccountProfileForm({ 
  name, 
  email, 
  image, 
  bio: initialBio, 
  website: initialWebsite, 
  twitter: initialTwitter, 
  instagram: initialInstagram 
}: AccountProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = React.useState(name);
  const [avatarUrl, setAvatarUrl] = React.useState(image ?? "");
  const [bio, setBio] = React.useState(initialBio ?? "");
  const [website, setWebsite] = React.useState(initialWebsite ?? "");
  const [twitter, setTwitter] = React.useState(initialTwitter ?? "");
  const [instagram, setInstagram] = React.useState(initialInstagram ?? "");
  
  const [status, setStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setDisplayName(name);
    setAvatarUrl(image ?? "");
    setBio(initialBio ?? "");
    setWebsite(initialWebsite ?? "");
    setTwitter(initialTwitter ?? "");
    setInstagram(initialInstagram ?? "");
    setStatus("idle");
    setMessage("");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatus("error");
      setMessage("Avatar image must be less than 2MB");
      return;
    }

    setIsUploading(true);
    setStatus("idle");
    setMessage("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatars/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      setStatus("success");
      setMessage("Avatar uploaded! Save changes to finalize.");
    } catch (error) {
      console.error("Avatar upload error:", error);
      setStatus("error");
      setMessage("Failed to upload avatar image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          image: avatarUrl.trim(),
          bio: bio.trim(),
          website: website.trim(),
          twitter: twitter.trim(),
          instagram: instagram.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to update account");

      setStatus("success");
      setMessage(payload.message || "Account updated successfully");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update account");
    }
  };

  const isDirty = 
    displayName !== name || 
    avatarUrl !== (image ?? "") || 
    bio !== (initialBio ?? "") || 
    website !== (initialWebsite ?? "") ||
    twitter !== (initialTwitter ?? "") ||
    instagram !== (initialInstagram ?? "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="group relative">
          <div className="relative h-28 w-28 overflow-hidden rounded-[32px] border-2 border-white/10 bg-black/40">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-black text-slate-600">
                {(displayName || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <Camera className="h-6 w-6 text-white" />}
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Display name</label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your public name" className="h-12 rounded-2xl bg-black/30 px-4" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Email (Read-only)</label>
              <Input value={email} readOnly className="h-12 rounded-2xl bg-black/20 px-4 text-slate-500 cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Creator Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell the world about your designs..."
              className="w-full min-h-[100px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-primary transition-all text-sm resize-none outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
             <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <Globe className="h-3 w-3" /> Website
                </label>
                <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="h-11 rounded-xl bg-black/30" />
             </div>
             <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <AtSign className="h-3 w-3" /> Twitter
                </label>
                <Input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="@handle" className="h-11 rounded-xl bg-black/30" />
             </div>
             <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <Link2 className="h-3 w-3" /> Instagram
                </label>
                <Input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@handle" className="h-11 rounded-xl bg-black/30" />
             </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${status === "error" ? "border-red-500/20 bg-red-500/10 text-red-200" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row pt-2 border-t border-white/5 mt-6">
        <Button
          type="submit"
          disabled={!isDirty || status === "saving" || isUploading}
          className="h-12 rounded-xl bg-primary px-8 font-black text-white hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all active:scale-95"
        >
          <Save className="mr-2 h-4 w-4" />
          {status === "saving" ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} className="h-12 rounded-xl border-white/10 px-6 font-bold transition-all hover:bg-white/5">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 sm:ml-auto">
          <PencilLine className="h-4 w-4 text-primary" />
          Last active: Just now
        </div>
      </div>
    </form>
  );
}
