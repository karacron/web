"use client";

import { gsap, registerGsap, ScrollTrigger } from "@lib/animations";
import { useEffect, type RefObject } from "react";

type UseScrollRevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  childrenSelector?: string;
};

export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollRevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    registerGsap();

    const {
      y = 36,
      duration = 0.8,
      delay = 0,
      stagger = 0.08,
      childrenSelector,
    } = options;

    const targets = childrenSelector
      ? (el.querySelectorAll(childrenSelector) as NodeListOf<HTMLElement>)
      : [el];

    gsap.set(targets, { autoAlpha: 0, y, scale: 0.985 });

    const tween = gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, options]);
}

export { ScrollTrigger };
