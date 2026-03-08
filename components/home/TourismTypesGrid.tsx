import Link from "next/link";
import { getLocale } from "next-intl/server";

type TourismType = {
  name: string;
  description: string;
  link: string;
  tag: string;
  image: string;
  accent: string;
  tagStyle: string;
};

const tourismTypes: TourismType[] = [
  {
    name: "Cultural Tourism",
    description: "Explore Egypt's ancient history, temples, and timeless monuments.",
    link: "/tourism/cultural",
    tag: "Heritage",
    image: "/images/cultural.jfif",
    accent: "from-amber-500 to-orange-500",
    tagStyle: "bg-amber-50 text-amber-800 ring-amber-200/80",
  },
  {
    name: "Sea Tourism",
    description: "Discover crystal shores, coral reefs, and world-class diving spots.",
    link: "/tourism/sea",
    tag: "Coastal",
    image: "/images/sea.jpg",
    accent: "from-cyan-500 to-sky-600",
    tagStyle: "bg-sky-50 text-sky-800 ring-sky-200/80",
  },
  {
    name: "Desert Tourism",
    description: "Adventure through golden dunes, oases, and dramatic desert nights.",
    link: "/tourism/desert",
    tag: "Adventure",
    image: "/images/desert.jpg",
    accent: "from-orange-500 to-amber-600",
    tagStyle: "bg-orange-50 text-orange-800 ring-orange-200/80",
  },
  {
    name: "Eco Tourism",
    description: "Experience protected nature reserves and sustainable local escapes.",
    link: "/tourism/eco",
    tag: "Nature",
    image: "/images/eco.jfif",
    accent: "from-emerald-500 to-teal-600",
    tagStyle: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  },
  {
    name: "Medical Tourism",
    description: "Travel for trusted healthcare services and high-quality treatment plans.",
    link: "/tourism/medical",
    tag: "Healthcare",
    image: "/images/medical.jfif",
    accent: "from-rose-500 to-pink-600",
    tagStyle: "bg-rose-50 text-rose-800 ring-rose-200/80",
  },
  {
    name: "Wellness Tourism",
    description: "Restore your energy through spas, retreats, and mindful destinations.",
    link: "/tourism/wellness",
    tag: "Relaxation",
    image: "/images/wellness.jpg",
    accent: "from-violet-500 to-fuchsia-600",
    tagStyle: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200/80",
  },
];

const tourismTypesAr: TourismType[] = [
  {
    name: "السياحة الثقافية",
    description: "اكتشف تاريخ مصر القديم والمعابد والاثار الخالدة.",
    link: "/tourism/cultural",
    tag: "تراث",
    image: "/images/cultural.jfif",
    accent: "from-amber-500 to-orange-500",
    tagStyle: "bg-amber-50 text-amber-800 ring-amber-200/80",
  },
  {
    name: "السياحة الشاطئية",
    description: "استمتع بالشواطئ الصافية والشعاب المرجانية وافضل مواقع الغوص.",
    link: "/tourism/sea",
    tag: "ساحلي",
    image: "/images/sea.jpg",
    accent: "from-cyan-500 to-sky-600",
    tagStyle: "bg-sky-50 text-sky-800 ring-sky-200/80",
  },
  {
    name: "السياحة الصحراوية",
    description: "مغامرات بين الكثبان الذهبية والواحات وليالي الصحراء الساحرة.",
    link: "/tourism/desert",
    tag: "مغامرة",
    image: "/images/desert.jpg",
    accent: "from-orange-500 to-amber-600",
    tagStyle: "bg-orange-50 text-orange-800 ring-orange-200/80",
  },
  {
    name: "السياحة البيئية",
    description: "تجارب مستدامة داخل المحميات الطبيعية والمناطق البيئية الفريدة.",
    link: "/tourism/eco",
    tag: "طبيعة",
    image: "/images/eco.jfif",
    accent: "from-emerald-500 to-teal-600",
    tagStyle: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  },
  {
    name: "السياحة العلاجية",
    description: "رحلات تجمع بيئات علاجية وخدمات صحية عالية الجودة.",
    link: "/tourism/medical",
    tag: "عناية صحية",
    image: "/images/medical.jfif",
    accent: "from-rose-500 to-pink-600",
    tagStyle: "bg-rose-50 text-rose-800 ring-rose-200/80",
  },
  {
    name: "سياحة الاستجمام",
    description: "استعد طاقتك عبر السبا والمنتجعات وتجارب السفر الهادئة.",
    link: "/tourism/wellness",
    tag: "استرخاء",
    image: "/images/wellness.jpg",
    accent: "from-violet-500 to-fuchsia-600",
    tagStyle: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200/80",
  },
];

export default async function TourismTypesGrid() {
  const locale = (await getLocale()) === "ar" ? "ar" : "en";
  const localizedTourismTypes = locale === "ar" ? tourismTypesAr : tourismTypes;
  const copy = {
    sectionTitle: locale === "ar" ? "استكشف انواع السياحة" : "Explore Tourism Types",
    sectionDescription:
      locale === "ar"
        ? "من العجائب القديمة ومغامرات الصحراء الى الشواطئ وتجارب الاستجمام، اختر الرحلة المناسبة لك."
        : "From ancient wonders and desert adventures to sea escapes and wellness retreats, choose the journey that matches your style.",
    discoverMore: locale === "ar" ? "اكتشف المزيد" : "Discover more",
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20 pt-8">
      <div className="relative overflow-hidden rounded-4xl border border-amber-200/70 bg-[linear-gradient(130deg,#fff8eb_0%,#f6efe6_45%,#edf7fb_100%)] p-7 shadow-[0_30px_80px_-35px_rgba(146,74,27,0.45)] md:p-10 dark:border-slate-700 dark:bg-[linear-gradient(130deg,#1b1410_0%,#1a1f26_100%)]">
        <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-amber-300/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative mb-10 text-center">
          <p className="mb-3 inline-flex rounded-full border border-amber-300/70 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900 backdrop-blur-sm dark:border-amber-400/40 dark:bg-slate-900/60 dark:text-amber-200">
            Egypt Panorama
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-amber-950 md:text-4xl dark:text-amber-100">
            {copy.sectionTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-amber-900/80 md:text-base dark:text-slate-300">
            {copy.sectionDescription}
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {localizedTourismTypes.map((type) => (
            <Link key={type.name} href={type.link} className="group block">
              <article className="relative isolate overflow-hidden rounded-2xl border border-white/70 p-6 shadow-[0_16px_40px_-25px_rgba(15,23,42,0.65)] ring-1 ring-black/15 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.55)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${type.image})` }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-linear-to-b from-slate-950/35 via-slate-950/60 to-slate-950/85"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className={`mb-5 h-1.5 w-24 rounded-full bg-linear-to-r ${type.accent}`} />

                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${type.tagStyle}`}>
                    {type.tag}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold leading-tight text-white">
                    {type.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-100/95">
                    {type.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200 transition group-hover:text-amber-100">
                    {copy.discoverMore}
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">
                      -&gt;
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
