"use client";

import { gsap, registerGsap, ScrollTrigger } from "@lib/animations";
import { createLenis } from "@lib/lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type PropsWithChildren } from "react";

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null);

  const refreshScrollBounds = () => {
    const lenis = lenisRef.current;

    if (!lenis) {
      return;
    }

    lenis.resize();
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    registerGsap();

    const lenis = createLenis();
    lenisRef.current = lenis;

    const onFrame = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(onFrame);
    lenis.on("scroll", ScrollTrigger.update);

    const onWindowResize = () => {
      refreshScrollBounds();
    };

    const onWindowLoad = () => {
      refreshScrollBounds();
    };

    const bodyObserver = new MutationObserver(() => {
      // Modal/drawer scroll locks often mutate body style/class and can stale Lenis limits.
      refreshScrollBounds();
    });

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("load", onWindowLoad);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.off("scroll", ScrollTrigger.update);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("load", onWindowLoad);
      bodyObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      !lenisRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Ensure every route starts at top and recalculates trigger bounds.
    lenisRef.current.scrollTo(0, { immediate: true });

    // Refresh after paint to capture route content that mounts one frame later.
    const frame = requestAnimationFrame(() => {
      refreshScrollBounds();
    });

    const timer = window.setTimeout(() => {
      refreshScrollBounds();
    }, 150);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return <>{children}</>;
}
