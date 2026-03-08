"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

interface Destination {
  id: number;
  name: string;
  city: string;
  region: string;
  type: string;
  typeColor: string;
  rating: number;
  lat: number;
  lng: number;
  desc: string;
  icon: string;
  image: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Pyramids of Giza",
    city: "Cairo",
    region: "Greater Cairo",
    type: "Cultural",
    typeColor: "#C9A84C",
    rating: 4.9,
    lat: 29.9792,
    lng: 31.1342,
    desc: "The last surviving wonder of the ancient world - three monumental pyramids rising from the desert plateau, guarding secrets of a civilization lost to time.",
    icon: "𓂀",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=75",
  },
  {
    id: 2,
    name: "Luxor Temple",
    city: "Luxor",
    region: "Upper Egypt",
    type: "Cultural",
    typeColor: "#C9A84C",
    rating: 4.8,
    lat: 25.6996,
    lng: 32.6396,
    desc: "A grand ancient Egyptian temple complex on the Nile's east bank - illuminated magnificently each evening, glowing gold against the night sky.",
    icon: "𓇌",
    image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=75",
  },
  {
    id: 3,
    name: "Abu Simbel",
    city: "Aswan",
    region: "Upper Egypt",
    type: "Cultural",
    typeColor: "#C9A84C",
    rating: 4.9,
    lat: 22.3372,
    lng: 31.6258,
    desc: "Two colossal rock temples carved by Ramesses II. Twice a year, sunlight aligns perfectly to illuminate the inner sanctuary in a breathtaking solar phenomenon.",
    icon: "𓆣",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=75",
  },
  {
    id: 4,
    name: "Sharm El-Sheikh",
    city: "Sharm El-Sheikh",
    region: "South Sinai",
    type: "Sea & Diving",
    typeColor: "#2A7B9B",
    rating: 4.8,
    lat: 27.9158,
    lng: 34.3299,
    desc: "Egypt's premier Red Sea resort - world-class coral reefs, crystal-clear waters, vibrant marine life, and the legendary Ras Mohamed National Park.",
    icon: "𓇳",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=75",
  },
  {
    id: 5,
    name: "Siwa Oasis",
    city: "Siwa",
    region: "Western Desert",
    type: "Eco & Wellness",
    typeColor: "#4A8B5C",
    rating: 4.7,
    lat: 29.2037,
    lng: 25.5195,
    desc: "A remote paradise of fresh springs, ancient mud-brick ruins, and salt lakes nestled deep in the Sahara - a sanctuary of silence, stars, and serenity.",
    icon: "𓅓",
    image: "https://images.unsplash.com/photo-1547531455-73cf00ae9e5e?w=400&q=75",
  },
  {
    id: 6,
    name: "Valley of the Kings",
    city: "Luxor",
    region: "Upper Egypt",
    type: "Cultural",
    typeColor: "#C9A84C",
    rating: 4.9,
    lat: 25.7402,
    lng: 32.6014,
    desc: "The royal necropolis of Egypt's greatest pharaohs. Sixty-three tombs carved into limestone cliffs, adorned with vivid hieroglyphic murals for the eternal afterlife.",
    icon: "𓆙",
    image: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=400&q=75",
  },
  {
    id: 7,
    name: "White Desert",
    city: "Farafra",
    region: "Western Desert",
    type: "Desert",
    typeColor: "#D4813A",
    rating: 4.7,
    lat: 27.2833,
    lng: 27.9833,
    desc: "A surreal moonscape of chalk-white rock formations sculpted by centuries of wind - glowing ethereally under moonlight in the heart of Egypt's Western Desert.",
    icon: "𓆈",
    image: "https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400&q=75",
  },
  {
    id: 8,
    name: "Karnak Temple",
    city: "Luxor",
    region: "Upper Egypt",
    type: "Cultural",
    typeColor: "#C9A84C",
    rating: 4.8,
    lat: 25.7188,
    lng: 32.6573,
    desc: "The largest ancient religious site ever built - a vast complex of sanctuaries, colossal pylons, and sacred obelisks constructed over 2,000 years of pharaonic rule.",
    icon: "𓏌",
    image: "https://images.unsplash.com/photo-1582010940411-0bd6f0a6fefb?w=400&q=75",
  },
];

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0D0A06] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#E8A000] border-t-transparent" />
        <p
          style={{ fontFamily: "'Cinzel', serif" }}
          className="text-[#E8A000] text-xs tracking-[0.3em] uppercase opacity-60"
        >
          Loading Map
        </p>
      </div>
    </div>
  ),
});

function SidebarCard({
  dest,
  isActive,
  onClick,
}: {
  dest: Destination;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all duration-300 group"
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(232,160,0,0.12), rgba(201,168,76,0.06))"
          : "transparent",
        border: `1px solid ${isActive ? "rgba(232,160,0,0.35)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: "10px",
        padding: "1rem",
        marginBottom: "0.6rem",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-base"
          style={{
            background: `${dest.typeColor}18`,
            border: `1px solid ${dest.typeColor}40`,
            color: dest.typeColor,
          }}
        >
          {dest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            style={{ fontFamily: "'Cinzel', serif" }}
            className={`text-xs font-semibold tracking-wide truncate transition-colors duration-200 ${
              isActive ? "text-[#E8C97A]" : "text-[#F7F0E3] group-hover:text-[#E8C97A]"
            }`}
          >
            {dest.name}
          </p>
          <p
            className="text-[10px] text-[rgba(247,240,227,0.35)] mt-0.5 truncate"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {dest.city} · {dest.region}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{
                background: `${dest.typeColor}18`,
                border: `1px solid ${dest.typeColor}35`,
                color: dest.typeColor,
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.06em",
              }}
            >
              {dest.type}
            </span>
            <span
              className="text-[10px] text-[#E8A000] font-semibold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ★ {dest.rating}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function MapsPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        @keyframes pulse-gold { 0%,100% { box-shadow: 0 0 0 0 rgba(232,160,0,0.4); } 70% { box-shadow: 0 0 0 10px rgba(232,160,0,0); } }
        .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button { display: none !important; }
        .leaflet-container { background: #1a1408 !important; }
        .leaflet-tile { filter: brightness(0.9) saturate(0.85) sepia(0.15); }
        .custom-marker { animation: pulse-gold 2.5s ease infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,160,0,0.2); border-radius: 2px; }
      `}</style>

      <div
        className="flex h-screen w-full overflow-hidden"
        style={{ background: "#0D0A06", fontFamily: "'Lora', serif" }}
      >
        <aside
          className="flex-shrink-0 flex flex-col transition-all duration-500 overflow-hidden"
          style={{
            width: sidebarOpen ? "340px" : "0px",
            background: "linear-gradient(180deg, #0D0A06 0%, #110E09 100%)",
            borderRight: "1px solid rgba(232,160,0,0.1)",
          }}
        >
          <div className="flex flex-col h-full overflow-hidden" style={{ minWidth: "340px" }}>
            <div className="flex-shrink-0 p-5" style={{ borderBottom: "1px solid rgba(232,160,0,0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    style={{ fontFamily: "'Cinzel Decorative', serif", color: "#E8A000" }}
                    className="text-base font-bold leading-tight"
                  >
                    Egypt
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: "rgba(247,240,227,0.4)",
                      letterSpacing: "0.25em",
                    }}
                    className="text-[9px] uppercase tracking-widest"
                  >
                    Panorama · Interactive Map
                  </p>
                </div>
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(232,160,0,0.08)",
                    border: "1px solid rgba(232,160,0,0.2)",
                    color: "#E8A000",
                    fontSize: "1.1rem",
                  }}
                >
                  𓂀
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px" style={{ background: "rgba(232,160,0,0.12)" }} />
                <span style={{ color: "rgba(232,160,0,0.3)", fontSize: "0.6rem" }}>◈</span>
                <div className="flex-1 h-px" style={{ background: "rgba(232,160,0,0.12)" }} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: destinations.length, l: "Locations" },
                  { n: "6", l: "Regions" },
                  { n: "4", l: "Types" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="text-center py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <p
                      style={{ fontFamily: "'Cinzel Decorative', serif", color: "#E8A000" }}
                      className="text-sm font-bold"
                    >
                      {s.n}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: "rgba(247,240,227,0.3)",
                        letterSpacing: "0.05em",
                      }}
                      className="text-[9px] uppercase"
                    >
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(247,240,227,0.25)",
                  letterSpacing: "0.3em",
                }}
                className="text-[9px] uppercase mb-3"
              >
                Select a Destination
              </p>
              {destinations.map((dest) => (
                <SidebarCard
                  key={dest.id}
                  dest={dest}
                  isActive={activeId === dest.id}
                  onClick={() => setActiveId(dest.id === activeId ? null : dest.id)}
                />
              ))}
            </div>

            <div className="flex-shrink-0 p-4" style={{ borderTop: "1px solid rgba(232,160,0,0.08)" }}>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(247,240,227,0.2)",
                  letterSpacing: "0.1em",
                }}
                className="text-[9px] text-center uppercase"
              >
                Click any marker on the map to explore
              </p>
            </div>
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 left-4 z-[1000] flex items-center gap-2 transition-all duration-300"
            style={{
              background: "rgba(13,10,6,0.92)",
              border: "1px solid rgba(232,160,0,0.3)",
              borderRadius: "10px",
              padding: "0.55rem 1rem",
              color: "#E8A000",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
              {sidebarOpen ? "Hide" : "Show"} Destinations
            </span>
          </button>

          <div
            className="absolute top-4 right-4 z-[1000]"
            style={{
              background: "rgba(13,10,6,0.9)",
              border: "1px solid rgba(232,160,0,0.2)",
              borderRadius: "10px",
              padding: "0.5rem 1.2rem",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#E8A000",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
              }}
              className="uppercase"
            >
              Interactive Map of Egypt
            </p>
          </div>

          <div
            className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1.5"
            style={{
              background: "rgba(13,10,6,0.88)",
              border: "1px solid rgba(232,160,0,0.15)",
              borderRadius: "10px",
              padding: "0.9rem 1.1rem",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                color: "rgba(247,240,227,0.3)",
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
              }}
              className="uppercase mb-1"
            >
              Legend
            </p>
            {[
              { label: "Cultural", color: "#C9A84C" },
              { label: "Sea & Diving", color: "#2A7B9B" },
              { label: "Desert", color: "#D4813A" },
              { label: "Eco & Wellness", color: "#4A8B5C" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: l.color, boxShadow: `0 0 6px ${l.color}80` }}
                />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: "rgba(247,240,227,0.5)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  {l.label}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-full">
            <MapComponent
              destinations={destinations}
              activeId={activeId}
              onMarkerClick={(id: number) => setActiveId(id === activeId ? null : id)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
