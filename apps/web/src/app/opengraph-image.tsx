import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO, SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${HERO.headline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Fonts are vendored in `assets/` so Satori does not fetch from the network. */
function fontPath(file: string) {
  return join(process.cwd(), "assets", file);
}

const [semiBold, regular, monoMedium] = await Promise.all([
  readFile(fontPath("Geist-SemiBold.ttf")),
  readFile(fontPath("Geist-Regular.ttf")),
  readFile(fontPath("GeistMono-Medium.ttf")),
]);

const INK = "#F5F6F0";
const MUTED = "#9BA69A";
const LIME = "#C5F477";
const DARK = "#101510";
const RULE = "#344336";

function Mark() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="6.5" fill={DARK} stroke={LIME} strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M5 12h3l2-4 3 8 2-4h4" stroke={LIME} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 60,
          backgroundColor: DARK,
          color: INK,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(#1B241D 1px, transparent 1px), linear-gradient(90deg, #1B241D 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
          <Mark />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em" }}>
            {SITE.wordmark}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 14,
              padding: "6px 14px",
              border: `1px solid ${RULE}`,
              fontFamily: "Geist Mono",
              fontSize: 15,
              letterSpacing: "0.14em",
              color: LIME,
            }}
          >
            OPEN SOURCE
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            maxWidth: 980,
            fontSize: 66,
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
          }}
        >
          {HERO.headline}
        </div>

        <div style={{ display: "flex", height: 24 }} />

        <div
          style={{
            position: "relative",
            display: "flex",
            maxWidth: 900,
            fontSize: 26,
            lineHeight: 1.45,
            color: MUTED,
          }}
        >
          {HERO.supporting}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              border: `1px solid ${RULE}`,
              fontFamily: "Geist Mono",
              fontSize: 22,
            }}
          >
            <span style={{ color: LIME }}>$</span>
            <span>node packages/cli/bin/cdoc.js scan</span>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 18,
              letterSpacing: "0.1em",
              color: MUTED,
            }}
          >
            LOCAL-FIRST · DEVELOPER-FIRST
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semiBold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist Mono", data: monoMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
