"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconShoppingBag,
  IconLeaf,
  IconPlus,
  IconMinus,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useBag } from "@/context/BagContext";

export default function BagSlider() {
  const { isBagOpen, closeBag, items, removeItem, updateQty } = useBag();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isBagOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBagOpen]);

  return (
    <AnimatePresence>
      {isBagOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="bag-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]"
            onClick={closeBag}
            aria-hidden
          />

          {/* ── Slider panel ─────────────────────────────────────────────── */}
          <motion.aside
            key="bag-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-[min(420px,92vw)] flex-col bg-white shadow-2xl"
            aria-label="Shopping bag"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-primary-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <IconShoppingBag size={20} stroke={1.5} className="text-primary-600" />
                <span className="font-mono text-base font-bold text-zinc-900">Your Bag</span>
                {totalQty > 0 && (
                  <motion.span
                    key={totalQty}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold leading-none text-white"
                  >
                    {totalQty}
                  </motion.span>
                )}
              </div>
              <button
                type="button"
                onClick={closeBag}
                className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                aria-label="Close bag"
              >
                <IconX size={20} stroke={1.5} />
              </button>
            </div>

            {/* ── Body ─────────────────────────────────────────────────── */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
                  className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-100"
                >
                  <IconLeaf size={36} className="text-primary-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <p className="font-mono text-lg font-bold text-zinc-900">Your bag is empty</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Looks like you haven&apos;t added any plants yet.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <Link
                    href="/product"
                    onClick={closeBag}
                    className="mt-2 inline-flex items-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:bg-primary-800"
                  >
                    Shop Plants
                  </Link>
                </motion.div>
              </div>
            ) : (
              /* Product list */
              <ul className="flex-1 overflow-y-auto divide-y divide-zinc-100 px-4 py-2">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBlock: 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 380, damping: 36 },
                        opacity: { duration: 0.18 },
                        delay: idx * 0.04,
                      }}
                      className="flex gap-3 py-4"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.id}`}
                        onClick={closeBag}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-900 leading-tight">
                              {item.name}
                            </p>
                            {item.variant && (
                              <p className="mt-0.5 text-[11px] text-zinc-400">{item.variant}</p>
                            )}
                          </div>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 rounded-full p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${item.name}`}
                          >
                            <IconTrash size={14} stroke={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty stepper */}
                          <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                              aria-label="Decrease quantity"
                            >
                              <IconMinus size={12} stroke={2} />
                            </button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.7 }}
                              animate={{ scale: 1 }}
                              className="w-6 text-center text-sm font-bold text-zinc-800"
                            >
                              {item.quantity}
                            </motion.span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                              aria-label="Increase quantity"
                            >
                              <IconPlus size={12} stroke={2} />
                            </button>
                          </div>

                          {/* Line total */}
                          <p className="text-sm font-bold text-zinc-900">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="border-t border-primary-100 p-5">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-medium">Subtotal</span>
                <motion.span
                  key={subtotal}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-zinc-900"
                >
                  ₹{subtotal.toLocaleString("en-IN")}
                </motion.span>
              </div>
              <p className="mb-3 text-[11px] text-zinc-400">
                Taxes &amp; shipping calculated at checkout
              </p>
              <button
                disabled={items.length === 0}
                className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                  items.length > 0
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 active:bg-primary-800"
                    : "cursor-not-allowed bg-primary-200 text-primary-400"
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
