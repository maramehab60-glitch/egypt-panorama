"use client";
import { useLocale } from "next-intl";
import { useState, useEffect, useMemo, useRef, useId } from "react";
import Image from "next/image";

type DestinationType = "Cultural" | "Eco & Wellness" | "Desert" | "Sea & Diving";
type FilterOption = "All" | DestinationType;
type SortOption = "popular" | "rating" | "reviews" | "alpha";

interface Destination {
  id: number;
  name: string;
  city: string;
  region: string;
  rating: number;
  reviews: number;
  type: DestinationType;
  desc: string;
  image: string;
  imagePosition?: string;
  badge: string;
  featured: boolean;
}

type DestinationTranslation = {
  name: string;
  city: string;
  region: string;
  desc: string;
  badge: string;
};

const useInView = <T extends HTMLElement>(threshold = 0.1): [React.RefObject<T | null>, boolean] => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const destinationsEn: Destination[] = [
  {
    id: 1,
    name: "Pyramids of Giza",
    city: "Cairo",
    region: "Greater Cairo",
    rating: 4.9,
    reviews: 18420,
    type: "Cultural",
    desc: "The last surviving wonder of the ancient world. Three monumental pyramids rising from the desert plateau, guarding secrets of a civilization lost to time.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Giza-pyramids.JPG",
    imagePosition: "center 58%",
    badge: "Wonder of the World",
    featured: true,
  },
  {
    id: 2,
    name: "Luxor Temple",
    city: "Luxor",
    region: "Upper Egypt",
    rating: 4.8,
    reviews: 12340,
    type: "Cultural",
    desc: "A grand ancient Egyptian temple complex standing on the east bank of the Nile, illuminated magnificently each evening under the desert sky.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luxor_Temple_at_night,_Luxor,_Egypt.jpg",
    imagePosition: "center 50%",
    badge: "Ancient Temple",
    featured: false,
  },
  {
    id: 3,
    name: "Abu Simbel",
    city: "Aswan",
    region: "Upper Egypt",
    rating: 4.9,
    reviews: 9870,
    type: "Cultural",
    desc: "Two massive rock temples carved into a mountainside by Ramesses II. Twice a year, sunlight aligns perfectly to illuminate the inner sanctuary.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Abu_Simbel_Temple_May_30_2007.jpg",
    imagePosition: "center 42%",
    badge: "UNESCO Heritage",
    featured: true,
  },
  {
    id: 4,
    name: "Siwa Oasis",
    city: "Siwa",
    region: "Western Desert",
    rating: 4.7,
    reviews: 6210,
    type: "Eco & Wellness",
    desc: "A remote paradise of fresh springs, ancient mud-brick ruins, and salt lakes nestled deep in the Sahara — a sanctuary of silence and stars.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Siwa_Oasis,_Western_Desert,_Egypt.jpg",
    imagePosition: "center 58%",
    badge: "Desert Gem",
    featured: false,
  },
  {
    id: 5,
    name: "Karnak Temple",
    city: "Luxor",
    region: "Upper Egypt",
    rating: 4.8,
    reviews: 14100,
    type: "Cultural",
    desc: "The largest ancient religious site in the world — a vast complex of sanctuaries, pylons, and obelisks built over 2,000 years of pharaonic history.",
    image: "/images/ancient-ruins-of-karnak-temple-in-egypt.jpg",
    imagePosition: "center 40%",
    badge: "Ancient Wonder",
    featured: false,
  },
  {
    id: 6,
    name: "White Desert",
    city: "Farafra",
    region: "Western Desert",
    rating: 4.7,
    reviews: 5430,
    type: "Desert",
    desc: "A surreal moonscape of chalk-white rock formations sculpted by centuries of wind, glowing ethereally under moonlight in the heart of Egypt.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/White_Desert,_Egypt.jpg",
    imagePosition: "center 60%",
    badge: "Natural Marvel",
    featured: false,
  },
  {
    id: 7,
    name: "Bibliotheca Alexandrina",
    city: "Alexandria",
    region: "Mediterranean Coast",
    rating: 4.6,
    reviews: 8760,
    type: "Cultural",
    desc: "A breathtaking modern homage to the legendary ancient Library of Alexandria — a beacon of knowledge overlooking the Mediterranean Sea.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexandrina_Library_in_Alexandria,_Egypt._03.jpg",
    imagePosition: "center 52%",
    badge: "Icon of Knowledge",
    featured: false,
  },
  {
    id: 8,
    name: "Ras Mohamed",
    city: "Sharm El-Sheikh",
    region: "South Sinai",
    rating: 4.8,
    reviews: 10980,
    type: "Sea & Diving",
    desc: "Egypt's premier marine national park where the Red Sea reveals an underwater kingdom of vibrant coral walls, sea turtles, and reef sharks.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Coral_reef_in_Ras_Muhammad_nature_park.JPG",
    imagePosition: "center",
    badge: "Marine Reserve",
    featured: true,
  },
  {
    id: 9,
    name: "Valley of the Kings",
    city: "Luxor",
    region: "Upper Egypt",
    rating: 4.9,
    reviews: 16230,
    type: "Cultural",
    desc: "The royal necropolis of ancient Egypt's greatest pharaohs. Sixty-three tombs carved into limestone cliffs, adorned with vivid hieroglyphic murals.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_the_Kings_panorama.jpg",
    imagePosition: "center 42%",
    badge: "Royal Necropolis",
    featured: true,
  },
];

const typeColors: Record<DestinationType, { bg: string; border: string; text: string }> = {
  "Cultural":     { bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.35)",  text: "#C9A84C" },
  "Eco & Wellness":{ bg: "rgba(74,139,92,0.12)",  border: "rgba(74,139,92,0.35)",   text: "#4A8B5C" },
  "Desert":       { bg: "rgba(212,129,58,0.12)",  border: "rgba(212,129,58,0.35)",  text: "#D4813A" },
  "Sea & Diving": { bg: "rgba(42,123,155,0.12)",  border: "rgba(42,123,155,0.35)",  text: "#2A7B9B" },
};

const filters: FilterOption[] = ["All", "Cultural", "Desert", "Sea & Diving", "Eco & Wellness"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "alpha", label: "A-Z" },
];

const destinationArById: Record<number, DestinationTranslation> = {
  1: {
    name: "اهرامات الجيزة",
    city: "القاهرة",
    region: "القاهرة الكبرى",
    desc: "اخر عجائب العالم القديم الباقية. ثلاث اهرامات عملاقة ترتفع فوق الهضبة وتحمل اسرار حضارة خالدة.",
    badge: "عجيبة عالمية",
  },
  2: {
    name: "معبد الاقصر",
    city: "الاقصر",
    region: "صعيد مصر",
    desc: "مجمع معابد مصري عريق على الضفة الشرقية للنيل يتوهج ليلا في مشهد مهيب.",
    badge: "معبد اثري",
  },
  3: {
    name: "ابو سمبل",
    city: "اسوان",
    region: "صعيد مصر",
    desc: "معبدان منحوتان في الجبل شيدهما رمسيس الثاني، وتتعامد الشمس داخلهما مرتين سنويا.",
    badge: "تراث عالمي",
  },
  4: {
    name: "واحة سيوة",
    city: "سيوة",
    region: "الصحراء الغربية",
    desc: "جنة صحراوية من العيون والبحيرات المالحة والاطلال الطينية القديمة في قلب الصحراء.",
    badge: "جوهرة الصحراء",
  },
  5: {
    name: "معبد الكرنك",
    city: "الاقصر",
    region: "صعيد مصر",
    desc: "اكبر موقع ديني اثري في العالم يضم صروحا واعمدة ومسلات شيدت عبر قرون طويلة.",
    badge: "اعجوبة اثرية",
  },
  6: {
    name: "الصحراء البيضاء",
    city: "الفرافرة",
    region: "الصحراء الغربية",
    desc: "تشكيلات طباشيرية بيضاء نحتتها الرياح عبر الزمن لتصنع مشهدا قمريا فريدا.",
    badge: "اعجوبة طبيعية",
  },
  7: {
    name: "مكتبة الاسكندرية",
    city: "الاسكندرية",
    region: "ساحل المتوسط",
    desc: "صرح ثقافي حديث يستلهم مكتبة الاسكندرية القديمة ويطل على البحر المتوسط.",
    badge: "منارة المعرفة",
  },
  8: {
    name: "راس محمد",
    city: "شرم الشيخ",
    region: "جنوب سيناء",
    desc: "اشهر محمية بحرية في مصر بعالم ساحر من الشعاب المرجانية والسلاحف والاسماك النادرة.",
    badge: "محمية بحرية",
  },
  9: {
    name: "وادي الملوك",
    city: "الاقصر",
    region: "صعيد مصر",
    desc: "مقابر ملوك مصر القديمة المنحوتة في الجبال والمزينة بنقوش مذهلة تحكي التاريخ.",
    badge: "جبانة الملوك",
  },
};

const typeLabelAr: Record<DestinationType, string> = {
  "Cultural": "ثقافي",
  "Eco & Wellness": "بيئي واستجمام",
  "Desert": "صحراوي",
  "Sea & Diving": "بحري وغوص",
};

const typeFallbackImages: Record<DestinationType, string> = {
  "Cultural": "/images/cultural.jfif",
  "Eco & Wellness": "/images/wellness.jpg",
  "Desert": "/images/desert.jpg",
  "Sea & Diving": "/images/sea.jpg",
};

function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const gradientId = useId();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i <= full ? "#E8A000" : half && i === full + 1 ? `url(#${gradientId})` : "#2A2418"}
            stroke="#E8A000"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="#E8A000"/>
              <stop offset="50%" stopColor="#2A2418"/>
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}

function DestinationCard({ dest, index, isAr }: { dest: Destination; index: number; isAr: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.08);
  const [hovered, setHovered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const tc = typeColors[dest.type] || typeColors["Cultural"];
  const fallbackSrc = typeFallbackImages[dest.type];
  const resolvedImageSrc = imageFailed ? fallbackSrc : dest.image;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#110E09",
        border: `1px solid ${hovered ? "rgba(232,160,0,0.45)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.7s ease ${(index % 3) * 0.1}s, transform 0.7s ease ${(index % 3) * 0.1}s, border-color 0.3s ease, box-shadow 0.3s ease`,
        boxShadow: hovered
          ? "0 20px 60px rgba(232,160,0,0.12), 0 0 0 1px rgba(232,160,0,0.08)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: "220px", flexShrink: 0 }}>
        <Image
          src={resolvedImageSrc}
          alt={dest.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            if (!imageFailed) {
              setImageFailed(true);
            }
          }}
          style={{
            objectFit: "cover",
            objectPosition: dest.imagePosition || "center",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(17,14,9,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }} />
        {/* Type badge */}
        <div style={{
          position: "absolute", top: "14px", left: "14px",
          background: tc.bg, border: `1px solid ${tc.border}`,
          color: tc.text, padding: "4px 11px",
          borderRadius: "20px", fontSize: "0.68rem",
          fontFamily: "'Cinzel', serif", letterSpacing: "0.08em",
          backdropFilter: "blur(8px)",
        }}>
          {isAr ? typeLabelAr[dest.type] : dest.type}
        </div>
        {/* Wonder badge */}
        <div style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(17,14,9,0.75)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.55)", padding: "4px 10px",
          borderRadius: "20px", fontSize: "0.62rem",
          fontFamily: "'Cinzel', serif", letterSpacing: "0.05em",
          backdropFilter: "blur(8px)",
        }}>
          {dest.badge}
        </div>
        {dest.featured && (
          <div style={{
            position: "absolute", left: "50%", bottom: "14px",
            transform: "translateX(-50%)",
            background: "rgba(232,160,0,0.18)",
            border: "1px solid rgba(232,160,0,0.45)",
            color: "#E8C97A",
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "0.6rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "'Cinzel', serif",
            backdropFilter: "blur(8px)",
          }}>
            {isAr ? "مميز" : "Featured"}
          </div>
        )}
        {/* Region overlay bottom */}
        <div style={{
          position: "absolute", bottom: "12px", left: "14px",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,0,0.8)" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Lora', serif" }}>
            {dest.city}, {dest.region}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1.05rem", fontWeight: 700,
          color: hovered ? "#E8C97A" : "#F7F0E3",
          margin: "0 0 0.5rem",
          transition: "color 0.3s",
          letterSpacing: "0.03em",
        }}>
          {dest.name}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.9rem" }}>
          <StarRating rating={dest.rating} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", color: "#E8A000", fontWeight: 600 }}>
            {dest.rating}
          </span>
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
            ({dest.reviews.toLocaleString()} {isAr ? "تقييم" : "reviews"})
          </span>
        </div>

        <p style={{
          fontSize: "0.85rem", lineHeight: 1.75,
          color: "rgba(247,240,227,0.5)",
          fontFamily: "'Lora', serif", fontStyle: "italic",
          margin: "0 0 1.4rem", flex: 1,
        }}>
          {dest.desc}
        </p>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: hovered
            ? "linear-gradient(90deg, rgba(232,160,0,0.5), transparent)"
            : "rgba(255,255,255,0.06)",
          marginBottom: "1.2rem",
          transition: "background 0.4s",
        }} />

        <button style={{
          width: "100%",
          padding: "0.75rem 1.5rem",
          background: hovered
            ? "linear-gradient(135deg, #E8A000, #C9A84C)"
            : "transparent",
          border: `1px solid ${hovered ? "transparent" : "rgba(232,160,0,0.3)"}`,
          color: hovered ? "#0D0A06" : "rgba(232,160,0,0.8)",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "all 0.35s ease",
          fontWeight: hovered ? 700 : 400,
        }}>
          {isAr ? "استكشف الوجهة" : "Explore Destination"}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.3s" }}>
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [active, setActive] = useState<FilterOption>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [sectionRef, sectionInView] = useInView<HTMLElement>(0.05);

  const localizedDestinations = useMemo(() => {
    if (!isAr) {
      return destinationsEn;
    }

    return destinationsEn.map((dest) => {
      const translated = destinationArById[dest.id];
      if (!translated) {
        return dest;
      }

      return {
        ...dest,
        name: translated.name,
        city: translated.city,
        region: translated.region,
        desc: translated.desc,
        badge: translated.badge,
      };
    });
  }, [isAr]);

  const localizedSortOptions = isAr
    ? [
        { value: "popular" as SortOption, label: "الاكثر شيوعا" },
        { value: "rating" as SortOption, label: "الاعلى تقييما" },
        { value: "reviews" as SortOption, label: "الاكثر مراجعات" },
        { value: "alpha" as SortOption, label: "ابجدي" },
      ]
    : sortOptions;

  const localizedFilters: { value: FilterOption; label: string }[] = isAr
    ? [
        { value: "All", label: "الكل" },
        { value: "Cultural", label: "ثقافي" },
        { value: "Desert", label: "صحراوي" },
        { value: "Sea & Diving", label: "بحري وغوص" },
        { value: "Eco & Wellness", label: "بيئي واستجمام" },
      ]
    : filters.map((value) => ({ value, label: value }));

  const copy = {
    heroTop: isAr ? "افضل" : "Top",
    heroDestinations: isAr ? "الوجهات" : "Destinations",
    heroInEgypt: isAr ? "في مصر" : "in Egypt",
    heroDescription: isAr
      ? "استكشف اشهر الاماكن في مصر من العجائب الاثرية الى المناظر الطبيعية المذهلة."
      : "Explore the most iconic places across Egypt — from ancient wonders to breathtaking natural landscapes waiting to be discovered.",
    statDestinations: isAr ? "وجهات" : "Destinations",
    statTypes: isAr ? "انواع السياحة" : "Tourism Types",
    statYears: isAr ? "سنوات من التاريخ" : "Years of History",
    scroll: isAr ? "مرر" : "Scroll",
    searchPlaceholder: isAr ? "ابحث عن وجهات ومدن ومناطق..." : "Search destinations, cities, regions...",
    sort: isAr ? "ترتيب" : "Sort",
    showingFeatured: isAr ? "عرض المميز" : "Showing Featured",
    featuredOnly: isAr ? "المميز فقط" : "Featured Only",
    countSuffix: isAr ? "وجهة" : "destination",
    countSuffixPlural: isAr ? "وجهات" : "destinations",
    countFound: isAr ? "تم العثور" : "found",
    avgRating: isAr ? "متوسط التقييم" : "Avg Rating",
    topRegion: isAr ? "ابرز منطقة" : "Top Region",
    featured: isAr ? "مميز" : "Featured",
    discoverEgypt: isAr ? "اكتشف مصر" : "Discover Egypt",
    noDestinations: isAr ? "لا توجد وجهات مطابقة" : "No destinations found",
    noDestinationsHint: isAr ? "جرب بحثا او فلترة مختلفة" : "Try a different search or filter",
    bannerStart: isAr ? "كل رحلة تبدا" : "Every Journey Begins With",
    bannerEnd: isAr ? "بخطوة واحدة" : "a Single Step",
    bannerDescription: isAr
      ? "استخدم الخريطة التفاعلية لاستكشاف الوجهات بصريا عبر مناطق مصر."
      : "Use our interactive map to explore destinations visually across Egypt's regions.",
    openMap: isAr ? "افتح الخريطة التفاعلية" : "Open Interactive Map",
  };

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 100); }, []);

  const filtered = useMemo(() => {
    const base = localizedDestinations.filter(d => {
      const matchType = active === "All" || d.type === active;
      const matchSearch = search === "" ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.city.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase());
      const matchFeatured = !featuredOnly || d.featured;
      return matchType && matchSearch && matchFeatured;
    });

    const sorted = [...base];
    if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews") sorted.sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "alpha") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "popular") {
      sorted.sort((a, b) => {
        const scoreA = a.rating * 1000 + a.reviews;
        const scoreB = b.rating * 1000 + b.reviews;
        return scoreB - scoreA;
      });
    }
    return sorted;
  }, [active, search, featuredOnly, sortBy, localizedDestinations]);

  const filteredAvgRating = useMemo(() => {
    if (filtered.length === 0) return "0.0";
    const total = filtered.reduce((sum, d) => sum + d.rating, 0);
    return (total / filtered.length).toFixed(1);
  }, [filtered]);

  const topRegion = useMemo(() => {
    if (filtered.length === 0) return "-";
    const counts = filtered.reduce((acc, d) => {
      acc[d.region] = (acc[d.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  }, [filtered]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D0A06; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0A06; }
        ::-webkit-scrollbar-thumb { background: rgba(232,160,0,0.3); border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(35px);} to {opacity:1;transform:translateY(0);} }
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
      `}</style>

      <div style={{ background: "#0D0A06", minHeight: "100vh", fontFamily: "'Lora', serif", color: "#F7F0E3" }}>

        {/* ── HERO ── */}
        <section style={{
          position: "relative", minHeight: "88vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* BG Image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=85')",
            backgroundSize: "cover", backgroundPosition: "center 40%",
            transform: "scale(1.05)",
            filter: "brightness(0.35) saturate(0.8)",
          }} />

          {/* Overlays */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(13,10,6,0.5) 0%, rgba(13,10,6,0.2) 40%, rgba(13,10,6,0.85) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232,160,0,0.04) 0%, transparent 70%)",
          }} />

          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(232,160,0,1) 79px, rgba(232,160,0,1) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(232,160,0,1) 79px, rgba(232,160,0,1) 80px)",
          }} />

          {/* Ornamental frame */}
          <div style={{
            position: "absolute", inset: "2rem",
            border: "1px solid rgba(232,160,0,0.12)",
            pointerEvents: "none",
          }}>
            {[
              { top: "-5px", left: "-5px" },
              { top: "-5px", right: "-5px" },
              { bottom: "-5px", left: "-5px" },
              { bottom: "-5px", right: "-5px" },
            ].map((pos, i) => (
              <div key={i} style={{
                position: "absolute", ...pos,
                width: "10px", height: "10px",
                background: "#E8A000", opacity: 0.5,
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }} />
            ))}
          </div>

          {/* Hero Content */}
          <div style={{
            position: "relative", zIndex: 2,
            textAlign: "center", padding: "4rem 2rem",
            maxWidth: "860px",
          }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem", letterSpacing: "0.45em",
              color: "#E8A000", textTransform: "uppercase",
              marginBottom: "1.8rem",
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
            }}>
              <span style={{ display: "inline-block", width: "40px", height: "1px", background: "#E8A000", opacity: 0.5 }} />
              Egypt Panorama
              <span style={{ display: "inline-block", width: "40px", height: "1px", background: "#E8A000", opacity: 0.5 }} />
            </div>

            <h1 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
              fontWeight: 900, lineHeight: 1.1,
              color: "#F7F0E3", marginBottom: "0.15em",
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s",
            }}>
              {copy.heroTop}{" "}
              <span style={{
                background: "linear-gradient(135deg, #E8C97A, #E8A000, #C9762A)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {copy.heroDestinations}
              </span>
              <br />{copy.heroInEgypt}
            </h1>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "1rem", margin: "2rem 0",
              opacity: heroLoaded ? 1 : 0,
              transition: "opacity 0.8s ease 0.6s",
            }}>
              <div style={{ width: "70px", height: "1px", background: "linear-gradient(90deg, transparent, #E8A000)" }} />
              <span style={{ color: "#E8A000", fontSize: "1rem" }}>◈</span>
              <div style={{ width: "70px", height: "1px", background: "linear-gradient(90deg, #E8A000, transparent)" }} />
            </div>

            <p style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              lineHeight: 1.85, color: "rgba(247,240,227,0.6)",
              fontStyle: "italic", maxWidth: "600px", margin: "0 auto 2.5rem",
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
            }}>
              {copy.heroDescription}
            </p>

            {/* Stats row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "2rem", flexWrap: "wrap",
              opacity: heroLoaded ? 1 : 0,
              transition: "opacity 0.8s ease 0.9s",
            }}>
              {[
                { n: "9+", l: copy.statDestinations },
                { n: "6", l: copy.statTypes },
                { n: "7,000", l: copy.statYears },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: "1.6rem", fontWeight: 900, color: "#E8A000", lineHeight: 1,
                  }}>{s.n}</div>
                  <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(247,240,227,0.35)", marginTop: "4px",
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            animation: "scrollBounce 2s ease infinite",
            opacity: 0.4,
          }}>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
              letterSpacing: "0.3em", textTransform: "uppercase", color: "#E8A000",
            }}>{copy.scroll}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A000" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </section>

        {/* ── FILTER + SEARCH ── */}
        <section ref={sectionRef} style={{ background: "#0D0A06", padding: "4rem 2rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* Search */}
            <div style={{
              display: "flex", justifyContent: "center", marginBottom: "2.5rem",
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}>
              <div style={{
                width: "100%", maxWidth: "900px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}>
                <div style={{ position: "relative", width: "100%" }}>
                <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,0,0.5)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder={copy.searchPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.8rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(232,160,0,0.2)",
                    borderRadius: "10px",
                    color: "#F7F0E3",
                    fontSize: "0.9rem",
                    fontFamily: "'Lora', serif",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(232,160,0,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(232,160,0,0.2)"}
                />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(232,160,0,0.2)",
                    borderRadius: "10px",
                    color: "#F7F0E3",
                    fontSize: "0.85rem",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.08em",
                    outline: "none",
                  }}
                >
                  {localizedSortOptions.map((option) => (
                    <option key={option.value} value={option.value} style={{ color: "#0D0A06" }}>
                      {copy.sort}: {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setFeaturedOnly((prev) => !prev)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: featuredOnly
                      ? "linear-gradient(135deg, #E8A000, #C9A84C)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${featuredOnly ? "transparent" : "rgba(232,160,0,0.2)"}`,
                    borderRadius: "10px",
                    color: featuredOnly ? "#0D0A06" : "#E8C97A",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {featuredOnly ? copy.showingFeatured : copy.featuredOnly}
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem",
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}>
              {localizedFilters.map((filter) => (
                <button key={filter.value} onClick={() => setActive(filter.value)} style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "30px",
                  border: `1px solid ${active === filter.value ? "#E8A000" : "rgba(255,255,255,0.1)"}`,
                  background: active === filter.value
                    ? "linear-gradient(135deg, #E8A000, #C9A84C)"
                    : "rgba(255,255,255,0.03)",
                  color: active === filter.value ? "#0D0A06" : "rgba(247,240,227,0.55)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontWeight: active === filter.value ? 700 : 400,
                  transition: "all 0.3s ease",
                }}>
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Result count */}
            <div style={{
              textAlign: "center", marginBottom: "3.5rem",
              fontFamily: "'Cinzel', serif", fontSize: "0.65rem",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "rgba(247,240,227,0.25)",
            }}>
              {filtered.length} {filtered.length !== 1 ? copy.countSuffixPlural : copy.countSuffix} {copy.countFound}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.9rem",
              marginBottom: "2.8rem",
            }}>
              {[
                { label: copy.avgRating, value: filteredAvgRating },
                { label: copy.topRegion, value: topRegion },
                { label: copy.featured, value: `${filtered.filter((d) => d.featured).length}` },
              ].map((insight) => (
                <div key={insight.label} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(232,160,0,0.16)",
                  borderRadius: "10px",
                  padding: "0.8rem 1rem",
                }}>
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(247,240,227,0.35)",
                    marginBottom: "0.35rem",
                  }}>
                    {insight.label}
                  </div>
                  <div style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: "1rem",
                    color: "#E8C97A",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {insight.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "1.5rem",
              marginBottom: "3rem",
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: "0.65rem",
                letterSpacing: "0.4em", textTransform: "uppercase",
                color: "#E8A000", whiteSpace: "nowrap",
              }}>
                {copy.discoverEgypt}
              </div>
              <div style={{ flex: 1, height: "1px", background: "rgba(232,160,0,0.15)" }} />
              <div style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "0.7rem", color: "rgba(247,240,227,0.2)",
              }}>◈</div>
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section style={{ padding: "0 2rem 8rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {filtered.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "1.8rem",
              }}>
                {filtered.map((dest, i) => (
                  <DestinationCard key={dest.id} dest={dest} index={i} isAr={isAr} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center", padding: "6rem 2rem",
                color: "rgba(247,240,227,0.3)",
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>◈</div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", letterSpacing: "0.1em" }}>
                  {copy.noDestinations}
                </p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", fontStyle: "italic" }}>
                  {copy.noDestinationsHint}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM BANNER ── */}
        <section style={{
          background: "linear-gradient(135deg, #0A0600 0%, #1A1208 50%, #0A1A28 100%)",
          padding: "6rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(232,160,0,0.1)",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232,160,0,0.05) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "2rem", color: "#E8A000", opacity: 0.3, marginBottom: "1.5rem" }}>𓂀</div>
            <h2 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(1.6rem, 4vw, 3rem)",
              fontWeight: 700, color: "#F7F0E3", marginBottom: "1rem",
              lineHeight: 1.2,
            }}>
              {copy.bannerStart}<br />
              <span style={{
                background: "linear-gradient(135deg, #E8C97A, #E8A000)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{copy.bannerEnd}</span>
            </h2>
            <p style={{
              fontSize: "1rem", color: "rgba(247,240,227,0.45)",
              fontStyle: "italic", maxWidth: "480px", margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}>
              {copy.bannerDescription}
            </p>
            <a href="/map" style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              padding: "0.9rem 2.5rem",
              border: "1px solid rgba(232,160,0,0.4)",
              color: "#E8A000",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "6px",
              transition: "all 0.3s",
              background: "transparent",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E8A000"; e.currentTarget.style.color = "#0D0A06"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E8A000"; }}
            >
              {copy.openMap} ◈
            </a>
          </div>
        </section>

      </div>
    </>
  );
}