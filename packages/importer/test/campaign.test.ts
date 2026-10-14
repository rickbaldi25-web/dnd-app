import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { decodeCr, importCampaign } from "../src/index.ts";

const SAMPLE = `<?xml version="1.0"?><data version="5"><campaign><name>Prova</name>
<adventure><uid>1</uid><name>Capitolo 1</name>
<note><name>Introduzione</name><text>Il gruppo arriva al villaggio.</text></note>
<npc><uid>10</uid><label>Rose Durst</label><name>Ghost</name><size>2</size><abilities>7,13,10,10,12,17</abilities><hpMax>45</hpMax><ac>11</ac><cr>4</cr><skill><id>16</id><modifier>3</modifier></skill></npc>
<encounter><name>Imboscata</name><uid>20</uid>
<combatant><monster><uid>10</uid></monster></combatant>
<combatant><monster><label>Goblin 1</label><name>Goblin</name><size>1</size><abilities>8,14,10,10,8,8</abilities><hpMax>7</hpMax><ac>15</ac><cr>-1</cr>
<action><name>Scimitar</name><text>Melee.</text><attack><atk>4</atk><dmg>1d6+2</dmg></attack></action></monster></combatant>
<item><name>Gold Pieces</name><quantity>30</quantity></item>
<note><name>Tattica</name><text>Fuggono a metà PF.</text></note>
</encounter></adventure></campaign></data>`;

describe("campagne di Game Master 5", () => {
  it("decodifica i gradi di sfida frazionari", () => {
    expect([-3, -2, -1, 0, 1, 7].map((n) => decodeCr(String(n)))).toEqual(["0", "1/8", "1/4", "1/2", "1", "7"]);
  });

  it("legge capitoli, note, PNG, incontri e tesori", () => {
    const c = importCampaign(SAMPLE);
    expect(c.name).toBe("Prova");
    const ch = c.chapters[0]!;
    expect(ch.name).toBe("Capitolo 1");
    expect(ch.notes).toEqual([{ title: "Introduzione", text: "Il gruppo arriva al villaggio." }]);
    expect(ch.npcs[0]!.label).toBe("Rose Durst");
    expect(ch.npcs[0]!.monster).toMatchObject({ name: "Ghost", size: "Medium", hp: 45, cr: "4", skills: { stealth: 3 } });
    const enc = ch.encounters[0]!;
    expect(enc.combatants.map((x) => x.label)).toEqual(["Rose Durst", "Goblin 1"]);
    expect(enc.combatants[1]!.monster).toMatchObject({ cr: "1/4", hp: 7, ac: 15, actions: [{ name: "Scimitar", attack: { bonus: 4, damage: "1d6+2" } }] });
    expect(enc.treasure).toEqual([{ name: "Gold Pieces", quantity: 30 }]);
    expect(enc.notes[0]!.title).toBe("Tattica");
  });

  const file = resolve(__dirname, "../../../manuali/campagne/Lost Mines of Phandelver.xml");
  it.skipIf(!existsSync(file))("importa Lost Mines of Phandelver", () => {
    const c = importCampaign(readFileSync(file, "utf8"));
    expect(c.chapters.length).toBe(9);
    expect(c.chapters.reduce((n, ch) => n + ch.encounters.length, 0)).toBe(57);
    for (const ch of c.chapters) for (const e of ch.encounters) for (const m of e.combatants) expect(m.monster.hp).toBeGreaterThan(0);
  });
});
