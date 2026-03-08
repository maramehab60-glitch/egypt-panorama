"use client";

import L, { type DivIcon, type Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type Destination = {
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
};

type MapComponentProps = {
  destinations: Destination[];
  activeId: number | null;
  onMarkerClick: (id: number) => void;
};

function ActiveController({
  destinations,
  activeId,
  markerRefs,
}: {
  destinations: Destination[];
  activeId: number | null;
  markerRefs: React.MutableRefObject<Record<number, LeafletMarker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const selected = destinations.find((d) => d.id === activeId);
    if (!selected) {
      return;
    }

    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 7), {
      duration: 1.2,
    });

    const marker = markerRefs.current[activeId];
    marker?.openPopup();
  }, [activeId, destinations, map, markerRefs]);

  return null;
}

function markerIcon(destination: Destination): DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div class="custom-marker" style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid rgba(247, 240, 227, 0.65);
        background: linear-gradient(135deg, ${destination.typeColor}, #0D0A06);
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff4d6;
        font-size: 16px;
        box-shadow: 0 8px 18px rgba(0,0,0,0.35);
      ">${destination.icon}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

export default function MapComponent({
  destinations,
  activeId,
  onMarkerClick,
}: MapComponentProps) {
  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});
  const icons = useMemo(() => {
    return Object.fromEntries(destinations.map((d) => [d.id, markerIcon(d)]));
  }, [destinations]);

  return (
    <MapContainer
      center={[26.8206, 30.8025]}
      zoom={6}
      minZoom={5}
      maxZoom={12}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {destinations.map((dest) => (
        <Marker
          key={dest.id}
          position={[dest.lat, dest.lng]}
          icon={icons[dest.id]}
          ref={(instance) => {
            markerRefs.current[dest.id] = instance;
          }}
          eventHandlers={{
            click: () => onMarkerClick(dest.id),
          }}
        >
          <Popup>
            <article
              style={{
                width: "280px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(232,160,0,0.22)",
                background: "linear-gradient(180deg, rgba(13,10,6,0.96), rgba(17,14,9,0.96))",
                color: "#F7F0E3",
                boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  height: "135px",
                  backgroundImage: `linear-gradient(rgba(13,10,6,0.2), rgba(13,10,6,0.75)), url(${dest.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: "0.95rem" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Cinzel', serif",
                    color: "#E8C97A",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                  }}
                >
                  {dest.name}
                </p>
                <p
                  style={{
                    margin: "0.3rem 0 0.6rem",
                    fontSize: "0.72rem",
                    color: "rgba(247,240,227,0.52)",
                    fontFamily: "'Lora', serif",
                  }}
                >
                  {dest.city} · {dest.region}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.6rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      borderRadius: "999px",
                      padding: "0.16rem 0.52rem",
                      border: `1px solid ${dest.typeColor}55`,
                      background: `${dest.typeColor}22`,
                      color: dest.typeColor,
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    {dest.type}
                  </span>
                  <span style={{ color: "#E8A000", fontSize: "0.75rem", fontFamily: "'Cinzel', serif" }}>
                    ★ {dest.rating}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.76rem",
                    lineHeight: 1.45,
                    color: "rgba(247,240,227,0.8)",
                    fontFamily: "'Lora', serif",
                  }}
                >
                  {dest.desc}
                </p>
              </div>
            </article>
          </Popup>
        </Marker>
      ))}

      <ActiveController destinations={destinations} activeId={activeId} markerRefs={markerRefs} />
    </MapContainer>
  );
}
