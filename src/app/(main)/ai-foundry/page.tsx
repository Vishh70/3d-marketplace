"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  Box,
  Cpu,
  Terminal,
  CheckCircle2,
  Download,
  ArrowRight,
  Info,
  Layers3,
  Scan,
  Cuboid,
  Wand2,
  ShieldCheck,
  FileDown,
  Gauge,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FoundryStlPreview } from "@/components/ai/FoundryStlPreview";
import type { FoundryReconstructionMode } from "@/lib/foundry";

type PipelineStage = "idle" | "queued" | "point-cloud" | "meshing" | "cleaning" | "stl" | "complete" | "failed";
type ViewKey = "front" | "side" | "back" | "top";

const PIPELINE_STEPS = [
  {
    title: "1. Input Image",
    tools: ["PNG", "JPG", "Simple backgrounds"],
    output: "Clean image reference",
    description: "Use a front view plus side, back, and top views when possible. One image still works, but only as relief fallback."
  },
  {
    title: "2. Polarity Check",
    tools: ["Sharp", "Histogram", "Background detection"],
    output: "Foreground polarity",
    description: "The backend decides whether the subject is brighter or darker than the background for each uploaded view."
  },
  {
    title: "3. Shape Reconstruction",
    tools: ["Relief map", "Voxel carving"],
    output: "Printable shell",
    description: "Single-view uploads become reliefs. Multi-view uploads carve a fuller 3D shell from silhouettes."
  },
  {
    title: "4. Cleanup",
    tools: ["Mesh repair", "Watertight shell", "Thickness"],
    output: "Watertight mesh",
    description: "The relief is sealed into a printable shell with a stable base and minimum wall thickness."
  },
  {
    title: "5. STL Export",
    tools: ["STL", "Cura", "PrusaSlicer"],
    output: "STL file",
    description: "The printable relief is exported as STL for slicing and print validation."
  }
] as const;

const FREE_STACK = [
  {
    icon: Scan,
    title: "Sharp",
    description: "Used to decode the uploaded image, resize it, flatten it, and prepare the grayscale signal."
  },
  {
    icon: Cuboid,
    title: "Contour relief",
    description: "Turns brightness and edges into a printable height field instead of a fake 3D guess."
  },
  {
    icon: Layers3,
    title: "Mesh repair",
    description: "Closes the shell, adds thickness, and keeps the model printable."
  },
  {
    icon: Gauge,
    title: "Slicer output",
    description: "Final STL artifacts are written locally and can be sent to Cura or PrusaSlicer."
  }
];

const PRINT_CHECKLIST = [
  "No thin floating surfaces",
  "Thickness added for printable walls",
  "Watertight mesh with closed holes",
  "Flat base or stable orientation",
  "Moderate polygon count for slicer safety"
];

const LIMITATION_NOTE =
  "Single-image note: this is a relief STL, not a full hidden-surface reconstruction. For exact 1:1 geometry, use multiple images or photogrammetry.";

const VIEW_SLOTS: Array<{
  key: ViewKey;
  label: string;
  shortLabel: string;
  hint: string;
  required?: boolean;
}> = [
  { key: "front", label: "Front view", shortLabel: "Front", hint: "Primary image, required", required: true },
  { key: "side", label: "Side view", shortLabel: "Side", hint: "Optional, improves profile" },
  { key: "back", label: "Back view", shortLabel: "Back", hint: "Optional, improves rear shape" },
  { key: "top", label: "Top view", shortLabel: "Top", hint: "Optional, improves footprint" },
];

export default function AIFoundryPage() {
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [viewFiles, setViewFiles] = useState<Record<ViewKey, File | null>>({
    front: null,
    side: null,
    back: null,
    top: null,
  });
  const [viewPreviews, setViewPreviews] = useState<Record<ViewKey, string | null>>({
    front: null,
    side: null,
    back: null,
    top: null,
  });
  const [fileName, setFileName] = useState<string>("front-image");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>("sample-image");
  const [reconstructionMode, setReconstructionMode] = useState<FoundryReconstructionMode>("single-view");
  const [viewCount, setViewCount] = useState(0);
  const [outputStlUrl, setOutputStlUrl] = useState<string | null>(null);
  const [outputBriefUrl, setOutputBriefUrl] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const resumeGuardRef = useRef(false);

  const outputArtifacts = [
    outputStlUrl && {
      label: "Printable STL",
      format: "STL",
      description: "Final printable mesh for Blender, Cura, or PrusaSlicer.",
      url: outputStlUrl,
    },
    outputBriefUrl && {
      label: "Pipeline brief",
      format: "TXT",
      description: "Run summary with the source file and output locations.",
      url: outputBriefUrl,
    },
  ].filter(Boolean) as Array<{
    label: string;
    format: string;
    description: string;
    url: string;
  }>;

  const outputFileName = (url: string) => url.split("/").pop() ?? url;
  const frontFile = viewFiles.front;
  const attachmentCount = Object.values(viewFiles).filter(Boolean).length;
  const completedAtLabel = completedAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(completedAt))
    : null;
  const localMode: FoundryReconstructionMode = attachmentCount > 1 ? "multi-view" : "single-view";
  const stageLabel = stage === "point-cloud"
    ? "Polarity check"
    : stage === "meshing"
      ? "Meshing"
      : stage === "cleaning"
        ? "Cleanup"
        : stage === "stl"
          ? "STL export"
          : stage === "complete"
            ? "Complete"
            : stage === "failed"
              ? "Failed"
    : stage === "queued"
                ? "Queued"
                : "Idle";

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const persistedJobId = window.localStorage.getItem("makerverse:foundry-job-id");
    if (persistedJobId && !resumeGuardRef.current) {
      resumeGuardRef.current = true;
      setJobId(persistedJobId);
      setIsSubmitting(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(viewPreviews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [viewPreviews]);

  const clearJobState = () => {
    setJobId(null);
    setReconstructionMode("single-view");
    setViewCount(0);
    setOutputStlUrl(null);
    setOutputBriefUrl(null);
    setCompletedAt(null);
    setErrorMessage(null);
    setIsSubmitting(false);
    window.localStorage.removeItem("makerverse:foundry-job-id");
    window.history.replaceState(null, "", "/ai-foundry");
  };

  const setViewFile = (key: ViewKey, file: File | null) => {
    const nextFiles = { ...viewFiles, [key]: file };
    setViewFiles(nextFiles);
    setViewPreviews((current) => {
      const next = { ...current };
      if (current[key]) {
        URL.revokeObjectURL(current[key] as string);
      }
      next[key] = file ? URL.createObjectURL(file) : null;
      return next;
    });

    if (key === "front" && file) {
      setFileName(file.name.replace(/\.[^.]+$/, ""));
    }

    clearJobState();
    const selectedNames = VIEW_SLOTS.map((slot) => nextFiles[slot.key]?.name).filter(Boolean) as string[];
    setSourceName(selectedNames.length ? selectedNames.join(" + ") : "sample-image");
    setReconstructionMode(selectedNames.length > 1 ? "multi-view" : "single-view");
    setViewCount(selectedNames.length);
    setLogs([]);
    setProgress(0);
    setStage("idle");
  };

  const handleUpload = (key: ViewKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setViewFile(key, file);
  };

  useEffect(() => {
    if (!jobId) return;

    window.localStorage.setItem("makerverse:foundry-job-id", jobId);
    window.history.replaceState(null, "", `/ai-foundry?job=${encodeURIComponent(jobId)}`);

    let active = true;

    const pollJob = async () => {
      try {
        const res = await fetch(`/api/foundry/jobs/${jobId}`, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!active) return;

        setStage(data.stage);
        setProgress(data.progress ?? 0);
        setLogs(Array.isArray(data.logs) ? data.logs.map((entry: string) => `> ${entry}`) : []);
        if (data.sourceName) {
          setSourceName(data.sourceName);
        }
        setReconstructionMode(data.reconstructionMode ?? "single-view");
        setViewCount(data.viewCount ?? 0);
        setOutputStlUrl(data.outputStlUrl ?? null);
        setOutputBriefUrl(data.outputBriefUrl ?? null);
        setCompletedAt(data.completedAt ?? null);
        setErrorMessage(data.errorMessage ?? null);

        if (data.status === "COMPLETED" || data.status === "FAILED") {
          setIsSubmitting(false);
          return true;
        }
      } catch {
        // Keep polling until the job stabilizes.
      }

      return false;
    };

    void pollJob();
    const interval = window.setInterval(async () => {
      const shouldStop = await pollJob();
      if (shouldStop) {
        window.clearInterval(interval);
      }
    }, 1200);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [jobId]);

  const runPipelineDemo = async () => {
    if (!frontFile || isSubmitting) return;

    setLogs([]);
    setProgress(4);
    setStage("queued");
    setOutputStlUrl(null);
    setOutputBriefUrl(null);
    setErrorMessage(null);
    setIsSubmitting(true);
    setReconstructionMode(localMode);
    setViewCount(attachmentCount);

    const formData = new FormData();
    VIEW_SLOTS.forEach((slot) => {
      const file = viewFiles[slot.key];
      if (file) {
        formData.append(slot.key, file);
      }
    });
    formData.append("notes", "Free 3D Foundry local job");

    try {
      const res = await fetch("/api/foundry/jobs", {
        method: "POST",
        body: formData,
      });

      const job = await res.json();
      if (!res.ok) {
        throw new Error(job.message || "Unable to start foundry job");
      }

      setJobId(job.id);
      setStage(job.stage);
      setProgress(job.progress ?? 0);
      setLogs(Array.isArray(job.logs) ? job.logs.map((entry: string) => `> ${entry}`) : []);
      setSourceName(job.sourceName ?? fileName);
      setReconstructionMode(job.reconstructionMode ?? localMode);
      setViewCount(job.viewCount ?? attachmentCount);
      setOutputStlUrl(job.outputStlUrl ?? null);
      setOutputBriefUrl(job.outputBriefUrl ?? null);
      setCompletedAt(job.completedAt ?? null);
      setErrorMessage(job.errorMessage ?? null);
    } catch (error) {
      setIsSubmitting(false);
      setStage("idle");
      setProgress(0);
      setErrorMessage(error instanceof Error ? error.message : "Unable to start foundry job.");
      setLogs([`> ${error instanceof Error ? error.message : "Unable to start foundry job."}`]);
    }
  };

  const resetDemo = () => {
    setStage("idle");
    setLogs([]);
    setProgress(0);
    setJobId(null);
    setViewFiles({
      front: null,
      side: null,
      back: null,
      top: null,
    });
    Object.values(viewPreviews).forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setViewPreviews({
      front: null,
      side: null,
      back: null,
      top: null,
    });
    setFileName("front-image");
    setSourceName("sample-image");
    setReconstructionMode("single-view");
    setViewCount(0);
    setOutputStlUrl(null);
    setOutputBriefUrl(null);
    setCompletedAt(null);
    setErrorMessage(null);
    setIsSubmitting(false);
    window.localStorage.removeItem("makerverse:foundry-job-id");
    window.history.replaceState(null, "", "/ai-foundry");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6">
        <section className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-transparent p-8 shadow-2xl md:p-12">
          <div className="flex flex-col justify-between gap-8 border-b border-white/5 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3 w-3" />
                3D Foundry
              </div>
              <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
                Image <span className="text-primary">to Relief STL</span> Pipeline
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
                A free, local-first workflow for turning a 2D image into a printable relief STL using the uploaded
                image brightness map, cleanup, and slicer-ready export steps.
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                {localMode === "multi-view"
                  ? "Multi-view mode is active: the pipeline will reconstruct a more accurate mesh from front, side, back, and top views."
                  : LIMITATION_NOTE}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              No login, no payment, no hosting dependency
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <Card className="overflow-hidden rounded-[32px] border-white/10 bg-white/[0.02]">
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <h2 className="flex items-center gap-2 font-bold">
                      <Upload className="h-4 w-4 text-primary" />
                      Input image
                    </h2>
                    <p className="text-sm text-slate-400">
                      Use a simple object photo, logo, or product shot with a clean background.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {VIEW_SLOTS.map((slot) => {
                      const preview = viewPreviews[slot.key];
                      const file = viewFiles[slot.key];
                      return (
                        <label
                          key={slot.key}
                          htmlFor={`foundry-upload-${slot.key}`}
                          className={`relative flex min-h-[140px] cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-dashed p-3 transition-colors ${
                            preview ? "border-primary/50" : "border-white/10 hover:border-white/25"
                          } ${slot.key === "front" ? "sm:col-span-2" : ""}`}
                        >
                          {preview ? (
                            <Image src={preview} alt={`${slot.label} preview`} fill className="object-cover opacity-80" />
                          ) : (
                            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                <FileDown className="h-5 w-5 text-slate-500" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-semibold">{slot.shortLabel}</p>
                                <p className="text-[11px] text-slate-500">{slot.hint}</p>
                              </div>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-black/30 bg-black/70 px-3 py-2 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{slot.label}</p>
                                <p className="mt-1 truncate text-xs text-slate-200">{file?.name ?? "No file selected"}</p>
                              </div>
                              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                                {file ? "Ready" : slot.required ? "Required" : "Optional"}
                              </span>
                            </div>
                          </div>
                          <input
                            id={`foundry-upload-${slot.key}`}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleUpload(slot.key)}
                          />
                        </label>
                      );
                    })}
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-white/5 bg-black/40 p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Source</span>
                      <span className="max-w-[180px] truncate font-semibold text-white">{sourceName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Mode</span>
                      <span className="font-semibold text-white">
                        {localMode === "multi-view" ? "Multi-view reconstruction" : "Single-view relief"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Views</span>
                      <span className="font-semibold text-white">{attachmentCount} uploaded</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Export</span>
                      <span className="font-semibold text-white">Watertight STL</span>
                    </div>
                  </div>

                  <Button
                    className="h-14 w-full rounded-2xl bg-primary text-lg font-black text-white shadow-xl shadow-primary/20 hover:bg-primary/90"
                    disabled={!frontFile || isSubmitting || stage !== "idle"}
                    onClick={runPipelineDemo}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 italic">Submitting backend job...</span>
                    ) : stage === "idle" ? (
                      <span className="flex items-center gap-2">
                        Run backend job <ArrowRight className="h-5 w-5" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 italic">Processing...</span>
                    )}
                  </Button>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3">
                      <p className="flex items-start gap-2 text-xs leading-relaxed text-blue-100/80">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                      This page is intentionally free-only. The final STL is generated locally from the uploaded
                      view set and can be sent to Cura or PrusaSlicer afterward.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-[32px] border border-white/5 bg-black/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-5 py-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                    <Terminal className="h-3 w-3" />
                    System logs
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="max-h-[260px] space-y-1 overflow-y-auto p-5 font-mono text-[11px] text-emerald-400/80">
                  {logs.length === 0 ? (
                    <span className="italic text-slate-600">Waiting for an image...</span>
                  ) : (
                    logs.map((log, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                        {log}
                      </motion.div>
                    ))
                  )}
                  <div ref={logEndRef} />
                </div>
                <div className="bg-white/5 px-5 py-3">
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} initial={{ width: 0 }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="relative flex min-h-[640px] flex-col overflow-hidden rounded-[44px] border border-white/5 bg-white/[0.015]">
                <div className="pointer-events-none absolute left-8 top-8 z-20 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <Box className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Workspace: local pipeline</span>
                  </div>
                  {stage !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1.5 text-primary backdrop-blur-md"
                    >
                      <Cpu className="h-4 w-4 animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Stage: {stage}</span>
                    </motion.div>
                  )}
                </div>

                {stage !== "idle" && (
                  <div className="absolute right-8 top-8 z-20 hidden w-[320px] rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md lg:block">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Job summary</p>
                        <p className="mt-1 text-sm font-black text-white">{stageLabel}</p>
                      </div>
                      <div className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                        {progress}%
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                        <span className="text-slate-500">Source</span>
                        <span className="max-w-[170px] truncate font-semibold text-white">{sourceName}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                        <span className="text-slate-500">Mode</span>
                        <span className="font-semibold text-white">
                          {reconstructionMode === "multi-view" ? "Multi-view" : "Single-view"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                        <span className="text-slate-500">Views</span>
                        <span className="font-semibold text-white">{viewCount || attachmentCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                        <span className="text-slate-500">Job ID</span>
                        <span className="max-w-[170px] truncate font-mono text-[11px] text-white">{jobId ?? "pending"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                        <span className="text-slate-500">Status</span>
                        <span className="font-semibold text-white">{stage === "complete" ? "Ready" : stage === "failed" ? "Needs retry" : "Processing"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 p-8 md:p-10">
                  <AnimatePresence mode="wait">
                    {stage === "idle" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full min-h-[520px] items-center justify-center"
                      >
                        <div className="max-w-lg space-y-6 text-center">
                          <div className="relative mx-auto h-52 w-52">
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[70px] animate-pulse" />
                            <Wand2 className="relative z-10 h-full w-full text-white/5" />
                          </div>
                          <div className="space-y-3">
                            <h2 className="text-2xl font-black tracking-tight md:text-3xl">Build the STL pipeline step by step</h2>
                            <p className="text-slate-500">
                              Upload one or more views, start the backend job, and follow the reconstruction path before exporting to STL.
                            </p>
                            <p className="text-xs leading-relaxed text-slate-500">{LIMITATION_NOTE}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : stage === "complete" ? (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full min-h-[520px]"
                      >
                          <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <div className="space-y-4">
                              <div className="rounded-[32px] border border-white/10 bg-black/40 p-4">
                              {outputStlUrl ? (
                                <FoundryStlPreview title="Generated STL Preview" url={outputStlUrl} />
                              ) : (
                                <div className="flex h-[360px] items-center justify-center rounded-3xl border border-white/10 bg-black/40 text-slate-500">
                                  STL preview will appear here once the export finishes.
                                </div>
                              )}
                              </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Source image</p>
                                <p className="mt-2 break-all text-sm font-semibold text-white">{sourceName}</p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Mode</p>
                                <p className="mt-2 text-sm font-semibold text-white">
                                  {reconstructionMode === "multi-view" ? "Multi-view reconstruction" : "Single-view relief"}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Views used</p>
                                <p className="mt-2 text-sm font-semibold text-white">{viewCount} view{viewCount === 1 ? "" : "s"}</p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Completed at</p>
                                <p className="mt-2 text-sm font-semibold text-white">{completedAtLabel ?? "Just now"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex h-full items-center justify-center">
                            <div className="max-w-lg space-y-6 text-center">
                              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 className="h-12 w-12" />
                              </div>
                              <div className="space-y-3">
                                <h2 className="text-2xl font-black tracking-tight md:text-3xl">Backend job complete</h2>
                                <p className="text-slate-500">
                                  {reconstructionMode === "multi-view"
                                    ? "Your multi-view STL and pipeline brief are ready. Download the artifacts below or reset for a new image."
                                    : "Your image-derived relief STL and pipeline brief are ready. Download the artifacts below or reset for a new image."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : stage === "failed" ? (
                      <motion.div
                        key="failed"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-full min-h-[520px] items-center justify-center"
                      >
                        <div className="max-w-xl space-y-6 text-center">
                          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                            <AlertCircle className="h-12 w-12" />
                          </div>
                          <div className="space-y-3">
                            <h2 className="text-2xl font-black tracking-tight md:text-3xl">Backend job failed</h2>
                            <p className="text-slate-500">
                              The pipeline hit an error. Check the logs, then retry the same upload or reset the demo.
                            </p>
                          </div>
                          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">Error details</p>
                            <p className="mt-2 break-words font-mono text-sm text-rose-100">
                              {errorMessage ?? "No error message was returned by the backend."}
                            </p>
                          </div>
                          <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button
                              className="h-12 gap-2 rounded-xl bg-rose-500 font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-500/90"
                              onClick={runPipelineDemo}
                              disabled={!frontFile || isSubmitting}
                            >
                              <ArrowRight className="h-4 w-4" />
                              Retry same image
                            </Button>
                            <Button
                              variant="outline"
                              className="h-12 gap-2 rounded-xl border-white/10 font-bold"
                              onClick={resetDemo}
                            >
                              Reset demo
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-full min-h-[520px] items-center justify-center"
                      >
                        <div className="w-full max-w-2xl space-y-8 text-center">
                          <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                            <div className="absolute inset-4 rounded-full border-b-2 border-primary/30 animate-spin-reverse" />
                            <Layers3 className="h-12 w-12 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-tight">Pipeline in motion</h3>
                            <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate-500">
                              Current phase: {stage}
                            </p>
                          </div>
                          <div className="grid gap-3 text-left md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Source</p>
                              <p className="mt-2 break-all text-sm font-semibold text-white">{sourceName}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Job ID</p>
                              <p className="mt-2 break-all font-mono text-[11px] text-white">{jobId ?? "pending"}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Progress</p>
                              <p className="mt-2 text-sm font-semibold text-white">{progress}% complete</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {stage === "complete" && (
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="border-t border-white/5 bg-black/60 p-6 backdrop-blur-2xl md:p-8"
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h3 className="flex items-center gap-2 text-xl font-black">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            Export ready
                          </h3>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                            STL-ready workflow locked. Use the generated STL for slicer validation or Blender inspection.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          {outputStlUrl && (
                            <a href={outputStlUrl} download className="block">
                              <Button variant="outline" className="h-12 gap-2 rounded-xl border-white/10 font-bold">
                                <Download className="h-4 w-4" />
                                Download STL
                              </Button>
                            </a>
                          )}
                          {outputBriefUrl && (
                            <a href={outputBriefUrl} download className="block">
                              <Button variant="outline" className="h-12 gap-2 rounded-xl border-white/10 font-bold">
                                <Download className="h-4 w-4" />
                                Download brief
                              </Button>
                            </a>
                          )}
                          <Button
                            className="h-12 gap-2 rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                            onClick={resetDemo}
                          >
                            Reset demo
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                          <div className="mb-3 flex items-center gap-2 text-emerald-400">
                            <FileDown className="h-4 w-4" />
                            <h4 className="text-sm font-black uppercase tracking-[0.2em]">Generated outputs</h4>
                          </div>
                          <div className="space-y-3">
                            {outputArtifacts.map((artifact) => (
                              <div key={artifact.url} className="rounded-xl border border-white/5 bg-black/30 p-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm font-black text-white">{artifact.label}</p>
                                    <p className="text-xs uppercase tracking-[0.18em] text-primary/80">{artifact.format}</p>
                                  </div>
                                  <a
                                    href={artifact.url}
                                    download
                                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:border-primary/40 hover:text-white"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    Download
                                  </a>
                                </div>
                                <p className="mt-3 text-xs leading-relaxed text-slate-500">{artifact.description}</p>
                                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                  File name: {outputFileName(artifact.url)}
                                </p>
                                <p className="mt-2 break-all font-mono text-[11px] text-slate-400">{artifact.url}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                          <div className="mb-3 flex items-center gap-2 text-sky-400">
                            <Info className="h-4 w-4" />
                            <h4 className="text-sm font-black uppercase tracking-[0.2em]">What you received</h4>
                          </div>
                          <ul className="space-y-3 text-sm text-slate-300">
                            <li className="rounded-xl border border-white/5 bg-black/20 p-3">
                              <span className="font-bold text-white">STL file:</span> printable model ready for slicer validation.
                            </li>
                            <li className="rounded-xl border border-white/5 bg-black/20 p-3">
                              <span className="font-bold text-white">Pipeline brief:</span> a text summary with job details and artifact paths.
                            </li>
                            <li className="rounded-xl border border-white/5 bg-black/20 p-3">
                              <span className="font-bold text-white">Source image:</span> {sourceName}
                            </li>
                            <li className="rounded-xl border border-white/5 bg-black/20 p-3">
                              <span className="font-bold text-white">Saved locally:</span> outputs are stored under <span className="font-mono text-xs text-primary">/public/generated/foundry</span>.
                            </li>
                            <li className="rounded-xl border border-white/5 bg-black/20 p-3">
                              <span className="font-bold text-white">Completed at:</span> {completedAtLabel ?? "Just now"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[32px] border-white/10 bg-white/[0.02]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Workflow stages</h2>
              </div>
              <div className="space-y-4">
                {PIPELINE_STEPS.map((step) => (
                  <div key={step.title} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{step.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{step.description}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <div className="font-semibold text-white">{step.output}</div>
                        <div className="mt-1">{step.tools.join(" • ")}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/10 bg-white/[0.02]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h2 className="text-2xl font-black tracking-tight">Free tool stack</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {FREE_STACK.map((tool) => (
                  <div key={tool.title} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <tool.icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-bold">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <h3 className="font-bold text-amber-100">Printability checklist</h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-50/80">
                  {PRINT_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <div className="pointer-events-none fixed right-0 top-0 -z-10 h-[40%] w-[40%] bg-primary/5 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[40%] w-[40%] bg-blue-500/5 blur-[150px]" />
    </div>
  );
}
