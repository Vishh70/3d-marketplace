"use client";

import { ModelUploadForm } from "@/components/models/ModelUploadForm";
import { Sparkles, ShieldCheck, Globe } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            <span>Join the Elite Creator Circle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight italic">
            CONTRIBUTE TO THE <span className="text-primary">VERSE</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Share your industrial-grade designs with thousands of makers across India. 
            Monetize your creativity with our direct-to-print ecosystem.
          </p>
        </div>

        {/* Feature grid for confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "IP Protection", desc: "Your designs are encrypted and protected by our secure Foundry." },
            { icon: Globe, title: "India-Wide Reach", desc: "Get your models in the hands of makers from Hyderabad to Delhi." },
            { icon: Sparkles, title: "AI Optimization", desc: "Our Grok AI helps optimize your print settings for maximum quality." },
          ].map((feat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <ModelUploadForm />
      </div>
    </div>
  );
}
