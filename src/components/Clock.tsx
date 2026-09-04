"use client";

import { useEffect, useState } from "react";

import { formatClock } from "@/lib/time";

const ZONE = "Asia/Kolkata";

// Local time where the work happens. It ticks, because a status line with a
// frozen clock on it is not a status line.
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatClock(new Date(), ZONE));

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tnum">
      {time ?? "--:--:--"} <span className="text-faint">IST</span>
    </span>
  );
}
