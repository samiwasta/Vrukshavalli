"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IconMail, IconLock, IconBrandGoogle } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
    setLoading(false);
    if (err) setError(err.message ?? "Sign in failed");
  };

  const handleGoogle = async () => {
    setError("");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-3xl border border-primary-200/80 bg-white/90 p-6 shadow-[0_8px_32px_rgba(7,61,43,0.08)] backdrop-blur sm:p-8"
    >
      <div className="mb-6 text-center sm:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="font-mono text-2xl font-semibold text-primary-800 sm:text-3xl"
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-1.5 font-sans text-sm text-primary-600/80"
        >
          Sign in to your account to continue
        </motion.p>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-primary-200 bg-white py-3.5 font-sans font-medium text-primary-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50/50"
      >
        <IconBrandGoogle size={22} stroke={1.5} />
        Continue with Google
      </motion.button>

      <div className="my-6 flex items-center gap-3 sm:my-8">
        <div className="h-px flex-1 bg-primary-200" />
        <span className="font-sans text-xs font-medium text-primary-500">or</span>
        <div className="h-px flex-1 bg-primary-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="relative"
        >
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-primary-700">
            Email
          </label>
          <div className="relative">
            <IconMail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
              stroke={1.5}
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-primary-200 bg-white py-3 pl-11 pr-4 font-sans text-primary-800 outline-none transition-all placeholder:text-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="you@example.com"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="relative"
        >
          <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-primary-700">
            Password
          </label>
          <div className="relative">
            <IconLock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
              stroke={1.5}
            />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-primary-200 bg-white py-3 pl-11 pr-4 font-sans text-primary-800 outline-none transition-all placeholder:text-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="••••••••"
            />
          </div>
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-red-600"
          >
            {error}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 font-sans font-semibold shadow-md transition-all hover:shadow-lg"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="mt-6 text-center font-sans text-sm text-primary-600"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary-600 underline-offset-2 hover:underline">
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
}
