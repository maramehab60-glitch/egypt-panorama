"use client"

import CountrySelect from "@/components/auth/CountrySelect"
import Link from "next/link"
import { nationalityOptions, phoneCountryOptions, getNationalityFlag, type Gender, type UserProfile } from "@/lib/userProfile"
import { useLocale } from "next-intl"
import { useState } from "react"

export default function SignupPage() {
  const locale = useLocale()
  const isAr = locale === "ar"
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationality, setNationality] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneCountry, setPhoneCountry] = useState("EG")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState<Gender | "">("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const selectedPhoneCountry = phoneCountryOptions.find((option) => option.value === phoneCountry) ?? phoneCountryOptions[0]
  const copy = {
    required: isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields.",
    mismatch: isAr ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.",
    passwordMin: isAr ? "يجب أن تكون كلمة المرور 10 أحرف على الأقل." : "Password must be at least 10 characters.",
    passwordCapital: isAr ? "يجب أن تبدأ كلمة المرور بحرف كبير." : "Password must start with a capital letter.",
    passwordSpecial: isAr ? "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (!@#$%^&*…)." : "Password must contain at least one special character (!@#$%^&*…).",
    join: isAr ? "انضم الى Egypt Panorama" : "Join Egypt Panorama",
    title: isAr ? "انشئ حسابك" : "Create Your Account",
    subtitle: isAr
      ? "ابدأ التخطيط لمغامرتك القادمة في مصر من مكان واحد."
      : "Start planning your next Egyptian adventure in one place.",
    firstName: isAr ? "الاسم الاول" : "First Name",
    firstNamePlaceholder: isAr ? "اكتب الاسم الاول" : "Enter first name",
    lastName: isAr ? "اسم العائلة" : "Last Name",
    lastNamePlaceholder: isAr ? "اكتب اسم العائلة" : "Enter last name",
    nationality: isAr ? "الجنسية" : "Nationality",
    nationalityPlaceholder: isAr ? "اختر الجنسية" : "Select nationality",
    nationalitySearch: isAr ? "ابحث عن الدولة" : "Search countries",
    nationalityEmpty: isAr ? "لا توجد دول مطابقة" : "No matching countries",
    email: isAr ? "البريد الالكتروني" : "Email",
    password: isAr ? "كلمة المرور" : "Password",
    passwordPlaceholder: isAr ? "انشئ كلمة مرور" : "Create a password",
    phone: isAr ? "رقم الهاتف" : "Phone",
    phoneCode: isAr ? "مفتاح الدولة" : "Country code",
    phoneHint: isAr ? "أدخل رقم الهاتف بدون مفتاح الدولة" : "Enter the phone number without the country code",
    gender: isAr ? "النوع" : "Gender",
    genderPlaceholder: isAr ? "اختر النوع" : "Select gender",
    genderMale: isAr ? "ذكر" : "Male",
    genderFemale: isAr ? "انثى" : "Female",
    genderPreferNot: isAr ? "افضل عدم التحديد" : "Prefer not to say",
    confirmPassword: isAr ? "تأكيد كلمة المرور" : "Confirm Password",
    confirmPlaceholder: isAr ? "اكد كلمة المرور" : "Confirm password",
    submit: isAr ? "انشاء حساب" : "Sign Up",
    hasAccount: isAr ? "لديك حساب بالفعل؟" : "Already have an account?",
    login: isAr ? "تسجيل الدخول" : "Login",
  }

  function getPasswordValidationError(value: string) {
    if (!value) {
      return ""
    }

    if (value.length < 10) {
      return copy.passwordMin
    }

    if (!/^[A-Z]/.test(value)) {
      return copy.passwordCapital
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value)) {
      return copy.passwordSpecial
    }

    return ""
  }

  const passwordLiveError = getPasswordValidationError(password)

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const hasMissingRequired =
      !firstName.trim() ||
      !lastName.trim() ||
      !nationality.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phoneCountry.trim() ||
      !phone.trim() ||
      !gender

    if (hasMissingRequired) {
      setError(copy.required)
      return
    }

    const passwordError = getPasswordValidationError(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError(copy.mismatch)
      return
    }

    const user: UserProfile = {
      firstName,
      lastName,
      nationality,
      email,
      phone: `${selectedPhoneCountry.dialCode} ${phone.trim()}`,
      phoneCountry,
      gender,
    }

    localStorage.setItem("user", JSON.stringify(user))
    window.location.href = "/"
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#080d1b_0%,#0d1528_55%,#1d2b44_100%)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/texture.jfif')] bg-cover bg-center opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-24 top-6 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/65 p-8 text-amber-50 shadow-[0_24px_70px_-28px_rgba(251,146,60,0.75)] backdrop-blur-xl"
      >
        <div className="space-y-2 text-center">
          <p className="inline-flex rounded-full border border-amber-200/40 bg-amber-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            {copy.join}
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
            <span className="text-sm font-semibold text-amber-100">{copy.firstName}</span>
            <input
              type="text"
              placeholder={copy.firstNamePlaceholder}
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.lastName}</span>
            <input
              type="text"
              placeholder={copy.lastNamePlaceholder}
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.nationality}</span>
            <CountrySelect
              value={nationality}
              onChange={setNationality}
              options={nationalityOptions}
              locale={isAr ? "ar" : "en"}
              placeholder={copy.nationalityPlaceholder}
              searchPlaceholder={copy.nationalitySearch}
              emptyLabel={copy.nationalityEmpty}
            />
          </label>

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
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              required
            />
            {passwordLiveError && (
              <p className="text-xs text-red-200">{passwordLiveError}</p>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.confirmPassword}</span>
            <input
              type="password"
              placeholder={copy.confirmPlaceholder}
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError("")
              }}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.phone}</span>
            <div className="grid grid-cols-[7.25rem_minmax(0,1fr)] gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <select
                className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-3 py-3 text-xs text-amber-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35 sm:px-4 sm:text-sm"
                value={phoneCountry}
                onChange={(e) => {
                  setPhoneCountry(e.target.value)
                  setError("")
                }}
                aria-label={copy.phoneCode}
                required
              >
                {phoneCountryOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900 text-amber-100">
                    {getNationalityFlag(option.value)} {(isAr ? option.ar : option.en)} ({option.dialCode})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                placeholder="e.g. 1234567890"
                className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-3 py-3 text-sm text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35 sm:px-4"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setError("")
                }}
                required
              />
            </div>
            <p className="text-xs text-amber-100/60">{copy.phoneHint}</p>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-amber-100">{copy.gender}</span>
            <select
              className="w-full rounded-xl border border-amber-200/30 bg-black/25 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender | "")}
              required
            >
              <option value="" disabled className="bg-slate-900 text-amber-100">
                {copy.genderPlaceholder}
              </option>
              <option value="male" className="bg-slate-900 text-amber-100">{copy.genderMale}</option>
              <option value="female" className="bg-slate-900 text-amber-100">{copy.genderFemale}</option>
              <option value="prefer_not_to_say" className="bg-slate-900 text-amber-100">{copy.genderPreferNot}</option>
            </select>
          </label>
        </div>

        {error && (
          <p className="rounded-lg border border-red-300/50 bg-red-900/20 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-amber-400 to-orange-500 py-3 font-bold text-black shadow-[0_12px_30px_-15px_rgba(249,115,22,0.95)] transition hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-400"
        >
          {copy.submit}
        </button>

        <p className="text-center text-sm text-amber-100/80">
          {copy.hasAccount}{" "}
          <Link href="/auth/login" className="font-semibold text-amber-200 underline decoration-amber-300/70 underline-offset-4 transition hover:text-amber-100">
            {copy.login}
          </Link>
        </p>
      </form>
    </div>
  )
}
