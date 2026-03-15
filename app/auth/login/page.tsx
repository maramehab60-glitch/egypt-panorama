"use client"

import Link from "next/link"
import type { UserProfile } from "@/lib/userProfile"
import { useLocale } from "next-intl"
import { useState } from "react"

export default function LoginPage() {
  const locale = useLocale()
  const isAr = locale === "ar"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const copy = {
    welcome: isAr ? "اهلا بعودتك" : "Welcome Back",
    title: isAr ? "تسجيل الدخول الى Egypt Panorama" : "Login to Egypt Panorama",
    subtitle: isAr
      ? "واصل رحلتك عبر ثقافة مصر وطبيعتها وتاريخها."
      : "Continue your journey through Egypt's culture, nature, and history.",
    email: isAr ? "البريد الالكتروني" : "Email",
    password: isAr ? "كلمة المرور" : "Password",
    passwordPlaceholder: isAr ? "ادخل كلمة المرور" : "Enter password",
    submit: isAr ? "تسجيل الدخول" : "Login",
    noAccount: isAr ? "ليس لديك حساب؟" : "Don't have an account?",
    signUp: isAr ? "انشاء حساب" : "Sign Up",
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let existingUser: Partial<UserProfile> = {}

    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        existingUser = JSON.parse(storedUser) as UserProfile
      }
    } catch {
      existingUser = {}
    }

    const user: UserProfile = {
      ...existingUser,
      email,
    }

    localStorage.setItem("user", JSON.stringify(user))

    window.location.href = "/"
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#080d1b_0%,#0d1528_55%,#1d2b44_100%)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/texture.jfif')] bg-cover bg-center opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/65 p-8 text-amber-50 shadow-[0_24px_70px_-28px_rgba(251,146,60,0.75)] backdrop-blur-xl"
      >
        <div className="space-y-2 text-center">
          <p className="inline-flex rounded-full border border-amber-200/40 bg-amber-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            {copy.welcome}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-amber-50">
            {copy.title}
          </h1>
          <p className="text-sm text-amber-100/80">
            {copy.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.email}</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.password}</span>
            <input
              type="password"
              placeholder={copy.passwordPlaceholder}
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-amber-400 to-orange-500 py-3 font-bold text-black shadow-[0_12px_30px_-15px_rgba(249,115,22,0.95)] transition hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-400"
        >
          {copy.submit}
        </button>

        <p className="text-center text-sm text-amber-100/80">
          {copy.noAccount}{" "}
          <Link href="/auth/signup" className="font-semibold text-amber-200 underline decoration-amber-300/70 underline-offset-4 transition hover:text-amber-100">
            {copy.signUp}
          </Link>
        </p>
      </form>
    </div>
  )
}