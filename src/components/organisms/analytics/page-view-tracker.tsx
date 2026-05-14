"use client";

import { trackPageView } from "@lib/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const queryString = window.location.search;
    const pagePath = `${pathname}${queryString}`;

    trackPageView(pagePath);
  }, [pathname]);

  return null;
}
