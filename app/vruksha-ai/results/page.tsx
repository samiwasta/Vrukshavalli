"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  IconSparkles,
  IconLeaf,
  IconAlertTriangle,
  IconCheck,
  IconArrowLeft,
  IconVirus,
  IconShieldCheck,
  IconDroplet,
  IconPlant,
  IconEye,
  IconFirstAidKit,
  IconCalendar,
  IconFileText,
  IconActivity,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

/* ─── types ──────────────────────────────────────────────── */
interface AnalysisResult {
  plantName: string;
  scientificName: string;
  status: "healthy" | "diseased";
  confidence: number;
  diseaseName: string | null;
  summary: string;
  symptoms: string[];
  causes: string[];
  precautions: string[];
  treatment: string[];
  fertilization: string[];
  care: string[];
  severity: "none" | "mild" | "moderate" | "severe";
}

interface StoredData {
  result: AnalysisResult;
  imageData: string;
  fileName: string;
  fileSize: number;
  analyzedAt: string;
}

/* ─── helpers ────────────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: AnalysisResult["severity"] }) {
  const map = {
    none: { 
      label: "Healthy", 
      bg: "bg-emerald-50", 
      text: "text-emerald-700",
      ring: "ring-emerald-200/60",
      icon: <IconCheck size={14} stroke={2.5} />
    },
    mild: { 
      label: "Mild Issue", 
      bg: "bg-amber-50", 
      text: "text-amber-700",
      ring: "ring-amber-200/60",
      icon: <IconActivity size={14} stroke={2} />
    },
    moderate: { 
      label: "Moderate", 
      bg: "bg-orange-50", 
      text: "text-orange-700",
      ring: "ring-orange-200/60",
      icon: <IconAlertTriangle size={14} stroke={2} />
    },
    severe: { 
      label: "Severe", 
      bg: "bg-rose-50", 
      text: "text-rose-700",
      ring: "ring-rose-200/60",
      icon: <IconAlertTriangle size={14} stroke={2.5} />
    },
  };
  const s = map[severity];
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl ring-1 ${s.ring} ${s.bg} px-3.5 py-2 ${s.text} font-bold text-xs`}>
      {s.icon}
      {s.label}
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────── */
export default function VrukshaAIResultsPage() {
  const [data, setData] = useState<StoredData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("vrukshaAIResult");
    if (stored) {
      setData(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <IconSparkles size={36} className="text-emerald-600" stroke={2} />
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50 gap-6 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-20 w-20 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xl"
        >
          <IconAlertTriangle size={36} stroke={2} />
        </motion.div>
        <div className="text-center">
          <h2 className="font-mono font-bold text-2xl text-primary-900 mb-2">No Analysis Found</h2>
          <p className="text-primary-600 max-w-md text-[15px]">
            Upload a plant image to get AI-powered insights and recommendations.
          </p>
        </div>
        <Link
          href="/vruksha-ai"
          className="mt-3 inline-flex items-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <IconArrowLeft size={18} />
          Go to Analyser
        </Link>
      </div>
    );
  }

  const { result, imageData, fileName, fileSize, analyzedAt } = data;
  const isHealthy = result.status === "healthy";

  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-primary-50/30 min-h-screen">

      {/* ── Compact Header ── */}
      <section className="pt-20 pb-5 bg-white border-b border-primary-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <FadeUp>
            <Link
              href="/vruksha-ai"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 transition-colors mb-4 font-medium group"
            >
              <IconArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" stroke={2.5} />
              Back to Analyser
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className={`h-2 w-2 rounded-full ${isHealthy ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-primary-900">
                Analysis Results
              </h1>
            </div>
            <p className="text-primary-600 text-sm">
              Generated on {new Date(analyzedAt).toLocaleDateString("en-IN", { 
                day: "numeric", 
                month: "long", 
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">

          {/* Status Card */}
          <FadeUp delay={0.05}>
            <div className={`rounded-3xl overflow-hidden mb-8 shadow-xl ring-1 ${
              isHealthy 
                ? "bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 ring-emerald-200" 
                : "bg-linear-to-br from-rose-500 via-rose-600 to-orange-600 ring-rose-200"
            }`}>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl" />
                  <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white blur-2xl" />
                </div>

                <div className="relative p-8 sm:p-10">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Image */}
                    <div className="relative h-48 w-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl shrink-0 ring-4 ring-white/10">
                      <Image src={imageData} alt={fileName} fill className="object-cover" unoptimized />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-white">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shrink-0 ring-2 ring-white/30">
                          {isHealthy ? <IconCheck size={28} stroke={2.5} /> : <IconAlertTriangle size={28} stroke={2.5} />}
                        </div>
                        <div className="flex-1">
                          <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-2">
                            {isHealthy ? "Plant is Healthy!" : "Disease Detected"}
                          </h2>
                          {result.diseaseName && (
                            <p className="text-white/90 text-lg font-semibold">{result.diseaseName}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <SeverityBadge severity={result.severity} />
                        <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 px-4 py-2 text-xs font-bold">
                          <IconActivity size={15} stroke={2} />
                          {result.confidence}% Confidence
                        </div>
                      </div>

                      <p className="text-white/95 text-base leading-relaxed">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Plant Info Grid */}
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  icon: IconLeaf,
                  label: "Common Name",
                  value: result.plantName,
                  color: "emerald",
                },
                {
                  icon: IconPlant,
                  label: "Scientific Name",
                  value: result.scientificName,
                  color: "teal",
                  italic: true,
                },
                {
                  icon: IconCalendar,
                  label: "Analysis Date",
                  value: new Date(analyzedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                  color: "violet",
                },
                {
                  icon: IconFileText,
                  label: "File Size",
                  value: fileSize / 1024 < 1024 ? `${(fileSize / 1024).toFixed(1)} KB` : `${(fileSize / 1024 / 1024).toFixed(1)} MB`,
                  color: "sky",
                },
              ].map((item) => {
                const Icon = item.icon;
                const colors = {
                  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
                  teal: "bg-teal-100 text-teal-700 ring-teal-200",
                  violet: "bg-violet-100 text-violet-700 ring-violet-200",
                  sky: "bg-sky-100 text-sky-700 ring-sky-200",
                };
                return (
                  <div key={item.label} className="rounded-2xl bg-white border border-primary-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className={`h-11 w-11 rounded-xl ${colors[item.color as keyof typeof colors]} flex items-center justify-center mb-4 ring-1`}>
                      <Icon size={22} stroke={2} />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-1.5">{item.label}</p>
                    <p className={`text-sm font-bold text-primary-900 leading-tight ${item.italic ? "italic" : ""}`}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeUp>

          {/* Details Sections */}
          <div className="space-y-8">
            {/* Diagnosis */}
            {(result.symptoms.length > 0 || result.causes.length > 0) && (
              <FadeUp delay={0.15}>
                <div className="rounded-2xl bg-white border border-primary-100 shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-rose-50 to-orange-50 border-b border-rose-100 px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center ring-2 ring-rose-200">
                        <IconEye size={20} stroke={2} />
                      </div>
                      <h3 className="font-mono font-bold text-xl text-primary-900">Diagnosis & Analysis</h3>
                    </div>
                  </div>
                  <div className="p-7 grid gap-6 lg:grid-cols-2">
                    {result.symptoms.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            isHealthy ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                          }`}>
                            <IconEye size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">Observed Symptoms</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.symptoms.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 group">
                              <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                                isHealthy ? "bg-emerald-500" : "bg-rose-500"
                              } ring-4 ring-offset-0 ${
                                isHealthy ? "ring-emerald-100" : "ring-rose-100"
                              }`} />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.causes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <IconVirus size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">Possible Causes</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.causes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 ring-4 ring-amber-100" />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            )}

            {/* Treatment Plan */}
            {(result.precautions.length > 0 || result.treatment.length > 0) && (
              <FadeUp delay={0.2}>
                <div className="rounded-2xl bg-white border border-primary-100 shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-sky-50 to-violet-50 border-b border-sky-100 px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center ring-2 ring-sky-200">
                        <IconShieldCheck size={20} stroke={2} />
                      </div>
                      <h3 className="font-mono font-bold text-xl text-primary-900">Treatment & Prevention</h3>
                    </div>
                  </div>
                  <div className="p-7 grid gap-6 lg:grid-cols-2">
                    {result.precautions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                            <IconShieldCheck size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">Preventive Measures</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.precautions.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 ring-4 ring-sky-100" />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.treatment.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                            <IconFirstAidKit size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">Treatment Steps</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.treatment.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0 ring-4 ring-violet-100" />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            )}

            {/* Plant Care */}
            {(result.fertilization.length > 0 || result.care.length > 0) && (
              <FadeUp delay={0.25}>
                <div className="rounded-2xl bg-white border border-primary-100 shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center ring-2 ring-emerald-200">
                        <IconPlant size={20} stroke={2} />
                      </div>
                      <h3 className="font-mono font-bold text-xl text-primary-900">Ongoing Plant Care</h3>
                    </div>
                  </div>
                  <div className="p-7 grid gap-6 lg:grid-cols-2">
                    {result.fertilization.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                            <IconDroplet size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">Fertilization Guide</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.fertilization.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0 ring-4 ring-teal-100" />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.care.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <IconPlant size={17} stroke={2} />
                          </div>
                          <h4 className="font-bold text-base text-primary-800">General Care Tips</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.care.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-100" />
                              <span className="text-[15px] text-primary-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            )}
          </div>

          {/* CTA */}
          <FadeUp delay={0.3}>
            <div className="mt-12 text-center bg-white rounded-2xl border border-primary-100 shadow-md p-8">
              <p className="text-primary-600 mb-5 text-sm">
                Want to analyze another plant?
              </p>
              <Link
                href="/vruksha-ai"
                className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <IconSparkles size={20} stroke={2} />
                Analyse Another Plant
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
