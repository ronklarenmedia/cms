// Onthoudt een klik op "Akkoord" (localStorage), zodat de cookiemelding niet op elke pagina terugkomt.
// Zonder dit script (of als localStorage niet beschikbaar is) blijft de melding gewoon op elke pagina zichtbaar:
// dat is de veilige, correcte staat, geen kapotte pagina. Zie docs/publieke-paginas-zonder-js.md.
const KEY = "rkm-cookie-consent";

function dismiss(el) {
  el.remove();
}

try {
  if (localStorage.getItem(KEY) === "1") {
    document.querySelectorAll("[data-cookie-notice]").forEach(dismiss);
  }
} catch {
  // Privénavigatie of geblokkeerde opslag: de melding blijft gewoon zichtbaar.
}

document.querySelectorAll("[data-cookie-notice] .blk-cookie-notice__accept").forEach((btn) => {
  btn.addEventListener("click", () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // Kan niet onthouden worden; de klik verbergt de melding nog wel voor deze weergave.
    }
    const notice = btn.closest("[data-cookie-notice]");
    if (notice) dismiss(notice);
  });
});
