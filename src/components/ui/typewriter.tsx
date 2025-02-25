"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // Tempo (ms) entre a digitação de cada letra
}

export function Typewriter({ text, speed = 80 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let cancelled = false;
    setDisplayedText("");

    const animate = async () => {
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        setDisplayedText((prev) => prev + text[i]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      <span className="blinking-cursor">|</span>
      <style jsx>{`
        .blinking-cursor {
          font-weight: 100;
          font-size: 1em;
          color: inherit;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
