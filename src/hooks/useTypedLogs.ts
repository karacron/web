"use client";

import { useEffect, useMemo, useState } from "react";

export function useTypedLogs(lines: string[], active: boolean, speed = 68) {
  const [visible, setVisible] = useState(1);

  const safeLines = useMemo(() => lines.slice(0, 8), [lines]);

  useEffect(() => {
    if (!active || safeLines.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setVisible((current) => {
        if (current >= safeLines.length) {
          return 1;
        }
        return current + 1;
      });
    }, speed * 12);

    return () => {
      window.clearInterval(interval);
    };
  }, [active, safeLines, speed]);

  return safeLines.slice(0, visible);
}
