"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Upload, FileText, Settings, Tag, 
  CheckCircle2, 
  Box, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  priceDigital: z.number().min(0),
  pricePhysical: z.number().optional(),
  materials: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, label: "Files", icon: Upload },
  { id: 2, label: "Details", icon: FileText },
  { id: 3, label: "Settings", icon: Settings },
  { id: 4, label: "Price", icon: Tag },
];

export function ModelUploadForm() {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [files, setFiles] = React.useState<{ stl: File | null; image: File | null }>({ stl: null, image: null });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priceDigital: 0,
      materials: [],
    },
  });

  React.useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (values: FormValues) => {
    if (!files.stl || !files.image) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("stl", files.stl);
      formData.append("image", files.image);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("categoryId", values.category);
      formData.append("priceDigital", values.priceDigital.toString());
      if (values.pricePhysical) formData.append("pricePhysical", values.pricePhysical.toString());
      if (values.materials) formData.append("materials", values.materials.join(","));

      const response = await fetch("/api/models/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      
      setStep(5);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong with the upload. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonMaterials = ["PLA", "ABS", "PETG", "TPU", "Resin", "Nylon", "Carbon Fiber"];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between px-4">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step >= s.id ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-muted-foreground"
              )}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= s.id ? "text-primary" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-[2px] -mt-6 transition-colors duration-300", step > s.id ? "bg-primary" : "bg-white/5")} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="bg-white/[0.02] border-white/10 overflow-hidden shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Upload Your Model</h3>
                    <p className="text-sm text-muted-foreground">Select your 3D file and a high-quality preview image.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* STL Upload */}
                    <div className={cn(
                      "relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:bg-white/5",
                      files.stl ? "border-primary/50 bg-primary/5" : "border-white/10"
                    )}>
                      <input 
                        type="file" 
                        accept=".stl,.obj" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => setFiles(f => ({ ...f, stl: e.target.files?.[0] || null }))}
                      />
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Box className={cn("h-6 w-6", files.stl ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{files.stl ? files.stl.name : "3D Model (STL/OBJ)"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Max 50MB</p>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className={cn(
                      "relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:bg-white/5",
                      files.image ? "border-primary/50 bg-primary/5" : "border-white/10"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => setFiles(f => ({ ...f, image: e.target.files?.[0] || null }))}
                      />
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                        <ImageIcon className={cn("h-6 w-6", files.image ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{files.image ? files.image.name : "Cover Image"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">1600x1200 recommended</p>
                      </div>
                    </div>
                  </div>

                  <Button type="button" className="w-full h-12 rounded-xl" onClick={nextStep} disabled={!files.stl || !files.image}>
                    Continue to Details
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Model Information</h3>
                    <p className="text-sm text-muted-foreground">Describe your creation to the MakerVerse community.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</label>
                      <input 
                        {...form.register("title")}
                        placeholder="e.g. Cyberpunk Katana Stand"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                      {form.formState.errors.title && <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                      <textarea 
                        {...form.register("description")}
                        placeholder="Tell us about your design, assembly tips, or story..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                      {form.formState.errors.description && <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={prevStep}>Back</Button>
                    <Button type="button" className="flex-[2] h-12 rounded-xl" onClick={nextStep}>Continue to Settings</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Print Settings</h3>
                    <p className="text-sm text-muted-foreground">Define the category and recommended materials.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                      <select 
                        {...form.register("category")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                      >
                        <option value="" className="bg-background">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-background">{cat.name}</option>
                        ))}
                      </select>
                      {form.formState.errors.category && <p className="text-xs text-rose-500">{form.formState.errors.category.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recommended Materials</label>
                      <div className="flex flex-wrap gap-2">
                        {commonMaterials.map(mat => {
                          const isSelected = (form.watch("materials") || []).includes(mat);
                          return (
                            <button
                              key={mat}
                              type="button"
                              onClick={() => {
                                const current = form.getValues("materials") || [];
                                if (isSelected) {
                                  form.setValue("materials", current.filter(m => m !== mat));
                                } else {
                                  form.setValue("materials", [...current, mat]);
                                }
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                isSelected 
                                  ? "bg-primary border-primary text-white" 
                                  : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                              )}
                            >
                              {mat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={prevStep}>Back</Button>
                    <Button type="button" className="flex-[2] h-12 rounded-xl" onClick={nextStep}>Continue to Pricing</Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Monetization</h3>
                    <p className="text-sm text-muted-foreground">Set your prices for digital files and physical prints.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-primary">Digital Download (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <input 
                          type="number"
                          {...form.register("priceDigital", { valueAsNumber: true })}
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Set to 0 for a free download.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-emerald-500">Physical Print Base (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <input 
                          type="number"
                          {...form.register("pricePhysical", { valueAsNumber: true })}
                          placeholder="Optional"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Base royalty you receive per print.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
                    <Tag className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Creator Revenue Share</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        You receive 85% of every digital sale and 100% of your specified physical royalty. 
                        Payments are processed weekly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={prevStep} disabled={isSubmitting}>Back</Button>
                    <Button 
                      type="submit" 
                      className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Uploading Model..." : "Confirm & Submit"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 space-y-6 text-center"
                >
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Mission Accomplished!</h2>
                    <p className="text-muted-foreground max-w-sm">
                      Your model has been sent to the MakerVerse lab for verification. It will be live on the marketplace within 24 hours.
                    </p>
                  </div>
                  <Button type="button" className="h-12 px-8 rounded-xl" onClick={() => window.location.href = '/catalogue'}>
                    Return to Catalogue
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
