import { sunriseJulianIST, tithiIndex } from '../utils/astro.js';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const weekdayOf = (d) => WEEKDAYS[d.getUTCDay()];
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
// Aladhan returns dates as DD-MM-YYYY
const parseDMY = (s) => {
  const [dd, mm, yy] = s.split('-').map(Number);
  return new Date(Date.UTC(yy, mm - 1, dd));
};

// Tithi index (0..29) prevailing at sunrise for a UTC calendar day
function udayaTithi(d) {
  return tithiIndex(sunriseJulianIST(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()));
}

// Tithi indices that "newly began" between the previous and current sunrise.
// Handles kshaya (skipped) tithis so no Ekadashi/Pradosh occurrence is missed.
function startedTithis(prev, cur) {
  const out = [];
  let k = prev;
  while (k !== cur) { k = (k + 1) % 30; out.push(k); }
  return out;
}

// Is a Shukla Pratipada the start of Navratri? Sharad ~late-Sep/Oct, Chaitra ~late-Mar/Apr.
function navratriName(d) {
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  if ((m === 9 && day >= 25) || (m === 10 && day <= 25)) return 'Sharad Navratri';
  if ((m === 3 && day >= 20) || (m === 4 && day <= 20)) return 'Chaitra Navratri';
  return null;
}

// Walk the window day-by-day and pick out the tithi-based Hindu observances.
function computeHinduObservances(from, windowDays) {
  const events = [];
  const purnimas = []; // for Sawan Somwar bounding
  let prev = udayaTithi(addDays(from, -1));

  for (let i = 0; i < windowDays; i++) {
    const d = addDays(from, i);
    const cur = udayaTithi(d); // 0..29
    const started = startedTithis(prev, cur);
    prev = cur;
    const iso = isoOf(d);
    const wd = weekdayOf(d);

    const month = d.getUTCMonth() + 1;
    if (started.includes(14)) purnimas.push(d);

    // ── Hindu ──
    // Ekadashi — 11th tithi of either paksha (index 10 Shukla, 25 Krishna)
    if (started.includes(10) || started.includes(25)) {
      events.push({ id: `ekadashi-${iso}`, type: 'ekadashi', name: 'Ekadashi', emoji: '🌙', date: iso, weekday: wd });
    }
    // Pradosh — Trayodashi (index 12 Shukla, 27 Krishna)
    if (started.includes(12) || started.includes(27)) {
      events.push({ id: `pradosh-${iso}`, type: 'pradosh', name: 'Pradosh Vrat', emoji: '🪔', date: iso, weekday: wd });
    }
    // Navratri — Shukla Pratipada (index 0) in the spring or autumn window
    if (started.includes(0)) {
      const name = navratriName(d);
      if (name) events.push({ id: `navratri-${iso}`, type: 'navratri', name, emoji: '🪔', date: iso, weekday: wd, days: 9 });
    }

    // ── Jain ── Ashtami (8th tithi) & Chaudas (14th tithi) of either paksha
    if (started.includes(7) || started.includes(22)) {
      events.push({ id: `jain-ashtami-${iso}`, type: 'jain_ashtami', name: 'Ashtami (Jain fast)', emoji: '🤲', date: iso, weekday: wd });
    }
    if (started.includes(13) || started.includes(28)) {
      events.push({ id: `jain-chaudas-${iso}`, type: 'jain_chaudas', name: 'Chaudas (Jain fast)', emoji: '🤲', date: iso, weekday: wd });
    }

    // ── Buddhist / Sikh ── tied to full & new moon
    if (started.includes(14)) {
      events.push({ id: `uposatha-p-${iso}`, type: 'uposatha', name: 'Purnima Uposatha', emoji: '☸️', date: iso, weekday: wd });
      // Vesak = Vaishakha Purnima (~late-Apr to mid-May), not the Chaitra Purnima
      if ((month === 4 && d.getUTCDate() >= 25) || (month === 5 && d.getUTCDate() <= 25)) {
        events.push({ id: `buddha-purnima-${iso}`, type: 'buddha_purnima', name: 'Buddha Purnima (Vesak)', emoji: '☸️', date: iso, weekday: wd });
      }
      if (month === 11) {
        events.push({ id: `gurpurab-${iso}`, type: 'gurpurab', name: 'Guru Nanak Gurpurab', emoji: '🪯', date: iso, weekday: wd });
      }
    }
    if (started.includes(29)) {
      events.push({ id: `uposatha-a-${iso}`, type: 'uposatha', name: 'Amavasya Uposatha', emoji: '☸️', date: iso, weekday: wd });
    }
  }

  // Sawan Somwar — Mondays of Shravan (Purnimanta: the lunar month ending on the
  // Shravan Purnima, which falls ~late-Jul/Aug). Bound by the two Purnimas around it.
  const shravanPurnima = purnimas.find((p) => {
    const m = p.getUTCMonth() + 1;
    const day = p.getUTCDate();
    return (m === 8) || (m === 7 && day >= 25);
  });
  if (shravanPurnima) {
    const start = addDays(shravanPurnima, -29); // ~previous Purnima
    for (let d = new Date(start); d <= shravanPurnima; d = addDays(d, 1)) {
      if (d.getUTCDay() === 1 && d >= from) {
        const iso = isoOf(d);
        events.push({ id: `sawan-${iso}`, type: 'sawan_somwar', name: 'Sawan Somwar', emoji: '🙏', date: iso, weekday: 'Monday' });
      }
    }
  }

  return events;
}

// Easter Sunday (Gregorian) via the Anonymous Computus algorithm — exact.
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

// Christian Lenten observances: Ash Wednesday, Lenten Fridays, Good Friday.
function computeChristian(from, end) {
  const events = [];
  const push = (d, type, name) => {
    if (d >= from && d <= end) {
      events.push({ id: `${type}-${isoOf(d)}`, type, name, emoji: '✝️', date: isoOf(d), weekday: weekdayOf(d) });
    }
  };
  for (const y of [from.getUTCFullYear(), from.getUTCFullYear() + 1]) {
    const easter = easterSunday(y);
    const ashWed = addDays(easter, -46);
    const goodFri = addDays(easter, -2);
    push(ashWed, 'ash_wednesday', 'Ash Wednesday');
    for (let d = addDays(ashWed, 1); d < goodFri; d = addDays(d, 1)) {
      if (d.getUTCDay() === 5) push(d, 'lent_friday', 'Lenten Friday');
    }
    push(goodFri, 'good_friday', 'Good Friday');
  }
  return events;
}

// Sikh Baisakhi — fixed solar date (Apr 14). Guru Nanak Gurpurab is lunar (above).
function computeSikh(from, end) {
  const events = [];
  for (const y of [from.getUTCFullYear(), from.getUTCFullYear() + 1]) {
    const d = new Date(Date.UTC(y, 3, 14));
    if (d >= from && d <= end) {
      events.push({ id: `baisakhi-${isoOf(d)}`, type: 'baisakhi', name: 'Baisakhi', emoji: '🌾', date: isoOf(d), weekday: weekdayOf(d) });
    }
  }
  return events;
}

// Next Ramadan on/after `from`, via the keyless Aladhan API (Hijri month 9).
async function fetchRamadan(from) {
  try {
    const dmy = `${pad(from.getUTCDate())}-${pad(from.getUTCMonth() + 1)}-${from.getUTCFullYear()}`;
    const gToH = await fetch(`https://api.aladhan.com/v1/gToH/${dmy}`);
    const gToHData = await gToH.json();
    const hy = parseInt(gToHData?.data?.hijri?.year, 10);
    if (!hy) return null;

    for (const year of [hy, hy + 1]) {
      const res = await fetch(`https://api.aladhan.com/v1/hToGCalendar/9/${year}`);
      const json = await res.json();
      const arr = json?.data;
      if (!Array.isArray(arr) || !arr.length) continue;
      const startG = parseDMY(arr[0].gregorian.date);
      const endG = parseDMY(arr[arr.length - 1].gregorian.date);
      if (startG >= from) {
        return {
          id: `ramadan-${isoOf(startG)}`,
          type: 'ramadan',
          name: 'Ramadan (Roza)',
          emoji: '🌙',
          date: isoOf(startG),
          endDate: isoOf(endG),
          weekday: weekdayOf(startG),
          days: arr.length,
        };
      }
    }
    return null;
  } catch (_) {
    return null; // Ramadan is best-effort; Hindu events still return
  }
}

export async function getObservances(req, res, next) {
  try {
    const windowDays = Math.min(parseInt(req.query.days, 10) || 365, 400);
    const fromStr = req.query.from;
    const from = fromStr ? new Date(`${fromStr}T00:00:00Z`) : new Date(`${isoOf(new Date())}T00:00:00Z`);

    const end = addDays(from, windowDays);
    const all = [
      ...computeHinduObservances(from, windowDays),
      ...computeChristian(from, end),
      ...computeSikh(from, end),
    ];
    const ramadan = await fetchRamadan(from);
    if (ramadan) all.push(ramadan);

    // Sort by date, then cap noisy recurring types so the picker stays readable
    all.sort((a, b) => a.date.localeCompare(b.date));
    const caps = { ekadashi: 4, pradosh: 4, jain_ashtami: 4, jain_chaudas: 4, uposatha: 4, lent_friday: 6 };
    const counts = {};
    const events = all.filter((e) => {
      if (!caps[e.type]) return true;
      counts[e.type] = (counts[e.type] || 0) + 1;
      return counts[e.type] <= caps[e.type];
    });

    res.json({
      events,
      note: 'Hindu Panchang dates are computed astronomically and may be ±1 day — verify against your local Panchang for strict observance.',
    });
  } catch (err) {
    next(err);
  }
}
