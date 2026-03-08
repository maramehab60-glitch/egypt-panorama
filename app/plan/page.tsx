"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  destination: string;
  nights: number;
  company: string;
  budget: "Budget" | "Standard" | "Luxury";
  style: "Cultural" | "Adventure" | "Relaxation" | "Mixed";
}

interface Activity {
  time: string;
  activity: string;
  icon: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  highlight: string;
}

interface GeneratedPlan {
  form: FormData;
  days: DayPlan[];
  totalCost: number;
  perNight: number;
  tips: string[];
  bestSeason: string;
  difficulty: string;
}

type OptionItem = {
  value: string;
  label: string;
};

type CurrencyCode = "USD" | "EGP";

// ── Itinerary Database ────────────────────────────────────────────────────────
const ITINERARIES: Record<string, Record<number, DayPlan[]>> = {
  Cairo: {
    2: [
      { day: 1, title: "Ancient Wonders",   highlight: "Pyramids at sunset",       activities: [{ time: "Morning",   activity: "Pyramids of Giza & the Great Sphinx",    icon: "𓂀" }, { time: "Afternoon", activity: "Egyptian Museum — Royal Mummy Hall",         icon: "𓏌" }, { time: "Evening",   activity: "Nile dinner cruise",                        icon: "𓇳" }] },
      { day: 2, title: "City & Bazaars",    highlight: "Khan El-Khalili souvenirs",activities: [{ time: "Morning",   activity: "Citadel of Saladin & Alabaster Mosque",  icon: "𓆣" }, { time: "Afternoon", activity: "Khan El-Khalili bazaar & Al-Azhar Mosque",   icon: "𓅓" }, { time: "Evening",   activity: "Sound & Light Show at the Pyramids",        icon: "𓆈" }] },
    ],
    3: [
      { day: 1, title: "Ancient Wonders",   highlight: "Sphinx at golden hour",    activities: [{ time: "Morning",   activity: "Pyramids of Giza & Great Sphinx",         icon: "𓂀" }, { time: "Afternoon", activity: "Solar Boat Museum",                          icon: "𓇌" }, { time: "Evening",   activity: "Nile dinner cruise",                        icon: "𓇳" }] },
      { day: 2, title: "Museums & Heritage",highlight: "Grand Egyptian Museum",    activities: [{ time: "Morning",   activity: "Grand Egyptian Museum (GEM)",             icon: "𓏌" }, { time: "Afternoon", activity: "Coptic Cairo & Hanging Church",              icon: "𓆙" }, { time: "Evening",   activity: "Al-Azhar Park rooftop dinner",               icon: "𓅓" }] },
      { day: 3, title: "City & Departure",  highlight: "Khan El-Khalili finds",   activities: [{ time: "Morning",   activity: "Citadel & Alabaster Mosque",              icon: "𓆣" }, { time: "Afternoon", activity: "Khan El-Khalili bazaar & spice market",      icon: "𓆈" }, { time: "Evening",   activity: "Departure from Cairo",                      icon: "𓏌" }] },
    ],
    5: [
      { day: 1, title: "Pyramids & Sphinx",    highlight: "Sunset at Giza Plateau",  activities: [{ time: "Morning",   activity: "Pyramids of Giza & Sphinx",        icon: "𓂀" }, { time: "Afternoon", activity: "Solar Boat Museum",                  icon: "𓇌" }, { time: "Evening",   activity: "Nile dinner cruise",                icon: "𓇳" }] },
      { day: 2, title: "Grand Museum",          highlight: "Tutankhamun collection",  activities: [{ time: "Morning",   activity: "Grand Egyptian Museum (GEM)",      icon: "𓏌" }, { time: "Afternoon", activity: "Tahrir Square & downtown Cairo art",  icon: "𓅓" }, { time: "Evening",   activity: "Rooftop dinner — Cairo Tower views", icon: "𓆣" }] },
      { day: 3, title: "Coptic & Islamic Cairo",highlight: "Al-Azhar Park sunset",    activities: [{ time: "Morning",   activity: "Coptic Cairo & Hanging Church",    icon: "𓆙" }, { time: "Afternoon", activity: "Al-Azhar Mosque & Islamic quarter",   icon: "𓆈" }, { time: "Evening",   activity: "Al-Azhar Park stroll",               icon: "𓅓" }] },
      { day: 4, title: "Saqqara Day Trip",      highlight: "Step Pyramid of Djoser",  activities: [{ time: "Morning",   activity: "Saqqara Necropolis",               icon: "𓂀" }, { time: "Afternoon", activity: "Dahshur — Bent & Red Pyramids",       icon: "𓏌" }, { time: "Evening",   activity: "Khan El-Khalili bazaar",             icon: "𓆣" }] },
      { day: 5, title: "Markets & Departure",   highlight: "Final souvenirs",          activities: [{ time: "Morning",   activity: "Fustat & Old Cairo walk",          icon: "𓇌" }, { time: "Afternoon", activity: "Souvenir shopping & local café",      icon: "𓆈" }, { time: "Evening",   activity: "Departure from Cairo International", icon: "𓏌" }] },
    ],
    7: [
      { day: 1, title: "Arrival & Pyramids",    highlight: "Sphinx at dusk",            activities: [{ time: "Morning",   activity: "Arrival & hotel check-in",              icon: "𓏌" }, { time: "Afternoon", activity: "Pyramids of Giza & Sphinx",               icon: "𓂀" }, { time: "Evening",   activity: "Nile dinner cruise",                      icon: "𓇳" }] },
      { day: 2, title: "Grand Egyptian Museum",  highlight: "Tutankhamun gold mask",     activities: [{ time: "Morning",   activity: "Grand Egyptian Museum",                 icon: "𓏌" }, { time: "Afternoon", activity: "Camel ride, Giza plateau",                icon: "𓆣" }, { time: "Evening",   activity: "Sound & Light Show",                      icon: "𓆈" }] },
      { day: 3, title: "Saqqara Day Trip",       highlight: "Step Pyramid",              activities: [{ time: "Morning",   activity: "Saqqara Necropolis",                    icon: "𓂀" }, { time: "Afternoon", activity: "Dahshur pyramids",                        icon: "𓏌" }, { time: "Evening",   activity: "Downtown Cairo walk",                      icon: "𓅓" }] },
      { day: 4, title: "Coptic & Islamic",       highlight: "Al-Azhar architecture",     activities: [{ time: "Morning",   activity: "Coptic Cairo & Ben Ezra Synagogue",     icon: "𓆙" }, { time: "Afternoon", activity: "Al-Azhar Mosque & Islamic art museum",    icon: "𓆣" }, { time: "Evening",   activity: "Al-Azhar Park dinner",                    icon: "𓅓" }] },
      { day: 5, title: "Alexandria Day Trip",    highlight: "Mediterranean seafront",    activities: [{ time: "Morning",   activity: "Drive to Alexandria — Bibliotheca",     icon: "𓇌" }, { time: "Afternoon", activity: "Catacombs of Kom El Shoqafa",              icon: "𓆙" }, { time: "Evening",   activity: "Stanley Bridge & seafood dinner",          icon: "𓇳" }] },
      { day: 6, title: "Khan El-Khalili",        highlight: "Artisan workshops",         activities: [{ time: "Morning",   activity: "Citadel of Saladin & Mosque",           icon: "𓆣" }, { time: "Afternoon", activity: "Khan El-Khalili & spice bazaar",           icon: "𓆈" }, { time: "Evening",   activity: "Whirling dervish show",                   icon: "𓅓" }] },
      { day: 7, title: "Relaxation & Departure", highlight: "Farewell Nile view",        activities: [{ time: "Morning",   activity: "Zamalek galleries & Nile stroll",       icon: "𓇳" }, { time: "Afternoon", activity: "Final souvenir shopping",                 icon: "𓆈" }, { time: "Evening",   activity: "Departure from Cairo",                    icon: "𓏌" }] },
    ],
  },
  Luxor: {
    2: [
      { day: 1, title: "West Bank Wonders", highlight: "Valley of the Kings",       activities: [{ time: "Morning",   activity: "Valley of the Kings — Tutankhamun's Tomb", icon: "𓂀" }, { time: "Afternoon", activity: "Hatshepsut Temple & Colossi of Memnon",       icon: "𓏌" }, { time: "Evening",   activity: "Luxor Temple illuminated at night",            icon: "𓇌" }] },
      { day: 2, title: "East Bank & Karnak",highlight: "Karnak hypostyle hall",     activities: [{ time: "Morning",   activity: "Karnak Temple Complex",                    icon: "𓆣" }, { time: "Afternoon", activity: "Luxor Museum — royal artifacts",               icon: "𓅓" }, { time: "Evening",   activity: "Felucca sunset ride & Corniche stroll",       icon: "𓇳" }] },
    ],
    3: [
      { day: 1, title: "West Bank",             highlight: "Valley of the Kings",   activities: [{ time: "Morning",   activity: "Valley of the Kings",                    icon: "𓂀" }, { time: "Afternoon", activity: "Hatshepsut Temple",                          icon: "𓏌" }, { time: "Evening",   activity: "Luxor Temple by night",                     icon: "𓇌" }] },
      { day: 2, title: "Balloon & Karnak",      highlight: "Sunrise balloon ride",  activities: [{ time: "Morning",   activity: "Hot air balloon at sunrise",              icon: "𓆣" }, { time: "Afternoon", activity: "Karnak Temple Complex",                     icon: "𓅓" }, { time: "Evening",   activity: "Sound & Light Show at Karnak",              icon: "𓆈" }] },
      { day: 3, title: "Market & Departure",    highlight: "Alabaster workshops",   activities: [{ time: "Morning",   activity: "Luxor Museum",                           icon: "𓇳" }, { time: "Afternoon", activity: "Local market & alabaster workshop",          icon: "𓆈" }, { time: "Evening",   activity: "Departure from Luxor",                      icon: "𓏌" }] },
    ],
    5: [
      { day: 1, title: "Arrival & Luxor Temple",highlight: "Temple lit at night",    activities: [{ time: "Morning",   activity: "Arrival & hotel check-in",               icon: "𓏌" }, { time: "Afternoon", activity: "Luxor Temple visit",                        icon: "𓇌" }, { time: "Evening",   activity: "Corniche felucca ride",                     icon: "𓇳" }] },
      { day: 2, title: "West Bank Tombs",       highlight: "Valley of the Kings",    activities: [{ time: "Morning",   activity: "Valley of the Kings",                   icon: "𓂀" }, { time: "Afternoon", activity: "Hatshepsut Temple & Colossi",               icon: "𓏌" }, { time: "Evening",   activity: "Luxor Museum evening visit",                icon: "𓅓" }] },
      { day: 3, title: "Balloon & Karnak",      highlight: "Sunrise balloon",        activities: [{ time: "Morning",   activity: "Hot air balloon at sunrise",             icon: "𓆣" }, { time: "Afternoon", activity: "Karnak Temple",                             icon: "𓆣" }, { time: "Evening",   activity: "Sound & Light Show",                       icon: "𓆈" }] },
      { day: 4, title: "Dendera Day Trip",      highlight: "Hathor's painted ceiling",activities:[{ time: "Morning",   activity: "Dendera Temple of Hathor",               icon: "𓇌" }, { time: "Afternoon", activity: "Abydos Temple of Seti I",                   icon: "𓂀" }, { time: "Evening",   activity: "Nile-side dinner in Luxor",                icon: "𓇳" }] },
      { day: 5, title: "Markets & Departure",   highlight: "Souvenir finds",         activities: [{ time: "Morning",   activity: "Alabaster workshops & papyrus",          icon: "𓆈" }, { time: "Afternoon", activity: "Local spice market",                        icon: "𓅓" }, { time: "Evening",   activity: "Departure from Luxor",                     icon: "𓏌" }] },
    ],
    7: [
      { day: 1, title: "Arrival",              highlight: "Temple by night",         activities: [{ time: "Morning",   activity: "Arrival & check-in",                    icon: "𓏌" }, { time: "Afternoon", activity: "Luxor Temple",                              icon: "𓇌" }, { time: "Evening",   activity: "Nile dinner cruise",                       icon: "𓇳" }] },
      { day: 2, title: "Valley of Kings",      highlight: "Royal tombs",             activities: [{ time: "Morning",   activity: "Valley of the Kings",                   icon: "𓂀" }, { time: "Afternoon", activity: "Hatshepsut Temple",                         icon: "𓏌" }, { time: "Evening",   activity: "Colossi of Memnon sunset",                 icon: "𓅓" }] },
      { day: 3, title: "Balloon & Karnak",     highlight: "Sunrise over the Nile",   activities: [{ time: "Morning",   activity: "Hot air balloon sunrise",               icon: "𓆣" }, { time: "Afternoon", activity: "Karnak Temple",                             icon: "𓆣" }, { time: "Evening",   activity: "Sound & Light Show",                       icon: "𓆈" }] },
      { day: 4, title: "Dendera & Abydos",     highlight: "Hathor's ceiling",        activities: [{ time: "Morning",   activity: "Dendera Temple",                        icon: "𓇌" }, { time: "Afternoon", activity: "Abydos Temple of Seti I",                   icon: "𓂀" }, { time: "Evening",   activity: "Luxor waterfront walk",                    icon: "𓇳" }] },
      { day: 5, title: "Luxor Museum",         highlight: "Royal mummies",           activities: [{ time: "Morning",   activity: "Luxor Museum",                          icon: "𓅓" }, { time: "Afternoon", activity: "Mummification Museum",                      icon: "𓆙" }, { time: "Evening",   activity: "Felucca sunset ride",                      icon: "𓇳" }] },
      { day: 6, title: "Valley of Queens",     highlight: "Nefertari's tomb",        activities: [{ time: "Morning",   activity: "Valley of the Queens",                  icon: "𓂀" }, { time: "Afternoon", activity: "Deir el-Medina artisan village",             icon: "𓏌" }, { time: "Evening",   activity: "Local restaurant & oud music",              icon: "𓆈" }] },
      { day: 7, title: "Markets & Departure",  highlight: "Final souvenirs",         activities: [{ time: "Morning",   activity: "Spice & alabaster market",               icon: "𓆈" }, { time: "Afternoon", activity: "Last Nile stroll",                          icon: "𓇳" }, { time: "Evening",   activity: "Departure from Luxor",                     icon: "𓏌" }] },
    ],
  },
  Aswan: {
    2: [
      { day: 1, title: "Nubian Wonders",    highlight: "Abu Simbel temples",       activities: [{ time: "Morning",   activity: "Abu Simbel Temples — day trip by flight", icon: "𓂀" }, { time: "Afternoon", activity: "Philae Temple of Isis by boat",           icon: "𓇌" }, { time: "Evening",   activity: "Nubian village dinner & music",           icon: "𓅓" }] },
      { day: 2, title: "Nile & Markets",    highlight: "Felucca at sunset",        activities: [{ time: "Morning",   activity: "Aswan High Dam & Lake Nasser",           icon: "𓆣" }, { time: "Afternoon", activity: "Elephantine Island & Nilometer",          icon: "𓏌" }, { time: "Evening",   activity: "Felucca sunset & Aswan spice market",    icon: "𓇳" }] },
    ],
    3: [
      { day: 1, title: "Abu Simbel",       highlight: "Ramesses II temples",       activities: [{ time: "Morning",   activity: "Flight to Abu Simbel Temples",           icon: "𓂀" }, { time: "Afternoon", activity: "Unfinished Obelisk",                      icon: "𓏌" }, { time: "Evening",   activity: "Nubian village visit",                   icon: "𓅓" }] },
      { day: 2, title: "Nile Islands",     highlight: "Philae Temple by boat",     activities: [{ time: "Morning",   activity: "Philae Temple of Isis",                  icon: "𓇌" }, { time: "Afternoon", activity: "Elephantine Island museum",               icon: "𓆣" }, { time: "Evening",   activity: "Felucca sunset ride",                    icon: "𓇳" }] },
      { day: 3, title: "Dam & Departure",  highlight: "Lake Nasser panorama",      activities: [{ time: "Morning",   activity: "Aswan High Dam & Lake Nasser",           icon: "𓆣" }, { time: "Afternoon", activity: "Aswan spice market",                      icon: "𓆈" }, { time: "Evening",   activity: "Departure from Aswan",                   icon: "𓏌" }] },
    ],
    5: [
      { day: 1, title: "Arrival",          highlight: "Corniche sunset",           activities: [{ time: "Morning",   activity: "Arrival & hotel check-in",               icon: "𓏌" }, { time: "Afternoon", activity: "Corniche & Aga Khan Mausoleum",           icon: "𓆣" }, { time: "Evening",   activity: "Nubian restaurant dinner",               icon: "𓅓" }] },
      { day: 2, title: "Abu Simbel",       highlight: "Sun alignment phenomenon",  activities: [{ time: "Morning",   activity: "Abu Simbel Temples",                     icon: "𓂀" }, { time: "Afternoon", activity: "Unfinished Obelisk",                      icon: "𓏌" }, { time: "Evening",   activity: "Traditional music evening",              icon: "𓆈" }] },
      { day: 3, title: "Philae & Islands", highlight: "Temple of Isis by boat",    activities: [{ time: "Morning",   activity: "Philae Temple of Isis",                  icon: "𓇌" }, { time: "Afternoon", activity: "Elephantine Island museum",               icon: "𓆣" }, { time: "Evening",   activity: "Felucca sunset",                         icon: "𓇳" }] },
      { day: 4, title: "Kom Ombo & Edfu",  highlight: "Dual temple of Sobek",      activities: [{ time: "Morning",   activity: "Kom Ombo Temple",                        icon: "𓆙" }, { time: "Afternoon", activity: "Edfu Temple of Horus",                    icon: "𓂀" }, { time: "Evening",   activity: "Nile-side dinner in Aswan",               icon: "𓇳" }] },
      { day: 5, title: "Market & Depart",  highlight: "Nubian craft souvenirs",    activities: [{ time: "Morning",   activity: "Aswan spice & Nubian crafts market",     icon: "𓆈" }, { time: "Afternoon", activity: "Lake Nasser panorama",                    icon: "𓆣" }, { time: "Evening",   activity: "Departure from Aswan",                   icon: "𓏌" }] },
    ],
    7: [
      { day: 1, title: "Arrival",          highlight: "Corniche at dusk",          activities: [{ time: "Morning",   activity: "Arrival & hotel",                        icon: "𓏌" }, { time: "Afternoon", activity: "Corniche promenade",                      icon: "𓆣" }, { time: "Evening",   activity: "Nubian dinner",                          icon: "𓅓" }] },
      { day: 2, title: "Abu Simbel",       highlight: "Ramesses II colossus",      activities: [{ time: "Morning",   activity: "Abu Simbel Temples",                     icon: "𓂀" }, { time: "Afternoon", activity: "Unfinished Obelisk",                      icon: "𓏌" }, { time: "Evening",   activity: "Traditional music evening",              icon: "𓆈" }] },
      { day: 3, title: "Philae & Elephant",highlight: "Isis temple by boat",       activities: [{ time: "Morning",   activity: "Philae Temple",                          icon: "𓇌" }, { time: "Afternoon", activity: "Elephantine Island",                      icon: "𓆣" }, { time: "Evening",   activity: "Felucca sunset",                         icon: "𓇳" }] },
      { day: 4, title: "Kom Ombo & Edfu",  highlight: "Sobek crocodile temple",    activities: [{ time: "Morning",   activity: "Kom Ombo Temple",                        icon: "𓆙" }, { time: "Afternoon", activity: "Edfu Temple of Horus",                    icon: "𓂀" }, { time: "Evening",   activity: "Nile dinner",                            icon: "𓇳" }] },
      { day: 5, title: "Nubian Village",   highlight: "Authentic Nubian culture",  activities: [{ time: "Morning",   activity: "Nubian village full-day tour",            icon: "𓅓" }, { time: "Afternoon", activity: "Traditional craft workshop",              icon: "𓆈" }, { time: "Evening",   activity: "Rooftop dinner with desert view",        icon: "𓏌" }] },
      { day: 6, title: "Desert & Dam",     highlight: "Lake Nasser panorama",      activities: [{ time: "Morning",   activity: "High Dam & Lake Nasser",                 icon: "𓆣" }, { time: "Afternoon", activity: "West Bank desert monastery",              icon: "𓆙" }, { time: "Evening",   activity: "Last felucca ride",                      icon: "𓇳" }] },
      { day: 7, title: "Market & Depart",  highlight: "Spice market finale",       activities: [{ time: "Morning",   activity: "Aswan spice market",                     icon: "𓆈" }, { time: "Afternoon", activity: "Final Nile view",                         icon: "𓇳" }, { time: "Evening",   activity: "Departure from Aswan",                   icon: "𓏌" }] },
    ],
  },
  "Sharm El Sheikh": {
    2: [
      { day: 1, title: "Red Sea Paradise",  highlight: "Ras Mohamed coral reef",   activities: [{ time: "Morning",   activity: "Ras Mohamed National Park snorkeling",   icon: "𓇌" }, { time: "Afternoon", activity: "Tiran Island boat trip",                  icon: "𓇳" }, { time: "Evening",   activity: "Naama Bay promenade & dinner",            icon: "𓆣" }] },
      { day: 2, title: "Sinai Adventure",   highlight: "Mount Sinai sunrise",       activities: [{ time: "Morning",   activity: "Mount Sinai sunrise hike",               icon: "𓂀" }, { time: "Afternoon", activity: "St. Catherine's Monastery",               icon: "𓆙" }, { time: "Evening",   activity: "Old Market & shisha evening",             icon: "𓆈" }] },
    ],
    3: [
      { day: 1, title: "Arrival & Beach",   highlight: "Red Sea first swim",        activities: [{ time: "Morning",   activity: "Arrival & beach resort check-in",        icon: "𓏌" }, { time: "Afternoon", activity: "House Reef snorkeling",                   icon: "𓇌" }, { time: "Evening",   activity: "Naama Bay dinner",                        icon: "𓆣" }] },
      { day: 2, title: "Marine Reserve",    highlight: "Ras Mohamed coral walls",   activities: [{ time: "Morning",   activity: "Ras Mohamed National Park diving",        icon: "𓇳" }, { time: "Afternoon", activity: "Tiran Island & shark observation",         icon: "𓆈" }, { time: "Evening",   activity: "Waterfront seafood restaurant",           icon: "𓅓" }] },
      { day: 3, title: "Sinai Hike",        highlight: "Sunrise from Mt Sinai",     activities: [{ time: "Morning",   activity: "Mount Sinai sunrise hike",               icon: "𓂀" }, { time: "Afternoon", activity: "St. Catherine's Monastery",               icon: "𓆙" }, { time: "Evening",   activity: "Departure from Sharm",                   icon: "𓏌" }] },
    ],
    5: [
      { day: 1, title: "Arrival",           highlight: "Resort beach sunset",       activities: [{ time: "Morning",   activity: "Arrival & check-in",                     icon: "𓏌" }, { time: "Afternoon", activity: "Beach & house reef",                      icon: "𓇌" }, { time: "Evening",   activity: "Naama Bay walk",                          icon: "𓆣" }] },
      { day: 2, title: "Diving Day",        highlight: "Ras Mohamed reef walls",    activities: [{ time: "Morning",   activity: "Ras Mohamed diving excursion",            icon: "𓇳" }, { time: "Afternoon", activity: "Tiran Island snorkel",                    icon: "𓆈" }, { time: "Evening",   activity: "Seafood dinner",                          icon: "𓅓" }] },
      { day: 3, title: "Bedouin Safari",    highlight: "Desert star-gazing camp",   activities: [{ time: "Morning",   activity: "4x4 Sinai desert safari",                icon: "𓆣" }, { time: "Afternoon", activity: "Bedouin village & camel ride",            icon: "𓂀" }, { time: "Evening",   activity: "Desert camp & stargazing",               icon: "𓆈" }] },
      { day: 4, title: "Mount Sinai",       highlight: "Burning Bush monastery",    activities: [{ time: "Morning",   activity: "Mount Sinai sunrise climb",               icon: "𓂀" }, { time: "Afternoon", activity: "St. Catherine's Monastery",               icon: "𓆙" }, { time: "Evening",   activity: "Old Market shopping",                     icon: "𓆈" }] },
      { day: 5, title: "Spa & Departure",   highlight: "Relaxing farewell",         activities: [{ time: "Morning",   activity: "Resort spa & wellness treatment",         icon: "𓅓" }, { time: "Afternoon", activity: "Old Market souvenirs",                    icon: "𓆈" }, { time: "Evening",   activity: "Departure from Sharm",                   icon: "𓏌" }] },
    ],
    7: [
      { day: 1, title: "Arrival",           highlight: "Red Sea first look",        activities: [{ time: "Morning",   activity: "Arrival & resort check-in",              icon: "𓏌" }, { time: "Afternoon", activity: "House reef snorkel",                      icon: "𓇌" }, { time: "Evening",   activity: "Welcome dinner",                          icon: "𓆣" }] },
      { day: 2, title: "Ras Mohamed",       highlight: "Coral wall diving",         activities: [{ time: "Morning",   activity: "Ras Mohamed National Park",              icon: "𓇳" }, { time: "Afternoon", activity: "Tiran Island",                             icon: "𓆈" }, { time: "Evening",   activity: "Waterfront seafood restaurant",           icon: "𓅓" }] },
      { day: 3, title: "Bedouin Safari",    highlight: "Desert sunset",             activities: [{ time: "Morning",   activity: "4x4 Sinai safari",                       icon: "𓆣" }, { time: "Afternoon", activity: "Camel ride & Bedouin village",             icon: "𓂀" }, { time: "Evening",   activity: "Desert camp stargazing",                  icon: "𓆈" }] },
      { day: 4, title: "Mount Sinai",       highlight: "Sunrise pilgrimage",        activities: [{ time: "Morning",   activity: "Mount Sinai sunrise hike",               icon: "𓂀" }, { time: "Afternoon", activity: "St. Catherine's Monastery",               icon: "𓆙" }, { time: "Evening",   activity: "Naama Bay evening",                       icon: "𓆣" }] },
      { day: 5, title: "Dahab Day Trip",    highlight: "Blue Hole dive site",       activities: [{ time: "Morning",   activity: "Day trip to Dahab — Blue Hole",          icon: "𓇌" }, { time: "Afternoon", activity: "Wind & kite surfing lesson",               icon: "𓇳" }, { time: "Evening",   activity: "Beachfront dinner in Dahab",              icon: "𓆈" }] },
      { day: 6, title: "Spa & Leisure",     highlight: "Resort relaxation",         activities: [{ time: "Morning",   activity: "Spa & wellness treatment",               icon: "𓅓" }, { time: "Afternoon", activity: "Pool & beach leisure",                    icon: "𓇌" }, { time: "Evening",   activity: "Old Market farewell dinner",              icon: "𓆣" }] },
      { day: 7, title: "Departure",         highlight: "Last Red Sea sunrise",      activities: [{ time: "Morning",   activity: "Sunrise beach walk",                     icon: "𓇳" }, { time: "Afternoon", activity: "Souvenir shopping",                       icon: "𓆈" }, { time: "Evening",   activity: "Departure from Sharm El-Sheikh",          icon: "𓏌" }] },
    ],
  },
  "Siwa Oasis": {
    2: [
      { day: 1, title: "Ancient Oasis",     highlight: "Temple of the Oracle",      activities: [{ time: "Morning",   activity: "Temple of the Oracle — Alexander's Shrine", icon: "𓂀" }, { time: "Afternoon", activity: "Cleopatra's Bath natural spring",           icon: "𓇳" }, { time: "Evening",   activity: "Rooftop dinner — desert panorama",          icon: "𓅓" }] },
      { day: 2, title: "Desert & Dunes",    highlight: "Great Sand Sea sunset",     activities: [{ time: "Morning",   activity: "Great Sand Sea — sandboarding & 4x4",      icon: "𓆣" }, { time: "Afternoon", activity: "Salt lakes & Fatnas Island",                icon: "𓇌" }, { time: "Evening",   activity: "Gebel al-Mawta sunset hike",               icon: "𓆈" }] },
    ],
    3: [
      { day: 1, title: "Arrival & Oracle",  highlight: "Alexander's shrine",        activities: [{ time: "Morning",   activity: "Arrival & eco-lodge check-in",             icon: "𓏌" }, { time: "Afternoon", activity: "Temple of the Oracle & Old Shali",          icon: "𓂀" }, { time: "Evening",   activity: "Rooftop Siwan dinner",                      icon: "𓅓" }] },
      { day: 2, title: "Great Sand Sea",    highlight: "Sandboarding the dunes",    activities: [{ time: "Morning",   activity: "Great Sand Sea 4x4 safari",                icon: "𓆣" }, { time: "Afternoon", activity: "Cleopatra's Bath natural spring",           icon: "𓇳" }, { time: "Evening",   activity: "Salt lake sunset & Sahara stargazing",      icon: "𓆈" }] },
      { day: 3, title: "Springs & Depart",  highlight: "Fatnas Island float",       activities: [{ time: "Morning",   activity: "Fatnas Island & fresh spring swim",         icon: "𓇌" }, { time: "Afternoon", activity: "Siwan crafts & silver jewellery market",    icon: "𓆈" }, { time: "Evening",   activity: "Departure from Siwa",                      icon: "𓏌" }] },
    ],
    5: [
      { day: 1, title: "Arrival",           highlight: "Desert horizon welcome",    activities: [{ time: "Morning",   activity: "Arrival & eco-lodge check-in",             icon: "𓏌" }, { time: "Afternoon", activity: "Old Shali mud-brick ruins",                 icon: "𓂀" }, { time: "Evening",   activity: "Siwan rooftop dinner",                      icon: "𓅓" }] },
      { day: 2, title: "Oracle & Springs",  highlight: "Temple of Alexander",       activities: [{ time: "Morning",   activity: "Temple of the Oracle",                     icon: "𓂀" }, { time: "Afternoon", activity: "Cleopatra's Bath & natural springs",        icon: "𓇳" }, { time: "Evening",   activity: "Gebel al-Mawta sunset hike",               icon: "𓆈" }] },
      { day: 3, title: "Great Sand Sea",    highlight: "Sandboarding at sunset",    activities: [{ time: "Morning",   activity: "Great Sand Sea 4x4 expedition",            icon: "𓆣" }, { time: "Afternoon", activity: "Desert camp & sandboarding",                icon: "𓆈" }, { time: "Evening",   activity: "Sahara stargazing camp",                    icon: "𓅓" }] },
      { day: 4, title: "Salt Lakes",        highlight: "Fatnas Island float",       activities: [{ time: "Morning",   activity: "Fatnas Island & salt lake float",           icon: "𓇌" }, { time: "Afternoon", activity: "Siwan olive grove walk",                    icon: "𓅓" }, { time: "Evening",   activity: "Traditional Siwan music evening",           icon: "𓆈" }] },
      { day: 5, title: "Crafts & Depart",   highlight: "Silver Siwan jewellery",    activities: [{ time: "Morning",   activity: "Siwan silver jewellery market",             icon: "𓆈" }, { time: "Afternoon", activity: "Last spring swim",                          icon: "𓇳" }, { time: "Evening",   activity: "Departure from Siwa",                      icon: "𓏌" }] },
    ],
    7: [
      { day: 1, title: "Arrival",           highlight: "Eco lodge under stars",     activities: [{ time: "Morning",   activity: "Arrival & eco-lodge",                      icon: "𓏌" }, { time: "Afternoon", activity: "Old Shali ruins",                           icon: "𓂀" }, { time: "Evening",   activity: "Siwan dinner",                              icon: "𓅓" }] },
      { day: 2, title: "Oracle Temple",     highlight: "Alexander's shrine",        activities: [{ time: "Morning",   activity: "Temple of the Oracle",                     icon: "𓂀" }, { time: "Afternoon", activity: "Gebel al-Mawta tombs",                      icon: "𓆙" }, { time: "Evening",   activity: "Sunset view from mountain",                icon: "𓆈" }] },
      { day: 3, title: "Great Sand Sea",    highlight: "Sahara dune expanse",       activities: [{ time: "Morning",   activity: "Great Sand Sea 4x4 safari",                icon: "𓆣" }, { time: "Afternoon", activity: "Sandboarding & desert camp",                icon: "𓆈" }, { time: "Evening",   activity: "Stargazing under the Milky Way",            icon: "𓅓" }] },
      { day: 4, title: "Springs & Lakes",   highlight: "Cleopatra's Bath",          activities: [{ time: "Morning",   activity: "Cleopatra's Bath spring swim",              icon: "𓇳" }, { time: "Afternoon", activity: "Fatnas Island salt float",                  icon: "𓇌" }, { time: "Evening",   activity: "Siwan music evening",                      icon: "𓆈" }] },
      { day: 5, title: "Qara Oasis",        highlight: "Remote desert oasis",       activities: [{ time: "Morning",   activity: "Day trip to Qara Oasis",                   icon: "𓆣" }, { time: "Afternoon", activity: "Bedouin tea ceremony",                      icon: "𓅓" }, { time: "Evening",   activity: "Bonfire under the desert stars",            icon: "𓆈" }] },
      { day: 6, title: "Siwan Culture",     highlight: "Silver jewellery craft",    activities: [{ time: "Morning",   activity: "Siwan women's craft cooperative",           icon: "𓆈" }, { time: "Afternoon", activity: "Olive & date farm walk",                    icon: "𓅓" }, { time: "Evening",   activity: "Last sunset over the salt lake",            icon: "𓇌" }] },
      { day: 7, title: "Departure",         highlight: "Final desert memory",       activities: [{ time: "Morning",   activity: "Sunrise spring swim",                      icon: "𓇳" }, { time: "Afternoon", activity: "Souvenir shopping",                         icon: "𓆈" }, { time: "Evening",   activity: "Departure from Siwa",                      icon: "𓏌" }] },
    ],
  },
};

const TIPS: Record<string, string[]> = {
  Cairo:              ["Visit the Pyramids at 8 AM to beat the crowds", "Hire a licensed guide at the Grand Egyptian Museum", "Friday mornings are quietest at Khan El-Khalili", "The GEM is best visited on weekday mornings"],
  Luxor:              ["Book hot air balloon 48 hours in advance", "West Bank is best explored in the early morning", "Karnak Sound & Light is worth the evening visit", "Hire a private Egyptologist guide for the Valley of the Kings"],
  Aswan:              ["Book Abu Simbel flight early — it sells out fast", "Felucca captains negotiate — agree price upfront", "The Nubian village tour is best done at sunset", "Philae Temple Sound & Light show is spectacular"],
  "Sharm El Sheikh":  ["Book diving only with PADI-certified operators", "Mount Sinai hike starts at midnight — bring warm layers", "Ras Mohamed is best April–October for visibility", "Old Market is much cheaper than Naama Bay shops"],
  "Siwa Oasis":       ["Visit September–March to avoid extreme desert heat", "Hire local Siwan guides for dune safaris", "Bring sufficient cash — ATMs are unreliable in Siwa", "The Great Sand Sea sunset is an absolute must"],
};

const BEST_SEASON: Record<string, string> = {
  Cairo:             "October – April",
  Luxor:             "October – March",
  Aswan:             "November – February",
  "Sharm El Sheikh": "April – October (diving) / Year-round",
  "Siwa Oasis":      "October – March",
};

const DIFFICULTY: Record<string, Record<string, string>> = {
  Cultural:   { Cairo: "Easy", Luxor: "Easy", Aswan: "Easy", "Sharm El Sheikh": "Moderate", "Siwa Oasis": "Moderate" },
  Adventure:  { Cairo: "Moderate", Luxor: "Moderate", Aswan: "Moderate", "Sharm El Sheikh": "Challenging", "Siwa Oasis": "Challenging" },
  Relaxation: { Cairo: "Easy", Luxor: "Easy", Aswan: "Easy", "Sharm El Sheikh": "Easy", "Siwa Oasis": "Easy" },
  Mixed:      { Cairo: "Moderate", Luxor: "Moderate", Aswan: "Moderate", "Sharm El Sheikh": "Moderate", "Siwa Oasis": "Moderate" },
};

const COST_PER_NIGHT: Record<string, number> = { Budget: 80, Standard: 150, Luxury: 300 };
const NIGHT_OPTIONS  = [2, 3, 5, 7];
const DESTINATIONS   = ["Cairo", "Luxor", "Aswan", "Sharm El Sheikh", "Siwa Oasis"];
const COMPANIES      = ["Memphis Tours", "Travco Group", "Abercrombie & Kent Egypt"];
const BUDGETS        = ["Budget", "Standard", "Luxury"] as const;
const STYLES         = ["Cultural", "Adventure", "Relaxation", "Mixed"] as const;
const TIER_COLORS    = { Budget: "#4A8B5C", Standard: "#2A7B9B", Luxury: "#C9A84C" };
const TIME_COLORS: Record<string, string> = { Morning: "#E8A000", Afternoon: "#D4813A", Evening: "#2A7B9B" };
const USD_TO_EGP_RATE = 50;

const AR_DESTINATION_LABELS: Record<string, string> = {
  Cairo: "القاهرة",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "Sharm El Sheikh": "شرم الشيخ",
  "Siwa Oasis": "واحة سيوة",
};

const AR_COMPANY_LABELS: Record<string, string> = {
  "Memphis Tours": "ممفيس تورز",
  "Travco Group": "مجموعة ترافكو",
  "Abercrombie & Kent Egypt": "أبركرومبي آند كنت مصر",
};

const AR_BUDGET_LABELS: Record<FormData["budget"], string> = {
  Budget: "اقتصادي",
  Standard: "متوسط",
  Luxury: "فاخر",
};

const AR_STYLE_LABELS: Record<FormData["style"], string> = {
  Cultural: "ثقافي",
  Adventure: "مغامرة",
  Relaxation: "استرخاء",
  Mixed: "متنوع",
};

const AR_TIME_LABELS: Record<string, string> = {
  Morning: "صباحا",
  Afternoon: "بعد الظهر",
  Evening: "مساء",
};

const AR_DIFFICULTY_LABELS: Record<string, string> = {
  Easy: "سهل",
  Moderate: "متوسط",
  Challenging: "صعب",
};

const EN_COPY = {
  partneredWith: "Partnered with",
  plannerBadge: "Egypt Panorama · AI Trip Planner",
  heroTitleStart: "Plan Your",
  heroTitleAccent: "Perfect Trip",
  heroTitleEnd: "to Egypt",
  heroSubtitle: "Generate a personalised travel itinerary in seconds — tailored to your destination, duration, style, and budget.",
  journeyPreferences: "Your Journey Preferences",
  journeyHelp: "Customize all fields, then generate your plan",
  destination: "Destination",
  numberOfNights: "Number of Nights",
  tourismCompany: "Tourism Company",
  budgetLevel: "Budget Level",
  travelStyle: "Travel Style",
  nights: "Nights",
  crafting: "Crafting Your Itinerary...",
  generate: "Generate My Travel Plan ◈",
  generatedPlan: "Your Generated Plan",
  itinerary: "Itinerary",
  curatedBy: "Curated by",
  difficulty: "difficulty",
  best: "Best",
  insiderTips: "✦ Insider Travel Tips",
  estimatedTotalCost: "Estimated Total Cost",
  nightSuffix: "/night",
  tier: "Tier",
  duration: "Duration",
  budget: "Budget",
  company: "Company",
  bestSeason: "Best Season",
  printSave: "Print / Save Plan ◈",
  editPreferences: "Edit Preferences",
  currency: "Currency",
  exchangeRateLabel: "Rate",
  perNight: "per night",
  readyToBook: "Ready to Book?",
  browseCompanies: "Browse All Companies ◈",
};

const AR_COPY = {
  partneredWith: "بالشراكة مع",
  plannerBadge: "ايجيبت بانوراما · مخطط رحلات ذكي",
  heroTitleStart: "خطط",
  heroTitleAccent: "رحلتك المثالية",
  heroTitleEnd: "في مصر",
  heroSubtitle: "أنشئ برنامج رحلة مخصص خلال ثوان حسب الوجهة والمدة ونمط السفر والميزانية.",
  journeyPreferences: "تفضيلات رحلتك",
  journeyHelp: "عدّل الحقول ثم أنشئ خطتك",
  destination: "الوجهة",
  numberOfNights: "عدد الليالي",
  tourismCompany: "شركة السياحة",
  budgetLevel: "مستوى الميزانية",
  travelStyle: "نمط الرحلة",
  nights: "ليال",
  crafting: "جار تجهيز خط سير رحلتك...",
  generate: "انشاء خطة رحلتي ◈",
  generatedPlan: "الخطة المقترحة",
  itinerary: "خطة الرحلة",
  curatedBy: "إعداد",
  difficulty: "الصعوبة",
  best: "الافضل",
  insiderTips: "✦ نصائح سفر مهمة",
  estimatedTotalCost: "التكلفة التقديرية الكلية",
  nightSuffix: "/لليلة",
  tier: "الفئة",
  duration: "المدة",
  budget: "الميزانية",
  company: "الشركة",
  bestSeason: "افضل موسم",
  printSave: "طباعة / حفظ الخطة ◈",
  editPreferences: "تعديل التفضيلات",
  currency: "العملة",
  exchangeRateLabel: "سعر الصرف",
  perNight: "لكل ليلة",
  readyToBook: "جاهز للحجز؟",
  browseCompanies: "تصفح كل الشركات ◈",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function generatePlan(form: FormData): GeneratedPlan {
  const days       = ITINERARIES[form.destination]?.[form.nights] ?? [];
  const perNight   = COST_PER_NIGHT[form.budget];
  const totalCost  = perNight * form.nights;
  const tips       = TIPS[form.destination] ?? [];
  const bestSeason = BEST_SEASON[form.destination] ?? "October – April";
  const difficulty = DIFFICULTY[form.style]?.[form.destination] ?? "Moderate";
  return { form, days, totalCost, perNight, tips, bestSeason, difficulty };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SelectField({ label, icon, value, onChange, options }: {
  label: string; icon: string; value: string;
  onChange: (v: string) => void; options: OptionItem[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'Cinzel', serif", fontSize: "0.63rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(247,240,227,0.38)", marginBottom: "0.55rem" }}>
        <span style={{ marginRight: "0.45rem", opacity: 0.7 }}>{icon}</span>{label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "0.82rem 2.4rem 0.82rem 1.05rem",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(232,160,0,0.5)" : "rgba(255,255,255,0.09)"}`,
          borderRadius: "10px", color: "#F7F0E3",
          fontSize: "0.88rem", fontFamily: "'Lora', serif",
          outline: "none", cursor: "pointer",
          transition: "border-color 0.25s, box-shadow 0.25s",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='rgba(232,160,0,0.55)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center",
          boxShadow: focused ? "0 0 0 3px rgba(232,160,0,0.07)" : "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#1A1408", color: "#F7F0E3" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DayCard({ day, index, isArabic }: { day: DayPlan; index: number; isArabic: boolean }) {
  const dayLabel = isArabic ? "اليوم" : "Day";
  const localizeTime = (value: string) => (isArabic ? (AR_TIME_LABELS[value] ?? value) : value);

  return (
    <div style={{
      background: "#110E09", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px", overflow: "hidden",
      animation: `fadeUp 0.55s ease ${index * 0.07}s both`,
    }}>
      <div style={{ padding: "0.95rem 1.3rem", background: "linear-gradient(135deg,rgba(232,160,0,0.09),rgba(201,168,76,0.04))", borderBottom: "1px solid rgba(232,160,0,0.11)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg,#E8A000,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel Decorative', serif", fontSize: "0.75rem", fontWeight: 900, color: "#0D0A06" }}>
            {day.day}
          </div>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", fontWeight: 700, color: "#E8C97A", letterSpacing: "0.04em" }}>
            {dayLabel} {day.day} · {day.title}
          </span>
        </div>
        <span style={{ fontSize: "0.63rem", padding: "2px 9px", borderRadius: "20px", background: "rgba(232,160,0,0.08)", border: "1px solid rgba(232,160,0,0.22)", color: "#E8A000", fontFamily: "'Cinzel', serif", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
          ✦ {day.highlight}
        </span>
      </div>
      <div style={{ padding: "0.85rem 1.3rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {day.activities.map((act, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.06em", color: TIME_COLORS[act.time] ?? "#E8A000", flexShrink: 0, minWidth: "72px", marginTop: "2px" }}>
              {localizeTime(act.time)}
            </span>
            <span style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>{act.icon}</span>
            <span style={{ fontSize: "0.83rem", color: "rgba(247,240,227,0.62)", fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: 1.55 }}>
              {act.activity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inner Page (uses useSearchParams) ─────────────────────────────────────────
function PlanSuggestionContent() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const copy = isArabic ? AR_COPY : EN_COPY;

  const searchParams  = useSearchParams();
  const presetCompany = searchParams.get("company") ?? "";

  const [form, setForm] = useState<FormData>({
    destination: "Cairo",
    nights:      3,
    company:     presetCompany || "Memphis Tours",
    budget:      "Standard",
    style:       "Cultural",
  });
  const [plan,    setPlan]    = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan(generatePlan(form));
      setLoading(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }, 1300);
  };

  const budgetColor = TIER_COLORS[form.budget] ?? "#C9A84C";

  const toLocalizedDestination = (value: string) => (isArabic ? (AR_DESTINATION_LABELS[value] ?? value) : value);
  const toLocalizedCompany = (value: string) => (isArabic ? (AR_COMPANY_LABELS[value] ?? value) : value);
  const toLocalizedBudget = (value: FormData["budget"]) => (isArabic ? AR_BUDGET_LABELS[value] : value);
  const toLocalizedStyle = (value: FormData["style"]) => (isArabic ? AR_STYLE_LABELS[value] : value);
  const toLocalizedDifficulty = (value: string) => (isArabic ? (AR_DIFFICULTY_LABELS[value] ?? value) : value);
  const convertFromUsd = (usdValue: number) => (currency === "USD" ? usdValue : usdValue * USD_TO_EGP_RATE);
  const formatCurrency = (usdValue: number) => {
    const converted = convertFromUsd(usdValue);
    return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const destinationOptions: OptionItem[] = DESTINATIONS.map((value) => ({ value, label: toLocalizedDestination(value) }));
  const nightOptions: OptionItem[] = NIGHT_OPTIONS.map((value) => ({
    value: String(value),
    label: isArabic ? `${value} ${copy.nights}` : `${value} Night${value > 1 ? "s" : ""}`,
  }));
  const companyOptions: OptionItem[] = COMPANIES.map((value) => ({ value, label: toLocalizedCompany(value) }));
  const budgetOptions: OptionItem[] = BUDGETS.map((value) => ({ value, label: toLocalizedBudget(value) }));
  const styleOptions: OptionItem[] = STYLES.map((value) => ({ value, label: toLocalizedStyle(value) }));

  return (
    <div dir={isArabic ? "rtl" : "ltr"} style={{ background: "#0D0A06", minHeight: "100vh", fontFamily: "'Lora', serif", color: "#F7F0E3" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", background: "linear-gradient(160deg,#0D0A06 0%,#1A1208 45%,#081520 100%)", padding: "6rem 2rem 5rem", textAlign: "center", overflow: "hidden", borderBottom: "1px solid rgba(232,160,0,0.1)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 90% at 50% -10%,rgba(232,160,0,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(232,160,0,1) 59px,rgba(232,160,0,1) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(232,160,0,1) 59px,rgba(232,160,0,1) 60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {presetCompany && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(232,160,0,0.08)", border: "1px solid rgba(232,160,0,0.2)", borderRadius: "30px", padding: "0.4rem 1.2rem", marginBottom: "1.5rem", animation: "fadeUp 0.6s ease both" }}>
              <span>𓂀</span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", color: "#E8A000", letterSpacing: "0.12em" }}>{copy.partneredWith}: {toLocalizedCompany(presetCompany)}</span>
            </div>
          )}
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.45em", color: "#E8A000", textTransform: "uppercase", marginBottom: "1.4rem", animation: "fadeUp 0.6s ease 0.1s both", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ display: "inline-block", width: "35px", height: "1px", background: "#E8A000", opacity: 0.4 }} />
            {copy.plannerBadge}
            <span style={{ display: "inline-block", width: "35px", height: "1px", background: "#E8A000", opacity: 0.4 }} />
          </p>
          <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(2.2rem,6vw,4.8rem)", fontWeight: 900, lineHeight: 1.1, color: "#F7F0E3", marginBottom: "0.2em", animation: "fadeUp 0.7s ease 0.2s both" }}>
            {copy.heroTitleStart}{" "}
            <span style={{ background: "linear-gradient(135deg,#E8C97A,#E8A000,#C9762A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{copy.heroTitleAccent}</span>
            <br />{copy.heroTitleEnd}
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", margin: "1.5rem 0", animation: "fadeUp 0.6s ease 0.35s both" }}>
            <div style={{ width: "50px", height: "1px", background: "linear-gradient(90deg,transparent,#E8A000)" }} />
            <span style={{ color: "#E8A000", fontSize: "0.9rem" }}>◈</span>
            <div style={{ width: "50px", height: "1px", background: "linear-gradient(90deg,#E8A000,transparent)" }} />
          </div>
          <p style={{ fontSize: "clamp(0.9rem,1.8vw,1.1rem)", color: "rgba(247,240,227,0.5)", fontStyle: "italic", maxWidth: "520px", margin: "0 auto", lineHeight: 1.85, animation: "fadeUp 0.6s ease 0.45s both" }}>
            {copy.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ background: "#110E09", border: "1px solid rgba(232,160,0,0.15)", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", animation: "fadeUp 0.7s ease 0.5s both" }}>
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(232,160,0,0.09)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg,#E8A000,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>𓂀</div>
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", fontWeight: 700, color: "#F7F0E3" }}>{copy.journeyPreferences}</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(247,240,227,0.28)", fontStyle: "italic" }}>{copy.journeyHelp}</p>
            </div>
          </div>

          {/* Select grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.35rem", marginBottom: "1.8rem" }}>
            <SelectField label={copy.destination}      icon="𓆣" value={form.destination}    onChange={(v) => setForm({ ...form, destination: v })}                  options={destinationOptions} />
            <SelectField label={copy.numberOfNights}   icon="𓇳" value={String(form.nights)} onChange={(v) => setForm({ ...form, nights: Number(v) })}                options={nightOptions} />
            <SelectField label={copy.tourismCompany}   icon="𓂀" value={form.company}        onChange={(v) => setForm({ ...form, company: v })}                      options={companyOptions} />
            <SelectField label={copy.budgetLevel}      icon="◈"  value={form.budget}         onChange={(v) => setForm({ ...form, budget: v as FormData["budget"] })} options={budgetOptions} />
            <SelectField label={copy.travelStyle}      icon="𓅓" value={form.style}          onChange={(v) => setForm({ ...form, style: v as FormData["style"] })}   options={styleOptions} />
          </div>

          {/* Live tag strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.9rem 1.1rem", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.8rem" }}>
            {[
              { label: toLocalizedDestination(form.destination), color: "#C9A84C" },
              { label: `${form.nights} ${copy.nights}`, color: "#2A7B9B" },
              { label: toLocalizedStyle(form.style), color: "#D4813A" },
              { label: toLocalizedBudget(form.budget), color: budgetColor },
              { label: toLocalizedCompany(form.company), color: "rgba(247,240,227,0.28)" },
            ].map((tag) => (
              <span key={tag.label} style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: "20px", background: `${tag.color}18`, border: `1px solid ${tag.color}38`, color: tag.color, fontFamily: "'Cinzel', serif", letterSpacing: "0.07em" }}>
                {tag.label}
              </span>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: "100%", padding: "1.05rem 2rem",
              background: loading ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#E8A000,#C9A84C)",
              border: `1px solid ${loading ? "rgba(255,255,255,0.07)" : "transparent"}`,
              borderRadius: "12px",
              color: loading ? "rgba(247,240,227,0.28)" : "#0D0A06",
              fontFamily: "'Cinzel', serif", fontSize: "0.78rem",
              letterSpacing: "0.25em", textTransform: "uppercase",
              fontWeight: loading ? 400 : 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              transition: "all 0.3s",
              boxShadow: loading ? "none" : "0 8px 28px rgba(232,160,0,0.22)",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: "15px", height: "15px", border: "2px solid rgba(232,160,0,0.3)", borderTopColor: "#E8A000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                {copy.crafting}
              </>
            ) : copy.generate}
          </button>
        </div>
      </section>

      {/* ── RESULT ── */}
      {plan && !loading && (
        <section ref={resultRef} style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 1.5rem 8rem" }}>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem", animation: "fadeUp 0.6s ease both" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(232,160,0,0.1)" }} />
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.63rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#E8A000", whiteSpace: "nowrap" }}>{copy.generatedPlan}</p>
            <div style={{ flex: 1, height: "1px", background: "rgba(232,160,0,0.1)" }} />
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT — Itinerary ── */}
            <div>
              {/* Plan header card */}
              <div style={{ background: "linear-gradient(135deg,#1A1208,#0A1520)", border: "1px solid rgba(232,160,0,0.2)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp 0.6s ease both" }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.35em", color: "#E8A000", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {`${plan.form.nights} ${copy.nights} · ${toLocalizedStyle(plan.form.style)} ${copy.itinerary}`}
                </p>
                <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#F7F0E3", marginBottom: "0.35rem", lineHeight: 1.15 }}>
                  {toLocalizedDestination(plan.form.destination)}
                </h2>
                <p style={{ fontSize: "0.83rem", color: "rgba(247,240,227,0.38)", fontStyle: "italic", marginBottom: "1.1rem" }}>{copy.curatedBy} {toLocalizedCompany(plan.form.company)}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {[
                    { icon: "◉", label: `${plan.form.nights} ${copy.nights}`, color: "#2A7B9B" },
                    { icon: "◈", label: toLocalizedStyle(plan.form.style), color: "#D4813A" },
                    { icon: "✦", label: `${toLocalizedDifficulty(plan.difficulty)} ${copy.difficulty}`, color: "#4A8B5C" },
                    { icon: "𓇌", label: `${copy.best}: ${plan.bestSeason}`, color: "#C9A84C" },
                  ].map((tag) => (
                    <span key={tag.label} style={{ fontSize: "0.66rem", padding: "3px 10px", borderRadius: "20px", background: `${tag.color}14`, border: `1px solid ${tag.color}32`, color: tag.color, fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                      {tag.icon} {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Day cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {plan.days.map((day, i) => <DayCard key={day.day} day={day} index={i} isArabic={isArabic} />)}
              </div>

              {/* Tips */}
              <div style={{ marginTop: "1.5rem", background: "#110E09", border: "1px solid rgba(74,139,92,0.22)", borderRadius: "14px", padding: "1.5rem", animation: `fadeUp 0.6s ease ${plan.days.length * 0.07 + 0.1}s both` }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4A8B5C", marginBottom: "1rem" }}>{copy.insiderTips}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {plan.tips.map((tip, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                      <span style={{ color: "#E8A000", fontSize: "0.65rem", marginTop: "4px", flexShrink: 0 }}>◈</span>
                      <span style={{ fontSize: "0.83rem", color: "rgba(247,240,227,0.52)", fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: 1.65 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── RIGHT — Summary Card ── */}
            <div style={{ position: "sticky", top: "2rem" }}>
              <div style={{ background: "linear-gradient(160deg,#1A1208,#0A1520)", border: "1px solid rgba(232,160,0,0.2)", borderRadius: "16px", overflow: "hidden", marginBottom: "1.2rem", animation: "fadeUp 0.6s ease 0.2s both", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
                {/* Cost */}
                <div style={{ padding: "1.8rem", textAlign: "center", borderBottom: "1px solid rgba(232,160,0,0.09)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 100% at 50% 0%,rgba(232,160,0,0.06),transparent)", pointerEvents: "none" }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(247,240,227,0.28)", marginBottom: "0.4rem" }}>{copy.estimatedTotalCost}</p>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.7rem", position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(247,240,227,0.5)" }}>
                      {copy.currency}
                    </span>
                    {(["USD", "EGP"] as CurrencyCode[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        style={{
                          padding: "0.22rem 0.55rem",
                          borderRadius: "999px",
                          border: `1px solid ${currency === code ? "rgba(232,160,0,0.6)" : "rgba(255,255,255,0.2)"}`,
                          background: currency === code ? "rgba(232,160,0,0.18)" : "rgba(255,255,255,0.03)",
                          color: currency === code ? "#E8A000" : "rgba(247,240,227,0.7)",
                          fontSize: "0.63rem",
                          letterSpacing: "0.07em",
                          cursor: "pointer",
                        }}
                      >
                        {code}
                      </button>
                    ))}
                  </div>

                  <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "3rem", fontWeight: 900, color: "#E8A000", lineHeight: 1, position: "relative" }}>
                    {formatCurrency(plan.totalCost)}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(247,240,227,0.28)", fontStyle: "italic", marginTop: "0.25rem" }}>
                    {`${formatCurrency(plan.perNight)} ${copy.perNight} · ${plan.form.nights} ${copy.nights}`}
                  </p>
                  <p style={{ fontSize: "0.66rem", color: "rgba(247,240,227,0.32)", marginTop: "0.25rem" }}>
                    {`${copy.exchangeRateLabel}: 1 USD = ${USD_TO_EGP_RATE} EGP`}
                  </p>
                  <div style={{ display: "inline-block", marginTop: "0.75rem", padding: "3px 13px", borderRadius: "20px", background: `${budgetColor}18`, border: `1px solid ${budgetColor}40`, color: budgetColor, fontFamily: "'Cinzel', serif", fontSize: "0.63rem", letterSpacing: "0.1em" }}>
                    {toLocalizedBudget(plan.form.budget)} {copy.tier}
                  </div>
                </div>

                {/* Trip details */}
                <div style={{ padding: "1.4rem" }}>
                  {[
                    { label: copy.destination, value: toLocalizedDestination(plan.form.destination), icon: "𓆣" },
                    { label: copy.duration, value: `${plan.form.nights} ${copy.nights}`, icon: "𓇳" },
                    { label: copy.travelStyle, value: toLocalizedStyle(plan.form.style), icon: "𓅓" },
                    { label: copy.budget, value: toLocalizedBudget(plan.form.budget), icon: "◈" },
                    { label: copy.company, value: toLocalizedCompany(plan.form.company), icon: "𓂀" },
                    { label: copy.bestSeason, value: plan.bestSeason, icon: "𓇌" },
                    { label: copy.difficulty, value: toLocalizedDifficulty(plan.difficulty), icon: "✦" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0.6rem 0", borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                        <span style={{ fontSize: "0.82rem", opacity: 0.55 }}>{row.icon}</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(247,240,227,0.26)" }}>{row.label}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#F7F0E3", fontFamily: "'Lora', serif", textAlign: isArabic ? "left" : "right" }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ padding: "0 1.4rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <button onClick={() => window.print()} style={{ width: "100%", padding: "0.72rem", background: "transparent", border: "1px solid rgba(232,160,0,0.2)", borderRadius: "9px", color: "#E8A000", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,160,0,0.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >{copy.printSave}</button>
                  <button onClick={() => { setPlan(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ width: "100%", padding: "0.72rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "9px", color: "rgba(247,240,227,0.32)", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                  >{copy.editPreferences}</button>
                </div>
              </div>

              {/* Bottom CTA */}
              <div style={{ background: "#110E09", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "1.3rem", textAlign: "center", animation: "fadeUp 0.6s ease 0.35s both" }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(247,240,227,0.22)", marginBottom: "0.65rem" }}>{copy.readyToBook}</p>
                <a href="/tourism-companies" style={{ display: "block", padding: "0.78rem", background: "linear-gradient(135deg,#E8A000,#C9A84C)", borderRadius: "9px", color: "#0D0A06", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", transition: "opacity 0.25s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
                >{copy.browseCompanies}</a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────
export default function PlanSuggestionPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D0A06; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to   { transform: rotate(360deg); } }
        select option { background:#1A1408; color:#F7F0E3; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0D0A06; }
        ::-webkit-scrollbar-thumb { background:rgba(232,160,0,0.2); border-radius:3px; }
      `}</style>
      <Suspense fallback={
        <div style={{ minHeight: "100vh", background: "#0D0A06", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "2px solid rgba(232,160,0,0.3)", borderTopColor: "#E8A000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      }>
        <PlanSuggestionContent />
      </Suspense>
    </>
  );
}
