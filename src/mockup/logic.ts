
/* eslint-disable */
// @ts-nocheck
// Demo-logica en -data uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
// Elk scherm in ./screens leest zijn waarden uit renderVals(); vervang de demo-data
// per scherm door echte data zodra het bijbehorende datamodel er is.

export type Vals = Record<string, any>;
export type MockupState = typeof initialState;
export type SetState = (patch: Partial<MockupState> | ((s: MockupState) => Partial<MockupState>)) => void;
export type LogicProps = { active: string; roster?: any[]; sites?: any[] };

export const initialState = {
  wide: true, repClient: "Meridian Studio",
};

export class MockupLogic {
  constructor(public state: MockupState, public setState: SetState, public props: LogicProps) {}

  reportVals() {
    const list = [
      ["Meridian Studio", "Verstuurd", "1 sep 09:00", "#2e9c6a"],
      ["Veldhuis Group", "Verstuurd", "1 sep 09:00", "#2e9c6a"],
      ["Pallas Onderwijs", "Verstuurd", "1 sep 09:00", "#2e9c6a"],
      ["Cordaan Vastgoed", "Concept", "wacht op advies", "#c4881c"],
      ["Duinrand Hotels", "Concept", "wacht op advies", "#c4881c"],
      ["Kade & Co", "Gepland", "1 okt 09:00", "#7d5fd6"],
      ["Noorderlicht", "Gepland", "1 okt 09:00", "#7d5fd6"],
      ["Bureau Hedde", "Uit", "geen rapportage", "#9397ab"],
    ];
    const sel = this.state.repClient;
    return {
      repList: list.map(([name, state, note, color]) => {
        const on = name === sel;
        return {
          name, state, note, color,
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "var(--color-surface)",
          ring: on ? "inset 0 0 0 1px var(--color-accent)" : "var(--shadow-sm)",
          select: () => this.setState({ repClient: name }),
        };
      }),
      repClient: sel,
      repSources: [["Organisch zoeken", "46%", "46%"], ["Direct", "24%", "24%"], ["LinkedIn", "13%", "13%"], ["Nieuwsbrief", "9%", "9%"], ["Overig", "8%", "8%"]]
        .map(([label, val, w]) => ({ label, val, w })),
      repPages: [["/diensten", "18.400", "100%"], ["/cases/havenkwartier", "11.250", "61%"], ["/over-ons", "7.980", "43%"], ["/contact", "5.410", "29%"], ["/vacatures", "3.120", "17%"]]
        .map(([label, val, w]) => ({ label, val, w })),
      repChanges: [["Nieuwe case gepubliceerd", "12 aug"], ["Hero-component vernieuwd (v4.1)", "18 aug"], ["Vacaturepagina toegevoegd", "24 aug"], ["Design kit accent aangepast", "29 aug"]]
        .map(([label, when]) => ({ label, when })),
      repLeads: [["Contactformulier", "38"], ["Aanvraag brochure", "21"], ["Nieuwsbrief", "64"], ["Telefoonclicks", "45"]]
        .map(([label, val]) => ({ label, val })),
      repCosts: [["Websites (3)", "€ 285,00"], ["Klantportaal-app", "€ 120,00"], ["Design kit onderhoud", "€ 45,00"], ["AI-credits boven bundel", "€ 18,40"]]
        .map(([label, val]) => ({ label, val })),
      repKpis: [["Bezoekers", "42.180", "+12,4%"], ["Sessies", "58.900", "+9,1%"], ["Gem. laadtijd", "1,2 s", "−0,3 s"], ["Uptime", "99,98%", "geen incidenten"]]
        .map(([label, val, delta]) => ({ label, val, delta })),
      finKpis: [["MRR", "€ 18.640", "+4,2% t.o.v. augustus"], ["Marge", "€ 12.310", "66% van omzet"], ["Openstaand", "€ 4.180", "3 facturen · Moneybird"], ["Prognose dec", "€ 21.400", "bij huidige groei"]]
        .map(([label, val, delta]) => ({ label, val, delta })),
      finPlans: [["Agency · 6 klanten", "€ 9.540", "100%"], ["Pro · 14 klanten", "€ 6.860", "72%"], ["Starter · 9 klanten", "€ 2.240", "23%"]]
        .map(([label, val, w]) => ({ label, val, w })),
      finCosts: [["Hosting (Vercel)", "€ 2.140", "100%"], ["Database (Neon)", "€ 1.380", "64%"], ["AI-generatie", "€ 1.910", "89%"], ["Overig (mail, CDN)", "€ 640", "30%"]]
        .map(([label, val, w]) => ({ label, val, w })),
      finRows: [
        ["Meridian Studio", "Agency", "€ 2.480", "€ 690", "€ 1.790", "72%"],
        ["Veldhuis Group", "Agency", "€ 2.150", "€ 610", "€ 1.540", "72%"],
        ["Pallas Onderwijs", "Agency", "€ 1.890", "€ 720", "€ 1.170", "62%"],
        ["Cordaan Vastgoed", "Agency", "€ 1.640", "€ 480", "€ 1.160", "71%"],
        ["Duinrand Hotels", "Agency", "€ 1.380", "€ 520", "€ 860", "62%"],
        ["Kade & Co", "Pro", "€ 980", "€ 260", "€ 720", "73%"],
        ["Rietveld Mobility", "Pro", "€ 870", "€ 310", "€ 560", "64%"],
        ["Stroomlijn Energie", "Pro", "€ 810", "€ 240", "€ 570", "70%"],
      ].map(([name, plan, omzet, kosten, marge, pct]) => ({ name, plan, omzet, kosten, marge, pct })),
      finChurn: [["Nieuw deze maand", "Bakker & Zoon, Amberhout Interieur", "+€ 410", "#2e9c6a"], ["Opgezegd", "Elsinga Advocaten (per 1 okt)", "−€ 95", "#d94662"], ["Upgrade", "Kade & Co naar Agency", "+€ 240", "#2e9c6a"]]
        .map(([label, note, val, color]) => ({ label, note, val, color })),
    };
  }

  renderVals() {
    const active = this.props.active;

    const roster = this.props.roster ?? [
      ["Meridian Studio", "Lotte de Wit", "+31 6 1240 8891", "lotte@meridian.nl", "Agency", [["Sites", 34], ["Apps", 3], ["Design kit", 1]]],
      ["Molenaar Techniek", "Bas Molenaar", "+31 30 214 5567", "bas@molenaartechniek.nl", "Pro", [["Sites", 6], ["Apps", 1]]],
      ["Amberhout Interieur", "Iris Amberhout", "+31 6 4471 2093", "iris@amberhout.nl", "Starter", [["Sites", 2]]],
      ["Bureau Hedde", "Sanne Bos", "+31 20 771 3320", "sanne@hedde.studio", "Starter", [["Sites", 4], ["Design kit", 1]]],
      ["Bakker & Zoon", "Ruben Bakker", "+31 55 302 8814", "ruben@bakkerenzoon.nl", "Pro", [["Sites", 8], ["Apps", 2]]],
      ["Cordaan Vastgoed", "Nynke Cordaan", "+31 10 448 9921", "nynke@cordaan.nl", "Agency", [["Sites", 19], ["Apps", 4], ["Design kit", 2]]],
      ["Delfland Zorg", "Peter Vos", "+31 15 226 7714", "p.vos@delflandzorg.nl", "Pro", [["Sites", 5], ["Apps", 1]]],
      ["Duinrand Hotels", "Maud Duinker", "+31 71 519 4432", "maud@duinrand.com", "Agency", [["Sites", 14], ["Apps", 2]]],
      ["Elsinga Advocaten", "Tim Elsinga", "+31 58 213 0087", "t.elsinga@elsinga.nl", "Starter", [["Sites", 1]]],
      ["Kade & Co", "Joris van Kade", "+31 6 2299 4410", "joris@kade.co", "Pro", [["Sites", 12], ["Design kit", 1]]],
      ["Kruithof Bouw", "Ellen Kruithof", "+31 40 291 6628", "ellen@kruithofbouw.nl", "Pro", [["Sites", 7], ["Apps", 1]]],
      ["Noorderlicht", "Anke Fokkema", "+31 50 311 7752", "anke@noorderlicht.nl", "Pro", [["Sites", 9], ["Apps", 1], ["Design kit", 1]]],
      ["Oostvaarders Reizen", "Mark Oosting", "+31 36 530 2218", "mark@oostvaarders.nl", "Starter", [["Sites", 3]]],
      ["Pallas Onderwijs", "Feline Pallas", "+31 24 660 1193", "f.pallas@pallas-onderwijs.nl", "Agency", [["Sites", 22], ["Apps", 5]]],
      ["Rietveld Mobility", "Sander Rietveld", "+31 88 400 2290", "sander@rietveldmobility.com", "Pro", [["Sites", 6], ["Apps", 3]]],
      ["Stroomlijn Energie", "Hugo Stroom", "+31 85 016 7741", "hugo@stroomlijn.nl", "Agency", [["Sites", 16], ["Apps", 2], ["Design kit", 1]]],
      ["Veldhuis Group", "Wendy Veldhuis", "+31 6 5502 1187", "wendy@veldhuis.com", "Agency", [["Sites", 28], ["Apps", 4], ["Design kit", 3]]],
      ["Waterlander Media", "Joost Waterlander", "+31 6 1188 9042", "joost@waterlander.media", "Pro", [["Sites", 11], ["Apps", 1]]],
    ].map(([name, cp, tel, mail, plan, svc]) => ({
      name, cp, tel, mail, plan,
      letter: name[0].toUpperCase(),
      monogram: name.split(" ").filter(w => /[a-z]/i.test(w[0])).slice(0, 2).map(w => w[0]).join("").toUpperCase(),
      planTag: plan === "Agency" ? "tag tag-accent" : plan === "Pro" ? "tag tag-neutral" : "tag tag-outline",
      services: svc.map(([label, n]) => ({ label: label + " · " + n })),
    }));

    const byLetter = {};
    roster.forEach(c => { (byLetter[c.letter] = byLetter[c.letter] || []).push(c); });
    const letterGroups = Object.keys(byLetter).sort().map(l => ({ letter: l, count: byLetter[l].length + " klanten", items: byLetter[l] }));
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => ({
      letter: l,
      href: byLetter[l] ? "#k-" + l : "#",
      color: byLetter[l] ? "var(--color-accent-200)" : "color-mix(in srgb, var(--color-text) 22%, transparent)",
      bg: byLetter[l] ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "transparent",
    }));

    const sites = [
      ["amberhout.nl", "Amberhout Interieur", "Live"], ["bakkerenzoon.nl", "Bakker & Zoon", "Live"],
      ["cordaan.nl", "Cordaan Vastgoed", "Live"], ["delflandzorg.nl", "Delfland Zorg", "Concept"],
      ["duinrand.com", "Duinrand Hotels", "Live"], ["elsinga.nl", "Elsinga Advocaten", "Live"],
      ["hedde.studio", "Bureau Hedde", "Mislukt"], ["kade.co", "Kade & Co", "Live"],
      ["kruithofbouw.nl", "Kruithof Bouw", "Live"], ["meridian.nl", "Meridian Studio", "Live"],
      ["molenaartechniek.nl", "Molenaar Techniek", "Live"], ["noorderlicht.nl", "Noorderlicht", "Live"],
      ["oostvaarders.nl", "Oostvaarders Reizen", "Concept"], ["pallas-onderwijs.nl", "Pallas Onderwijs", "Live"],
      ["rietveldmobility.com", "Rietveld Mobility", "Live"], ["stroomlijn.nl", "Stroomlijn Energie", "Live"],
      ["veldhuis.com", "Veldhuis Group", "Live"], ["waterlander.media", "Waterlander Media", "Concept"],
    ];
    const apps = [
      ["Afsprakenportaal", "Delfland Zorg", "Live"], ["Bouwdossier", "Kruithof Bouw", "Live"],
      ["Cursusplanner", "Pallas Onderwijs", "Live"], ["Dealer Locator", "Rietveld Mobility", "Concept"],
      ["Energie-dashboard", "Stroomlijn Energie", "Live"], ["Kamerbeheer", "Duinrand Hotels", "Live"],
      ["Klantportaal", "Veldhuis Group", "Live"], ["Leadflow", "Meridian Studio", "Live"],
      ["Onderhoudsbon", "Molenaar Techniek", "Concept"], ["Projectenkaart", "Cordaan Vastgoed", "Live"],
      ["Reserveringen", "Oostvaarders Reizen", "Mislukt"], ["Servicedesk", "Bakker & Zoon", "Live"],
      ["Voorraadscanner", "Rietveld Mobility", "Live"], ["Werkbon-app", "Kruithof Bouw", "Live"],
    ];
    const isApps = active === "apps";
    // Websites komen uit de database (tuples [naam, klant, status, href]); apps zijn nog demo-data.
    const siteList = this.props.sites ?? sites;
    const gallerySource = (isApps ? apps : siteList).map(([name, client, state, href]) => ({
      name, client, state, href,
      letter: name.replace(/^www\./, "")[0].toUpperCase(),
      stateColor: state === "Live" ? "#2e9c6a" : state === "Concept" ? "#c4881c" : "#d94662",
    }));
    const galByLetter = {};
    gallerySource.forEach(g => { (galByLetter[g.letter] = galByLetter[g.letter] || []).push(g); });
    const galleryGroups = Object.keys(galByLetter).sort().map(l => ({
      letter: l, count: galByLetter[l].length + (isApps ? " apps" : " sites"), items: galByLetter[l],
    }));
    const galleryAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => ({
      letter: l,
      href: galByLetter[l] ? "#g-" + l : "#",
      color: galByLetter[l] ? "var(--color-accent-200)" : "color-mix(in srgb, var(--color-text) 22%, transparent)",
      bg: galByLetter[l] ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "transparent",
    }));

    return {
      pageMax: this.state.wide ? "100%" : "1280px",
      ...this.reportVals(),
      letterGroups, alphabet, klantCount: roster.length + " klanten",
      galleryGroups, galleryAlphabet,
      galleryTitle: isApps ? "Apps" : "Websites",
      galleryMeta: (isApps ? apps.length + " apps" : siteList.length + " websites") + " · alfabetisch gesorteerd",
      galleryNewLabel: isApps ? "Nieuwe app" : "Nieuwe site",
      galleryNewHref: isApps ? "/apps/nieuw" : "/websites/nieuw",
    };
  }
}
