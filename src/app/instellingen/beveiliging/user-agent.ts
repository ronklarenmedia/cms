// Grove herkenning van browser en besturingssysteem voor de sessielijst; bewust simpel, geen dependency.

const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Safari\//, "Safari"],
];
const SYSTEMS: [RegExp, string][] = [
  [/iPhone|iPad|iPod/, "iOS"],
  [/Android/, "Android"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Windows/, "Windows"],
  [/Linux|X11/, "Linux"],
];

export function describeUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Onbekend apparaat";
  const browser = BROWSERS.find(([re]) => re.test(ua))?.[1];
  const system = SYSTEMS.find(([re]) => re.test(ua))?.[1];
  if (browser && system) return `${browser} op ${system}`;
  return browser ?? system ?? "Onbekend apparaat";
}

/** IP-adres voor de sessielijst; een loopback- of leeg adres (lokaal ontwikkelen) toont niets zinnigs. */
export function describeIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  if (/^[0:.]*1?$/.test(ip) || ip === "127.0.0.1") return "lokaal";
  return ip;
}
