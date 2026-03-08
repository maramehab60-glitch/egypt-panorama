import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";

import { getTourismCategories } from "@/lib/tourismCategories";

const categoryVisuals = {
  cultural: {
    image: "/images/cultural.jfif",
    tint: "from-amber-900/40 via-black/10 to-black/60",
  },
  sea: {
    image: "/images/sea.jpg",
    tint: "from-cyan-900/40 via-black/10 to-black/60",
  },
  desert: {
    image: "/images/desert.jpg",
    tint: "from-orange-900/45 via-black/10 to-black/60",
  },
  eco: {
    image: "/images/eco.jfif",
    tint: "from-emerald-900/40 via-black/10 to-black/60",
  },
  medical: {
    image: "/images/medical.jfif",
    tint: "from-rose-900/40 via-black/10 to-black/60",
  },
  wellness: {
    image: "/images/wellness.jpg",
    tint: "from-fuchsia-900/40 via-black/10 to-black/60",
  },
} as const;

const featuredPlacesEn = [
  {
    name: "Pyramids of Giza",
    region: "Greater Cairo",
    category: "Cultural",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Giza-pyramids.JPG",
  },
  {
    name: "Luxor Temple",
    region: "Upper Egypt",
    category: "Cultural",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luxor_Temple_at_night,_Luxor,_Egypt.jpg",
  },
  {
    name: "Abu Simbel",
    region: "Aswan",
    category: "Cultural",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Abu_Simbel_Temple_May_30_2007.jpg",
  },
  {
    name: "Siwa Oasis",
    region: "Western Desert",
    category: "Wellness",
    href: "/tourism/wellness",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Siwa_Oasis,_Western_Desert,_Egypt.jpg",
  },
  {
    name: "Ras Muhammad",
    region: "South Sinai",
    category: "Eco",
    href: "/tourism/eco",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Coral_reef_in_Ras_Muhammad_nature_park.JPG",
  },
  {
    name: "Bibliotheca Alexandrina",
    region: "Alexandria",
    category: "Cultural",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexandrina_Library_in_Alexandria,_Egypt._03.jpg",
  },
];

const featuredPlacesAr = [
  {
    name: "اهرامات الجيزة",
    region: "القاهرة الكبرى",
    category: "ثقافي",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Giza-pyramids.JPG",
  },
  {
    name: "معبد الاقصر",
    region: "صعيد مصر",
    category: "ثقافي",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luxor_Temple_at_night,_Luxor,_Egypt.jpg",
  },
  {
    name: "ابو سمبل",
    region: "اسوان",
    category: "ثقافي",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Abu_Simbel_Temple_May_30_2007.jpg",
  },
  {
    name: "واحة سيوة",
    region: "الصحراء الغربية",
    category: "استجمام",
    href: "/tourism/wellness",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Siwa_Oasis,_Western_Desert,_Egypt.jpg",
  },
  {
    name: "راس محمد",
    region: "جنوب سيناء",
    category: "بيئي",
    href: "/tourism/eco",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Coral_reef_in_Ras_Muhammad_nature_park.JPG",
  },
  {
    name: "مكتبة الاسكندرية",
    region: "الاسكندرية",
    category: "ثقافي",
    href: "/tourism/cultural",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexandrina_Library_in_Alexandria,_Egypt._03.jpg",
  },
];

export default async function TourismIndexPage() {
  const locale = (await getLocale()) === "ar" ? "ar" : "en";
  const tourismCategories = getTourismCategories(locale);
  const featuredPlaces = locale === "ar" ? featuredPlacesAr : featuredPlacesEn;
  const copy = {
    heroTitleLine1: locale === "ar" ? "بوابة السياحة" : "Premium Tourism",
    heroTitleLine2: locale === "ar" ? "لتخطيط رحلتك" : "Journey Builder",
    heroDescription:
      locale === "ar"
        ? "استكشف مصر حسب نوع الرحلة مع صور غنية ومعلومات واضحة ومسارات مباشرة للتخطيط السريع."
        : "Explore Egypt by travel intent with rich visuals, destination context, and direct category paths designed for faster planning.",
    viewDestinations: locale === "ar" ? "عرض الوجهات" : "View Destinations",
    openPlanner: locale === "ar" ? "فتح مخطط الرحلة" : "Open Trip Planner",
    openCategory: locale === "ar" ? "فتح التصنيف" : "Open Category",
    featuredPlaces: locale === "ar" ? "اماكن مميزة" : "Featured Places",
    ctaTitle:
      locale === "ar"
        ? "ابن قصة رحلتك في مصر بسياق اوضح"
        : "Build Your Egypt Story With Better Context",
    ctaDescription:
      locale === "ar"
        ? "انتقل من استكشاف التصنيفات الى برنامج رحلة متكامل يجمع الوجهات ونمط السفر والتخطيط العملي."
        : "Move from category exploration to a complete itinerary with destinations, travel style, and practical planning in one connected flow.",
    startPlanning: locale === "ar" ? "ابدا التخطيط" : "Start Planning",
    learnMore: locale === "ar" ? "اعرف المزيد" : "Learn More",
  };

  return (
    <main className="bg-[#0D0A06] text-[#F7F0E3]">
      <section className="relative isolate min-h-[72vh] overflow-hidden border-b border-amber-200/10">
        <Image
          src="/images/hero/pyramids.jpg"
          alt="Egypt tourism overview"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(13,10,6,0.45)_0%,rgba(13,10,6,0.25)_35%,rgba(13,10,6,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_75%_at_50%_35%,rgba(232,160,0,0.10)_0%,transparent_70%)]" />

        <div className="relative mx-auto flex min-h-[72vh] w-full max-w-7xl items-center px-6 py-20 md:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-amber-300/35 bg-black/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200 backdrop-blur-sm">
              Egypt Panorama
            </p>

            <h1 className="mt-6 text-4xl font-black leading-[1.04] text-[#F7F0E3] md:text-6xl">
              {copy.heroTitleLine1}
              <span className="block bg-linear-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {copy.heroTitleLine2}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#F7F0E3]/75 md:text-base">
              {copy.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/destinations"
                className="rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0D0A06] transition hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-400"
              >
                {copy.viewDestinations}
              </Link>
              <Link
                href="/plan"
                className="rounded-full border border-amber-200/50 bg-black/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 transition hover:border-amber-300/80"
              >
                {copy.openPlanner}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tourismCategories.map((category) => {
            const visual = categoryVisuals[category.slug];

            return (
              <Link
                key={category.slug}
                href={`/tourism/${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#120E07] shadow-[0_20px_50px_-32px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-1 hover:border-amber-300/40"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={visual.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-linear-to-t ${visual.tint}`} />

                  <p className="absolute left-4 top-4 inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-amber-100">
                    {category.badge}
                  </p>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg font-bold text-white">{category.title.replace(" in Egypt", "")}</h2>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-7 text-[#F7F0E3]/68">{category.subtitle}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.places.slice(0, 3).map((place) => (
                      <span
                        key={place}
                        className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.66rem] tracking-wide text-[#F7F0E3]/70"
                      >
                        {place}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">
                    {copy.openCategory} -&gt;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">{copy.featuredPlaces}</div>
          <div className="h-px flex-1 bg-amber-300/20" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPlaces.map((place) => (
            <Link
              key={place.name}
              href={place.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#120E07] shadow-[0_20px_50px_-32px_rgba(0,0,0,0.88)]"
            >
              <div className="relative h-52">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,10,6,0.90)_5%,rgba(13,10,6,0.1)_55%,rgba(13,10,6,0.15)_100%)]" />

                <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/25 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                  {place.category}
                </div>

                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-amber-200/80">{place.region}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="rounded-2xl border border-amber-200/20 bg-[linear-gradient(130deg,#130E07_0%,#1C140A_45%,#102434_100%)] p-6 md:p-8">
          <h2 className="text-2xl font-black leading-tight text-[#F7F0E3] md:text-3xl">
            {copy.ctaTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-[#F7F0E3]/68">
            {copy.ctaDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/plan"
              className="rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0D0A06]"
            >
              {copy.startPlanning}
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/20 bg-black/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F7F0E3]"
            >
              {copy.learnMore}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
