import Lenis, { type LenisOptions } from "lenis";

export const defaultLenisOptions: LenisOptions = {
  duration: 1.15,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

export function createLenis(options: Partial<LenisOptions> = {}) {
  return new Lenis({ ...defaultLenisOptions, ...options });
}
