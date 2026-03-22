"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  IconLeaf,
  IconSeedling,
  IconHeart,
  IconWorld,
  IconUsers,
  IconSchool,
  IconHome,
  IconMoodSmile,
  IconTrees,
  IconFlame,
  IconStar,
  IconQuote,
} from "@tabler/icons-react";
import { cn } from "@/lib/util";

// ── Animation helpers ─────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 mb-4">
      <IconLeaf size={13} className="text-primary-500" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-primary-600">
        {children}
      </span>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-mono text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "1993", label: "Legacy since" },
  { value: "2017", label: "Vrikshavalli founded" },
  { value: "10,000+", label: "Happy customers" },
  { value: "33,000+", label: "Online community" },
];

// ── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: IconSeedling,
    title: "Sustainability First",
    body: "We promote eco-friendly gardening practices, water-wise landscaping, and long-term green solutions that respect the earth.",
    accent: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    icon: IconUsers,
    title: "Rural Employment & Empowerment",
    body: "Creating green livelihoods in rural areas — especially for women — is at the heart of our growth story.",
    accent: "bg-primary-50/50 border-primary-100",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-700",
  },
  {
    icon: IconHome,
    title: "Grow Your Own Movement",
    body: "We actively guide people to grow their own vegetables, fruits, and herbs — because food grown with your own hands carries unmatched satisfaction.",
    accent: "bg-amber-50/50 border-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    icon: IconSchool,
    title: "Education & Awareness",
    body: "Through workshops, trainings, and digital initiatives, we simplify gardening for beginners and inspire more people to start their green journey with confidence.",
    accent: "bg-sky-50/50 border-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
  },
];

// ── Mission pillars ──────────────────────────────────────────────────────────

const PILLARS = [
  { icon: IconLeaf, text: "Bring nature back into people's daily lives" },
  { icon: IconSeedling, text: "Empower families to grow their own food" },
  { icon: IconTrees, text: "Create beautiful, sustainable green spaces" },
  { icon: IconUsers, text: "Generate meaningful rural employment" },
  { icon: IconWorld, text: "Inspire environmentally responsible living" },
  { icon: IconHeart, text: "Contribute toward a healthier planet for future generations" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-24 sm:py-32">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-primary-700/20 blur-3xl" />

        <div className="container relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <IconLeaf size={13} className="text-primary-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-100">
                Our Story
              </span>
            </div>

            <h1 className="font-mono text-3xl font-bold text-white sm:text-5xl leading-tight">
              Adding Green Touch
              <br />
              <span className="text-primary-200">to Your Life</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
              Every meaningful journey begins with a simple belief. Ours began with a deep concern
              — that in the race of urban growth, we were slowly losing our connection with nature.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-4"
              >
                <p className="font-mono text-2xl font-extrabold text-white">{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-primary-200">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INTRO SUMMARY ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <FadeUp>
            <div className="relative rounded-3xl border border-primary-100 bg-primary-50/40 p-8 sm:p-10">
              {/* quote icon */}
              <IconQuote
                size={48}
                className="absolute -top-5 -left-3 text-primary-200 rotate-180 opacity-60"
              />
              <p className="text-base sm:text-lg leading-8 text-zinc-700">
                What started as a shared love for plants during{" "}
                <span className="font-semibold text-primary-700">Madhuri&apos;s</span> B.Tech in
                Agricultural Engineering and{" "}
                <span className="font-semibold text-primary-700">Pratik&apos;s</span> B.Sc in
                Horticulture soon turned into a life mission. Leaving behind a well-settled corporate
                job, Madhuri chose to follow her heart and joined Pratik in the family nursery
                business at Ratnagiri — combining technical knowledge with hands-on passion.
              </p>
              <p className="mt-5 text-base sm:text-lg leading-8 text-zinc-700">
                In 2017, they started{" "}
                <span className="font-mono font-bold text-primary-600">Vrukshavalli</span>, the
                first-of-its-kind plant boutique in the entire Konkan region, specially created for
                urban plant lovers who wanted to experience gardening in simple and modern ways.
              </p>
              <p className="mt-5 text-base sm:text-lg leading-8 text-zinc-700">
                Today, with a thriving online community of{" "}
                <span className="font-semibold text-primary-600">33,000+ followers</span> and{" "}
                <span className="font-semibold text-primary-600">10,000+ happy customers</span>{" "}
                across India, Vrukshavalli continues to grow —
              </p>
              <p className="mt-4 font-mono text-xl font-bold text-primary-600">
                &ldquo;Adding green touch to your life.&rdquo;
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ACHIEVEMENT ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>Recognition</SectionLabel>
            <SectionHeading>🏆 Award &amp; Achievement</SectionHeading>
            <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm leading-7">
              A milestone that reflects years of passion, hard work, and a bold vision for green entrepreneurship.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-yellow-50">
              <div className="grid lg:grid-cols-2">
                {/* Image */}
                <div className="relative min-h-72 lg:min-h-full">
                  <Image
                    src="/award-2022.jpg"
                    alt="Maharashtra Start Up Yatra 2022 Award"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
                      Maharashtra Start Up Yatra 2022
                    </span>
                    <h3 className="mt-2 font-mono text-xl font-bold text-zinc-900 sm:text-2xl leading-snug">
                      Best Start-Up Award
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-amber-600">
                      State Level Winner
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-zinc-600">
                    Out of thousands of start-ups across Maharashtra, Vrukshavalli was recognised as
                    the <span className="font-semibold text-zinc-800">State Level Best Start-Up</span>{" "}
                    at the prestigious Maharashtra Start Up Yatra — a testament to the impact we&apos;ve
                    been creating in the agri-green sector.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Agriculture & Horticulture", "State Level", "2022"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-amber-200 bg-amber-100/60 px-3 py-1 text-[11px] font-bold text-amber-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ROOTS 1993 ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <FadeUp>
              <SectionLabel>Roots That Go Back</SectionLabel>
              <SectionHeading>
                🌱 A Legacy Born in 1993
              </SectionHeading>
              <div className="mt-5 space-y-4 text-base leading-8 text-zinc-600">
                <p>
                  The story of Vrukshavalli is deeply rooted in experience and legacy.{" "}
                  <span className="font-semibold text-zinc-800">Pratik</span>, a horticulture
                  graduate, grew up in the world of plants. His family nursery, established in 1993,
                  nurtured not just saplings but also a lifelong understanding of soil, seasons, and
                  sustainable growing.
                </p>
                <p>
                  For Pratik, plants were never just products — they were{" "}
                  <span className="font-semibold text-primary-600">living relationships</span>.
                </p>
                <p>
                  <span className="font-semibold text-zinc-800">Madhuri</span>, an agricultural
                  engineer and post-graduate, gave up her high-paying corporate job in Mumbai and
                  joined Pratik in this journey. She saw a growing gap in urban India — people wanted
                  plants, but lacked the right guidance, systems, and confidence to grow them
                  successfully.
                </p>
                <p>
                  Together, they decided not just to continue the legacy… but to take it forward with
                  a larger purpose.
                </p>
                <p className="font-mono font-semibold text-primary-600">
                  And that is how they founded Vrukshavalli in 2017. 🌿
                </p>
              </div>
            </FadeUp>

            {/* Timeline milestones */}
            <FadeUp delay={0.15}>
              <div className="flex flex-col gap-0">
                {[
                  {
                    year: "1993",
                    title: "Family Nursery Founded",
                    desc: "Pratik's family establishes a nursery in Ratnagiri — planting seeds of a lifelong legacy.",
                    color: "bg-primary-500",
                    border: "border-primary-200",
                    bg: "bg-primary-50/60",
                  },
                  {
                    year: "2010s",
                    title: "Education & Expertise",
                    desc: "Pratik (B.Sc Horticulture) and Madhuri (B.Tech Agricultural Engineering) sharpen their craft and vision.",
                    color: "bg-amber-400",
                    border: "border-amber-200",
                    bg: "bg-amber-50/60",
                  },
                  {
                    year: "2017",
                    title: "Vrukshavalli is Born",
                    desc: "Konkan's first plant boutique opens — a modern destination for urban plant lovers.",
                    color: "bg-emerald-500",
                    border: "border-emerald-200",
                    bg: "bg-emerald-50/60",
                  },
                  {
                    year: "Today",
                    title: "A Nation-Wide Movement",
                    desc: "10,000+ customers and 33,000+ community members growing stronger every day.",
                    color: "bg-sky-500",
                    border: "border-sky-200",
                    bg: "bg-sky-50/60",
                  },
                ].map((item, i) => (
                  <div key={item.year} className="flex gap-4">
                    {/* spine */}
                    <div className="flex flex-col items-center">
                      <div className={cn("h-4 w-4 rounded-full shrink-0 mt-4", item.color)} />
                      {i < 3 && <div className="w-0.5 flex-1 bg-zinc-200 my-1" />}
                    </div>
                    {/* card */}
                    <div
                      className={cn(
                        "mb-4 flex-1 rounded-2xl border p-4",
                        item.border,
                        item.bg
                      )}
                    >
                      <span className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        {item.year}
                      </span>
                      <p className="mt-1 text-sm font-bold text-zinc-900">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FROM PASSION TO PURPOSE ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-primary-600">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-4">
              <IconFlame size={13} className="text-primary-200" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-200">
                From Passion to Purpose
              </span>
            </div>
            <SectionHeading className="text-white">
              🌍 Small Seeds, Large Impact
            </SectionHeading>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: IconSeedling,
                heading: "The Early Days",
                body: "There were challenges — limited resources, unpredictable climates, failed trials, and the constant effort of educating people about the importance of plants in modern living.",
              },
              {
                icon: IconFlame,
                heading: "Fuelled by Belief",
                body: "But every thriving garden and every happy customer strengthened their conviction. For Madhuri and Pratik, this was never just about selling plants.",
              },
              {
                icon: IconHeart,
                heading: "A Deeper Mission",
                body: "It was — and continues to be — a mission to rebuild the human–nature connection and inspire every Indian home to grow something of their own.",
              },
            ].map((card, i) => (
              <FadeUp key={card.heading} delay={i * 0.1}>
                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm p-6 h-full flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <card.icon size={20} className="text-primary-100" />
                  </div>
                  <h3 className="font-mono text-base font-bold text-white">{card.heading}</h3>
                  <p className="text-sm leading-7 text-primary-100/80">{card.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION PILLARS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>What Drives Us</SectionLabel>
            <SectionHeading>
              🌿 Our Purpose — Simple, Yet Powerful
            </SectionHeading>
            <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm leading-7">
              At Vrukshavalli, we believe that nature is not a luxury — it is a necessity.
            </p>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <FadeUp key={p.text} delay={i * 0.07}>
                <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50/40 px-5 py-4 h-full">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 mt-0.5">
                    <p.icon size={17} className="text-primary-600" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-zinc-700">{p.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <p className="mt-8 text-center text-sm text-zinc-500 max-w-xl mx-auto leading-7">
              Every plant we grow and every landscape we design is a step toward this vision.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>Rooted in Strong Values</SectionLabel>
            <SectionHeading>🤝 What We Stand For</SectionHeading>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div
                  className={cn(
                    "rounded-3xl border p-6 h-full flex flex-col gap-4",
                    v.accent
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      v.iconBg
                    )}
                  >
                    <v.icon size={22} className={v.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-zinc-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-600">{v.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROAD AHEAD ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <FadeUp className="text-center mb-10">
            <SectionLabel>The Road Ahead</SectionLabel>
            <SectionHeading>🌳 A Bold & Beautiful Dream</SectionHeading>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="space-y-5 text-base leading-8 text-zinc-600">
              <p>
                We know the journey is long. But every balcony garden, every vertical green wall,
                every seed ball, and every smiling customer tells us — we are moving in the right
                direction.
              </p>
              <div className="rounded-3xl border border-primary-100 bg-primary-50/40 p-6 sm:p-8">
                <p className="font-mono text-sm font-bold text-primary-500 uppercase tracking-widest mb-4">
                  Our Dream
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "To see every home connected to nature",
                    "Every child understanding the value of plants",
                    "Every city breathing a little easier",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <IconStar size={15} className="text-amber-500 shrink-0 mt-1" />
                      <span className="text-zinc-700 font-medium">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Because the future we leave behind depends on the seeds we plant today.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CLOSING TAGLINE ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
          <IconTrees size={420} className="text-white" />
        </div>
        <div className="container relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <FadeUp>
            <IconMoodSmile size={44} className="text-primary-200 mx-auto mb-5" />
            <p className="font-mono text-3xl font-extrabold text-white sm:text-4xl leading-tight">
              Vrukshavalli
            </p>
            <p className="mt-3 text-lg font-medium text-primary-200">
              Adding green touch to your life. 🌿
            </p>
            <p className="mt-6 text-sm text-primary-300/80 max-w-md mx-auto leading-7">
              Thank you for being part of this green journey. Every plant you bring home is a step
              toward a healthier world — for you, your family, and the planet.
            </p>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
