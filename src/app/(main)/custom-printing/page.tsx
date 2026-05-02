"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ModelUploadForm } from "@/components/models/ModelUploadForm";
import { Box, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomPrintingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
          </div>

          <div className="container px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold">
                <Box className="h-4 w-4" />
                <span>Industrial Grade Manufacturing</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Your Idea, <span className="text-primary italic">Melted</span> <br />into Reality
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Upload your designs and get high-precision 3D prints delivered across India. 
                From rapid prototyping to industrial small-batch production.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container px-4 md:px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {[
              { 
                icon: Zap, 
                title: "Fast Turnaround", 
                desc: "Average 48-hour shipping across metro cities in India with live tracking.",
                color: "text-orange-500"
              },
              { 
                icon: ShieldCheck, 
                title: "Quality Assured", 
                desc: "Industrial-grade QC and dimensional accuracy testing on every print.",
                color: "text-green-500"
              },
              { 
                icon: Globe, 
                title: "PAN India", 
                desc: "Secure shipping to over 25,000+ pin codes with trusted logistics partners.",
                color: "text-blue-500"
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.05] transition-all group"
              >
                <div className={`${f.color} bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white/[0.02] border border-white/10 rounded-[48px] p-8 md:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 p-8 opacity-5 pointer-events-none rotate-12">
              <Box className="h-64 w-64" />
            </div>
            <div className="mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black">Start Your Print Order</h2>
              <p className="text-slate-500 mt-3 text-lg">Fill in the details below to get an instant engineering review.</p>
            </div>
            <div className="relative z-10">
              <ModelUploadForm />
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
