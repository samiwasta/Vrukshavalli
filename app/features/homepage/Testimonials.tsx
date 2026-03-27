"use client";

import { motion } from "motion/react";
import { IconStarFilled } from "@tabler/icons-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
};

const CARD_WIDTH_PX = 400;
const CARD_GAP_PX = 24;

const testimonialsRow1: Testimonial[] = [
  {
    id: 1,
    name: "Aadyaa Fabrics By Nutan",
    role: "5 months ago",
    rating: 5,
    text: "Years of indoor, outdoor, and veg plants from Vrukshavalli. Kalambate Madam guides like a pro; warm shop, helpful staff, great maintenance. Highly recommended!",
  },
  {
    id: 2,
    name: "Tejaswini B",
    role: "4 years ago",
    rating: 5,
    text: "Ordered rare plants online—Ratnagiri to Pune in 48 hours. Packed with care; they arrived healthy and beautiful. I will keep buying here. Thank you!",
  },
  {
    id: 3,
    name: "Siddhesh Vaidya",
    role: "1 year ago",
    rating: 5,
    text: "One of Ratnagiri's best nurseries for flowering plants and more—warm, knowledgeable, and a pleasure to visit every time.",
  },
  {
    id: 4,
    name: "Pramendra Singh Kushwah",
    role: "1 year ago",
    rating: 5,
    text: "Warm, respectful people and smooth, honest transactions. I felt looked after and would trust them again without hesitation.",
  },
  {
    id: 5,
    name: "swapnal salvi chendwankar",
    role: "4 years ago",
    rating: 5,
    text: "Their balcony and indoor session changed me—I had no interest until I met Madhuri mam and saw the nursery. Now I love planting; flowers, indoor plants, and pots galore.",
  },
  {
    id: 6,
    name: "kirtee tavadare",
    role: "4 years ago",
    rating: 5,
    text: "Plants from about fifty rupees up, fair pricing, plus fancy planters and stands. A must for plant parents—watch for festive discounts too.",
  },
  {
    id: 7,
    name: "ARVIND DUBAL",
    role: "5 years ago",
    rating: 5,
    text: "A beautiful Ratnagiri stop: local and exotic plants including medicinal kinds, tools and accessories, and generous tips straight from the owner.",
  },
  {
    id: 8,
    name: "Gouri",
    role: "3 years ago",
    rating: 5,
    text: "Indoor and outdoor plants, colourful planters, tonics, compost, and seeds—all at fair prices. Plant lovers in Ratnagiri should not miss this place.",
  },
  {
    id: 9,
    name: "Prasad Khedekar",
    role: "3 years ago",
    rating: 5,
    text: "Excellent plants and a sharp, friendly team—Pratik sir and Madhuri madam set the tone. Wishing you growth; this nursery is a must-visit.",
  },
  {
    id: 10,
    name: "amit dhawade",
    role: "3 years ago",
    rating: 5,
    text: "Visiting feels like more than shopping—like a short nature tour. You leave with healthy plants and clearer ideas on how to care for them.",
  },
];

const testimonialsRow2: Testimonial[] = [
  {
    id: 11,
    name: "Deepika Ghoran",
    role: "2 years ago",
    rating: 5,
    text: "So much choice and staff who truly know plants—they listen and advise without rushing. One of my favourite shopping experiences.",
  },
  {
    id: 12,
    name: "Watch World Holidays And Travels",
    role: "2 years ago",
    rating: 5,
    text: "Patient, knowledgeable guidance on plants—thank you Mrs Madhuri madam for making the visit both useful and enjoyable.",
  },
  {
    id: 13,
    name: "sarvesh shetye",
    role: "2 years ago",
    rating: 5,
    text: "A must-visit nursery: lovely indoor and outdoor plants, welcoming vibe, and plenty to choose from in one trip.",
  },
  {
    id: 14,
    name: "Bhairavi Rane",
    role: "2 years ago",
    rating: 5,
    text: "Top-tier plants in Ratnagiri with an owner and staff who cooperate and genuinely want you to succeed with your greens.",
  },
  {
    id: 15,
    name: "shivani lingayat",
    role: "2 years ago",
    rating: 5,
    text: "Fair prices, gracious behaviour, and beautiful trees—this shop earns its reputation among Ratnagiri plant parents.",
  },
  {
    id: 16,
    name: "Devyani Waghdhare",
    role: "2 years ago",
    rating: 5,
    text: "Stunning collection paired with practical advice—you get eye-catching plants and confidence to look after them.",
  },
  {
    id: 17,
    name: "Swaraj Karekar",
    role: "2 years ago",
    rating: 5,
    text: "Hard-working team and a wide mix of pots, media, and plants under one roof. Thank you for the care you put in.",
  },
  {
    id: 18,
    name: "abhijit mohite",
    role: "2 years ago",
    rating: 5,
    text: "A calm, creative green experience that feels fresh. If you enjoy plants, put this nursery on your list.",
  },
  {
    id: 19,
    name: "Tanvi Joshi",
    role: "5 years ago",
    rating: 5,
    text: "Diverse plants plus everyday garden needs, all backed by staff and owners who know their craft inside out.",
  },
  {
    id: 20,
    name: "Ninad Hajare",
    role: "6 years ago",
    rating: 5,
    text: "A heartfelt home for plants—unique atmosphere, thoughtful curation, and absolutely worth stopping by.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initial =
    testimonial.name.trim().charAt(0).toUpperCase() ||
    testimonial.name.charAt(0);
  return (
    <div className="flex h-[248px] sm:h-[256px] w-87.5 sm:w-100 shrink-0 flex-col rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="mb-3 flex shrink-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700 sm:h-12 sm:w-12">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-primary-700 sm:text-base">
            {testimonial.name}
          </h4>
          <p className="text-xs text-foreground/60 sm:text-sm">{testimonial.role}</p>
        </div>
      </div>

      <div className="mb-2 flex shrink-0 gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <IconStarFilled key={i} size={16} className="text-yellow-500" />
        ))}
      </div>

      <p className="min-h-0 flex-1 text-sm leading-relaxed text-foreground/80 line-clamp-4 overflow-hidden">
        &ldquo;{testimonial.text}&rdquo;
      </p>
    </div>
  );
}

export default function Testimonials() {
  const row1Loop = [...testimonialsRow1, ...testimonialsRow1];
  const row2Loop = [...testimonialsRow2, ...testimonialsRow2];
  const row1Shift = testimonialsRow1.length * (CARD_WIDTH_PX + CARD_GAP_PX);
  const row2Shift = testimonialsRow2.length * (CARD_WIDTH_PX + CARD_GAP_PX);

  return (
    <section className="w-full bg-linear-to-b from-background to-primary-50/30 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-700 font-mono leading-tight tracking-tight mb-4">
            Loved by Plant Parents
          </h2>
          <p className="text-base sm:text-lg text-foreground/70">
            Real words from customers who shop with us in Ratnagiri and across India
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -row1Shift],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 55,
                ease: "linear",
              },
            }}
          >
            {row1Loop.map((testimonial, index) => (
              <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-row2Shift, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 55,
                ease: "linear",
              },
            }}
          >
            {row2Loop.map((testimonial, index) => (
              <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
