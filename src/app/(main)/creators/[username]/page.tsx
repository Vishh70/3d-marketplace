import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, CircleUserRound, Download, Heart, MapPin, Share2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ModelGrid } from "@/components/models/ModelGrid";
import { type ModelData } from "@/data/mock";

type CreatorPageProps = {
  params: { username: string };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatPrice(value: number | null | undefined) {
  if (!value || value === 0) return 0;
  return value;
}

function mapModels(models: Awaited<ReturnType<typeof prisma.model3D.findMany>>, authorName: string): ModelData[] {
  return models.map((model) => ({
    id: model.id,
    title: model.title,
    description: model.description || "",
    thumbnail: model.thumbnail || "",
    author: {
      name: authorName,
      avatar: undefined,
      verified: true,
    },
    stats: {
      downloads: model.downloads,
      likes: model.likes,
    },
    price: {
      digital: formatPrice(model.priceDigital),
      physical: model.pricePhysical ?? undefined,
    },
    fileUrl: model.fileUrl || undefined,
    materials: model.materials ? model.materials.split(",").filter(Boolean) : undefined,
    badges: model.badges ? model.badges.split(",").filter(Boolean) : undefined,
    isGif: model.isGif,
  }));
}

export default async function CreatorProfilePage({ params }: CreatorPageProps) {
  const { username } = params;
  const decoded = decodeURIComponent(username);

  const creators = await prisma.user.findMany({
    where: { role: "CREATOR" },
    include: {
      orders: {
        select: { id: true },
      },
      models: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const creator = creators.find((user) => user.id === decoded || user.name === decoded || slugify(user.name || "") === slugify(decoded));

  if (!creator) {
    notFound();
  }

  const models = mapModels(creator.models, creator.name || "Creator");
  const totalDownloads = creator.models.reduce((sum, model) => sum + model.downloads, 0);
  const totalLikes = creator.models.reduce((sum, model) => sum + model.likes, 0);
  const latestModel = creator.models[0];
  const creatorHandle = slugify(creator.name || creator.id) || creator.id.slice(0, 8);
  const publicHandle = `@${creatorHandle}`;
  const about =
    creator.role === "CREATOR"
      ? "Creator profile synced from the private account data. This is the public-facing version of the same identity, models, and metrics."
      : "Public account profile.";

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20">
        <div className="h-56 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_25%),linear-gradient(135deg,rgba(255,115,0,0.95),rgba(0,0,0,0.5))]" />
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.45))]" />

        <div className="-mt-20 px-6 pb-8 md:-mt-24 md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-end">
              <div className="relative shrink-0 rounded-full border border-white/10 bg-black/30 p-2">
                <Avatar
                  src={creator.image || undefined}
                  fallback={(creator.name || "CR").slice(0, 2).toUpperCase()}
                  size="xl"
                  className="h-28 w-28 md:h-36 md:w-36"
                  verified
                />
                <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-background p-1">
                  <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" />
                </div>
              </div>

              <div className="space-y-4 text-center md:text-left">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/80">
                    Public creator profile
                  </p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">
                    {creator.name || "Creator"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    {about}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-slate-200">
                    <CircleUserRound className="h-4 w-4 text-primary" />
                    {publicHandle}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-slate-200">
                    <MapPin className="h-4 w-4 text-primary" />
                    India
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-slate-200">
                    <Share2 className="h-4 w-4 text-primary" />
                    {creator.emailVerified ? "Verified creator" : "Profile synced"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/account`}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-background px-5 font-bold text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                Edit account
              </Link>
              <Button className="h-12 rounded-xl bg-primary px-5 font-bold text-white hover:bg-primary/90">
                Follow
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
          <div className="p-4 text-center">
            <div className="font-black text-2xl text-white">{creator.models.length}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Models</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-black text-2xl text-white">{creator.orders.length}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Orders</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-black text-2xl text-white">{totalDownloads.toLocaleString()}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Downloads</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-black text-2xl text-white">{totalLikes.toLocaleString()}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Likes</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-2xl">Models</CardTitle>
            <CardDescription>Live public models mirrored from the creator account.</CardDescription>
          </CardHeader>
          <CardContent>
            {models.length > 0 ? (
              <ModelGrid models={models} hasMore={false} showControls={false} />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-slate-400">
                No public models yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-2xl">About</CardTitle>
              <CardDescription>Mirrors the creator identity from the private account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-300">
                {creator.role === "CREATOR"
                  ? "This creator specializes in functional, print-friendly designs with a clean industrial aesthetic."
                  : "Public account profile."}
              </p>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Current name</p>
                  <p className="mt-2 text-sm font-bold text-slate-200">{creator.name || "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Avatar</p>
                  <p className="mt-2 text-sm font-bold text-slate-200">
                    {creator.image ? "Custom image set" : "Default initials"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Verified</p>
                  <p className="mt-2 text-sm font-bold text-slate-200">
                    {creator.emailVerified ? `Since ${formatDate(creator.emailVerified)}` : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-2xl">Recent activity</CardTitle>
              <CardDescription>Latest items tied to this public creator profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestModel ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{latestModel.title}</p>
                      <p className="mt-1 text-sm text-slate-500">Added {formatDate(latestModel.createdAt)}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>{latestModel.downloads} downloads</p>
                      <p>{latestModel.likes} likes</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-slate-400">
                  No recent public activity yet.
                </div>
              )}
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-white">Public sync</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  This page mirrors the creator&apos;s editable profile data and their published model list from the private account dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Public profile last synced from account data on {formatDate(new Date())}
          <Download className="h-4 w-4 text-primary" />
          {creator.models.length} published models
          <Heart className="h-4 w-4 text-primary" />
          {totalLikes.toLocaleString()} public likes
        </div>
      </div>
    </div>
  );
}
