"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Destination } from "@/lib/destinationsData";
import { typeColors, typeFallbackImages, typeLabelAr } from "@/lib/destinationsData";

interface Props {
  destination: Destination;
  index?: number;
  isAr?: boolean;
}

export default function DestinationCard({ destination: d, index = 0, isAr = false }: Props) {
  const [imgError, setImgError] = useState(false);

  const tc = typeColors[d.type] ?? typeColors["Cultural"];
  const src = imgError ? (typeFallbackImages[d.type] ?? "/images/cultural.jfif") : d.coverImage;
  const typeLabel = isAr ? (typeLabelAr[d.type] ?? d.type) : d.type;
  const fullStars = Math.floor(d.rating);
  const hasHalf = d.rating % 1 >= 0.5;

  const delay = `${(index % 3) * 0.1}s`;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#110E09] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_20px_60px_rgba(232,160,0,0.13)]"
      style={{ animationDelay: delay }}
    >
      {/* ── Image ── */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <Image
          src={src}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ objectPosition: d.coverPosition ?? "center" }}
          onError={() => setImgError(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#110E09]/90 via-black/10 to-transparent" />

        {/* Type badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-wide backdrop-blur-sm"
          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
        >
          {typeLabel}
        </span>

        {/* Wonder badge */}
        <span className="absolute right-3 top-3 rounded-full border border-white/[0.09] bg-black/55 px-2.5 py-1 text-[0.6rem] text-white/50 backdrop-blur-sm">
          {d.badge}
        </span>

        {/* Featured pill */}
        {d.featured && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-0.5 text-[0.58rem] uppercase tracking-[0.18em] text-amber-300 backdrop-blur-sm">
            {isAr ? "مميز" : "Featured"}
          </span>
        )}

        {/* City / region overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,0,0.8)" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[0.7rem] text-white/55" style={{ fontFamily: "'Lora', serif" }}>
            {d.city}, {d.region}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Name */}
        <h3
          className="text-[1.05rem] font-bold leading-tight tracking-wide text-[#F7F0E3] transition-colors duration-300 group-hover:text-amber-300"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {d.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => {
              const filled = s <= fullStars;
              const half = !filled && hasHalf && s === fullStars + 1;
              return (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id={`hg-${d.id}-${s}`} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="50%" stopColor="#E8A000" />
                      <stop offset="50%" stopColor="#2A2418" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill={filled ? "#E8A000" : half ? `url(#hg-${d.id}-${s})` : "#2A2418"}
                    stroke="#E8A000"
                    strokeWidth="1"
                  />
                </svg>
              );
            })}
          </div>
          <span className="text-[0.78rem] font-semibold text-amber-400" style={{ fontFamily: "'Cinzel', serif" }}>
            {d.rating}
          </span>
          <span className="text-[0.7rem] text-white/30">
            ({d.reviews.toLocaleString()} {isAr ? "تقييم" : "reviews"})
          </span>
        </div>

        {/* Short description */}
        <p
          className="flex-1 text-[0.84rem] italic leading-relaxed text-white/50"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {d.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] transition-colors duration-300 group-hover:bg-amber-400/20" />

        {/* CTA */}
        <Link
          href={`/destinations/${d.id}`}
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-400/30 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-amber-400/80 transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-600 hover:text-[#0D0A06] hover:font-bold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {isAr ? "استكشف الوجهة" : "Explore Destination"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
