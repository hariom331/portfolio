// Calendar arithmetic for the uptime readout. Whole months are counted by
// walking the calendar rather than dividing by an average month, so "1 Jan to
// 1 Mar" is two months on every run of the code and not 1.97.

export interface Elapsed {
  readonly years: number;
  readonly months: number;
  readonly days: number;
}

export function elapsedSince(iso: string, now: Date): Elapsed | null {
  const start = new Date(iso);
  if (Number.isNaN(start.getTime()) || start > now) return null;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // Day 0 of this month is the last day of the previous one, which is the
    // month the borrowed days come out of.
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

// "2y 7m 21d" — the shape an uptime command prints.
export function formatUptime(elapsed: Elapsed): string {
  return `${elapsed.years}y ${elapsed.months}m ${elapsed.days}d`;
}

// Wall clock in the given IANA zone, as HH:MM:SS. Falls back to the visitor's
// own clock if the runtime has no data for the zone.
export function formatClock(now: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  }
}
