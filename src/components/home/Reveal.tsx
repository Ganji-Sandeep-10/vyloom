"use client";

import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Start visible so content is never hidden if JS is slow/disabled; the
  // observer only adds a subtle entrance animation as progressive enhancement.
  const [entered, setEntered] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animate = armed && !entered;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        animate ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
