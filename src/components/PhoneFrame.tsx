import React from "react";

type Props = {
  width?: number;
  height?: number;
  children: React.ReactNode;
};

export const PhoneFrame: React.FC<Props> = ({
  width = 720,
  height = 1480,
  children,
}) => {
  const bezel = 12;
  const outerRadius = width * 0.14;
  const innerRadius = outerRadius - bezel;
  const islandW = width * 0.30;
  const islandH = 34;

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Volume Up */}
      <div
        style={{
          position: "absolute",
          left: -5,
          top: height * 0.17,
          width: 5,
          height: 42,
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
          background: "linear-gradient(90deg, #3a3a3e, #5a5a5e, #3a3a3e)",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.4)",
        }}
      />
      {/* Volume Down */}
      <div
        style={{
          position: "absolute",
          left: -5,
          top: height * 0.25,
          width: 5,
          height: 42,
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
          background: "linear-gradient(90deg, #3a3a3e, #5a5a5e, #3a3a3e)",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.4)",
        }}
      />
      {/* Action Button */}
      <div
        style={{
          position: "absolute",
          left: -5,
          top: height * 0.14,
          width: 5,
          height: 32,
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
          background: "linear-gradient(90deg, #3a3a3e, #5a5a5e, #3a3a3e)",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.4)",
        }}
      />
      {/* Power Button */}
      <div
        style={{
          position: "absolute",
          right: -5,
          top: height * 0.24,
          width: 5,
          height: 80,
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
          background: "linear-gradient(90deg, #3a3a3e, #5a5a5e, #3a3a3e)",
          boxShadow: "1px 0 3px rgba(0,0,0,0.4)",
        }}
      />

      {/* Outer frame — titanium finish */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: outerRadius,
          background:
            "linear-gradient(145deg, #4a4a4e 0%, #2a2a2e 15%, #3d3d42 30%, #1a1a1e 50%, #2d2d32 70%, #3a3a3e 85%, #2a2a2e 100%)",
          padding: bezel,
          position: "relative",
          boxShadow: `
            0 40px 100px rgba(0,0,0,0.6),
            0 10px 40px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,255,255,0.04)
          `,
        }}
      >
        {/* Titanium edge highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: outerRadius,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.03) 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Inner screen bezel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: innerRadius,
            background: "#000",
            overflow: "hidden",
            position: "relative",
            boxShadow: "inset 0 0 1px 1px rgba(0,0,0,0.8)",
          }}
        >
          {/* Screen content */}
          {children}

          {/* Screen glass reflection */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: innerRadius,
              background:
                "linear-gradient(155deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)",
              pointerEvents: "none",
              zIndex: 15,
            }}
          />

          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: islandW,
              height: islandH,
              borderRadius: islandH / 2,
              background: "#000",
              zIndex: 20,
              boxShadow:
                "0 0 0 1.5px rgba(30,30,30,1), inset 0 0 4px rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {/* Front camera */}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background:
                  "radial-gradient(circle at 40% 35%, #1a1a3a 0%, #0a0a1a 50%, #000 100%)",
                boxShadow:
                  "inset 0 0 2px rgba(30,30,80,0.5), 0 0 1px rgba(255,255,255,0.08)",
                marginLeft: islandW * 0.22,
              }}
            />
            {/* Face ID sensors */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#0a0a0e",
                boxShadow: "inset 0 0 1px rgba(50,50,50,0.3)",
              }}
            />
          </div>

          {/* Status bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 54,
              padding: "16px 40px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              color: "#fff",
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "-apple-system, SF Pro Display, system-ui, sans-serif",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>9:41</div>
            <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#fff" />
                <rect x="4" y="5" width="3" height="7" rx="0.5" fill="#fff" />
                <rect x="8" y="2" width="3" height="10" rx="0.5" fill="#fff" />
                <rect
                  x="12"
                  y="0"
                  width="3"
                  height="12"
                  rx="0.5"
                  fill="#fff"
                />
              </svg>
              <span style={{ fontWeight: 500, letterSpacing: 0.3 }}>5G</span>
              <svg width="27" height="13" viewBox="0 0 27 13">
                <rect
                  x="0"
                  y="0.5"
                  width="22"
                  height="12"
                  rx="3"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1"
                />
                <rect
                  x="23"
                  y="4"
                  width="2.5"
                  height="5"
                  rx="1"
                  fill="rgba(255,255,255,0.35)"
                />
                <rect
                  x="2"
                  y="2.5"
                  width="16"
                  height="8"
                  rx="1.5"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: width * 0.37,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.6)",
              zIndex: 20,
            }}
          />
        </div>
      </div>
    </div>
  );
};
