"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";

type Lang = "en" | "ar";

interface Company {
  id: number;
  name: Record<Lang, string>;
  location: Record<Lang, string>;
  rating: number;
  reviews: number;
  description: Record<Lang, string>;
  image: string;
  logoUrl: string;
  logoAlt: string;
  specialties: Record<Lang, string[]>;
  founded: string;
  tier: "Premium" | "Luxury" | "Boutique" | "Expert";
  tierColor: string;
}

const companies: Company[] = [
  {
    id: 1,
    name: { en: "Memphis Tours", ar: "ممفيس تورز" },
    location: { en: "Cairo", ar: "القاهرة" },
    rating: 4.9,
    reviews: 14820,
    description: {
      en: "Egypt's leading travel operator with curated journeys through ancient sites and Nile wonders.",
      ar: "شركة رائدة في السياحة تقدم رحلات متكاملة عبر المعالم الأثرية ونهر النيل.",
    },
    image: "/images/memphis%20tours%20background.jpg",
    logoUrl: "/images/companies/logos/memphis-tours.png",
    logoAlt: "Memphis Tours logo",
    specialties: {
      en: ["Nile Cruises", "Cultural Tours", "Desert Safaris"],
      ar: ["رحلات نيلية", "جولات ثقافية", "سفاري الصحراء"],
    },
    founded: "1994",
    tier: "Premium",
    tierColor: "#C9A84C",
  },
  {
    id: 2,
    name: { en: "Travco Group", ar: "مجموعة ترافكو" },
    location: { en: "Cairo", ar: "القاهرة" },
    rating: 4.8,
    reviews: 11340,
    description: {
      en: "A major hospitality and travel group known for premium services across Egypt.",
      ar: "مجموعة كبرى في الضيافة والسفر تقدم خدمات سياحية متميزة في مصر.",
    },
    image: "/images/companies/covers/travco-group.jpg",
    logoUrl: "/images/companies/logos/travco-group.png",
    logoAlt: "Travco Group logo",
    specialties: {
      en: ["Luxury Packages", "MICE Events", "Nile Cruises"],
      ar: ["باقات فاخرة", "فعاليات ومؤتمرات", "رحلات نيلية"],
    },
    founded: "1979",
    tier: "Luxury",
    tierColor: "#E8A000",
  },
  {
    id: 3,
    name: { en: "Abercrombie & Kent Egypt", ar: "أبركرومبي آند كنت مصر" },
    location: { en: "Cairo", ar: "القاهرة" },
    rating: 4.9,
    reviews: 8960,
    description: {
      en: "High-end private travel experiences with exclusive cultural access and luxury planning.",
      ar: "تجارب سفر فاخرة وخاصة مع وصول حصري وخطط رحلات راقية.",
    },
    image: "/images/abercrombie_and_kent_egypt_Background.jpg",
    logoUrl: "/images/abercrombie_and_kent_egypt_logo.jpg",
    logoAlt: "Abercrombie and Kent logo",
    specialties: {
      en: ["Private Travel", "Exclusive Access", "Ultra-Luxury"],
      ar: ["سفر خاص", "وصول حصري", "فخامة عالية"],
    },
    founded: "1962",
    tier: "Luxury",
    tierColor: "#E8A000",
  },
  {
    id: 4,
    name: { en: "Egypt Tailor Made", ar: "إيجيبت تيلور ميد" },
    location: { en: "Luxor", ar: "الأقصر" },
    rating: 4.7,
    reviews: 5670,
    description: {
      en: "Bespoke itineraries tailored to archaeology lovers, culture seekers, and adventurers.",
      ar: "برامج مخصصة لعشاق الآثار والثقافة والمغامرات.",
    },
    image: "/images/egypt%20tailor%20made%20background.jpg",
    logoUrl: "/images/egypt%20tailor%20made.jpg",
    logoAlt: "Egypt Tailor Made logo",
    specialties: {
      en: ["Custom Itineraries", "Egyptology", "Adventure"],
      ar: ["برامج مخصصة", "علم المصريات", "مغامرات"],
    },
    founded: "2008",
    tier: "Boutique",
    tierColor: "#4A8B5C",
  },
  {
    id: 5,
    name: { en: "Nile Explorers", ar: "نايل إكسبلوررز" },
    location: { en: "Aswan", ar: "أسوان" },
    rating: 4.8,
    reviews: 7210,
    description: {
      en: "Experts in Upper Egypt and Nile routes with authentic local experiences.",
      ar: "متخصصون في صعيد مصر ومسارات النيل بتجارب محلية أصيلة.",
    },
    image: "/images/companies/covers/nile-explorers.jpg",
    logoUrl: "/images/nile%20explorers%20logo.png",
    logoAlt: "Nile Explorers logo",
    specialties: {
      en: ["Felucca Voyages", "Dahabiya Cruises", "Aswan Tours"],
      ar: ["رحلات فلوكة", "رحلات دهبية", "جولات أسوان"],
    },
    founded: "2001",
    tier: "Expert",
    tierColor: "#2A7B9B",
  },
  {
    id: 6,
    name: { en: "Sinai Safari Adventures", ar: "سيناء سفاري" },
    location: { en: "Sharm El-Sheikh", ar: "شرم الشيخ" },
    rating: 4.7,
    reviews: 4890,
    description: {
      en: "Adventure-focused Sinai experiences from diving to mountain sunrise trips.",
      ar: "رحلات مغامرة في سيناء من الغوص لرحلات الجبال والشروق.",
    },
    image: "/images/companies/covers/sinai-safari-adventures.jpg",
    logoUrl: "/images/sinai%20safari%20logo.png",
    logoAlt: "Sinai Safari Adventures logo",
    specialties: {
      en: ["Diving", "Desert Camps", "Sinai Treks"],
      ar: ["غوص", "مخيمات صحراوية", "رحلات سيناء"],
    },
    founded: "2005",
    tier: "Expert",
    tierColor: "#2A7B9B",
  },
  {
    id: 7,
    name: { en: "Oasis Desert Tours", ar: "واحات ديزرت تورز" },
    location: { en: "Siwa", ar: "سيوة" },
    rating: 4.6,
    reviews: 3140,
    description: {
      en: "Western Desert specialists covering Siwa, White Desert, and 4x4 expeditions.",
      ar: "متخصصون في الصحراء الغربية وسيوة ورحلات الدفع الرباعي.",
    },
    image: "/images/companies/covers/oasis-desert-tours.jpg",
    logoUrl: "/images/oasis%20desert%20tours%20logo.jpg",
    logoAlt: "Oasis Desert Tours logo",
    specialties: {
      en: ["4x4 Expeditions", "Oasis Tours", "Camping"],
      ar: ["دفع رباعي", "جولات الواحات", "تخييم"],
    },
    founded: "2010",
    tier: "Boutique",
    tierColor: "#4A8B5C",
  },
  {
    id: 8,
    name: { en: "Pharaoh's Choice Travel", ar: "فرعونز تشويس" },
    location: { en: "Alexandria", ar: "الإسكندرية" },
    rating: 4.8,
    reviews: 6320,
    description: {
      en: "Culture-rich routes connecting Alexandria, Cairo, and Delta heritage.",
      ar: "رحلات ثقافية تربط الإسكندرية بالقاهرة وتراث الدلتا.",
    },
    image: "/images/pharaoh%27s%20choice%20travel%20background.png",
    logoUrl: "/images/pharaoh%27s%20choice%20travel%20logo.png",
    logoAlt: "Pharaoh's Choice Travel logo",
    specialties: {
      en: ["Alexandria", "Heritage Tours", "Day Trips"],
      ar: ["الإسكندرية", "جولات تراثية", "رحلات يومية"],
    },
    founded: "2003",
    tier: "Premium",
    tierColor: "#C9A84C",
  },
  {
    id: 9,
    name: { en: "Red Sea Diving Safari", ar: "ريد سي دايفنج سفاري" },
    location: { en: "Hurghada", ar: "الغردقة" },
    rating: 4.9,
    reviews: 9870,
    description: {
      en: "Top Red Sea diving operator for reefs, wreck dives, and liveaboard trips.",
      ar: "شركة غوص رائدة في البحر الأحمر للشعاب والحطام ورحلات اللايف أبورد.",
    },
    image: "/images/companies/covers/red-sea-diving-safari.jpg",
    logoUrl: "/images/companies/logos/red-sea-diving-safari.png",
    logoAlt: "Red Sea Diving Safari logo",
    specialties: {
      en: ["Liveaboards", "PADI Diving", "Wreck Diving"],
      ar: ["لايف أبورد", "غوص بادي", "غوص حطام"],
    },
    founded: "1990",
    tier: "Expert",
    tierColor: "#2A7B9B",
  },
];

const enCopy = {
  badge: "Egypt Panorama",
  titleFirst: "Tourism",
  titleAccent: "Companies",
  titleLast: "in Egypt",
  subtitle: "Discover verified tourism companies and choose the one that matches your style.",
  searchPlaceholder: "Search by company, city, or specialty...",
  tiers: ["All", "Luxury", "Premium", "Expert", "Boutique"],
  allCities: "All Cities",
  cities: ["Cairo", "Luxor", "Aswan", "Sharm El-Sheikh", "Siwa", "Alexandria", "Hurghada"],
  found: "found",
  companiesLabel: "companies",
  section: "Verified Companies",
  viewPackages: "View Packages",
  planTrip: "Plan Trip",
  noResults: "No companies found",
  clearFilters: "Clear Filters",
  stats: {
    total: "Listed Companies",
    cities: "Cities Covered",
    avgRating: "Average Rating",
  },
  ctaTitle: "Need help choosing a company?",
  ctaText: "Use Plan Suggestion and get a route tailored to your travel interests.",
  ctaButton: "Start Planning",
};

const arCopy = {
  badge: "ايجيبت بانوراما",
  titleFirst: "شركات",
  titleAccent: "السياحة",
  titleLast: "في مصر",
  subtitle: "اكتشف شركات سياحية موثوقة واختر الأنسب لأسلوب رحلتك.",
  searchPlaceholder: "ابحث باسم الشركة او المدينة او التخصص...",
  tiers: ["الكل", "فاخر", "بريميوم", "خبير", "بوتيك"],
  allCities: "كل المدن",
  cities: ["القاهرة", "الأقصر", "أسوان", "شرم الشيخ", "سيوة", "الإسكندرية", "الغردقة"],
  found: "نتيجة",
  companiesLabel: "شركة",
  section: "شركات موثقة",
  viewPackages: "عرض الباقات",
  planTrip: "خطط رحلتك",
  noResults: "لا توجد شركات مطابقة",
  clearFilters: "مسح الفلاتر",
  stats: {
    total: "شركة مسجلة",
    cities: "مدينة مغطاة",
    avgRating: "متوسط التقييم",
  },
  ctaTitle: "تحتاج مساعدة في اختيار الشركة؟",
  ctaText: "استخدم اقتراح الخطة لتحصل على مسار يناسب اهتماماتك.",
  ctaButton: "ابدأ التخطيط",
};

function getTierLabel(tier: Company["tier"], isArabic: boolean): string {
  if (!isArabic) return tier;

  if (tier === "Luxury") return "فاخر";
  if (tier === "Premium") return "بريميوم";
  if (tier === "Expert") return "خبير";
  return "بوتيك";
}

function LogoBadge({ src, alt, tierColor }: { src: string; alt: string; tierColor: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "14px",
        left: "14px",
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.9)",
        border: `2px solid ${tierColor}80`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {failed ? (
        <span style={{ color: "#1a1610", fontWeight: 700, fontSize: "0.8rem" }}>LOGO</span>
      ) : (
        <Image src={src} alt={alt} width={44} height={44} onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export default function TourismCompaniesPage() {
  const locale = (useLocale() === "ar" ? "ar" : "en") as Lang;
  const isArabic = locale === "ar";
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState(isArabic ? "الكل" : "All");
  const [activeCity, setActiveCity] = useState(isArabic ? "كل المدن" : "All Cities");

  const copy = isArabic ? arCopy : enCopy;

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const companyName = company.name[locale].toLowerCase();
      const location = company.location[locale].toLowerCase();
      const specialties = company.specialties[locale].map((entry) => entry.toLowerCase());
      const query = search.toLowerCase();

      const tierLabel = getTierLabel(company.tier, isArabic);

      const cityFilterOk = activeCity === copy.allCities || company.location[locale] === activeCity;
      const tierFilterOk = activeTier === copy.tiers[0] || tierLabel === activeTier;
      const searchOk =
        !query || companyName.includes(query) || location.includes(query) || specialties.some((entry) => entry.includes(query));

      return cityFilterOk && tierFilterOk && searchOk;
    });
  }, [activeCity, activeTier, copy.allCities, copy.tiers, isArabic, locale, search]);

  const avgRating = useMemo(() => {
    const total = companies.reduce((acc, company) => acc + company.rating, 0);
    return (total / companies.length).toFixed(1);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setActiveTier(copy.tiers[0]);
    setActiveCity(copy.allCities);
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 0%, #22170c 0%, #0e0a06 45%, #090704 100%)",
        color: "#f7f0e3",
      }}
    >
      <section
        style={{
          position: "relative",
          minHeight: "52vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(232,160,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
              backgroundImage: "url('/images/memphis%20tours%20background.jpg')",
            backgroundPosition: "center 30%",
            backgroundSize: "cover",
            filter: "brightness(0.35) saturate(0.9)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(17,12,8,0.45) 0%, rgba(11,8,5,0.95) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 920, padding: "2rem 1rem" }}>
          <p style={{ letterSpacing: "0.2em", color: "#e8a000", fontSize: "0.72rem", textTransform: "uppercase", marginBottom: "1rem" }}>
            {copy.badge}
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 4.6rem)", lineHeight: 1.12, fontWeight: 800, marginBottom: "1rem" }}>
            {copy.titleFirst} <span style={{ color: "#e8a000" }}>{copy.titleAccent}</span> {copy.titleLast}
          </h1>
          <p style={{ maxWidth: 680, margin: "0 auto", color: "rgba(247,240,227,0.78)", lineHeight: 1.7, fontSize: "1rem" }}>{copy.subtitle}</p>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "2rem 1rem 1rem" }}>
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.6rem" }}>
            <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.7rem", background: "rgba(255,255,255,0.03)" }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(247,240,227,0.7)" }}>{copy.stats.total}</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8d084" }}>{companies.length}</p>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.7rem", background: "rgba(255,255,255,0.03)" }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(247,240,227,0.7)" }}>{copy.stats.cities}</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8d084" }}>{copy.cities.length}</p>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.7rem", background: "rgba(255,255,255,0.03)" }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(247,240,227,0.7)" }}>{copy.stats.avgRating}</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8d084" }}>{avgRating}</p>
            </div>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.searchPlaceholder}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(232,160,0,0.35)",
              background: "rgba(255,255,255,0.03)",
              color: "#f7f0e3",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
            {copy.tiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 999,
                  border: activeTier === tier ? "1px solid #e8a000" : "1px solid rgba(255,255,255,0.2)",
                  background: activeTier === tier ? "rgba(232,160,0,0.18)" : "rgba(255,255,255,0.04)",
                  color: activeTier === tier ? "#f8cf75" : "#ece3d1",
                  cursor: "pointer",
                }}
              >
                {tier}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
            {[copy.allCities, ...copy.cities].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: 999,
                  border: activeCity === city ? "1px solid rgba(74,139,92,0.95)" : "1px solid rgba(255,255,255,0.2)",
                  background: activeCity === city ? "rgba(74,139,92,0.2)" : "rgba(255,255,255,0.03)",
                  color: activeCity === city ? "#89c79a" : "#d6c9b3",
                  cursor: "pointer",
                }}
              >
                {city}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.7rem", flexWrap: "wrap" }}>
            <p style={{ color: "rgba(247,240,227,0.58)", marginTop: "0.3rem" }}>
              {filtered.length} {copy.companiesLabel} {copy.found}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.04)",
                color: "#e9dfcb",
                cursor: "pointer",
                fontSize: "0.78rem",
              }}
            >
              {copy.clearFilters}
            </button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0.5rem 1rem 5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.4rem" }}>
          <p style={{ color: "#e8a000", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.72rem" }}>{copy.section}</p>
          <div style={{ flex: 1, height: 1, background: "rgba(232,160,0,0.2)" }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "2rem", textAlign: "center", color: "#d8c8aa" }}>
            {copy.noResults}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.2rem" }}>
            {filtered.map((company) => (
              <article
                key={company.id}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "linear-gradient(180deg, #171108 0%, #100c07 100%)",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ position: "relative", height: 198 }}>
                  <Image src={company.image} alt={company.name[locale]} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", filter: "brightness(0.64)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0.78) 100%)" }} />

                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: isArabic ? "auto" : 12,
                      right: isArabic ? 12 : "auto",
                      borderRadius: 999,
                      fontSize: "0.66rem",
                      padding: "0.2rem 0.6rem",
                      border: `1px solid ${company.tierColor}`,
                      color: company.tierColor,
                      background: "rgba(0,0,0,0.5)",
                    }}
                  >
                    {getTierLabel(company.tier, isArabic)}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: isArabic ? "auto" : 12,
                      left: isArabic ? 12 : "auto",
                      borderRadius: 999,
                      fontSize: "0.66rem",
                      padding: "0.2rem 0.6rem",
                      border: "1px solid rgba(255,255,255,0.26)",
                      color: "rgba(247,240,227,0.8)",
                      background: "rgba(0,0,0,0.5)",
                    }}
                  >
                    {`Est. ${company.founded}`}
                  </div>

                  <LogoBadge src={company.logoUrl} alt={company.logoAlt} tierColor={company.tierColor} />

                  <div
                    style={{
                      position: "absolute",
                      bottom: 18,
                      left: isArabic ? "auto" : 72,
                      right: isArabic ? 72 : "auto",
                      fontSize: "0.78rem",
                      color: "rgba(247,240,227,0.78)",
                    }}
                  >
                    {company.location[locale]}
                  </div>
                </div>

                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1.02rem", marginBottom: "0.36rem", color: "#f7f0e3" }}>{company.name[locale]}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.38rem", color: "#e8a000", fontSize: "0.8rem", marginBottom: "0.44rem" }}>
                    <span>{"★".repeat(Math.floor(company.rating))}</span>
                    <span style={{ color: "#f0c762" }}>{company.rating}</span>
                    <span style={{ color: "rgba(247,240,227,0.6)" }}>{`(${company.reviews.toLocaleString()})`}</span>
                  </div>
                  <p style={{ color: "rgba(247,240,227,0.7)", lineHeight: 1.65, minHeight: 66, fontSize: "0.9rem", marginBottom: "0.7rem" }}>
                    {company.description[locale]}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.9rem" }}>
                    {company.specialties[locale].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          border: "1px solid rgba(255,255,255,0.16)",
                          color: "rgba(247,240,227,0.75)",
                          fontSize: "0.68rem",
                          borderRadius: 999,
                          padding: "0.22rem 0.55rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
                    <button
                      type="button"
                      style={{
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "transparent",
                        color: "#ece1cc",
                        padding: "0.55rem 0.4rem",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      {copy.viewPackages}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/plan?company=${encodeURIComponent(company.name.en)}`)}
                      style={{
                        borderRadius: 10,
                        border: "none",
                        background: `linear-gradient(135deg, ${company.tierColor}, ${company.tierColor}ba)`,
                        color: "#14100b",
                        padding: "0.55rem 0.4rem",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      {copy.planTrip}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ borderTop: "1px solid rgba(232,160,0,0.2)", padding: "3.3rem 1rem 4rem", textAlign: "center", background: "linear-gradient(130deg, #120e07 0%, #1a140b 55%, #0f1820 100%)" }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2.3rem)", marginBottom: "0.8rem" }}>{copy.ctaTitle}</h2>
        <p style={{ color: "rgba(247,240,227,0.74)", maxWidth: 640, margin: "0 auto 1.2rem" }}>{copy.ctaText}</p>
        <Link
          href="/plan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.8rem 1.4rem",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 700,
            color: "#14100b",
            background: "linear-gradient(135deg, #e8a000 0%, #c9a84c 100%)",
          }}
        >
          {copy.ctaButton}
        </Link>
      </section>
    </div>
  );
}
