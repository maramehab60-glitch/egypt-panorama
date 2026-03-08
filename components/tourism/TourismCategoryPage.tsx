import Image from "next/image";
import { getLocale } from "next-intl/server";

type TourismCategoryPageProps = {
  title: string;
  subtitle: string;
  badge: string;
  places: string[];
  coverImage: string;
  coverImagePosition?: string;
  placeImages: string[];
  sectionGradientClass: string;
  cardBorderClass: string;
  accentLineClass: string;
  badgeClass: string;
};

export default function TourismCategoryPage({
  title,
  subtitle,
  badge,
  places,
  coverImage,
  coverImagePosition,
  placeImages,
  sectionGradientClass,
  cardBorderClass,
  accentLineClass,
  badgeClass,
}: TourismCategoryPageProps) {
  const localePromise = getLocale();

  return (
    <LocalizedTourismCategoryPage
      localePromise={localePromise}
      title={title}
      subtitle={subtitle}
      badge={badge}
      places={places}
      coverImage={coverImage}
      coverImagePosition={coverImagePosition}
      placeImages={placeImages}
      sectionGradientClass={sectionGradientClass}
      cardBorderClass={cardBorderClass}
      accentLineClass={accentLineClass}
      badgeClass={badgeClass}
    />
  );
}

async function LocalizedTourismCategoryPage({
  localePromise,
  title,
  subtitle,
  badge,
  places,
  coverImage,
  coverImagePosition,
  placeImages,
  sectionGradientClass,
  cardBorderClass,
  accentLineClass,
  badgeClass,
}: TourismCategoryPageProps & { localePromise: Promise<string> }) {
  const locale = (await localePromise) === "ar" ? "ar" : "en";
  const copy = {
    featuredPlaces: locale === "ar" ? "اماكن مميزة" : "Featured Places",
    cardDescription:
      locale === "ar"
        ? "اكتشف ابرز المزايا ونصائح السفر والمعلومات الاساسية لهذه الوجهة."
        : "Discover highlights, travel tips, and essential context for this destination.",
    exploreDestination:
      locale === "ar" ? "استكشف الوجهة" : "Explore destination",
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
      <div
        className={`relative overflow-hidden rounded-4xl border border-amber-200/70 p-7 shadow-[0_28px_70px_-35px_rgba(15,23,42,0.6)] md:p-10 ${sectionGradientClass}`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        <header className="relative mb-10 overflow-hidden rounded-3xl border border-white/30 bg-black/10">
          <div className="relative h-56 w-full md:h-64">
            <Image
              src={coverImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: coverImagePosition ?? "center" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.62)_100%)]" />

            <div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7">
              <p
                className={`mb-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${badgeClass}`}
              >
                {badge}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">{subtitle}</p>
            </div>
          </div>
        </header>

        <header className="relative mb-6 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900/85 dark:text-amber-200/85">
            {copy.featuredPlaces}
          </h2>
        </header>

        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {places.map((place, index) => (
            <article
              key={place}
              className={`group relative overflow-hidden rounded-2xl border bg-white/88 p-6 shadow-[0_16px_40px_-25px_rgba(15,23,42,0.65)] ring-1 ring-black/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900/80 ${cardBorderClass}`}
            >
              <div className="-mx-6 -mt-6 mb-5 overflow-hidden border-b border-black/5 dark:border-white/10">
                <div className="relative h-40 w-full">
                  <Image
                    src={placeImages[index] ?? coverImage}
                    alt={place}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.56)_0%,rgba(10,10,12,0.05)_60%)]" />
                </div>
              </div>

              <div className={`mb-5 h-1.5 w-24 rounded-full ${accentLineClass}`} />

              <h2 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                {place}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {copy.cardDescription}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 transition group-hover:text-amber-700 dark:text-amber-300 dark:group-hover:text-amber-200">
                {copy.exploreDestination}
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  -&gt;
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
