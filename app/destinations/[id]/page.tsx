import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import {
  destinationsEn,
  getLocalizedDestination,
  getDestinationById,
} from "@/lib/destinationsData";
import DestinationGallery from "@/components/destinations/DestinationGallery";
import DestinationActivities from "@/components/destinations/DestinationActivities";
import DestinationInfo from "@/components/destinations/DestinationInfo";

const K = "'Cinzel', serif";
const KD = "'Cinzel Decorative', serif";
const L = "'Lora', serif";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return destinationsEn.map((d) => ({ id: String(d.id) }));
}

export default async function DestinationDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const isAr = locale === "ar";

  const raw = getDestinationById(Number(id));
  if (!raw) notFound();

  const dest = getLocalizedDestination(raw, isAr);

  const copy = {
    back: isAr ? "العودة إلى الوجهات" : "Back to Destinations",
    gallery: isAr ? "معرض الصور" : "Photo Gallery",
    about: isAr ? "عن هذه الوجهة" : "About This Destination",
    activities: isAr ? "الأنشطة المتاحة" : "Available Activities",
    map: isAr ? "الموقع على الخريطة" : "Location on Map",
    openMap: isAr ? "افتح هذه الوجهة على الخريطة" : "Open this destination on Maps",
    planTrip: isAr ? "خطط لرحلتك" : "Plan a Trip",
    findCompany: isAr ? "ابحث عن شركة سياحة" : "Find Tourism Company",
    reviews: isAr ? "تقييم" : "reviews",
    wondering: isAr ? "هل أنت مستعد للاستكشاف؟" : "Ready to Explore?",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div
        style={{
          background: "#0D0A06",
          minHeight: "100vh",
          color: "#F7F0E3",
          fontFamily: L,
          direction: isAr ? "rtl" : "ltr",
        }}
      >
        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            height: "75vh",
            minHeight: "500px",
            overflow: "hidden",
          }}
        >
          <Image
            src={dest.coverImage}
            alt={dest.name}
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: dest.coverPosition ?? "center",
              filter: "brightness(0.45) saturate(0.8)",
            }}
          />
          {/* gradient overlays */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(13,10,6,0.3) 0%, rgba(13,10,6,0.1) 30%, rgba(13,10,6,0.9) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(232,160,0,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Back button */}
          <Link
            href="/destinations"
            style={{
              position: "absolute",
              top: "5.5rem",
              left: isAr ? "auto" : "2rem",
              right: isAr ? "2rem" : "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.55rem 1.2rem",
              background: "rgba(13,10,6,0.6)",
              border: "1px solid rgba(232,160,0,0.25)",
              borderRadius: "30px",
              color: "#E8C97A",
              fontFamily: K,
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s",
              zIndex: 10,
            }}
          >
            {isAr ? (
              <>
                {copy.back}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {copy.back}
              </>
            )}
          </Link>

          {/* Hero text */}
          <div
            style={{
              position: "absolute",
              bottom: "3rem",
              left: 0,
              right: 0,
              padding: "0 2rem",
              maxWidth: "800px",
              margin: "0 auto",
              animation: "fadeUp 0.8s ease forwards",
            }}
          >
            {/* Type badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.3rem 0.9rem",
                borderRadius: "30px",
                background: "rgba(232,160,0,0.15)",
                border: "1px solid rgba(232,160,0,0.3)",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily: K,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#E8C97A",
                }}
              >
                {isAr
                  ? {
                      Cultural: "ثقافي",
                      "Eco & Wellness": "بيئي واستجمام",
                      Desert: "صحراوي",
                      "Sea & Diving": "بحري وغوص",
                    }[dest.type] ?? dest.type
                  : dest.type}
              </span>
            </div>

            <h1
              style={{
                fontFamily: KD,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900,
                color: "#F7F0E3",
                lineHeight: 1.1,
                marginBottom: "0.6rem",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {dest.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: K,
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  color: "rgba(247,240,227,0.55)",
                  textTransform: "uppercase",
                }}
              >
                {dest.city}, {dest.region}
              </span>
              <span style={{ color: "rgba(247,240,227,0.2)" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={s <= Math.round(dest.rating) ? "#E8A000" : "none"}
                    stroke="#E8A000"
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span
                  style={{
                    fontFamily: K,
                    fontSize: "0.7rem",
                    color: "#E8C97A",
                    marginLeft: "4px",
                  }}
                >
                  {dest.rating} ({dest.reviews.toLocaleString()} {copy.reviews})
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT ──────────────────────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Gallery */}
          {dest.images.length > 0 && (
            <section style={{ padding: "4rem 0 2rem" }}>
              <SectionHeading title={copy.gallery} isAr={isAr} />
              <DestinationGallery
                images={dest.images}
                name={dest.name}
                isAr={isAr}
              />
            </section>
          )}

          {/* Info */}
          <section style={{ padding: "3rem 0 2rem" }}>
            <SectionHeading title={copy.about} isAr={isAr} />
            <DestinationInfo destination={dest} isAr={isAr} />
          </section>

          {/* Activities */}
          {dest.activities.length > 0 && (
            <section style={{ padding: "2rem 0" }}>
              <SectionHeading title={copy.activities} isAr={isAr} />
              <DestinationActivities
                activities={dest.activities}
                isAr={isAr}
              />
            </section>
          )}

          {/* Map redirect */}
          <section style={{ padding: "2rem 0 3rem" }}>
            <SectionHeading title={copy.map} isAr={isAr} />
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(232,160,0,0.15)",
                background: "rgba(255,255,255,0.02)",
                height: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.1rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(232,160,0,0.05) 39px, rgba(232,160,0,0.05) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(232,160,0,0.05) 39px, rgba(232,160,0,0.05) 40px)",
                }}
              />
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(232,160,0,0.3)"
                strokeWidth="1.5"
                style={{ position: "relative" }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <Link
                href="/maps"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(232,160,0,0.35)",
                  background: "rgba(232,160,0,0.15)",
                  fontFamily: K,
                  fontSize: "0.75rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#E8C97A",
                  position: "relative",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                {copy.openMap}
              </Link>
            </div>
          </section>

          {/* Action buttons */}
          <section
            style={{
              padding: "2rem 0 6rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              textAlign: "center",
              borderTop: "1px solid rgba(232,160,0,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                color: "#E8A000",
                opacity: 0.3,
              }}
            >
              𓂀
            </div>
            <p
              style={{
                fontFamily: KD,
                fontSize: "1.4rem",
                color: "#F7F0E3",
                fontWeight: 700,
              }}
            >
              {copy.wondering}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              <Link
                href="/plan"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.9rem 2.2rem",
                  background: "linear-gradient(135deg, #E8A000, #C9762A)",
                  borderRadius: "8px",
                  color: "#0D0A06",
                  fontFamily: K,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(232,160,0,0.25)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {copy.planTrip}
              </Link>
              <Link
                href="/tourism-companies"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.9rem 2.2rem",
                  background: "transparent",
                  border: "1px solid rgba(232,160,0,0.4)",
                  borderRadius: "8px",
                  color: "#E8C97A",
                  fontFamily: K,
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "border-color 0.3s, color 0.3s",
                }}
              >
                {copy.findCompany}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ── small helper component ─────────────────────────────── */
function SectionHeading({
  title,
  isAr,
}: {
  title: string;
  isAr?: boolean;
}) {
  void isAr;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.2rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          width: "3px",
          height: "28px",
          background: "linear-gradient(180deg, #E8A000, transparent)",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#E8C97A",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "rgba(232,160,0,0.12)",
        }}
      />
    </div>
  );
}
