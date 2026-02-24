"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconSparkles,
  IconUpload,
  IconPhoto,
  IconX,
  IconLeaf,
  IconAlertTriangle,
  IconRefresh,
  IconMicroscope,
  IconSearch,
  IconBrain,
  IconVirus,
  IconChevronRight,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── helpers ───────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXT = ".png, .jpg, .jpeg";

/* ─── analysis stages ───────────────────────────────────── */
const ANALYSIS_STAGES = [
  { label: "Uploading image…", icon: IconUpload, duration: 800 },
  { label: "Scanning for patterns…", icon: IconSearch, duration: 1200 },
  { label: "Identifying plant species…", icon: IconLeaf, duration: 1500 },
  { label: "Detecting diseases…", icon: IconVirus, duration: 2000 },
  { label: "Analysing with AI…", icon: IconBrain, duration: 2500 },
  { label: "Generating report…", icon: IconSparkles, duration: 1000 },
];

/* ─── page ───────────────────────────────────────────────── */
export default function VrukshaAIPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      setError("Only PNG, JPG, or JPEG images are accepted.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB.");
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ── progress animation ── */
  useEffect(() => {
    if (!analyzing) return;

    let currentStage = 0;
    let currentProgress = 0;
    const totalStages = ANALYSIS_STAGES.length;

    const tick = () => {
      const stageWeight = 100 / totalStages;
      const stageStart = currentStage * stageWeight;
      const increment = stageWeight / (ANALYSIS_STAGES[currentStage].duration / 50);

      currentProgress = Math.min(currentProgress + increment, stageStart + stageWeight);
      setProgress(Math.round(currentProgress));

      if (currentProgress >= stageStart + stageWeight && currentStage < totalStages - 1) {
        currentStage++;
        setStage(currentStage);
      }
    };

    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [analyzing]);

  /* ── analyse handler ── */
  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setStage(0);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/vruksha-ai", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Analysis failed");
      }

      // Finish progress animation
      setProgress(100);
      setStage(ANALYSIS_STAGES.length - 1);

      // Store result + image in sessionStorage for results page
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem(
          "vrukshaAIResult",
          JSON.stringify({
            result: data.result,
            imageData: reader.result as string,
            fileName: file.name,
            fileSize: file.size,
            analyzedAt: new Date().toISOString(),
          })
        );
        // Small delay so user sees 100% before redirect
        setTimeout(() => {
          router.push("/vruksha-ai/results");
        }, 600);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setAnalyzing(false);
      setProgress(0);
      setStage(0);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-800 via-primary-700 to-primary-600 pt-28 pb-24 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-teal-300 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <FadeUp>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-amber-200 tracking-wide shadow-lg">
              <IconSparkles size={14} stroke={2.5} />
              Powered by AI
            </div>

            <h1 className="font-mono text-5xl sm:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
              Vruksha{" "}
              <span className="bg-linear-to-r from-amber-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-emerald-100 mb-7 tracking-wide uppercase font-sans drop-shadow-sm">
              Plant Disease Analyser
            </p>

            <p className="text-emerald-50/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-2">
              Upload a clear photo of your plant and our AI will instantly scan for signs of
              disease, pest damage, or nutrient deficiencies — giving you an early diagnosis so
              you can act before it&apos;s too late.
            </p>
          </FadeUp>

          {/* Feature pills */}
          <FadeUp delay={0.15}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {[
                { icon: <IconMicroscope size={14} />, label: "Disease Detection" },
                { icon: <IconLeaf size={14} />, label: "Pest Identification" },
                { icon: <IconSparkles size={14} />, label: "Instant Results" },
              ].map((pill) => (
                <div
                  key={pill.label}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-white/15 transition-colors"
                >
                  {pill.icon}
                  {pill.label}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Analyser Card ── */}
      <section className="pb-24 pt-16 bg-linear-to-b from-emerald-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <FadeUp>
            <div className="rounded-3xl border border-primary-200/60 bg-white shadow-lg overflow-hidden">

              {/* Card header */}
              <div className="flex items-center gap-3 border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 px-6 sm:px-7 py-6">
                <div className="h-11 w-11 rounded-xl bg-linear-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <IconSparkles size={20} stroke={2.5} />
                </div>
                <div>
                  <p className="font-mono font-bold text-base text-primary-900">Analyse Your Plant</p>
                  <p className="text-xs text-primary-600 mt-0.5">Upload a photo below to get started</p>
                </div>
              </div>

              <div className="p-6 sm:p-9 space-y-7">

                {/* ── Analysing overlay ── */}
                <AnimatePresence mode="wait">
                  {analyzing ? (
                    <motion.div
                      key="analysing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-6"
                    >
                      {/* Mini preview */}
                      {preview && (
                        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-emerald-200 shrink-0">
                            <Image src={preview} alt="Analysing" fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-primary-800 truncate">{file?.name}</p>
                            <p className="text-xs text-primary-500 mt-0.5">
                              {file ? (file.size / 1024 < 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1024 / 1024).toFixed(2)} MB`) : ""}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-black text-emerald-600 font-mono">{progress}%</p>
                          </div>
                        </div>
                      )}

                      {/* Progress bar */}
                      <div className="space-y-3">
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-400"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Stage steps */}
                      <div className="grid gap-2">
                        {ANALYSIS_STAGES.map((s, i) => {
                          const StageIcon = s.icon;
                          const isDone = i < stage;
                          const isCurrent = i === stage;
                          return (
                            <motion.div
                              key={s.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: i <= stage ? 1 : 0.35, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                                isCurrent
                                  ? "bg-emerald-50 border border-emerald-200 font-semibold text-emerald-700"
                                  : isDone
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }`}
                            >
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                isCurrent
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : isDone
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}>
                                {isCurrent ? (
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                    className="inline-flex"
                                  >
                                    <IconRefresh size={14} />
                                  </motion.span>
                                ) : isDone ? (
                                  <IconChevronRight size={14} />
                                ) : (
                                  <StageIcon size={14} />
                                )}
                              </div>
                              <span>{s.label}</span>
                              {isDone && (
                                <span className="ml-auto text-xs text-emerald-500 font-medium">Done</span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="upload-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Upload zone OR preview */}
                <AnimatePresence mode="wait">
                  {!preview ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all px-8 py-14 select-none ${
                          dragging
                            ? "border-emerald-500 bg-emerald-50 scale-[1.02]"
                            : "border-emerald-300 bg-linear-to-br from-emerald-50/50 to-teal-50/30 hover:border-emerald-400 hover:from-emerald-50 hover:to-teal-50"
                        }`}
                      >
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                          dragging ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white scale-110" : "bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-600"
                        }`}>
                          <IconUpload size={30} stroke={2} />
                        </div>

                        <div className="text-center">
                          <p className="font-bold text-primary-900 text-base">
                            {dragging ? "Release to upload" : "Drag & drop your image here"}
                          </p>
                          <p className="text-primary-600 text-sm mt-1.5">
                            or <span className="text-emerald-600 font-semibold">click to browse</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-center">
                          {["PNG", "JPG", "JPEG"].map((ext) => (
                            <span
                              key={ext}
                              className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-bold text-emerald-700 font-mono shadow-sm"
                            >
                              {ext}
                            </span>
                          ))}
                          <span className="text-xs text-primary-500 font-medium">· Max 10 MB</span>
                        </div>

                        <input
                          ref={inputRef}
                          type="file"
                          accept={ACCEPTED_EXT}
                          className="hidden"
                          onChange={handleInputChange}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                      className="relative rounded-2xl overflow-hidden border border-primary-200 bg-primary-50/30"
                    >
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white border border-primary-200 text-foreground/60 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center shadow-sm transition-colors"
                        aria-label="Remove image"
                      >
                        <IconX size={15} />
                      </button>

                      {/* Image preview */}
                      <div className="relative w-full h-72 sm:h-80">
                        <Image
                          src={preview}
                          alt="Uploaded plant"
                          fill
                          className="object-contain p-4"
                          unoptimized
                        />
                      </div>

                      {/* File info strip */}
                      <div className="flex items-center gap-3 border-t border-primary-100 bg-white px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                          <IconPhoto size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                          <p className="text-xs text-foreground/45">
                            {file ? (file.size / 1024 < 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / 1024 / 1024).toFixed(2)} MB`)
                            : ""}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 font-mono uppercase">
                          {file?.name.split(".").pop()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 mt-6"
                    >
                      <IconAlertTriangle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analyse button */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!file || analyzing}
                  className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold transition-all shadow-md mt-7 ${
                    !file
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:shadow-lg hover:scale-[1.02]"
                  }`}
                >
                  <IconSparkles size={17} />
                  Analyse Plant
                </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </FadeUp>

          {/* Tips row */}
          <FadeUp delay={0.1}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <IconPhoto size={18} />, tip: "Use natural daylight", desc: "Avoid shadows or flash glare" },
                { icon: <IconLeaf size={18} />, tip: "Focus on affected area", desc: "Capture the leaves clearly" },
                { icon: <IconSparkles size={18} />, tip: "One plant per photo", desc: "For most accurate results" },
              ].map((t) => (
                <div key={t.tip} className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50/50 px-5 py-5 flex gap-3 items-start shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-9 w-9 rounded-xl bg-white border-2 border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-900">{t.tip}</p>
                    <p className="text-xs text-primary-600 mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
