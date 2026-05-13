"use client";

import { gsap, registerGsap } from "@lib/animations";
import { useEffect, type RefObject } from "react";

type UseParallaxOptions = {
  yPercent?: number;
  scrub?: number;
  start?: string;
  end?: string;
};

export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseParallaxOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    registerGsap();

    const {
      yPercent = -18,
      scrub = 1,
      start = "top bottom",
      end = "bottom top",
    } = options;

    const tween = gsap.to(el, {
      yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, options]);
}
