const API_BASE = "https://api.aladhan.com/v1/timingsByCity";

// Methods available in Al-Adhan API:
// 1: University of Islamic Sciences, Karachi
// 2: Islamic Society of North America (ISNA)
// 3: Muslim World League (MWL)
// 4: Umm Al-Qura University, Makkah - Recommended
// 5: Egyptian General Authority of Survey
// 6: Institute of Geophysics, University of Tehran
// 7: France (aoif)

export const PRAYER_METHODS = [
  { value: 1, label: "Karachi" },
  { value: 2, label: "ISNA (Amérique du Nord)" },
  { value: 3, label: "MWL (League Mondiale)" },
  { value: 4, label: "Umm Al-Qura (Makkah)" },
  { value: 5, label: "Égypte" },
  { value: 6, label: " Téhéran" },
  { value: 7, label: " France" }
];

const DEFAULT_METHOD = 4; // Umm Al-Qura for Senegal

let currentMethod = DEFAULT_METHOD;

export function setPrayerMethod(method) {
  currentMethod = method;
}

export function getPrayerMethod() {
  return currentMethod;
}

export async function fetchPrayerTimes(city, method = currentMethod) {
  const date = new Date();
  const dateStr = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
  const url = `${API_BASE}?city=${encodeURIComponent(city)}&country=Senegal&method=${method}&date=${dateStr}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des horaires.");
  }
  const json = await res.json();
  return {
    date: json.data.date.readable,
    timings: json.data.timings,
    method: method
  };
}

export function normalizeTime(value) {
  if (!value) return "--:--";
  return value.replace(/\s*\(.+\)/, "");
}
