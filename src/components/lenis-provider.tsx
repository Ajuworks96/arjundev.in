"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid running on server
    if (typeof window === "undefined") return;

    // Disable smooth scroll on admin panels and workspace pages to prevent scroll conflicts
    const isAdmin = pathname.startsWith("/admin");
    const isWorkspace = pathname.match(/^\/learn\/[^/]+\/[^/]+/);

    if (isAdmin || isWorkspace) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style premium smooth deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
