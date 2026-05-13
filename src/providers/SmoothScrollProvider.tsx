"use client";

import { gsap, registerGsap, ScrollTrigger } from "@lib/animations";
import { createLenis } from "@lib/lenis";
import { useEffect, type PropsWithChildren } from "react";

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    registerGsap();

    const lenis = createLenis();

    const onFrame = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onFrame);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
