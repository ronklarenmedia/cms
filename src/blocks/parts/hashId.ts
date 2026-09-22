/**
 * Korte, deterministische id op basis van tekst (geen node:crypto — blocks blijven framework-onafhankelijk). Gebruikt
 * om unieke DOM-id's te genereren voor een blockinstantie (bijv. radio-groepnamen, #-ankers), zodat twee secties van
 * hetzelfde block op één pagina elkaar niet raken. Niet cryptografisch, alleen bedoeld om botsingen te vermijden.
 */
export function hashId(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
