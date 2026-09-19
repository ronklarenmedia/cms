
/* eslint-disable */
// @ts-nocheck
// Demo-logica en -data uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
// Elk scherm in ./screens leest zijn waarden uit renderVals(); vervang de demo-data
// per scherm door echte data zodra het bijbehorende datamodel er is.

export type Vals = Record<string, any>;
export type MockupState = typeof initialState;
export type SetState = (patch: Partial<MockupState> | ((s: MockupState) => Partial<MockupState>)) => void;
export type LogicProps = { active: string; roster?: any[] };

export const initialState = {
  kitAccent: 2, kitPaper: 0, kitFont: 0, kitRadius: 10,
  setTab: "thema", wide: true, repClient: "Meridian Studio",
  compVariant: 0, compBp: 0, compLayer: "Heading", compPad: 64,
  compHeading: "Merkwerk dat blijft staan", compSize: 40, compMedia: true,
};

export class MockupLogic {
  constructor(public state: MockupState, public setState: SetState, public props: LogicProps) {}

  kitPalettes() {
    return [
      { name: "Koraal", accent: "#e0455f", tint: "#fbe3e7", ink: "#2b1b1f" },
      { name: "Magenta", accent: "#c63f86", tint: "#fae0ef", ink: "#2b1a25" },
      { name: "Blurple", accent: "#7d5fd6", tint: "#e8e1fb", ink: "#221f2e" },
      { name: "Teal", accent: "#2e9c9c", tint: "#dcf0f0", ink: "#17282a" },
      { name: "Groen", accent: "#2e9c6a", tint: "#dcf1e6", ink: "#17271f" },
      { name: "Oker", accent: "#c4881c", tint: "#f7ebd6", ink: "#2a2115" },
    ];
  }

  kitPapers() {
    return [
      { name: "Wit", paper: "#ffffff", surface: "#f5f5f8" },
      { name: "Warm", paper: "#fdfaf5", surface: "#f4eee5" },
      { name: "Koel", paper: "#f7f9fc", surface: "#eaeff6" },
    ];
  }

  kitFonts() {
    return [
      { name: "Inter", stack: "var(--font-inter), system-ui, sans-serif" },
      { name: "Playfair Display", stack: "var(--font-playfair), Georgia, serif" },
      { name: "Fraunces", stack: "var(--font-fraunces), Georgia, serif" },
      { name: "Source Serif 4", stack: "var(--font-source-serif), Georgia, serif" },
    ];
  }

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

  settingsVals() {
    const tabs = [
      ["algemeen", "Algemeen"], ["thema", "Thema"], ["koppelingen", "Koppelingen"], ["ai", "AI"],
      ["team", "Team & rollen"], ["plannen", "Plannen & facturatie"], ["domeinen", "Domeinen & DNS"],
      ["publicatie", "Publicatie & omgevingen"], ["notificaties", "Notificaties & webhooks"],
      ["beveiliging", "Beveiliging & logging"], ["compliance", "Compliance & data"],
    ];
    const tab = this.state.setTab;
    const stubs = {
      team: ["Gebruikers en uitnodigingen", "Rollen: platform-admin, medewerker, klantgebruiker", "Rechten per klant of werkruimte", "Tweestapsverificatie verplichten", "SSO / Google Workspace"],
      plannen: ["Plandefinities: Starter, Pro, Agency", "Prijzen, kortingen en proefperiode", "Limieten per plan (sites, apps, AI-credits)", "BTW en factuurgegevens", "Betaalmethoden en herinneringen"],
      domeinen: ["Standaarddomein voor werkruimtes", "Wildcard-DNS en SSL-uitgifte", "Aangepaste domeinen goedkeuren", "Redirect- en www-beleid"],
      publicatie: ["Omgevingen: preview, staging, productie", "Build-hooks en deploy-limieten", "Automatisch publiceren na goedkeuring", "Terugrolbeleid en bewaartermijn versies"],
      notificaties: ["E-mailafzender en templates", "Slack- of Teams-kanaal per gebeurtenis", "Webhooks voor deploys en incidenten", "Statuspagina-abonnementen"],
      beveiliging: ["Sessieduur en apparaatbeheer", "Audit log en export", "IP-allowlist voor beheer", "Back-ups en herstelpunten", "API-tokens en scopes"],
      compliance: ["Verwerkersovereenkomsten per klant", "Datalocatie en bewaartermijnen", "Cookiemelding en toestemming", "Uitvoer- en verwijderverzoeken (AVG)"],
    };
    return {
      setTabs: tabs.map(([id, label]) => {
        const on = id === tab;
        return {
          label,
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "transparent",
          fg: on ? "var(--color-accent-200)" : "color-mix(in srgb, var(--color-text) 78%, transparent)",
          ring: on ? "inset 0 0 0 1px var(--color-accent)" : "none",
          select: () => this.setState({ setTab: id }),
        };
      }),
      setTabAlgemeen: tab === "algemeen",
      setTabThema: tab === "thema",
      setTabKoppelingen: tab === "koppelingen",
      setTabAI: tab === "ai",
      setStubItems: (stubs[tab] || []).map(t => ({ t })),
      setStubShow: !!stubs[tab],
      setStubTitle: (tabs.find(t => t[0] === tab) || ["", ""])[1],
      setServices: [
        ["Vercel", "ph ph-triangle", "Verbonden", "team_ronklaren · 412 projecten", "#2e9c6a"],
        ["Cloudflare", "ph ph-cloud", "Verbonden", "Zone ronklaren.app · wildcard actief", "#2e9c6a"],
        ["Neon", "ph ph-database", "Verbonden", "eu-central-1 · 37 databases", "#2e9c6a"],
        ["Stripe", "ph ph-credit-card", "Verbonden", "Live-modus · webhooks ok", "#2e9c6a"],
        ["Resend", "ph ph-envelope-simple", "Aandacht", "Domein niet geverifieerd", "#c4881c"],
        ["Moneybird", "ph ph-receipt", "Verbonden", "Administratie · facturen & BTW", "#2e9c6a"],
        ["GitHub", "ph ph-git-branch", "Niet verbonden", "Voor eigen componentrepo's", "#d94662"],
      ].map(([name, icon, state, note, color]) => ({ name, icon, state, note, color })),
    };
  }

  compEditorVals() {
    const s = this.state;
    const variants = ["Split", "Gecentreerd", "Media links"];
    const bps = [["Desktop", "ph ph-monitor", "100%"], ["Tablet", "ph ph-device-tablet", "760px"], ["Mobiel", "ph ph-device-mobile", "390px"]];
    const layers = [
      ["Section · Hero", "ph ph-frame-corners", 0],
      ["Container", "ph ph-columns", 1],
      ["Eyebrow", "ph ph-text-t", 2],
      ["Heading", "ph ph-text-h-one", 2],
      ["Body", "ph ph-text-align-left", 2],
      ["Button group", "ph ph-cursor-click", 2],
      ["Media slot", "ph ph-image", 1],
    ];
    const pal = this.kitPalettes()[s.kitAccent];
    const centered = s.compVariant === 1;
    const mediaLeft = s.compVariant === 2;
    return {
      compVariantOpts: variants.map((v, i) => {
        const on = i === s.compVariant;
        return {
          label: v,
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "var(--color-surface)",
          ring: on ? "inset 0 0 0 1px var(--color-accent)" : "var(--shadow-sm)",
          fg: on ? "var(--color-accent-200)" : "var(--color-text)",
          select: () => this.setState({ compVariant: i }),
        };
      }),
      compBpOpts: bps.map(([label, icon], i) => {
        const on = i === s.compBp;
        return {
          label, icon,
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "transparent",
          fg: on ? "var(--color-accent-200)" : "color-mix(in srgb, var(--color-text) 75%, transparent)",
          select: () => this.setState({ compBp: i }),
        };
      }),
      compLayers: layers.map(([label, icon, depth]) => {
        const on = label === s.compLayer;
        return {
          label, icon,
          pad: "calc(var(--space-3) + " + depth * 14 + "px)",
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "transparent",
          fg: on ? "var(--color-accent-200)" : "color-mix(in srgb, var(--color-text) 80%, transparent)",
          select: () => this.setState({ compLayer: label }),
        };
      }),
      compCanvasWidth: bps[s.compBp][2],
      compLayerName: s.compLayer,
      compPad: s.compPad,
      compPadLabel: s.compPad + " px",
      compSetPad: e => this.setState({ compPad: +e.target.value }),
      compHeading: s.compHeading,
      compSetHeading: e => this.setState({ compHeading: e.target.value }),
      compSize: s.compSize,
      compSizeLabel: s.compSize + " px",
      compSetSize: e => this.setState({ compSize: +e.target.value }),
      compMedia: s.compMedia,
      compToggleMedia: () => this.setState(st => ({ compMedia: !st.compMedia })),
      compMediaDisplay: s.compMedia ? "grid" : "none",
      compToggleBg: s.compMedia ? "var(--color-accent)" : "var(--color-neutral-700)",
      compToggleX: s.compMedia ? "16px" : "2px",
      compRowDirection: mediaLeft ? "row-reverse" : "row",
      compRowWrap: centered ? "column" : (mediaLeft ? "row-reverse" : "row"),
      compTextAlign: centered ? "center" : "left",
      compTextItems: centered ? "center" : "flex-start",
      compPadPx: s.compPad + "px",
      compAccent: pal.accent, compTint: pal.tint, compInk: pal.ink,
      compHeadingSize: s.compSize + "px",
      compFontStack: this.kitFonts()[s.kitFont].stack,
    };
  }

  kitEditorVals() {
    const pal = this.kitPalettes()[this.state.kitAccent];
    const pap = this.kitPapers()[this.state.kitPaper];
    const fnt = this.kitFonts()[this.state.kitFont];
    const r = this.state.kitRadius;
    return {
      kitSwatches: this.kitPalettes().map((p, i) => ({
        name: p.name, c: p.accent,
        ring: i === this.state.kitAccent ? "0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent)" : "inset 0 0 0 1px rgba(37,37,45,.15)",
        select: () => this.setState({ kitAccent: i }),
      })),
      kitPaperOpts: this.kitPapers().map((p, i) => ({
        name: p.name, c: p.paper,
        ring: i === this.state.kitPaper ? "0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent)" : "inset 0 0 0 1px rgba(37,37,45,.15)",
        select: () => this.setState({ kitPaper: i }),
      })),
      kitFontOpts: this.kitFonts().map((p, i) => {
        const on = i === this.state.kitFont;
        return {
          name: p.name, stack: p.stack,
          bg: on ? "color-mix(in srgb, var(--color-accent) 12%, transparent)" : "var(--color-surface)",
          ring: on ? "inset 0 0 0 1px var(--color-accent)" : "var(--shadow-sm)",
          fg: on ? "var(--color-accent-200)" : "var(--color-text)",
          select: () => this.setState({ kitFont: i }),
        };
      }),
      kitRadiusLabel: r + " px",
      kitRadius: r,
      kitSetRadius: e => this.setState({ kitRadius: +e.target.value }),
      kAccent: pal.accent, kTint: pal.tint, kInk: pal.ink,
      kPaper: pap.paper, kSurface: pap.surface,
      kFontStack: fnt.stack, kFontName: fnt.name,
      kRadius: r + "px",
      kRadiusSm: Math.round(r * 0.6) + "px",
      kRadiusPill: Math.round(r * 1.6) + "px",
    };
  }

  renderVals() {
    const active = this.props.active;

    const services = [
      { name: "Vercel", icon: "ph ph-triangle", state: "ok", note: "Alle regio's · 142 ms" },
      { name: "Cloudflare", icon: "ph ph-cloud", state: "ok", note: "CDN & DNS · 38 ms" },
      { name: "Neon", icon: "ph ph-database", state: "degraded", note: "eu-central · verhoogde latency" },
      { name: "Anthropic API", icon: "ph ph-sparkle", state: "ok", note: "Generatie · 1.9 s p95" },
      { name: "Stripe", icon: "ph ph-credit-card", state: "ok", note: "Betalingen · webhooks live" },
      { name: "Resend", icon: "ph ph-envelope-simple", state: "incident", note: "Mailqueue loopt achter" },
    ].map(s => {
      const c = s.state === "ok" ? "#2e9c6a" : s.state === "degraded" ? "#c4881c" : "#d94662";
      return { ...s, dot: c, label: s.state === "ok" ? "Operationeel" : s.state === "degraded" ? "Verstoord" : "Incident", labelColor: c };
    });

    const kpis = [
      { label: "Klanten", value: "148", delta: "+6 deze maand", icon: "ph ph-users-three" },
      { label: "Websites", value: "412", delta: "+23 deze maand", icon: "ph ph-browsers" },
      { label: "Apps", value: "37", delta: "+4 deze maand", icon: "ph ph-app-window" },
      { label: "AI-generaties", value: "9.240", delta: "+18% t.o.v. vorige 30d", icon: "ph ph-sparkle" },
    ];

    const clients = [
      { name: "Meridian Studio", plan: "Agency", sites: "34", visits: "1,24 mln", trend: "+12%", tag: "tag tag-accent" },
      { name: "Veldhuis Group", plan: "Agency", sites: "28", visits: "870 k", trend: "+8%", tag: "tag tag-accent" },
      { name: "Kade & Co", plan: "Pro", sites: "12", visits: "412 k", trend: "+21%", tag: "tag tag-neutral" },
      { name: "Noorderlicht", plan: "Pro", sites: "9", visits: "228 k", trend: "−3%", tag: "tag tag-neutral" },
      { name: "Bureau Hedde", plan: "Starter", sites: "4", visits: "96 k", trend: "+5%", tag: "tag tag-outline" },
    ];

    const pages = [
      { path: "meridian.nl/diensten", views: "184 k", w: "100%" },
      { path: "veldhuis.com/vacatures", views: "142 k", w: "77%" },
      { path: "kade.co/portfolio", views: "98 k", w: "53%" },
      { path: "noorderlicht.nl/", views: "74 k", w: "40%" },
      { path: "hedde.studio/contact", views: "41 k", w: "22%" },
    ];

    const deploys = [
      { site: "meridian.nl", who: "AI-generator", when: "2 min", state: "Live", color: "#2e9c6a" },
      { site: "app.veldhuis.com", who: "Ron Klaren", when: "18 min", state: "Live", color: "#2e9c6a" },
      { site: "kade.co", who: "Sanne Bos", when: "41 min", state: "Bouwen", color: "#c4881c" },
      { site: "hedde.studio", who: "AI-generator", when: "1 u", state: "Mislukt", color: "#d94662" },
    ];

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
    const gallerySource = (isApps ? apps : sites).map(([name, client, state]) => ({
      name, client, state,
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

    const compTypes = [
      ["Navigatie", "ph ph-list", [
        ["Topbar met dropdown", 212, "Kit-ready"], ["Mega-menu", 74, "Kit-ready"],
        ["Zij-navigatie", 38, "Beta"], ["Breadcrumbs", 156, "Kit-ready"], ["Mobiel menu", 240, "Kit-ready"],
      ]],
      ["Hero's", "ph ph-layout", [
        ["Split hero", 131, "Kit-ready"], ["Hero met video", 46, "Beta"],
        ["Gecentreerde hero", 188, "Kit-ready"], ["Hero-slider", 29, "Verouderd"],
      ]],
      ["Content", "ph ph-text-align-left", [
        ["Feature-grid", 174, "Kit-ready"], ["Accordeon / FAQ", 121, "Kit-ready"],
        ["Tabs", 63, "Kit-ready"], ["Statistiekenbalk", 88, "Kit-ready"], ["Tijdlijn", 24, "Beta"],
      ]],
      ["Media", "ph ph-images-square", [
        ["Galerij-grid", 97, "Kit-ready"], ["Beeldcarrousel", 52, "Beta"],
        ["Video-embed", 110, "Kit-ready"], ["Logo-wall", 143, "Kit-ready"],
      ]],
      ["Formulieren", "ph ph-textbox", [
        ["Contactformulier", 258, "Kit-ready"], ["Nieuwsbriefblok", 167, "Kit-ready"],
        ["Meerstaps aanvraag", 31, "Beta"], ["Zoeken met filters", 44, "Beta"],
      ]],
      ["Commerce", "ph ph-shopping-bag", [
        ["Prijstabel", 76, "Kit-ready"], ["Productkaart", 58, "Kit-ready"],
        ["Winkelwagen-drawer", 19, "Beta"], ["Checkout-stap", 14, "Beta"],
      ]],
      ["Vertrouwen", "ph ph-seal-check", [
        ["Reviewslider", 84, "Kit-ready"], ["Cases-grid", 69, "Kit-ready"],
        ["Teamkaarten", 92, "Kit-ready"], ["Certificeringen", 41, "Kit-ready"],
      ]],
      ["Afsluiters", "ph ph-arrow-line-down", [
        ["CTA-band", 196, "Kit-ready"], ["Footer compact", 233, "Kit-ready"],
        ["Footer uitgebreid", 147, "Kit-ready"], ["Cookiemelding", 271, "Kit-ready"],
      ]],
    ];
    const compGroups = compTypes.map(([label, icon, items]) => ({
      label, icon, id: label.toLowerCase().replace(/[^a-z]/g, ""),
      count: items.length + " componenten",
      items: items.map(([name, uses, state], i) => ({
        name, icon, uses: "in " + uses + " sites", state,
        vars: "Variaties: " + (2 + ((uses + i * 3) % 5)),
        stateTag: state === "Kit-ready" ? "tag tag-neutral" : state === "Beta" ? "tag tag-accent" : "tag tag-outline",
      })),
    }));
    const compIndex = compGroups.map(g => ({ label: g.label, href: "#c-" + g.id, count: g.items.length }));
    const compTotal = compTypes.reduce((n, t) => n + t[2].length, 0);

    const kitCats = [
      ["Corporate", "ph ph-buildings", [
        ["Meridian Corporate", "Meridian Studio", 12, "Actief", ["#2f3a56", "#7d5fd6", "#e8e1fb", "#f6f6fa"], "Inter / Inter"],
        ["Veldhuis Blauw", "Veldhuis Group", 9, "Actief", ["#1d3a5c", "#4f86c6", "#dce8f5", "#ffffff"], "Inter / Source Serif"],
        ["Cordaan Vastgoed", "Cordaan Vastgoed", 6, "Actief", ["#2b2c31", "#a58fea", "#eceaf5", "#fafafc"], "Inter / Inter"],
      ]],
      ["Editorial", "ph ph-newspaper", [
        ["Waterlander Redactie", "Waterlander Media", 5, "Actief", ["#1a1a1f", "#d94662", "#f3e7e9", "#fdfcfb"], "Playfair / Inter"],
        ["Noorderlicht Verhaal", "Noorderlicht", 4, "Concept", ["#20242c", "#2e9c6a", "#e4f2ea", "#fbfdfb"], "Lora / Inter"],
      ]],
      ["Minimal", "ph ph-circle-half", [
        ["Kade Mono", "Kade & Co", 8, "Actief", ["#111114", "#5c5c66", "#e8e8ec", "#ffffff"], "Inter / Inter"],
        ["Amberhout Licht", "Amberhout Interieur", 2, "Actief", ["#2c2620", "#c4881c", "#f4ece0", "#fffdfa"], "Inter / Inter"],
        ["Hedde Raster", "Bureau Hedde", 3, "Concept", ["#191a1d", "#7d5fd6", "#ededf3", "#ffffff"], "Inter / JetBrains Mono"],
      ]],
      ["Expressief", "ph ph-paint-brush-broad", [
        ["Duinrand Zon", "Duinrand Hotels", 7, "Actief", ["#3a1f2b", "#f2556a", "#ffe6d9", "#fff9f5"], "Fraunces / Inter"],
        ["Stroomlijn Energie", "Stroomlijn Energie", 6, "Actief", ["#10261f", "#3fc18a", "#d9f5e8", "#f7fffb"], "Inter / Inter"],
        ["Oostvaarders Reis", "Oostvaarders Reizen", 2, "Verouderd", ["#22304a", "#f5a04f", "#fdeedd", "#fffaf4"], "Poppins / Inter"],
      ]],
      ["Tech & SaaS", "ph ph-cpu", [
        ["Rietveld Mobility", "Rietveld Mobility", 6, "Actief", ["#14161c", "#4fc3b4", "#dff5f2", "#f8fbfc"], "Inter / JetBrains Mono"],
        ["Leadflow UI", "Meridian Studio", 4, "Beta", ["#171a2b", "#8b6ee0", "#e8e1fb", "#f7f7fc"], "Inter / Inter"],
      ]],
      ["Zorg & publiek", "ph ph-first-aid-kit", [
        ["Delfland Zorg", "Delfland Zorg", 5, "Actief", ["#10333b", "#2e9c9c", "#dceeef", "#f8fcfc"], "Inter / Inter"],
        ["Pallas Onderwijs", "Pallas Onderwijs", 11, "Actief", ["#22214a", "#6f56bf", "#e6e2f7", "#fafaff"], "Inter / Source Serif"],
      ]],
    ];
    const kitGroups = kitCats.map(([label, icon, items]) => ({
      label, icon, id: label.toLowerCase().replace(/[^a-z]/g, ""),
      count: items.length + " kits",
      items: items.map(([name, client, uses, state, colors, fonts]) => ({
        name, client, fonts, state,
        uses: "in " + uses + (uses === 1 ? " site" : " sites"),
        stateTag: state === "Actief" ? "tag tag-neutral" : state === "Concept" || state === "Beta" ? "tag tag-accent" : "tag tag-outline",
        swatches: colors.map(c => ({ c })),
        ink: colors[0], accent: colors[1], tint: colors[2], paper: colors[3],
      })),
    }));
    const kitIndex = kitGroups.map(g => ({ label: g.label, href: "#dk-" + g.id, count: g.items.length }));
    const kitTotal = kitCats.reduce((n, k) => n + k[2].length, 0);

    return {
      pageMax: this.state.wide ? "100%" : "1280px",
      wideIcon: this.state.wide ? "ph ph-arrows-in-line-horizontal" : "ph ph-arrows-out-line-horizontal",
      wideTitle: this.state.wide ? "Beperk tot 1280 px" : "Volledige breedte",
      wideColor: this.state.wide ? "var(--color-accent)" : "inherit",
      toggleWide: () => this.setState(s => ({ wide: !s.wide })),
      compGroups, compIndex,
      kitGroups, kitIndex,
      ...this.kitEditorVals(),
      ...this.compEditorVals(),
      ...this.settingsVals(),
      ...this.reportVals(),
      showRepClient: active === "rapportages/klanten",
      showRepFin: active === "rapportages/omzet",
      showSettings: active === "instellingen",
      showCompEditor: active === "componenten/editor",
      showKitEditor: active === "designkits/editor",
      kitMeta: kitTotal + " design kits · " + kitCats.length + " stijlrichtingen",
      showKits: active === "designkits",
      compMeta: compTotal + " componenten · " + compTypes.length + " types",
      showComponents: active === "componenten",
      services, kpis, clients, pages, deploys,
      letterGroups, alphabet, klantCount: roster.length + " klanten",
      galleryGroups, galleryAlphabet,
      galleryTitle: isApps ? "Apps" : "Websites",
      galleryMeta: (isApps ? apps.length + " apps" : sites.length + " websites") + " · alfabetisch gesorteerd",
      galleryNewLabel: isApps ? "Nieuwe app" : "Nieuwe site",
      showGallery: active === "websites" || active === "apps",
      showKlantForm: active === "klanten/nieuw",
      showPlatform: active === "platform",
      showKlanten: active === "klanten",
      showPlaceholder: !["platform", "klanten", "websites", "apps", "klanten/nieuw", "componenten", "designkits", "designkits/editor", "componenten/editor", "instellingen", "rapportages/klanten", "rapportages/omzet"].includes(active),
    };
  }
}
