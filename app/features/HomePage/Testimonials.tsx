"use client";

import { motion } from "motion/react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Home Gardener",
    rating: 5,
    text: "The plants arrived in perfect condition! My balcony has never looked better. The care instructions were so helpful for a beginner like me.",
    image: "/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Urban Gardener",
    rating: 5,
    text: "Outstanding quality and packaging. The ceramic planters are beautiful and the plants are thriving. Will definitely order again!",
    image: "/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Sneha Patel",
    role: "Plant Enthusiast",
    rating: 5,
    text: "Amazing customer service and expert advice. They helped me choose the right plants for my low-light apartment. Highly recommend!",
    image: "/testimonial-3.jpg",
  },
  {
    id: 4,
    name: "Amit Desai",
    role: "Office Manager",
    rating: 5,
    text: "Transformed our office space with their indoor plant selection. The team provided excellent guidance on maintenance. Our workspace feels so fresh!",
    image: "/testimonial-4.jpg",
  },
  {
    id: 5,
    name: "Kavita Reddy",
    role: "Gardening Newbie",
    rating: 5,
    text: "I never thought I could keep plants alive, but their easy-care collection is perfect! Great quality and the plants are still thriving after months.",
    image: "/testimonial-5.jpg",
  },
  {
    id: 6,
    name: "Arjun Mehta",
    role: "Terrace Gardener",
    rating: 5,
    text: "The seeds and soil kits are top-notch. My terrace garden is flourishing thanks to their quality products and helpful tips.",
    image: "/testimonial-6.jpg",
  },
];

const testimonials2 = [
  {
    id: 7,
    name: "Deepa Nair",
    role: "Interior Designer",
    rating: 5,
    text: "Perfect plants for my design projects. The variety and health of the plants are exceptional. My clients love them!",
    image: "/testimonial-7.jpg",
  },
  {
    id: 8,
    name: "Vikram Singh",
    role: "Plant Parent",
    rating: 5,
    text: "Best online plant shopping experience! Fast delivery, healthy plants, and beautiful packaging. My plant family is growing!",
    image: "/testimonial-8.jpg",
  },
  {
    id: 9,
    name: "Ananya Joshi",
    role: "Balcony Gardener",
    rating: 5,
    text: "The planters are stunning and the plants are so healthy. Their customer support answered all my questions patiently. Absolutely worth it!",
    image: "/testimonial-9.jpg",
  },
  {
    id: 10,
    name: "Sanjay Gupta",
    role: "Garden Hobbyist",
    rating: 5,
    text: "Excellent quality plants at reasonable prices. The care guide included with each plant is very detailed and helpful.",
    image: "/testimonial-10.jpg",
  },
  {
    id: 11,
    name: "Meera Iyer",
    role: "Plant Lover",
    rating: 5,
    text: "The rare plant collection is amazing! Found plants I couldn't get anywhere else. Well-packaged and arrived in pristine condition.",
    image: "/testimonial-11.jpg",
  },
  {
    id: 12,
    name: "Rahul Kapoor",
    role: "Sustainable Living Advocate",
    rating: 5,
    text: "Love their commitment to sustainability. The organic soil and eco-friendly packaging shows they truly care about the environment.",
    image: "/testimonial-12.jpg",
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="shrink-0 w-87.5 sm:w-100 rounded-2xl border border-primary-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-primary-700">{testimonial.name}</h4>
          <p className="text-sm text-foreground/60">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <IconStarFilled
            key={i}
            size={16}
            className="text-yellow-500"
          />
        ))}
      </div>
      
      <p className="text-sm text-foreground/80 leading-relaxed">
        "{testimonial.text}"
      </p>
    </div>
  );
}

export default function Testimonials() {
  // Double the arrays to create seamless loop
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials2, ...testimonials2];

  return (
    <section className="w-full bg-linear-to-b from-background to-primary-50/30 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-700 font-mono leading-tight tracking-tight mb-4">
            Loved by Plant Parents
          </h2>
          <p className="text-base sm:text-lg text-foreground/70">
            Join thousands of happy customers growing their green spaces
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* First Row - Right to Left */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -testimonials.length * (400 + 24)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {row1.map((testimonial, index) => (
              <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Second Row - Left to Right */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-testimonials2.length * (400 + 24), 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {row2.map((testimonial, index) => (
              <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}