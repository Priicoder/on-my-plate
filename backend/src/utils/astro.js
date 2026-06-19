// Low-precision solar & lunar longitude (Meeus, simplified) — enough to derive
// the Hindu tithi, which spans 12° of moon–sun elongation. Civil-day placement
// uses the tithi prevailing at local sunrise (Udaya tithi). Accuracy is ±1 day
// in rare boundary cases, the same caveat commercial Panchang APIs carry.

const DEG = Math.PI / 180;
const norm360 = (x) => ((x % 360) + 360) % 360;

// Julian Day from a JS Date (uses the instant's UTC value)
export function toJulian(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

// Sun's apparent geometric longitude in degrees
export function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  return norm360(L0 + C);
}

// Moon's longitude in degrees (principal periodic terms of ELP-2000)
export function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = (297.8501921 + 445267.1114034 * T) * DEG;
  const M = (357.5291092 + 35999.0502909 * T) * DEG;
  const Mp = (134.9633964 + 477198.8675055 * T) * DEG;
  const F = (93.272095 + 483202.0175233 * T) * DEG;

  const sum =
    6.288774 * Math.sin(Mp) +
    1.274027 * Math.sin(2 * D - Mp) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mp) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * Mp) +
    0.057066 * Math.sin(2 * D - M - Mp) +
    0.053322 * Math.sin(2 * D + Mp) +
    0.045758 * Math.sin(2 * D - M) -
    0.040923 * Math.sin(M - Mp) -
    0.03472 * Math.sin(D) -
    0.030383 * Math.sin(M + Mp) +
    0.015327 * Math.sin(2 * D - 2 * F) -
    0.012528 * Math.sin(2 * F + Mp);

  return norm360(Lp + sum);
}

// Moon–sun elongation in degrees [0,360)
export function elongation(jd) {
  return norm360(moonLongitude(jd) - sunLongitude(jd));
}

// Tithi index 0..29 (0 = Shukla Pratipada start … 29 = Amavasya).
// Tithi number = index + 1; 0–14 = Shukla (waxing), 15–29 = Krishna (waning).
export function tithiIndex(jd) {
  return Math.floor(elongation(jd) / 12);
}

// JD for 06:00 IST (≈ sunrise in India) on a given calendar date.
// 06:00 IST = 00:30 UTC. We build the UTC instant explicitly.
export function sunriseJulianIST(year, month /*1-12*/, day) {
  const utc = Date.UTC(year, month - 1, day, 0, 30, 0);
  return toJulian(new Date(utc));
}
