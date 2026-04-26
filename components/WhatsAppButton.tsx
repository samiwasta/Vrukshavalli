"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const WHATSAPP_NUMBER = "917719890777";
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about your plants 🌿";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Label pill — absolutely positioned to the left of the button */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 ring-zinc-100"
          >
            Chat with us 💬
          </motion.span>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/30"
      >
        {/* Pulse rings */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#25D366] opacity-20" />
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#25D366] opacity-10 [animation-delay:0.4s]" />
        </span>
        {/* WhatsApp SVG */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.612 1.83 6.504L4 29l7.697-1.805A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm-3.48 6.75c-.27-.612-.554-.624-.81-.634l-.69-.01c-.24 0-.63.09-.96.45s-1.26 1.23-1.26 3c0 1.77 1.29 3.48 1.47 3.72.18.24 2.49 3.96 6.12 5.4 3.03 1.2 3.63.96 4.29.9.66-.06 2.13-.87 2.43-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.956-1.793-2.138-2.003-2.498-.21-.36-.022-.554.158-.733.162-.162.36-.423.54-.634.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.78-1.95-1.1-2.67Z"
            fill="white"
          />
        </svg>
      </motion.a>
    </div>
  );
}
