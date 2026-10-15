/*
 * Quali background si propongono per ogni classe nella creazione del personaggio.
 * Nei manuali non c'è un elenco ufficiale: l'abbinamento è una scelta del gruppo.
 *
 * Funziona in due passi: ogni background dei supplementi richiama uno o più background
 * del Manuale del Giocatore che gli somigliano; ogni classe elenca quelli del Manuale che le si addicono.
 * Un background che non compare qui (homebrew, supplementi futuri) resta disponibile per tutti.
 */

/** Background del Manuale del Giocatore adatti a ogni classe. */
const BY_CLASS: Record<string, string[]> = {
  barbarian: ["outlander", "folk-hero", "soldier", "gladiator", "sailor", "pirate", "urchin", "hermit", "criminal"],
  bard: ["entertainer", "gladiator", "charlatan", "noble", "guild-artisan", "sage", "spy", "urchin", "folk-hero", "criminal"],
  cleric: ["acolyte", "hermit", "sage", "noble", "folk-hero", "soldier", "knight"],
  druid: ["hermit", "outlander", "folk-hero", "acolyte", "sage"],
  fighter: ["soldier", "knight", "noble", "folk-hero", "gladiator", "outlander", "sailor", "pirate", "criminal", "urchin", "guild-artisan"],
  monk: ["acolyte", "hermit", "sage", "urchin", "folk-hero", "outlander", "entertainer"],
  paladin: ["acolyte", "knight", "noble", "soldier", "folk-hero"],
  ranger: ["outlander", "folk-hero", "hermit", "soldier", "sailor", "criminal"],
  rogue: ["criminal", "spy", "charlatan", "urchin", "pirate", "entertainer", "guild-merchant", "noble", "sailor"],
  sorcerer: ["noble", "hermit", "sage", "entertainer", "charlatan", "outlander", "folk-hero", "urchin"],
  warlock: ["charlatan", "hermit", "sage", "criminal", "acolyte", "noble", "urchin", "entertainer"],
  wizard: ["sage", "acolyte", "noble", "hermit", "guild-artisan", "charlatan", "spy"],
  artificer: ["guild-artisan", "guild-merchant", "sage", "soldier", "sailor", "noble"],
};

/** Background dei supplementi: a quali del Manuale somigliano. */
const LIKE: Record<string, string[]> = {
  "city-watch": ["soldier"],
  investigator: ["spy", "sage"],
  "clan-crafter": ["guild-artisan"],
  "cloistered-scholar": ["sage"],
  courtier: ["noble", "spy"],
  "faction-agent": ["spy", "acolyte"],
  "far-traveler": ["outlander", "noble"],
  inheritor: ["folk-hero", "noble"],
  "knight-of-the-order": ["knight", "acolyte"],
  "mercenary-veteran": ["soldier"],
  "urban-bounty-hunter": ["criminal", "soldier"],
  "uthgardt-tribe-member": ["outlander"],
  "waterdhavian-noble": ["noble"],
  "azorius-functionary": ["noble", "sage"],
  "boros-legionnaire": ["soldier", "knight"],
  "dimir-operative": ["spy"],
  "golgari-agent": ["hermit", "criminal"],
  "gruul-anarch": ["outlander"],
  "izzet-engineer": ["guild-artisan", "sage"],
  "orzhov-representative": ["guild-merchant", "noble"],
  "rakdos-cultist": ["entertainer", "criminal"],
  "selesnya-initiate": ["acolyte", "hermit"],
  "simic-scientist": ["sage", "guild-artisan"],
  "house-agent": ["spy", "guild-merchant"],
  "celebrity-adventurers-scion": ["noble", "entertainer"],
  "failed-merchant": ["guild-merchant"],
  gambler: ["charlatan"],
  plaintiff: ["charlatan", "folk-hero"],
  "rival-intern": ["guild-merchant", "spy"],
  "augen-trust-spy": ["spy"],
  "cobalt-scholar-sage": ["sage"],
  grinner: ["entertainer", "spy"],
  "luxonborn-acolyte": ["acolyte"],
  "myriad-operative-criminal": ["criminal"],
  "revelry-pirate-sailor": ["pirate", "sailor"],
  "volstrucker-agent": ["spy", "criminal"],
  athlete: ["gladiator", "folk-hero"],
  "investigator-van-richtens": ["spy", "sage"],
  "lorehold-student": ["sage"],
  "prismari-student": ["entertainer", "guild-artisan"],
  "quandrix-student": ["sage"],
  "silverquill-student": ["noble", "entertainer"],
  "witherbloom-student": ["hermit", "sage"],
  "giant-foundling": ["outlander"],
  "rune-carver": ["guild-artisan", "hermit"],
  "gate-warden": ["soldier", "acolyte"],
  "planar-philosopher": ["sage", "acolyte"],
  rewarded: ["noble"],
  ruined: ["urchin", "folk-hero"],
  faceless: ["entertainer", "spy"],
  "baldurs-gate-acolyte": ["acolyte"],
  "baldurs-gate-charlatan": ["charlatan"],
  "baldurs-gate-criminal": ["criminal"],
  "baldurs-gate-entertainer": ["entertainer"],
  "baldurs-gate-folk-hero": ["folk-hero"],
  "baldurs-gate-guild-artisan": ["guild-artisan"],
  "baldurs-gate-hermit": ["hermit"],
  "baldurs-gate-noble": ["noble"],
  "baldurs-gate-outlander": ["outlander"],
  "baldurs-gate-sage": ["sage"],
  "baldurs-gate-sailor": ["sailor"],
  "baldurs-gate-soldier": ["soldier"],
  "baldurs-gate-urchin": ["urchin"],
  "black-fist-double-agent": ["spy", "soldier"],
  "dragon-casualty": ["soldier", "folk-hero"],
  "iron-route-bandit": ["criminal", "outlander"],
  "phlan-insurgent": ["folk-hero", "criminal"],
  "stojanow-prisoner": ["criminal", "hermit"],
  "ticklebelly-nomad": ["outlander"],
  fisher: ["sailor", "folk-hero"],
  marine: ["soldier", "sailor"],
  shipwright: ["guild-artisan", "sailor"],
  smuggler: ["criminal", "sailor"],
  "cormanthor-refugee": ["outlander", "folk-hero"],
  "gate-urchin": ["urchin"],
  "hillsfar-merchant": ["guild-merchant"],
  "hillsfar-smuggler": ["criminal"],
  "secret-identity": ["spy", "charlatan"],
  "shade-fanatic": ["acolyte", "criminal"],
  "trade-sheriff": ["soldier", "spy"],
  "caravan-specialist": ["outlander", "guild-merchant"],
  "earthspur-miner": ["guild-artisan", "outlander"],
  harborfolk: ["sailor", "folk-hero"],
  "mulmaster-aristocrat": ["noble"],
  "phlan-refugee": ["folk-hero", "urchin"],
  feylost: ["outlander", "hermit"],
  "witchlight-hand": ["entertainer"],
  anthropologist: ["sage", "outlander"],
  archaeologist: ["sage", "outlander"],
  "astral-drifter": ["hermit", "sage"],
  wildspacer: ["sailor", "soldier"],
};

/** Background legati dal loro manuale a classi precise, oppure adatti a tutte. */
const ONLY: Record<string, string[] | "all"> = {
  "knight-of-solamnia": ["fighter", "paladin"],
  "mage-of-high-sorcery": ["wizard", "sorcerer", "warlock"],
  "haunted-one": "all",
};

/**
 * Per ora si propongono solo i background del Manuale del Giocatore (quelli elencati in BY_CLASS):
 * gli altri restano importati, e i personaggi che li hanno già funzionano. Per riattivarli: false.
 */
const CORE_ONLY = true;
const CORE = new Set(Object.values(BY_CLASS).flat());

/** Il background si può scegliere alla creazione? */
export function backgroundEnabled(backgroundId: string): boolean {
  return !CORE_ONLY || CORE.has(backgroundId);
}

/**
 * Il background va bene per la classe? Le classi senza elenco (i gregari, quelle homebrew)
 * li accettano tutti, e così i background che qui non compaiono.
 */
export function backgroundFits(backgroundId: string, classId: string): boolean {
  const wanted = BY_CLASS[classId];
  if (!wanted) return true;
  const only = ONLY[backgroundId];
  if (only) return only === "all" || only.includes(classId);
  const like = LIKE[backgroundId] ?? (Object.values(BY_CLASS).some((l) => l.includes(backgroundId)) ? [backgroundId] : null);
  if (!like) return true;
  return like.some((b) => wanted.includes(b));
}
