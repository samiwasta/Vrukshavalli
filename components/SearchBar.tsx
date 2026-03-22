"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconSearch, IconLoader2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/util";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({
  placeholder = "Search plants...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  // 🔎 Fetch products (with abort protection)
  const fetchProducts = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`,
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Search error:", error);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 Trigger search on debounce
  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchProducts(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, fetchProducts]);

  // ❌ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⌨ Escape closes dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  const showDropdown =
    isOpen && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative max-w-md flex-1", className)}
    >
      {/* Search Input */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 border-primary-600 bg-white transition-all duration-200",
          showDropdown && "rounded-b-none border-b-0 rounded-t-2xl"
        )}
      >
        <IconSearch size={20} className="shrink-0 text-primary-600" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none"
        />

        {/* Loader / Clear */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <IconLoader2
                size={18}
                className="animate-spin text-primary-600"
              />
            </motion.div>
          ) : query.length > 0 ? (
            <motion.button
              key="clear"
              type="button"
              onClick={clearSearch}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <IconX size={18} />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-2xl border border-t-0 border-primary-600 bg-white shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2
                  size={24}
                  className="animate-spin text-primary-600"
                />
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto p-2">
                <p className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Products
                </p>

                <div className="space-y-1">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-primary-50"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-primary-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-zinc-900">
                          {product.name}
                        </h4>
                        <p className="text-sm font-semibold text-primary-600">
                          ₹
                          {Number(product.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {results.length === 5 && (
                  <div className="border-t border-primary-100 pt-2 mt-2">
                    <Link
                      href={`/product?search=${encodeURIComponent(query)}`}
                      onClick={handleResultClick}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
                    >
                      View all results
                      <IconSearch size={16} />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-zinc-900">
                  No products found
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Try searching for something else
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}