import { classLevelsOf } from "./compute.js";
import type { Registry } from "./registry.js";
import { ABILITIES, type CharacterData, type ChoiceDef, type Issue } from "./types.js";

export interface ValidateContext {
  choices: (ChoiceDef & { source: string })[];
  featsByTag: (tag: string) => string[];
}

/** Controlli di regola sulla costruzione del personaggio (regole 2024). */
export function validateCharacter(ch: CharacterData, reg: Registry, vctx: ValidateContext): Issue[] {
  const issues: Issue[] = [];
  const err = (code: string, message: string, path?: string) => issues.push({ severity: "error", code, message, path });
  const warn = (code: string, message: string, path?: string) => issues.push({ severity: "warning", code, message, path });

  /* livelli */
  if (ch.levels.length === 0) err("level.none", "Il personaggio non ha livelli.");
  if (ch.levels.length > 20) err("level.max", "Il livello massimo è 20.");
  ch.levels.forEach((l, i) => {
    const cls = reg.classes.get(l.classId);
    if (!cls) return err("class.unknown", `Classe sconosciuta: ${l.classId}`, `levels.${i}`);
    if (i > 0 && l.hp !== "avg") {
      const size = parseInt(cls.hitDie.slice(1), 10);
      if (!Number.isInteger(l.hp) || l.hp < 1 || l.hp > size) err("hp.roll", `PF al livello ${i + 1} fuori dal ${cls.hitDie}.`, `levels.${i}.hp`);
    }
  });

  /* caratteristiche */
  for (const a of ABILITIES) {
    const s = ch.abilityScores[a];
    if (s === undefined || s < 1 || s > 20) err("ability.range", `Punteggio di ${a.toUpperCase()} fuori dall'intervallo 1–20.`, `abilityScores.${a}`);
  }

  /* bonus del background (+2/+1 oppure +1/+1/+1) */
  const bg = reg.backgrounds.get(ch.backgroundId);
  if (bg) {
    const entries = Object.entries(ch.backgroundBoosts).filter(([, v]) => v);
    if (entries.length === 0) warn("background.boosts.missing", `Assegna i bonus di caratteristica del background ${bg.name}.`);
    else {
      for (const [a] of entries) {
        if (!bg.abilities.includes(a as never)) err("background.boosts.ability", `${bg.name} non può aumentare ${a.toUpperCase()}.`, `backgroundBoosts.${a}`);
      }
      const pattern = entries.map(([, v]) => v).sort().join(",");
      if (pattern !== "1,2" && pattern !== "1,1,1") err("background.boosts.pattern", "I bonus del background devono essere +2/+1 oppure +1/+1/+1.");
    }
  }

  /* scelte */
  const bgSkills = new Set(bg?.skills ?? []);
  for (const c of vctx.choices) {
    const picked = ch.choices[c.id] ?? [];
    if (c.kind === "subclass") continue;
    const allowed = Array.isArray(c.from) ? c.from : c.from ? vctx.featsByTag(c.from.tag) : undefined;
    if (allowed) {
      for (const p of picked) if (!allowed.includes(p)) err("choice.invalid", `"${p}" non è un'opzione valida per ${c.label}.`, `choices.${c.id}`);
    }
    if (c.kind === "weaponMastery") {
      for (const p of picked) {
        const it = reg.items.get(p);
        if (!it || it.kind !== "weapon") err("choice.invalid", `"${p}" non è un'arma valida per ${c.label}.`, `choices.${c.id}`);
      }
    }
    if (new Set(picked).size !== picked.length) err("choice.duplicate", `Opzione ripetuta in ${c.label}.`, `choices.${c.id}`);
    if (c.kind === "skill") {
      for (const p of picked) if (bgSkills.has(p)) warn("skill.overlap", `${p} è già data dal background: scegline un'altra.`, `choices.${c.id}`);
    }
  }
  // Scelte in eccesso: richiede il conteggio valutato, lo fa computeSheet tramite pendingChoices (in difetto).

  /* sottoclassi */
  const levels = classLevelsOf(ch);
  for (const [classId, subId] of Object.entries(ch.subclasses)) {
    const sub = reg.subclasses.get(subId);
    const cls = reg.classes.get(classId);
    if (!sub || sub.classId !== classId) err("subclass.invalid", `Sottoclasse non valida per ${classId}: ${subId}`, `subclasses.${classId}`);
    else if (cls && (levels[classId] ?? 0) < cls.subclassLevel) warn("subclass.early", `${sub.name} si sceglie al livello ${cls.subclassLevel} di ${cls.name}.`, `subclasses.${classId}`);
  }

  /* multiclasse: 13 nella caratteristica primaria di ogni classe */
  if (Object.keys(levels).length > 1) {
    for (const classId of Object.keys(levels)) {
      const cls = reg.classes.get(classId);
      if (!cls) continue;
      const ok = cls.primaryAbility.some((a) => (ch.abilityScores[a] ?? 0) + (ch.backgroundBoosts[a] ?? 0) >= 13);
      if (!ok) {
        err("multiclass.prereq", `Multiclasse: serve almeno 13 in ${cls.primaryAbility.map((a) => a.toUpperCase()).join(" o ")} per ${cls.name}.`);
      }
    }
  }

  /* stato */
  if (ch.state.exhaustion < 0 || ch.state.exhaustion > 6) err("exhaustion.range", "Indebolimento va da 0 a 6.");

  return issues;
}
