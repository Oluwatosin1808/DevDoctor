import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Fonts are vendored into `assets/` and read from a statically scoped path so
 * Turbopack can trace exactly these three files instead of the whole project.
 * `geist` itself is hoisted to the monorepo root, so it can't be read from here.
 */
function fontPath(file: string) {
  return join(process.cwd(), "assets", file);
}

// Read once at module scope — the fonts never depend on request data.
const [semiBold, regular, monoMedium] = await Promise.all([
  readFile(fontPath("Geist-SemiBold.ttf")),
  readFile(fontPath("Geist-Regular.ttf")),
  readFile(fontPath("GeistMono-Medium.ttf")),
]);

const INK = "#ebeef1";
const MUTED = "#98a0aa";
const ACCENT = "#b6f36a";

function Mark() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        rx="6.5"
        fill="#0d1107"
        stroke="#B6F36A"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <path
        d="M5 12h3l2-4 3 8 2-4h4"
        stroke="#B6F36A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
          backgroundColor: "#08090a",
          color: INK,
          fontFamily: "Geist",
        }}
      >
        {/* Faint grid, echoing the site background. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(#14171c 1px, transparent 1px), linear-gradient(90deg, #14171c 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Soft lime wash from the top-right corner. A radial "bloom" would
            render as a hard-edged circle because Satori can't blur, so this is
            a gradient instead. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(215deg, rgba(182, 243, 106, 0.14) 0%, rgba(182, 243, 106, 0.04) 38%, rgba(182, 243, 106, 0) 62%)",
          }}
        />

        {/* Header: mark + wordmark. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Mark />
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {SITE.wordmark}
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 14,
              padding: "6px 14px",
              borderRadius: 9999,
              border: "1px solid rgba(182, 243, 106, 0.35)",
              backgroundColor: "rgba(182, 243, 106, 0.08)",
              fontFamily: "Geist Mono",
              fontSize: 17,
              letterSpacing: "0.14em",
              color: ACCENT,
            }}
          >
            OPEN SOURCE
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        {/* Headline. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            maxWidth: 940,
            fontSize: 74,
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: INK,
          }}
        >
          {SITE.tagline}
        </div>

        <div style={{ display: "flex", height: 26 }} />

        {/* Supporting line. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            maxWidth: 900,
            fontSize: 27,
            fontWeight: 400,
            lineHeight: 1.45,
            color: MUTED,
          }}
        >
          Catch issues before they become problems. Security, configuration,
          dependency and environment checks — straight from your terminal.
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        {/* Footer: install command + wordmark. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 24px",
              borderRadius: 14,
              border: "1px solid #292e36",
              backgroundColor: "#101216",
              fontFamily: "Geist Mono",
              fontSize: 26,
              color: INK,
            }}
          >
            <span style={{ color: ACCENT }}>$</span>
            <span>npm install -g devdoctor</span>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 20,
              letterSpacing: "0.1em",
              color: "#7d848e",
            }}
          >
            JAVASCRIPT · TYPESCRIPT
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: semiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Geist",
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Geist Mono",
          data: monoMedium,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}
