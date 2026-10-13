// File generato da scripts/build-spells.mjs: non modificarlo a mano.
// Fonte: System Reference Document 5.2.1 di Wizards of the Coast LLC, licenza CC-BY-4.0.
// Le correzioni ai tiri automatici vanno in overrides.ts.
import type { SpellDef } from "@dnd/engine";

export const SRD_SPELL_DATA: SpellDef[] = [
 {
  "id": "druidcraft",
  "name": "Artificio druidico",
  "nameEn": "Druidcraft",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "druid"
  ],
  "description": "Sussurrando agli spiriti della natura, l'incantatore crea uno degli effetti seguenti entro gittata.\n**Sensore atmosferico.** L'incantatore crea un Minuscolo e innocuo effetto sensoriale che predice il tempo atmosferico nel luogo in cui si trova per le successive 24 ore. L'effetto potrebbe manifestarsi come una sfera dorata in caso di cieli tersi, una nuvola in caso di pioggia, fiocchi di neve in caso di nevicate e così via. Questo effetto permane per 1 round.\n**Fioritura.** L'incantatore fa istantaneamente sbocciare un fiore, aprire un baccello o schiudere un germoglio.\n**Effetto sensoriale.** L'incantatore crea un effetto sensoriale innocuo, come la caduta di foglie, delle fate spettrali danzanti, una brezza leggera, il rumore di un piccolo animale o il debole odore di una puzzola. L'effetto deve poter essere contenuto in un cubo con spigolo di 1,5 metri.\n**Trucchetto col fuoco.** L'incantatore accende o spegne una candela, una torcia o un fuoco da campo."
 },
 {
  "id": "vicious-mockery",
  "name": "Beffa crudele",
  "nameEn": "Vicious Mockery",
  "level": 0,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard"
  ],
  "description": "L'incantatore pronuncia una sequenza di insulti mescolati a impercettibili ammaliamenti contro una creatura entro gittata che egli è in grado di vedere o di sentire. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti subisce 1d6 danni psichici e svantaggio al tiro per colpire successivo che effettua prima della fine del suo turno successivo.",
  "higherLevels": "I danni aumentano di 1d6 quando l'incantatore raggiunge il 5º livello (2d6), l'11º livello (3d6) e il 17º livello (4d6).",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "psychic",
   "cantripScaling": true
  }
 },
 {
  "id": "true-strike",
  "name": "Colpo accurato",
  "nameEn": "True Strike",
  "level": 0,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "S, M (un'arma nel cui uso l'incantatore ha competenza e ha un valore di 1 mr o più)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Guidato da un lampo di intuizione magica, l'incantatore effettua un attacco con l'arma utilizzata per lanciare l'incantesimo. Per determinare il tiro per colpire e il tiro per i danni, l'incantatore utilizza la sua caratteristica da incantatore invece che la Forza o la Destrezza. Se l'attacco infligge danni, possono essere danni radiosi o danni normali inflitti dall'arma (a scelta dell'incantatore).",
  "higherLevels": "A prescindere dal tipo di danni che l'incantatore sceglie (danni radiosi o danni normali dell'arma), l'attacco infligge danni radiosi extra quando l'incantatore raggiunge il 5º livello (1d6), l'11º livello (2d6) e il 17º livello (3d6)."
 },
 {
  "id": "fire-bolt",
  "name": "Dardo di fuoco",
  "nameEn": "Fire Bolt",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore scaglia una scintilla di fuoco verso una creatura o un oggetto situato entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d10 danni da fuoco. Un oggetto infiammabile colpito da questo incantesimo prende fuoco se non indossato o trasportato in quel momento.",
  "higherLevels": "I danni aumentano di 1d10 quando l'incantatore raggiunge il 5º livello (2d10), l'11º livello (3d10) e il 17º livello (4d10).",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d10",
   "damageType": "fire",
   "cantripScaling": true
  }
 },
 {
  "id": "eldritch-blast",
  "name": "Deflagrazione occulta",
  "nameEn": "Eldritch Blast",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "warlock"
  ],
  "description": "L'incantatore scaglia un raggio di energia crepitante, effettuando un attacco a distanza con incantesimo contro una creatura o un oggetto entro gittata. Se il colpo va a segno, il bersaglio subisce 1d10 danni da forza.",
  "higherLevels": "L'incantesimo crea due raggi al 5º livello, tre raggi all'11º livello e quattro raggi al 17º livello. L'incantatore può indirizzare i raggi contro lo stesso bersaglio o contro bersagli differenti, effettuando un tiro per colpire separato per ogni raggio.",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d10",
   "damageType": "force"
  }
 },
 {
  "id": "elementalism",
  "name": "Elementalismo",
  "nameEn": "Elementalism",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore esercita il suo controllo sugli elementi, creando uno dei seguenti effetti entro gittata.\n**Richiamo del fuoco.** Nell'area di un cubo con spigolo di 1,5 metri, l'incantatore crea una piccola nube di braci non incandescenti, colorate e che emettono fumo e un odore particolare. L'incantatore sceglie il colore e l'odore delle braci, che si possono usare per accendere candele, torce o lampade in quell'area. L'odore del fumo permane per 1 minuto.\n**Richiamo dell'acqua.** L'incantatore crea uno spruzzo d'acqua fresca nebulizzata che inumidisce leggermente le creature e gli oggetti all'interno di un cubo con spigolo di 1,5 metri. In alternativa, crea 1 coppa di acqua pulita da riversare all'interno di un contenitore aperto o su una superficie; l'acqua evapora dopo 1 minuto.\n**Richiamo dell'aria.** Nell'area di un cubo con spigolo di 1,5 metri, l'incantatore crea una brezza in grado di far svolazzare i tessuti, sollevare la polvere, far oscillare le foglie e chiudere porte e persiane aperte. Se le porte e le persiane sono tenute aperte da qualcuno, l'incantesimo non ha effetto su di esse.\n**Richiamo della terra.** L'incantatore crea un sottile velo di polvere o sabbia che ricopre le superfici di un'area di 1,5 metri per lato, oppure fa comparire una singola parola scritta nella sua calligrafia su un lembo di terra o un letto di sabbia.\n**Scolpire elementi.** L'incantatore fa in modo che un elemento a sua scelta tra terra, sabbia, fuoco, fumo, nebbia o acqua (in una quantità tale da poter essere contenuto in un cubo con spigolo di 30 centimetri) assuma una forma rozza (come quella di una creatura) per 1 ora."
 },
 {
  "id": "sacred-flame",
  "name": "Fiamma sacra",
  "nameEn": "Sacred Flame",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "Un bagliore simile a una fiamma discende su una creatura entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Destrezza, altrimenti subisce 1d8 danni radiosi. Per questo tiro salvezza, il bersaglio non trae beneficio dalla mezza copertura o dai tre quarti di copertura.",
  "higherLevels": "I danni aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "radiant",
   "cantripScaling": true
  }
 },
 {
  "id": "acid-splash",
  "name": "Fiotto acido",
  "nameEn": "Acid Splash",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea una bolla di acido in un punto entro gittata, dove la bolla esplode in una sfera del raggio di 1,5 metri. Ogni creatura all'interno della sfera deve superare un tiro salvezza su Destrezza, altrimenti subisce 1d6 danni da acido.",
  "higherLevels": "I danni aumentano di 1d6 quando l'incantatore raggiunge il 5º livello (2d6), l'11º livello (3d6) e il 17º livello (4d6).",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "acid",
   "cantripScaling": true
  }
 },
 {
  "id": "guidance",
  "name": "Guida",
  "nameEn": "Guidance",
  "level": 0,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore tocca una creatura consenziente e sceglie un'abilità. Fino al termine dell'incantesimo, la creatura aggiunge 1d4 a qualsiasi prova di caratteristica effettuata utilizzando l'abilità scelta."
 },
 {
  "id": "minor-illusion",
  "name": "Illusione minore",
  "nameEn": "Minor Illusion",
  "level": 0,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "S, M (un ciuffo di lana)",
  "duration": "1 minuto",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore crea un suono o un'immagine di un oggetto entro gittata che permane per la durata dell'incantesimo. Di seguito sono descritti gli effetti di ciascuno di essi. L'illusione termina se l'incantatore lancia nuovamente l'incantesimo.\nSe una creatura effettua l'azione di Studio per esaminare il suono o l'immagine, può determinare che si tratta di un'illusione superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se una creatura riconosce l'illusione per ciò che è, l'illusione risulta attenuata per quella creatura.\n**Suono.** Se l'incantatore crea un suono, la sua intensità può variare da quella di un sussurro a quella di un urlo. Può trattarsi della voce dell'incantatore o di altri, del ruggito di un leone, di un rullo di tamburi o di un qualsiasi altro suono a sua scelta. Il suono può echeggiare ininterrottamente per tutta la durata dell'incantesimo, oppure l'incantatore può emettere dei suoni separati in momenti diversi prima che l'incantesimo termini.\n**Immagine.** Se l'incantatore crea l'immagine di un oggetto (come per esempio una sedia, una serie di impronte nel fango o uno scrigno), quell'oggetto non deve essere più grande di un cubo con spigolo di 1,5 metri. L'illusione non può emettere suoni, luci, odori o qualsiasi altro effetto sensoriale L'illusione può essere rivelata da un'interazione fisica, poiché gli oggetti possono attraversarla."
 },
 {
  "id": "light",
  "name": "Luce",
  "nameEn": "Light",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, M (una lucciola o del muschio fosfore- scente)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tocca un oggetto di taglia Grande o inferiore che non sia stato indossato o trasportato da altri. Fino al termine dell'incantesimo, l'oggetto proietta luce intensa entro un raggio di 6 metri e luce fioca per altri 6 metri. L'incantatore può scegliere il colore di luce che desidera.\nCoprire l'oggetto con qualcosa di opaco blocca la luce. L'incantesimo termina se l'incantatore lo lancia di nuovo."
 },
 {
  "id": "starry-wisp",
  "name": "Luce splendente",
  "nameEn": "Starry Wisp",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "druid"
  ],
  "description": "L'incantatore lancia un globo di luce contro una creatura o un oggetto entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d8 danni radiosi e, fino al termine del turno successivo dell'incantatore, emette luce fioca nel raggio di 3 metri e non può beneficiare della condizione di invisibilità.",
  "higherLevels": "I danni aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "radiant",
   "cantripScaling": true
  }
 },
 {
  "id": "dancing-lights",
  "name": "Luci danzanti",
  "nameEn": "Dancing Lights",
  "level": 0,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M ((un frammento di fosforo)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea fino a quattro luci delle dimensioni di una torcia, facendole apparire come lanterne, torce o globi luminosi che fluttuano per la durata dell'incantesimo entro la sua gittata. In alternativa, l'incantatore può fondere le quattro luci in un'unica forma luminosa di taglia Media di aspetto simile a quello umano. Qualunque sia la forma scelta, ogni luce proietta luce fioca entro un raggio di 3 metri.\nCome azione bonus, l'incantatore può muovere le luci per un massimo di 18 metri fino a un punto entro gittata. Ogni luce deve trovarsi entro 6 metri da un'altra luce creata da questo incantesimo. Se una delle luci supera la gittata dell'incantesimo, svanisce."
 },
 {
  "id": "mage-hand",
  "name": "Mano magica",
  "nameEn": "Mage Hand",
  "level": 0,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "1 minuto",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una mano spettrale fluttuante compare in un punto a scelta dell'incantatore situato entro gittata. La mano permane per la durata dell'incantesimo e svanisce se si trova a più di 9 metri dall'incantatore o se quest'ultimo lancia nuovamente l'incantesimo.\nQuando lancia l'incantesimo, l'incantatore può usare la mano per maneggiare un oggetto, aprire una porta o un contenitore che non siano chiusi a chiave, riporre o estrarre un oggetto da un contenitore aperto o versare il contenuto di una fiala.\nCome azione di Magia nei tuoi turni successivi, puoi controllare nuovamente la mano. Come parte di quell'azione, puoi muoverla fino a 9 metri.\nLa mano non può attaccare, attivare oggetti magici o trasportare più di 5 chilogrammi."
 },
 {
  "id": "message",
  "name": "Messaggio",
  "nameEn": "Message",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "S, M (un filo di rame)",
  "duration": "1 round",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore indica una creatura entro gittata e sussurra un messaggio. Solo il bersaglio sente il messaggio e può sussurrare una risposta che unicamente l'incantatore può sentire.\nL'incantatore può lanciare questo incantesimo attraverso oggetti solidi se il bersaglio gli è noto e sa che si trova oltre la barriera. Tuttavia, l'incantesimo viene bloccato da silenzio magico, una sottile lamina di piombo o 30 centimetri di pietra, metallo o legno."
 },
 {
  "id": "prestidigitation",
  "name": "Prestidigitazione",
  "nameEn": "Prestidigitation",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "3 metri",
  "components": "V, S",
  "duration": "Fino a 1 ora",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore crea un effetto magico entro gittata, scegliendolo tra quelli illustrati di seguito. Se l'incantatore lancia questo incantesimo più volte, può tenere attivi fino a tre dei suoi effetti non istantanei contemporaneamente.\n**Effetto sensoriale.** L'incantatore crea un effetto sensoriale innocuo e istantaneo, come una pioggia di scintille, una folata di vento, una tenue melodia musicale o uno strano odore.\n**Trucchetto col fuoco.** L'incantatore accende o spegne istantaneamente una candela, una torcia o un piccolo fuoco da campo.\n**Pulire o sporcare.** L'incantatore pulisce o sporca istantaneamente un oggetto non più grande di un cubo con spigolo di 30 centimetri.\n**Lieve sensazione.** L'incantatore riscalda, raffredda o condisce materiale non vivente del volume massimo di un cubo con spigolo di 30 centimetri per 1 ora.\n**Segno magico.** L'incantatore fa comparire un colore, un piccolo segno o un simbolo su un oggetto o una superficie per 1 ora.\n**Creazione minore.** L'incantatore crea un monile non magico o un'immagine illusoria che può stare nel palmo della sua mano e che permane fino al termine del suo turno successivo. Un monile non può infliggere danni e non ha valore monetario."
 },
 {
  "id": "produce-flame",
  "name": "Produrre fiamma",
  "nameEn": "Produce Flame",
  "level": 0,
  "school": "conjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "10 minuti",
  "lists": [
   "druid"
  ],
  "description": "Una fiamma tremolante compare nella mano dell'incantatore e permane per la durata dell'incantesimo. La fiamma non emette calore e non può incendiare nulla; emana luce intensa in un raggio di 6 metri e luce fioca per ulteriori 6 metri. L'incantesimo termina se l'incantatore lo lancia di nuovo.\nFino al termine dell'incantesimo, l'incantatore può effettuare un'azione di Magia per scagliare la fiamma contro una creatura o un oggetto a 18 metri da lui, effettuando un attacco a distanza con incantesimo. Se il colpo va a segno, il bersaglio subisce 1d8 danni da fuoco.",
  "higherLevels": "I danni di questo incantesimo aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "fire",
   "cantripScaling": true
  }
 },
 {
  "id": "ray-of-frost",
  "name": "Raggio di gelo",
  "nameEn": "Ray of Frost",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Un raggio gelido di luce bianco-azzurra sfreccia verso una creatura entro gittata, contro cui l'incantatore effettua un attacco a distanza con incantesimo. Se il colpo va a segno, il bersaglio subisce 1d8 danni da freddo e la sua velocità è ridotta di 3 metri fino all'inizio del turno successivo dell'incantatore.",
  "higherLevels": "I danni aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "cold",
   "cantripScaling": true
  }
 },
 {
  "id": "shillelagh",
  "name": "Randello incantato",
  "nameEn": "Shillelagh",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V, S, M (vischio)",
  "duration": "1 minuto",
  "lists": [
   "druid"
  ],
  "description": "Un randello o un bastone ferrato impugnato dall'incantatore è pervaso dal potere della natura. Per la durata dell'incantesimo, l'incantatore usa la propria caratteristica da incantatore anziché la Forza per i tiri per i danni e i tiri per colpire effettuati negli attacchi in mischia usando quell'arma: inoltre, i danni dell'arma sono calcolati con un d8. Se l'attacco infligge danni, possono essere danni da forza o danni normali inflitti dall'arma (a scelta dell'incantatore).\nL'incantesimo termina se l'incantatore lo lancia di nuovo o se lascia andare l'arma.",
  "higherLevels": "I danni sono calcolati con un dado diverso quando l'incantatore raggiunge il 5º livello (d10), l'11º livello (d12) e il 17º livello (2d6)."
 },
 {
  "id": "resistance",
  "name": "Resistenza",
  "nameEn": "Resistance",
  "level": 0,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore tocca una creatura consenziente e sceglie un tipo di danno: acido, contundente, freddo, fulmine, fuoco, necrotico, perforante, radioso, tagliente, tuono, veleno. Quando una creatura subisce danni del tipo scelto prima del termine dell'incantesimo, riduce il totale dei danni subiti di 1d4. Una creatura può beneficiare di questo incantesimo solo una volta per turno."
 },
 {
  "id": "mending",
  "name": "Riparare",
  "nameEn": "Mending",
  "level": 0,
  "school": "transmutation",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (due calamite)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Questo incantesimo ripara una singola crepa o uno squarcio in un oggetto toccato dall'incantatore, come l'anello spezzato di una catena, due metà di una chiave spezzata, un mantello strappato o un otre forato. Se le dimensioni della crepa o dello squarcio non superano i 30 centimetri, l'incantatore ripara l'oggetto senza lasciare traccia del danno precedente.\nQuesto incantesimo può riparare un oggetto magico solo fisicamente, senza ripristinare la magia in esso contenuta."
 },
 {
  "id": "spare-the-dying",
  "name": "Salvare i morenti",
  "nameEn": "Spare the Dying",
  "level": 0,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "4,5 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore sceglie una creatura entro gittata con 0 punti ferita ma che è ancora in vita, facendola diventare stabile.",
  "higherLevels": "La gittata raddoppia quando l'incantatore raggiunge il 5º livello (9 metri), l'11º livello (18 metri) e il 17º livello (36 metri)."
 },
 {
  "id": "poison-spray",
  "name": "Spruzzo velenoso",
  "nameEn": "Poison Spray",
  "level": 0,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore spruzza una nebbia tossica contro una creatura entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d12 danni da veleno.",
  "higherLevels": "I danni aumentano di 1d12 quando l'incantatore raggiunge il 5º livello (2d12), l'11º livello (3d12) e il 17º livello (4d12).",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "1d12",
   "damageType": "poison",
   "cantripScaling": true
  }
 },
 {
  "id": "sorcerous-burst",
  "name": "Stregoneria esplosiva",
  "nameEn": "Sorcerous Burst",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "sorcerer"
  ],
  "description": "L'incantatore proietta energia stregonesca verso una creatura o un oggetto entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d8 danni di un tipo a scelta tra: acido, freddo, fuoco, fulmine, psichici, tuono o veleno.\nSe l'incantatore ottiene il risultato 8 su un d8, può tirare un altro d8 e aggiungere il risultato ai danni. Quando lancia l'incantesimo, l'incantatore può aggiungere ai danni dell'incantesimo un numero di d8 pari al suo modificatore di caratteristica da incantatore.",
  "higherLevels": "I danni di questo incantesimo aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "attack": "ranged"
 },
 {
  "id": "shocking-grasp",
  "name": "Stretta folgorante",
  "nameEn": "Shocking Grasp",
  "level": 0,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Un fulmine si sprigiona dall'incantatore verso una creatura da lui toccata. Con questo incantesimo, l'incantatore effettua un attacco in mischia contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d8 danni da fulmine e non può effettuare attacchi di opportunità fino all'inizio del proprio turno successivo.",
  "higherLevels": "I danni aumentano di 1d8 quando l'incantatore raggiunge il 5º livello (2d8), l'11º livello (3d8) e il 17º livello (4d8).",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "lightning",
   "cantripScaling": true
  }
 },
 {
  "id": "thaumaturgy",
  "name": "Taumaturgia",
  "nameEn": "Thaumaturgy",
  "level": 0,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V",
  "duration": "Fino a 1 minuto",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore genera una meraviglia minore entro gittata, oltre a uno degli effetti elencati di seguito. Se l'incantatore lancia questo incantesimo più volte, può tenere attivi contemporaneamente fino a tre dei suoi effetti dalla durata di 1 minuto.\n**Mano invisibile.** L'incantatore fa in modo che una porta o una finestra non chiusa a chiave si spalanchi o si chiuda di colpo da sola.\n**Occhi alterati.** L'incantatore altera l'aspetto dei suoi occhi per 1 minuto.\n**Suono spettrale.** L'incantatore crea un suono improvviso che ha origine da un punto entro gittata a sua scelta, come un rombo di tuono, il verso di un corvo o un mormorio sinistro.\n**Tremiti.** L'incantatore genera un tremito innocuo sul terreno per 1 minuto.\n**Trucchetto col fuoco.** L'incantatore fa in modo che una fiamma tremi, si intensifichi, si affievolisca o cambi colore per 1 minuto.\n**Voce tonante.** La voce dell'incantatore rimbomba con potenza tre volte superiore rispetto al normale per 1 minuto. Per la durata dell'incantesimo, dispone di vantaggio alle prove di Carisma (Intimidire)."
 },
 {
  "id": "chill-touch",
  "name": "Tocco gelido",
  "nameEn": "Chill Touch",
  "level": 0,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Incanalando un flusso di gelo sepolcrale, l'incantatore effettua un attacco con incantesimo in mischia contro un bersaglio a portata. Se il colpo va a segno, il bersaglio subisce 1d10 danni necrotici e non può recuperare punti ferita fino al termine del turno successivo dell'incantatore.",
  "higherLevels": "I danni aumentano di 1d10 quando l'incantatore raggiunge il 5º livello (2d10), l'11º livello (3d10) e il 17º livello (4d10).",
  "attack": "melee",
  "roll": {
   "kind": "damage",
   "dice": "1d10",
   "damageType": "necrotic",
   "cantripScaling": true
  }
 },
 {
  "id": "alarm",
  "name": "Allarme",
  "nameEn": "Alarm",
  "level": 1,
  "school": "abjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S, M (una campanella e un filo d'argento)",
  "duration": "8 ore",
  "ritual": true,
  "lists": [
   "wizard",
   "ranger"
  ],
  "description": "L'incantatore predispone un allarme che segnala un'intrusione. Sceglie una porta, una finestra o un'area entro gittata che non sia più ampia di un cubo con spigolo di 6 metri. Fino al termine dell'incantesimo, un allarme avverte l'incantatore tutte le volte che una creatura tocca o entra nell'area protetta. Al momento del lancio dell'incantesimo, l'incantatore designa quali creature non faranno scattare l'allarme. Inoltre, sceglie se l'allarme è acustico o mentale.\n**Allarme acustico.** L'allarme produce il suono di una campanella per 10 secondi entro 18 metri dall'area protetta.\n**Allarme mentale.** Un suono nella mente avverte l'incantatore se questi si trova entro 1,5 chilometri dall'area protetta. Il suono sveglia l'incantatore se sta dormendo."
 },
 {
  "id": "animal-friendship",
  "name": "Amicizia con gli animali",
  "nameEn": "Animal Friendship",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un boccone di cibo)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore sceglie come bersaglio una bestia entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane affascinato per la durata dell'incantesimo. Se l'incantatore o uno dei suoi alleati infligge danni al bersaglio, l'incantesimo termina.",
  "higherLevels": "L'incantatore può scegliere come bersaglio una bestia aggiuntiva per ogni slot di livello superiore al 1º.",
  "save": "wis"
 },
 {
  "id": "bane",
  "name": "Anatema",
  "nameEn": "Bane",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una goccia di sangue)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "warlock"
  ],
  "description": "L'incantatore sceglie fino a tre creature situate entro gittata che egli è in grado di vedere, ciascuna delle quali deve effettuare un tiro salvezza su Carisma. Se un bersaglio fallisce il tiro, ogni volta che effettua un tiro per colpire o un tiro salvezza prima del termine dell'incantesimo deve sottrarre 1d4 da essi.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º.",
  "save": "cha"
 },
 {
  "id": "mage-armor",
  "name": "Armatura magica",
  "nameEn": "Mage Armor",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un pezzo di cuoio trattato)",
  "duration": "8 ore",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tocca una creatura consenziente che non indossa un'armatura. Fino al termine dell'incantesimo, la CA base del bersaglio diventa 13 più il suo modificatore di Destrezza. L'incantesimo termina in anticipo se il bersaglio indossa un'armatura."
 },
 {
  "id": "goodberry",
  "name": "Bacche benefiche",
  "nameEn": "Goodberry",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un rametto di vischio)",
  "duration": "24 ore",
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "Per la durata dell'incantesimo, nella mano dell'incantatore appaiono dieci bacche infuse di magia. Una creatura può effettuare un'azione bonus per mangiare una bacca, recuperando così 1 punto ferita e ottenendo nutrimento sufficiente per una giornata intera.\nLe bacche non mangiate scompaiono al termine dell'incantesimo."
 },
 {
  "id": "bless",
  "name": "Benedizione",
  "nameEn": "Bless",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un simbolo sacro del valore di 5 mo o più)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore benedice fino a tre creature entro gittata. Se un bersaglio effettua un tiro per colpire o un tiro salvezza prima del termine dell'incantesimo, il bersaglio aggiunge a essi 1d4.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º."
 },
 {
  "id": "feather-fall",
  "name": "Caduta morbida",
  "nameEn": "Feather Fall",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Reazione, che l'incantatore può effet- tuare quando egli stesso o una creatura entro 18 metri da lui che egli è in grado di vedere cade",
  "timing": "reaction",
  "range": "18 metri",
  "components": "V, M (una piccola piuma)",
  "duration": "1 minuto",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore sceglie fino a cinque creature in caduta entro gittata. La velocità di discesa di una creatura in caduta rallenta fino a 18 metri per round finché l'incantesimo non termina. Se una creatura cade prima del termine dell'incantesimo, non subisce alcun danno da caduta e interrompe l'effetto dell'incantesimo."
 },
 {
  "id": "disguise-self",
  "name": "Camuffare se stesso",
  "nameEn": "Disguise Self",
  "level": 1,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore (compresi i suoi abiti, armatura, armi e altri oggetti personali presenti sulla sua persona) assume un aspetto diverso fino al termine alto o più basso e apparire più grasso o più magro, adottando una forma che usi la stessa disposizione basilare degli arti. Entro questi limiti, la natura dell'illusione dipende da lui.\nI cambiamenti apportati da questo incantesimo non passano il vaglio di un'ispezione fisica. Per esempio, se l'incantatore usa questo incantesimo per aggiungere un cappello al suo abbigliamento, gli oggetti attraverserebbero il cappello e chiunque lo toccasse non sentirebbe nulla.\nPer capire che l'incantatore è camuffato, una creatura può usare la sua azione di Studio per ispezionarne l'aspetto, superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo."
 },
 {
  "id": "charm-person",
  "name": "Charme su persone",
  "nameEn": "Charm Person",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Un umanoide entro gittata che l'incantatore è in grado di vedere effettua un tiro salvezza su Saggezza, disponendo di vantaggio se l'incantatore o i suoi alleati stanno combattendo contro di essa. In caso di fallimento, il bersaglio è affascinato fino al termine dell'incantesimo o finché non gli vengono inflitti danni dall'incantatore o i suoi alleati. La creatura affascinata è amichevole nei confronti dell'incantatore. Al termine dell'incantesimo, il bersaglio capirà di essere stato affascinato dall'incantatore.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º.",
  "save": "wis"
 },
 {
  "id": "ensnaring-strike",
  "name": "Colpo intrappolante",
  "nameEn": "Ensnaring Strike",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione bonus che l'incantatore effettua subito dopo aver colpito una creatura con un'arma",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "ranger"
  ],
  "description": "Quando l'incantatore colpisce il bersaglio, su di esso appare un groviglio di rampicanti. Il bersaglio effettua un tiro salvezza su Forza, disponendo di vantaggio a questo tiro se è una creatura di taglia Grande o superiore. Se lo fallisce, il bersaglio è trattenuto fino al termine dell'incantesimo. Se lo supera, i rampicanti si ritraggono e avvizziscono, ponendo fine all'incantesimo.\nFinché è trattenuto, il bersaglio subisce 1d6 danni perforanti all'inizio di ogni suo turno. Il bersaglio o una creatura alla sua portata può usare un'azione per effettuare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo. In caso di successo, l'incantesimo termina.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "piercing",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "ice-knife",
  "name": "Coltello di ghiaccio",
  "nameEn": "Ice Knife",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "S, M (una goccia d'acqua o un frammento di ghiaccio)",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea un frammento di ghiaccio e lo scaglia contro una creatura entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 1d10 danni perforanti. Che colpisca o manchi il bersaglio, il frammento poi esplode. Il bersaglio e ogni creatura entro 1,5 metri dal punto in cui il ghiaccio è esploso devono superare un tiro salvezza su Destrezza, altrimenti subiscono 2d6 danni da freddo.",
  "higherLevels": "I danni da freddo aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "attack": "ranged",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "1d10",
   "damageType": "piercing",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "command",
  "name": "Comando",
  "nameEn": "Command",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore rivolge una parola di comando a una creatura entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti dovrà obbedire al comando nel suo turno successivo. Scegli il comando tra le seguenti opzioni:\n**Avvicinati.** Il bersaglio si muove verso l'incantatore seguendo il percorso più breve e diretto, terminando il suo turno se giunge entro 1,5 metri da lui.\n**Fermo.** Nel suo turno, il bersaglio non si muove e non effettua alcuna azione o azione bonus.\n**Fuggi.** Il bersaglio usa il suo turno per allontanarsi dall'incantatore nel modo più rapido possibile.\n**Lascia.** Il bersaglio lascia cadere ciò che stava impugnando, poi termina il suo turno.\n**Prostrati.** Il bersaglio cade a terra prono e termina il suo turno.",
  "higherLevels": "L'incantatore può influenzare una creatura aggiuntiva per ogni slot di livello superiore al 1º.",
  "save": "wis"
 },
 {
  "id": "comprehend-languages",
  "name": "Comprensione dei linguaggi",
  "nameEn": "Comprehend Languages",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un pizzico di fuliggine e di sale)",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore comprende il significato letterale di qualsiasi linguaggio che è in grado di sentire o vedere tramite segni. Comprende inoltre ogni linguaggio scritto che è in grado di vedere, ma deve toccare la superficie su cui sono scritte le parole. È necessario circa 1 minuto per leggere una pagina di testo. Questo incantesimo non decodifica simboli o messaggi segreti."
 },
 {
  "id": "create-or-destroy-water",
  "name": "Creare o distruggere acqua",
  "nameEn": "Create or Destroy Water",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una miscela di acqua e sabbia)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore esegue una delle seguenti azioni:\n**Creare acqua.** L'incantatore crea fino a 40 litri d'acqua pulita in un contenitore aperto entro gittata. In alternativa, l'acqua cade sotto forma di pioggia in un cubo con spigolo di 9 metri entro gittata, estinguendo le fiamme presenti nell'area.\n**Distruggere acqua.** L'incantatore distrugge fino a 40 litri d'acqua in un contenitore aperto entro gittata. In alternativa, distrugge la nebbia presente in un cubo con spigolo di 9 metri entro gittata.",
  "higherLevels": "L'incantatore crea o distrugge 40 litri aggiuntivi d'acqua, oppure la grandezza del cubo aumenta di 1,5 metri per spigolo, per ogni slot di livello superiore al 1º."
 },
 {
  "id": "cure-wounds",
  "name": "Cura ferite",
  "nameEn": "Cure Wounds",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "Una creatura toccata dall'incantatore recupera un numero di punti ferita pari a 2d8 più il modificatore di caratteristica da incantatore dell'incantatore.",
  "higherLevels": "La guarigione aumenta di 2d8 per ogni slot di livello superiore al 1º.",
  "roll": {
   "kind": "heal",
   "dice": "2d8",
   "addMod": true,
   "perSlotLevel": "2d8"
  }
 },
 {
  "id": "magic-missile",
  "name": "Dardo incantato",
  "nameEn": "Magic Missile",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea tre dardi lucenti di forza magica. Ogni dardo colpisce una creatura a scelta dell'incantatore situata entro gittata che egli è in grado di vedere. Un dardo infligge 1d4 + 1 danni da forza al suo bersaglio. Tutti i dardi colpiscono simultaneamente e l'incantatore può dirigerli per colpire una o più creature.",
  "higherLevels": "L'incantesimo crea un dardo aggiuntivo per ogni slot di livello superiore al 1º.",
  "roll": {
   "kind": "damage",
   "dice": "1d4+1",
   "damageType": "force"
  }
 },
 {
  "id": "guiding-bolt",
  "name": "Dardo tracciante",
  "nameEn": "Guiding Bolt",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "1 round",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore scaglia un lampo di luce verso una creatura entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, esso subisce 4d6 danni radiosi, e il successivo tiro per colpire effettuato contro il bersaglio prima del termine del turno successivo dell'incantatore dispone di vantaggio.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "4d6",
   "damageType": "radiant",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "floating-disk",
  "name": "Disco fluttuante",
  "nameEn": "Floating Disk",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una goccia di mercurio)",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "wizard"
  ],
  "description": "Questo incantesimo crea un piano circolare e orizzontale di forza del diametro di 90 centimetri e spessore di 2,5 centimetri, che fluttua 90 centimetri sopra il terreno in uno spazio libero a scelta dell'incantatore entro gittata e che egli è in grado di vedere. Questo disco permane per la durata dell'incantesimo e può sostenere fino a 250 kg. Se si aggiunge ulteriore peso, l'incantesimo termina e tutto ciò che si trovava sul disco precipita a terra.\nIl disco rimane immobile se l'incantatore si trova entro 6 metri da esso. Se l'incantatore si allontana a più di 6 metri, il disco lo segue per rimanere entro 6 metri da lui. Può muoversi sul terreno dissestato, lungo scalinate, pendii e terreni simili, ma non può superare un dislivello pari o superiore a 3 metri. Per esempio, il disco non può attraversare una fossa profonda 3 metri o uscirne se si trovasse sul fondo.\nL'incantesimo termina se l'incantatore si allontana di più di 30 metri dal disco (normalmente accade perché il disco non può superare un ostacolo per seguirlo)."
 },
 {
  "id": "heroism",
  "name": "Eroismo",
  "nameEn": "Heroism",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "paladin"
  ],
  "description": "Una creatura consenziente toccata dall'incantatore è animata da grande coraggio. Fino al termine dell'incantesimo, la creatura è immune alla condizione spaventato e all'inizio di ogni suo turno ottiene una quantità di punti ferita temporanei pari al modificatore di caratteristica da incantatore dell'incantatore.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º."
 },
 {
  "id": "divine-favor",
  "name": "Favore divino",
  "nameEn": "Divine Favor",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "1 minuto",
  "lists": [
   "paladin"
  ],
  "description": "Fino al termine dell'incantesimo, i suoi attacchi con le armi infliggono 1d4 danni radiosi extra se il colpo va a segno.",
  "roll": {
   "kind": "damage",
   "dice": "1d4",
   "damageType": "radiant"
  }
 },
 {
  "id": "chromatic-orb",
  "name": "Globo cromatico",
  "nameEn": "Chromatic Orb",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (un diamante del valore di 50 mo o più)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore scaglia un globo di energia contro un bersaglio entro gittata. Può scegliere che tipo di globo creare tra acido, freddo, fulmine, fuoco, tuono o veleno, e poi effettuare un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 3d8 danni del tipo scelto.\nSe l'incantatore ottiene lo stesso risultato su due o più d8, il globo schizza verso un altro bersaglio a scelta dell'incantatore che si trovi entro 9 metri dal primo bersaglio. L'incantatore effettua un tiro per colpire contro il secondo bersaglio e anche un altro tiro per i danni. Il globo non può più schizzare verso un altro bersaglio, a meno che l'incantatore non lanci l'incantesimo usando uno slot incantesimo di 2º livello o superiore.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 1º. Il globo può schizzare verso un altro bersaglio un numero massimo di volte pari al livello dello slot incantesimo consumato, ed è possibile bersagliare una creatura soltanto una volta per ogni lancio di questo incantesimo.",
  "attack": "ranged"
 },
 {
  "id": "identify",
  "name": "Identificare",
  "nameEn": "Identify",
  "level": 1,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (una perla del valore di 100 mo o più)",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore tocca un oggetto per la durata del lancio dell'incantesimo. Se si tratta di un oggetto magico o di un altro oggetto infuso di magia, apprende le sue proprietà e come usarlo, se richiede sintonia e quante cariche contiene, se ce ne sono. Apprende anche se l'oggetto è influenzato da eventuali incantesimi in corso e di quali si tratta. Se l'oggetto è stato creato da un incantesimo, l'incantatore tocca una creatura, apprende quali Se invece durante il lancio dell'incantesimo l'incantatore apprende il nome di quell'incantesimo. incantesimi in corso la stanno influenzando, se ce ne sono."
 },
 {
  "id": "silent-image",
  "name": "Immagine silenziosa",
  "nameEn": "Silent Image",
  "level": 1,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un ciuffo di lana)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea l'immagine di un oggetto, una creatura o qualche altro fenomeno visibile che non sia più grande di un cubo con spigolo di 4,5 metri. L'immagine compare in un punto situato entro gittata e permane per la durata dell'incantesimo. L'immagine è puramente visiva: non è accompagnata da suoni, odori o altri effetti sensoriali.\nCome azione di Magia, il personaggio può far muovere l'immagine verso qualunque posizione entro gittata. Mentre l'immagine è in movimento, l'incantatore può alterarne l'aspetto in modo che i movimenti risultino naturali. Ad esempio, se l'incantatore crea l'immagine di una creatura e decide di farla muovere, può modificarla per simulare il fatto che sta camminando.\nL'illusione può essere rivelata da un'interazione fisica, poiché gli oggetti possono attraversarla. Una creatura che effettua l'azione di Studio per esaminare l'immagine può determinare che si tratta di un'illusione superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se una creatura riconosce l'illusione per ciò che è, riesce a vedere attraverso l'immagine."
 },
 {
  "id": "detect-evil-and-good",
  "name": "Individuazione del bene e del male",
  "nameEn": "Detect Evil and Good",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore percepisce la posizione di aberrazioni, celestiali, elementali, folletti, immondi o non morti entro 9 metri di distanza da sé. Percepisce inoltre se l'incantesimo santificare è attivo e, se sì, dove.\nL'incantesimo viene bloccato da 30 cm di pietra, terriccio o legno, 2,5 centimetri di metallo o una sottile lamina di piombo."
 },
 {
  "id": "detect-magic",
  "name": "Individuazione del magico",
  "nameEn": "Detect Magic",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "ritual": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "paladin",
   "ranger",
   "sorcerer",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore percepisce la presenza di effetti magici entro 9 metri da sé. Se percepisce tali effetti, può eseguire un azione di Magia per vedere una debole aura attorno a ogni creatura o oggetto visibile nell'area che contenga magia e apprende di che scuola di magia si tratta, se ne esiste una.\nL'incantesimo viene bloccato da 30 cm di pietra, terriccio o legno, 2,5 centimetri di metallo o una sottile lamina di piombo."
 },
 {
  "id": "detect-poison-and-disease",
  "name": "Individuazione delle malattie e dei veleni",
  "nameEn": "Detect Poison and Disease",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una foglia di tasso)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore percepisce l'ubicazione di veleni, creature velenose e contagi magici entro 9 metri da sé. Inoltre, in ciascun caso può identificare il tipo di veleno, di creatura velenosa o di malattia.\nL'incantesimo viene bloccato da 30 cm di pietra, terriccio o legno, 2,5 centimetri di metallo o una sottile lamina di piombo."
 },
 {
  "id": "inflict-wounds",
  "name": "Infliggi ferite",
  "nameEn": "Inflict Wounds",
  "level": 1,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "Una creatura toccata dall'incantatore effettua un tiro salvezza su Costituzione, subendo 2d10 danni necrotici in caso di fallimento, o la metà dei danni in caso di successo.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 1º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "2d10",
   "damageType": "necrotic",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "hellish-rebuke",
  "name": "Intimorire infernale",
  "nameEn": "Hellish Rebuke",
  "level": 1,
  "school": "evocation",
  "castingTime": "Reazione, che l'incantatore effettua quando subisce danni da una creatura che egli è in grado di vedere entro 18 metri da sé",
  "timing": "reaction",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "warlock"
  ],
  "description": "La creatura che ha inflitto danni all'incantatore viene temporaneamente avviluppata da fiamme verdi. La creatura effettua un tiro salvezza su Destrezza, subendo 2d10 danni da fuoco in caso di fallimento, o la metà dei danni in caso di successo.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 1º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "2d10",
   "damageType": "fire",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "entangle",
  "name": "Intralciare",
  "nameEn": "Entangle",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "Dei vegetali afferranti spuntano dal terreno in un quadrato di 6 metri per lato in un punto situato entro gittata. Per la durata dell'incantesimo, i vegetali trasformano quell'area in un terreno difficile. I vegetali scompaiono al termine dell'incantesimo.\nQuando viene lanciato l'incantesimo, ogni creatura diversa dall'incantatore all'interno dell'area deve superare un tiro salvezza su Forza, altrimenti è trattenuta fino al termine dell'incantesimo. Le creature trattenute possono usare un'azione per effettuare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo. In caso di successo, si liberano dai vegetali afferranti e non sono più trattenute.",
  "save": "str"
 },
 {
  "id": "faerie-fire",
  "name": "Luminescenza",
  "nameEn": "Faerie Fire",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "druid"
  ],
  "description": "Gli oggetti contenuti in un cubo con spigolo di 6 metri entro gittata vengono evidenziati da un alone di luce blu, verde o viola (a scelta dell'incantatore). Ogni creatura presente nel cubo viene a sua volta evidenziata se fallisce un tiro salvezza su Destrezza. Per la durata dell'incantesimo, gli oggetti e le creature influenzate proiettano luce fioca entro un raggio di 3 metri e non possono beneficiare della condizione di invisibilità.\nI tiri per colpire contro una creatura influenzata o un oggetto influenzato dispongono di vantaggio se l'attaccante è in grado di vederli.",
  "save": "dex"
 },
 {
  "id": "burning-hands",
  "name": "Mani brucianti",
  "nameEn": "Burning Hands",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Un sottile velo di fiamme si propaga dall'incantatore. Ogni creatura entro un cono di 4,5 metri effettua un tiro salvezza su Destrezza, subendo 3d6 danni da fuoco in caso di fallimento, o la metà dei danni in caso di successo.\nGli oggetti infiammabili nel cono che non sono indossati o trasportati iniziano a bruciare.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "fire",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "hunters-mark",
  "name": "Marchio del cacciatore",
  "nameEn": "Hunter’s Mark",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "27 metri",
  "components": "V",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "ranger"
  ],
  "description": "L'incantatore marchia magicamente come sua preda una creatura entro gittata che egli è in grado di vedere. Fino al termine dell'incantesimo, l'incantatore infligge 1d6 danni da forza extra al bersaglio ogni volta che lo colpisce con un tiro per colpire. Inoltre, l'incantatore dispone di vantaggio a qualsiasi prova di Saggezza (Percezione o Sopravvivenza) che effettua per trovare il bersaglio.\nSe il bersaglio scende a 0 punti ferita prima del termine dell'incantesimo, l'incantatore può effettuare un'azione bonus per spostare il marchio su un'altra creatura entro gittata che egli è in grado di vedere.",
  "higherLevels": "La concentrazione dell'incantatore può durare di più utilizzando uno slot incantesimo di 3º o 4º livello (fino a 8 ore) o di 5º livello o superiore (fino a 24 ore).",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "force"
  }
 },
 {
  "id": "fog-cloud",
  "name": "Nube di nebbia",
  "nameEn": "Fog Cloud",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "L'incantatore genera una sfera di nebbia del raggio di 6 metri centrata su un punto entro gittata. La sfera è pesantemente oscurata e permane la durata dell'incantesimo o finché un vento forte (come quello creato da folata di vento) non la disperde.",
  "higherLevels": "Il raggio della sfera di nebbia aumenta di 6 metri per ogni slot di livello superiore al 1º."
 },
 {
  "id": "thunderwave",
  "name": "Onda tonante",
  "nameEn": "Thunderwave",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore sprigiona un'ondata di energia tonante. Ogni creatura entro un cubo con spigolo di 4,5 metri originato dall'incantatore effettua un tiro salvezza su Costituzione. Se lo fallisce, subisce 2d8 danni da tuono e viene spinta a una distanza di 3 metri dall'incantatore. In caso di successo, subisce soltanto la metà di quei danni.\nInoltre, gli oggetti non fissati e situati interamente nel cubo vengono spinti a 3 metri dall'incantatore, con un boato tonante entro 90 metri.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 1º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "thunder",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "speak-with-animals",
  "name": "Parlare con gli animali",
  "nameEn": "Speak with Animals",
  "level": 1,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "10 minuti",
  "ritual": true,
  "lists": [
   "bard",
   "druid",
   "ranger",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore comprende le bestie e può comunicare verbalmente con loro usando una qualunque abilità dell'azione di Influenza.\nNella maggior parte dei casi hanno ben poco da dire su temi che esulano dalla sopravvivenza o dallo spirito di squadra, ma almeno possono fornire informazioni su luoghi e mostri nelle vicinanze, oltre a tutto ciò che hanno notato nel corso dell'ultima giornata."
 },
 {
  "id": "healing-word",
  "name": "Parola guaritrice",
  "nameEn": "Healing Word",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid"
  ],
  "description": "Una creatura scelta dall'incantatore entro gittata e che egli è in grado di vedere recupera un ammontare di punti ferita pari a 2d4 più il modificatore di caratteristica da incantatore dell'incantatore.",
  "higherLevels": "La guarigione aumenta di 2d4 per ogni slot di livello superiore al 1º.",
  "roll": {
   "kind": "heal",
   "dice": "2d4",
   "addMod": true,
   "perSlotLevel": "2d4"
  }
 },
 {
  "id": "longstrider",
  "name": "Passo veloce",
  "nameEn": "Longstrider",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un pizzico di terriccio)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura, la cui velocità aumenta di 3 metri fino al termine dell'incantesimo.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º."
 },
 {
  "id": "protection-from-evil-and-good",
  "name": "Protezione dal bene e dal male",
  "nameEn": "Protection from Evil and Good",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un'ampolla di acqua santa del valore di 25 mo o più, che l'incantesimo consuma)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "wizard",
   "paladin",
   "warlock"
  ],
  "description": "Fino al termine dell'incantesimo, una creatura consenziente toccata dall'incantatore è protetta da certi tipi di creature: aberrazioni, celestiali, elementali, folletti, immondi o non morti. La protezione garantisce diversi vantaggi. Le creature contro cui è attiva subiscono svantaggio ai tiri per colpire indirizzati contro il bersaglio; inoltre, il bersaglio non può essere affascinato, spaventato o posseduto da creature analoghe. Se il bersaglio è già affascinato, spaventato o posseduto da una tale creatura, dispone di vantaggio a qualsiasi nuovo tiro salvezza contro il relativo effetto."
 },
 {
  "id": "divine-smite",
  "name": "Punizione divina",
  "nameEn": "Divine Smite",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione bonus che l'incantatore effettua subito dopo aver colpito un bersaglio con un'arma da mischia o con un colpo senz'armi",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "paladin"
  ],
  "description": "Il bersaglio subisce 2d8 danni radiosi extra dall'attacco. I danni aumentano di 1d8 se il\nUtilizzo di uno slot incantesimo di livello superiore. I danni aumentano di 1d8 per ogni slot di livello superiore al 1º.",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "radiant"
  }
 },
 {
  "id": "searing-smite",
  "name": "Punizione incandescente",
  "nameEn": "Searing Smite",
  "level": 1,
  "school": "evocation",
  "castingTime": "Azione bonus che l'incantatore effettua subito dopo aver colpito un bersaglio con un'arma da mischia o con un colpo senz'armi",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V",
  "duration": "1 minuto",
  "lists": [
   "paladin"
  ],
  "description": "Quando l'incantatore colpisce il bersaglio, esso subisce 1d6 danni da fuoco extra dall'attacco. All'inizio di ogni suo turno fino al termine dell'incantesimo, bersaglio è un immondo o un non morto.il bersaglio subisce 1d6 danni da fuoco ed effettua un tiro salvezza su Costituzione. In caso di fallimento, l'incantesimo permane. In caso di successo, l'incantesimo termina.",
  "higherLevels": "Tutti i danni aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "fire",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "purify-food-and-drink",
  "name": "Purificare cibo e bevande",
  "nameEn": "Purify Food and Drink",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "3 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "paladin"
  ],
  "description": "L'incantatore rimuove veleno e marciume da cibi e bevande non magici situati in una sfera del raggio di 1,5 metri centrata su un punto entro gittata."
 },
 {
  "id": "ray-of-sickness",
  "name": "Raggio di infermità",
  "nameEn": "Ray of Sickness",
  "level": 1,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore proietta un raggio di energia verdastra verso una creatura entro gittata, effettuando un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 2d8 danni da veleno ed è avvelenato fino al termine del turno successivo dell'incantatore.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 1º.",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "poison",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "hideous-laughter",
  "name": "Risata incontenibile",
  "nameEn": "Hideous Laughter",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una crostata e una piuma)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "Una creatura a scelta entro gittata che l'incantatore è in grado di vedere effettua un tiro salvezza su Saggezza. Se lo fallisce, cade a terra prona ed è incapacitata per la durata dell'incantesimo. Durante quel periodo di tempo, ride incontrollabilmente (se è in grado di ridere) e non può porre fine alla condizione prono.\nIl bersaglio effettua un altro tiro salvezza su Saggezza alla fine di ogni suo turno e ogni volta che subisce danni; in quest'ultimo caso, lo effettua con vantaggio. In caso di successo, l'incantesimo termina.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º.",
  "save": "wis"
 },
 {
  "id": "expeditious-retreat",
  "name": "Ritirata rapida",
  "nameEn": "Expeditious Retreat",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore effettua un'azione di Scatto e, fino al termine dell'incantesimo, può effettuarla di nuovo come azione bonus."
 },
 {
  "id": "jump",
  "name": "Salto",
  "nameEn": "Jump",
  "level": 1,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Contatto",
  "components": "V, S, M (la zampa posteriore di una caval- letta)",
  "duration": "1 minuto",
  "lists": [
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "L'incantatore tocca una creatura consenziente. La creatura, in ogni suo turno fino al termine dell'incantesimo, può saltare fino a 9 metri, usando 3 metri di movimento.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 1º."
 },
 {
  "id": "sanctuary",
  "name": "Santuario",
  "nameEn": "Sanctuary",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "9 metri",
  "components": "V, S, M (un frammento di vetro di uno specchio)",
  "duration": "1 minuto",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore protegge una creatura situata entro gittata. Fino al termine dell'incantesimo, ogni creatura che bersaglia la creatura protetta con un tiro per colpire o con un incantesimo dannoso deve prima superare un tiro salvezza su Saggezza, altrimenti deve scegliere un bersaglio diverso o perdere l'attacco o l'incantesimo. Questo incantesimo non protegge la creatura protetta dalle aree di effetto. L'incantesimo termina se la creatura protetta effettua un tiro per colpire, lancia un incantesimo o infligge danni.",
  "save": "wis"
 },
 {
  "id": "illusory-script",
  "name": "Scritto illusorio",
  "nameEn": "Illusory Script",
  "level": 1,
  "school": "illusion",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "S, M (inchiostro del valore di 10 mo o più, che l'incantesimo consuma)",
  "duration": "10 giorni",
  "ritual": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore scrive su una pergamena, un foglio o un altro materiale adatto e infonde nello scritto un'illusione che permane per la durata dell'incantesimo. All'incantatore e a qualsiasi creatura indicata da lui al momento del lancio, lo scritto appare normale, sembra essere stilato nella calligrafia dell'incantatore e trasmette il significato inteso nel momento in cui è stato scritto. Agli occhi di tutti gli altri, il messaggio appare scritto in una lingua magica o ignota che risulta per loro incomprensibile. In alternativa, l'illusione può alterare il significato, la calligrafia e la lingua del testo, ma questa deve essere una lingua conosciuta dall'incantatore.\nSe l'incantesimo viene dissolto, il messaggio originale e l'illusione scompaiono.\nUna creatura con vista pura può leggere il messaggio nascosto."
 },
 {
  "id": "shield",
  "name": "Scudo",
  "nameEn": "Shield",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Reazione, che l'incantatore effettua quando è colpito da un tiro per colpire o bersagliato dall'incantesimo dardo incantato",
  "timing": "reaction",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "1 round",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una barriera impercettibile di forza magica protegge l'incantatore. Fino all'inizio del suo turno successivo, l'incantatore ottiene un bonus di +5 alla CA da applicare anche all'attacco innescante e non subisce danni da dardo incantato."
 },
 {
  "id": "shield-of-faith",
  "name": "Scudo della fede",
  "nameEn": "Shield of Faith",
  "level": 1,
  "school": "abjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "18 metri",
  "components": "V, S, M (una pergamena con una preghiera)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "Un campo di energia scintillante avvolge una creatura scelta dall'incantatore entro gittata, conferendole un bonus di +2 alla CA per la durata dell'incantesimo."
 },
 {
  "id": "unseen-servant",
  "name": "Servitore inosservato",
  "nameEn": "Unseen Servant",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un pezzo di spago e di legno)",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "Fino al termine di questo incantesimo, una forza Media invisibile, amorfa e priva di volontà propria svolge dei compiti semplici su ordine dell'incantatore. Il servitore appare sul terreno in uno spazio libero entro gittata, ha CA 10, 1 punto ferita, Forza pari a 2 e non può attaccare. Se scende a 0 punti ferita, l'incantesimo termina.\nUna volta in ogni suo turno, come azione bonus, l'incantatore può ordinare mentalmente al servitore di spostarsi di un massimo di 4,5 metri e interagire con un oggetto. Esso può eseguire compiti semplici alla stregua di un umano, come portare oggetti, pulire, riparare, ripiegare abiti, accendere fuochi, servire pietanze e versare bevande. Una volta impartito il comando, il servitore svolge il compito al meglio delle sue capacità finché non lo porta a termine, poi attende l'ordine successivo dell'incantatore.\nSe l'incantatore ordina al servitore di eseguire un compito che lo porta a più di 18 metri da lui, l'incantesimo termina."
 },
 {
  "id": "sleep",
  "name": "Sonno",
  "nameEn": "Sleep",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un pizzico di sabbia o dei petali di rosa)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Ogni creatura a scelta dell'incantatore in una sfera dal raggio di 1,5 metri in una posizione entro gittata deve superare un tiro salvezza su Saggezza, altrimenti sarà incapacitata fino al termine del proprio turno successivo. A questo punto, dovrà ripetere la prova e, in caso di fallimento, cadrà priva di sensi per la durata dell'incantesimo. L'effetto svanisce se il bersaglio subisce danni o se qualcuno entro 1,5 metri da esso effettua un'azione per scuoterlo e farlo tornare in sé.\nLe creature che non dormono, come gli elfi, o che sono immuni all'indebolimento superano automaticamente i tiri salvezza contro l'incantesimo.",
  "save": "wis"
 },
 {
  "id": "hex",
  "name": "Sortilegio",
  "nameEn": "Hex",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "27 metri",
  "components": "V, S, M (l'occhio pietrificato di un tritone)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "warlock"
  ],
  "description": "L'incantatore scaglia una maledizione su una creatura entro gittata che egli è in grado di vedere. Fino al termine dell'incantesimo, l'incantatore infligge 1d6 danni necrotici extra al bersaglio ogni volta che lo colpisce con un tiro per colpire. Inoltre, quando l'incantatore lancia l'incantesimo, sceglie una caratteristica. Il bersaglio subisce svantaggio alle prove di caratteristica effettuate con la caratteristica scelta.\nSe il bersaglio scende a 0 punti ferita prima del termine dell'incantesimo, l'incantatore può effettuare un'azione bonus in un suo turno successivo per maledire un'altra creatura.",
  "higherLevels": "La concentrazione dell'incantatore può durare di più utilizzando uno slot incantesimo di 2º livello (fino a 4 ore), di 3º o 4º livello (fino a 8 ore) o di 5º livello o superiore (24 ore).",
  "roll": {
   "kind": "damage",
   "dice": "1d6",
   "damageType": "necrotic"
  }
 },
 {
  "id": "color-spray",
  "name": "Spruzzo colorato",
  "nameEn": "Color Spray",
  "level": 1,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un pizzico di sabbia colorata)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore lancia un lampo abbagliante di luce multicolore. Ogni creatura entro un cono di 4,5 metri originato dall'incantatore deve superare un tiro salvezza su Costituzione, altrimenti è accecata fino al termine del turno successivo dell'incantatore.",
  "save": "con"
 },
 {
  "id": "dissonant-whispers",
  "name": "Sussurri dissonanti",
  "nameEn": "Dissonant Whispers",
  "level": 1,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard"
  ],
  "description": "Una creatura a scelta dell'incantatore, situata entro gittata e che egli è in grado di vedere, sente una melodia dissonante nella sua mente. Il bersaglio effettua un tiro salvezza su Saggezza. Se lo fallisce, subisce 3d6 danni psichici e, se disponibile, deve usare immediatamente la sua reazione per muoversi fin dove la sua velocità glielo consente, percorrendo la via più sicura. In caso di successo, subisce soltanto la metà di quei danni.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 1º.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "psychic",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "find-familiar",
  "name": "Trova famiglio",
  "nameEn": "Find Familiar",
  "level": 1,
  "school": "conjuration",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "3 metri",
  "components": "V, S, M (incenso bruciato del valore di 10 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore ottiene i servigi di un famiglio, uno spirito che assume la forma di un animale a sua scelta: pipistrello, gatto, rana, falco, lucertola, piovra, gufo, ratto, corvo, ragno, faina o un'altra bestia che abbia un grado di sfida pari a 0. Il famiglio appare in uno spazio libero entro gittata, ha le statistiche della forma scelta (vedi \"Mostri\"), anche se si tratta di un celestiale, un folletto o un immondo (a scelta dell'incantatore) invece di una bestia. Il famiglio è indipendente dall'incantatore, ma obbedisce ai suoi comandi.\n**Connessione telepatica.** Finché il famiglio si trova a 30 metri dall'incantatore, quest'ultimo può comunicare con lui telepaticamente. Inoltre, come azione bonus, l'incantatore è in grado di vedere attraverso gli occhi del famiglio e sentire ciò che sente fino all'inizio del suo turno successivo, ottenendo i benefici di eventuali sensi speciali posseduti dal famiglio.\nInfine, quando l'incantatore lancia un incantesimo con gittata a contatto, il suo famiglio può trasmettere il tocco. Il famiglio deve trovarsi entro 30 metri dall'incantatore e usare la sua reazione per trasmettere il tocco quando l'incantesimo viene lanciato.\n**Combattimento.** Il famiglio diventa un alleato per l'incantatore e i suoi alleati. Tira per la propria iniziativa e agisce nel proprio turno. Un famiglio non può attaccare, ma può effettuare altre azioni normalmente.\n**Scomparsa del famiglio.** Quando un famiglio scende a 0 punti ferita, scompare e riappare quando l'incantatore lancia nuovamente questo incantesimo. Come azione di Magia, l'incantatore può temporaneamente congedare il famiglio, che scompare in una sacca dimensionale. In alternativa, l'incantatore può farlo sparire per sempre. Come azione di Magia, finché il famiglio è congedato temporaneamente, l'incantatore può farlo ricomparire in uno spazio libero entro 9 metri da sé. Ogni volta che il famiglio scende a 0 punti ferita o scompare in una sacca dimensionale, nello spazio che occupava in precedenza lascia qualsiasi oggetto stesse indossando o trasportando.\n**Un solo famiglio.** Un incantatore non può avere più di un famiglio alla volta. Se lancia questo incantesimo mentre è già presente un famiglio, l'incantatore gli impartisce un'altra forma possibile."
 },
 {
  "id": "grease",
  "name": "Unto",
  "nameEn": "Grease",
  "level": 1,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un pezzo di cotenna di maiale o burro)",
  "duration": "1 minuto",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una patina di unto non infiammabile ricopre un'area di terreno di 3 metri per lato centrata su un punto entro gittata che diventa terreno difficile per la durata dell'incantesimo.\nQuando l'unto compare, ogni creatura nell'area deve superare un tiro salvezza su Destrezza, altrimenti cade a terra prona. Anche una creatura che entra nell'area o vi termina il proprio turno deve superare lo stesso tiro salvezza, altrimenti cade prona.",
  "save": "dex"
 },
 {
  "id": "false-life",
  "name": "Vita falsata",
  "nameEn": "False Life",
  "level": 1,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una goccia di alcol)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore ottiene 2d4 + 4 punti ferita temporanei.",
  "higherLevels": "L'incantatore ottiene 5 punti ferita temporanei aggiuntivi per ogni slot di livello superiore al 1º."
 },
 {
  "id": "mind-spike",
  "name": "Aculeo mentale",
  "nameEn": "Mind Spike",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore guida un flusso di energia psionica nella mente di una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Saggezza, subendo 3d8 danni psichici in caso di fallimento, o la metà dei danni in caso di successo. Se fallisce il tiro, l'incantatore sa sempre dove si trova il bersaglio fino al termine dell'incantesimo, ma solo se entrambi si trovano sullo stesso piano di esistenza. Finché l'incantatore è in possesso di queste conoscenze, il bersaglio non può nascondersi da lui e, se è invisibile, non ottiene alcun beneficio da questa condizione contro di lui.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 2º.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "3d8",
   "damageType": "psychic",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "aid",
  "name": "Aiuto",
  "nameEn": "Aid",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una striscia di tessuto bianco)",
  "duration": "8 ore",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore sceglie fino a tre creature entro gittata. I punti ferita massimi e i punti ferita attuali di ogni bersaglio aumentano di 5 per la durata dell'incantesimo.",
  "higherLevels": "I punti ferita di ciascun bersaglio aumentano di 5 per ogni slot incantesimo di livello superiore al 2º."
 },
 {
  "id": "phantasmal-force",
  "name": "Allucinazione di forza",
  "nameEn": "Phantasmal Force",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un ciuffo di lana)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tenta di creare un'illusione nella mente di una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Intelligenza. Se lo fallisce, l'incantatore crea l'illusione di un oggetto, una creatura o un fenomeno di altra natura, che non sia più grande di un cubo con spigolo di 3 metri e che sia percepibile soltanto dal bersaglio per la durata dell'incantesimo. L'allucinazione include suoni, temperature e altri stimoli analoghi.\nIl bersaglio può effettuare un'azione di Studio per esaminare l'allucinazione con una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se supera la prova, il bersaglio capisce che l'allucinazione è un'illusione e l'incantesimo termina.\nFinché il bersaglio è influenzato dall'incantesimo, considera l'allucinazione come se fosse reale e razionalizza qualsiasi esito illogico prodotto dalle sue interazioni con essa. Ad esempio, se il bersaglio cammina attraverso un ponte illusorio e sopravvive alla caduta, crederà comunque che il ponte esista e che sia stato qualcos'altro a causare la caduta.\nUn bersaglio influenzato può perfino subire danni dall'illusione se l'allucinazione rappresenta una creatura pericolosa o un pericolo. In ogni turno dell'incantatore, l'allucinazione può infliggere 2d8 danni psichici al bersaglio se questo si trova nell'area dell'allucinazione o entro 1,5 metri da essa. Il bersaglio percepisce i danni come se fossero del tipo appropriato per l'illusione.",
  "save": "int",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "psychic"
  }
 },
 {
  "id": "alter-self",
  "name": "Alterare se stesso",
  "nameEn": "Alter Self",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore altera la propria forma fisica scegliendo tra le opzioni seguenti. Gli effetti permangono per la sua durata, durante la quale l'incantatore può effettuare un'azione di Magia per sostituire l'opzione scelta con una diversa.\n**Adattamento acquatico.** L'incantatore sviluppa le branchie e una membrana tra le dita. Inoltre, può respirare sott'acqua e ottenere una velocità di nuoto pari alla sua velocità.\n**Armi naturali.** L'incantatore sviluppa artigli (taglienti), zanne (perforanti), corna (perforanti) o zoccoli (contundenti). Quando usa il suo colpo senz'armi per infliggere danni con l'arma naturale creata, infligge 1d6 danni (del tipo indicato tra parentesi) invece di infliggere i danni normali del colpo senz'armi, usando il modificatore di caratteristica da incantatore per i tiri per colpire e per i tiri per i danni anziché quello di Forza.\n**Cambiare aspetto.** L'incantatore altera il suo aspetto: decide come apparire e definisce altezza, peso, lineamenti facciali, tono della voce, lunghezza dei capelli, carnagione e altri tratti distintivi. Può scegliere di assomigliare a un membro di un'altra specie, ma le sue statistiche non subiscono modifiche. Non può apparire come una creatura di taglia diversa e la sua forma base rimane la stessa; per esempio, se è bipede, non può usare l'incantesimo per diventare quadrupede. Per la durata dell'incantesimo, può effettuare un'azione di Magia per cambiare di nuovo il suo aspetto."
 },
 {
  "id": "animal-messenger",
  "name": "Animale messaggero",
  "nameEn": "Animal Messenger",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un boccone di cibo)",
  "duration": "24 ore",
  "ritual": true,
  "lists": [
   "bard",
   "druid",
   "ranger"
  ],
  "description": "Una bestia Minuscola a scelta entro gittata che l'incantatore è in grado di vedere deve superare un tiro salvezza su Carisma, altrimenti deve cercare di consegnare un messaggio da parte dell'incantatore (se il grado di sfida del bersaglio non è 0, la prova viene superata automaticamente). L'incantatore specifica il luogo di consegna, che ha già visitato, e un destinatario che corrisponda a una descrizione generica, come \"una persona che indossa l'uniforme della guardia cittadina\" o \"un nano dai capelli rossi che indossa un cappello a punta\". Inoltre, l'incantatore comunica un messaggio composto da un massimo di venticinque parole. La bestia bersaglio viaggia per la durata dell'incantesimo verso il luogo specificato, percorrendo circa 37,5 chilometri in 24 ore o 75 chilometri se è una bestia volante.\nQuando la bestia arriva a destinazione, trasmette il messaggio alla creatura descritta, imitando il modo di comunicare dell'incantatore. Se la bestia non raggiunge la sua destinazione prima della fine dell'incantesimo, il messaggio viene perso e la bestia torna nel luogo dove l'incantatore ha lanciato l'incantesimo.",
  "higherLevels": "La durata dell'incantesimo aumenta di 48 ore per ogni slot di livello superiore al 2º.",
  "save": "cha"
 },
 {
  "id": "magic-weapon",
  "name": "Arma magica",
  "nameEn": "Magic Weapon",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Contatto",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "wizard",
   "paladin",
   "ranger",
   "sorcerer"
  ],
  "description": "L'incantatore tocca un'arma non magica, e, fino al termine dell'incantesimo, quell'arma diventa un'arma magica con un bonus di +1 ai tiri per colpire e ai tiri per i danni. L'incantesimo termina in anticipo se l'incantatore lo lancia di nuovo.",
  "higherLevels": "Il bonus aumenta a +2 con uno slot incantesimo compreso tra il 3º e 5º livello. Il bonus aumenta a +3 con uno slot incantesimo di 6º livello o superiore."
 },
 {
  "id": "spiritual-weapon",
  "name": "Arma spirituale",
  "nameEn": "Spiritual Weapon",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore crea una forza spettrale e fluttuante che ha la forma di un'arma a sua scelta e permane per la durata dell'incantesimo. L'arma appare entro gittata in un luogo a scelta dell'incantatore, il quale può subito effettuare un attacco in mischia con incantesimo contro una creatura entro 1,5 metri dall'arma. Se il colpo va a segno, il bersaglio subisce 1d8 danni da forza + il modificatore di caratteristica da incantatore dell'incantatore.\nCome azione bonus nei suoi turni successivi, l'incantatore può muovere l'arma spirituale di un massimo di 6 metri e ripetere l'attacco contro una creatura situata entro 1,5 metri da essa.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 2º.",
  "attack": "melee",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "force",
   "addMod": true,
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "arcanists-magic-aura",
  "name": "Aura magica dell'arcanista",
  "nameEn": "Arcanist’s Magic Aura",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un piccolo pezzo quadrato di seta)",
  "duration": "24 ore",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore tocca una creatura consenziente o un oggetto che non sia indossato o trasportato e vi pone un'illusione. Una creatura riceve l'effetto Maschera, mentre un oggetto riceve l'effetto Falsa aura. Entrambi gli effetti, descritti di seguito, permangono per tutta la durata dell'incantesimo. Se l'incantatore lancia l'incantesimo sullo stesso bersaglio ogni giorno per 30 giorni, l'illusione permane finché non viene dissolta.\n**Maschera (creatura).** L'incantatore sceglie un tipo di creatura diverso da quello del bersaglio. Gli incantesimi e altri effetti magici considerano il bersaglio come se fosse una creatura del tipo scelto dall'incantatore.\n**Falsa aura (oggetto).** L'incantatore modifica il modo in cui il bersaglio appare agli incantesimi e agli effetti magici che individuano le aure magiche, come per esempio individuazione del magico. L'incantatore può fare in modo che un oggetto non magico appaia come magico e viceversa, oppure può cambiare l'aura di un oggetto in modo che sembri appartenere a una scuola di magia a sua scelta."
 },
 {
  "id": "moonbeam",
  "name": "Bagliore lunare",
  "nameEn": "Moonbeam",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (una foglia di un vitigno legnoso)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "Un bagliore argentato di luce pallida forma un cilindro del raggio di 1,5 metri e dell'altezza di 12 metri centrato su un punto entro gittata. Fino al termine dell'incantesimo, il cilindro è pervaso da luce fioca e l'incantatore può effettuare un'azione di Magia nei turni successivi per spostare il cilindro fino a 18 metri.\nQuando appare il cilindro, ogni creatura al suo interno effettua un tiro salvezza su Costituzione. In caso di fallimento, una creatura subisce 2d10 danni radiosi e, se la creatura è in forma mutata (ad esempio, come conseguenza all'incantesimo metamorfosi), torna alla sua forma naturale e non può trasformarsi finché non esce dal cilindro. In caso di successo, subisce soltanto la metà di quei danni. Una creatura effettua questo tiro salvezza anche quando l'area dell'incantesimo si muove nel suo spazio e quando la creatura entra nell'area dell'incantesimo o vi termina il suo turno. Una creatura effettua questo tiro salvezza solo una volta per turno.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 2º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "2d10",
   "damageType": "radiant",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "hold-person",
  "name": "Blocca persone",
  "nameEn": "Hold Person",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (una sbarra di ferro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore sceglie un umanoide entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane paralizzato per la durata dell'incantesimo. Alla fine di ogni suo turno, il bersaglio ripete il tiro salvezza e, se lo supera, termina l'incantesimo su di sé.",
  "higherLevels": "L'incantatore può bersagliare un umanoide aggiuntivo per ogni slot di livello superiore al 2º.",
  "save": "wis"
 },
 {
  "id": "magic-mouth",
  "name": "Bocca magica",
  "nameEn": "Magic Mouth",
  "level": 2,
  "school": "illusion",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S, M (polvere di giada del valore di 10 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto",
  "ritual": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore imprime un messaggio all'interno di un oggetto entro gittata, che viene pronunciato quando si verifica una condizione di innesco. L'incantatore sceglie un oggetto che egli è in grado di vedere e che non è indossato o trasportato da un'altra creatura. Quindi pronuncia il messaggio, che non deve essere più lungo di 25 parole, ma può essere enunciato nell'arco di 10 minuti. Infine, determina la circostanza che innesca l'incantesimo e l'emissione del messaggio.\nQuando quell'innesco si verifica, sull'oggetto appare una bocca magica che recita il messaggio con il tono e il volume di voce dell'incantatore. Se l'oggetto scelto presenta già una bocca o qualcosa di simile (per esempio, la bocca di una statua), la bocca magica appare in modo che le parole sembrino pronunciate dalla bocca dell'oggetto. Quando lancia questo incantesimo, l'incantatore può fare in modo che esso termini una volta consegnato il messaggio o che rimanga attivo ripetendo il messaggio ogniqualvolta si verifica la circostanza di innesco.\nL'innesco può essere sia generale che dettagliato, ma deve essere basato su condizioni visibili o udibili che si verificano entro 9 metri dall'oggetto. Per esempio, l'incantatore potrebbe ordinare alla bocca di parlare quando, entro 9 metri dall'oggetto, una qualsiasi creatura si muove, oppure un campana d'argento suona."
 },
 {
  "id": "calm-emotions",
  "name": "Calmare emozioni",
  "nameEn": "Calm Emotions",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "cleric"
  ],
  "description": "Ogni umanoide all'interno di una sfera del raggio di 6 metri centrata su un punto scelto dall'incantatore entro gittata deve effettuare un tiro salvezza su Carisma o essere influenzato da uno dei seguenti effetti (a scelta per ogni creatura):\n• La creatura è immune alle condizioni affascinato e spaventato fino al termine dell'incantesimo. Se la creatura è già affascinata o spaventata, queste condizioni sono soppresse per la durata dell'incantesimo.\n• La creatura diventa indifferente alle creature (a scelta dell'incantatore) verso cui è ostile. Questa indifferenza termina se il bersaglio subisce danni o se vede uno dei suoi alleati subire danni. Al termine dell'incantesimo, l'atteggiamento della creatura torna alla normalità.",
  "save": "cha"
 },
 {
  "id": "enhance-ability",
  "name": "Caratteristica potenziata",
  "nameEn": "Enhance Ability",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un ciuffo di peli o una piuma)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "L'incantatore tocca una creatura e sceglie Forza, Destrezza, Intelligenza, Saggezza o Carisma. Per la durata dell'incantesimo, il bersaglio dispone di vantaggio sulle prove di caratteristica effettuate utilizzando l'abilità scelta.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 2º. L'incantatore può scegliere una caratteristica differente per ogni bersaglio."
 },
 {
  "id": "blindness-deafness",
  "name": "Cecità/sordità",
  "nameEn": "Blindness/Deafness",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V",
  "duration": "1 minuto",
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer"
  ],
  "description": "Una creatura entro gittata che l'incantatore è in grado di vedere deve superare un tiro salvezza su Costituzione, altrimenti viene accecata o assordata (a scelta dell'incantatore) per la durata dell'incantesimo. Alla fine di ogni suo turno, il bersaglio ripete il tiro salvezza e, se lo supera, termina l'incantesimo su di sé.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 2º.",
  "save": "con"
 },
 {
  "id": "spike-growth",
  "name": "Crescita di spine",
  "nameEn": "Spike Growth",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (sette spine)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "Spine e spuntoni nascono dal terreno in una sfera del raggio di 6 metri, centrata su un punto entro gittata. Per la durata dell'incantesimo, l'area diventa terreno difficile. Quando una creatura entra nell'area o si muove al suo interno, subisce 2d4 danni perforanti ogni 1,5 metri di movimento.\nLa trasformazione del terreno è mimetizzata in modo da sembrare naturale. Qualsiasi creatura che non stesse osservando l'area al momento del lancio dell'incantesimo deve effettuare un'azione di Ricerca e superare una prova di Saggezza (Percezione o Sopravvivenza) contro la CD del tiro salvezza sull'incantesimo per riconoscere la pericolosità del terreno prima di entrarvi.",
  "roll": {
   "kind": "damage",
   "dice": "2d4",
   "damageType": "piercing"
  }
 },
 {
  "id": "enthrall",
  "name": "Estasiare",
  "nameEn": "Enthrall",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "warlock"
  ],
  "description": "L'incantatore pronuncia una sequenza di parole disorientante, costringendo le creature da lui scelte entro gittata e che egli è in grado di vedere a effettuare un tiro salvezza su Saggezza. Se l'incantatore o i suoi compagni stanno combattendo contro una creatura, quella supera automaticamente questo tiro salvezza. In caso di fallimento, il bersaglio subisce una penalità di −10 alle prove di Saggezza (Percezione) e alla Percezione passiva fino al termine dell'incantesimo.",
  "save": "wis"
 },
 {
  "id": "continual-flame",
  "name": "Fiamma perenne",
  "nameEn": "Continual Flame",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere di rubino del valore di 50 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "Una fiamma si sprigiona da un oggetto toccato dall'incantatore. L'effetto proietta luce intensa in un raggio di 6 metri e luce fioca per ulteriori 6 metri. L'effetto è quello di una fiamma comune, ma non genera calore e non utilizza combustibile. La fiamma può essere coperta o nascosta, ma non soffocata o estinta."
 },
 {
  "id": "gust-of-wind",
  "name": "Folata di vento",
  "nameEn": "Gust of Wind",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un seme di legume)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "ranger",
   "wizard",
   "sorcerer"
  ],
  "description": "Una linea di vento forte lunga 18 metri e ampia 3 metri viene indirizzata dall'incantatore in una direzione a sua scelta per la durata dell'incantesimo. Ogni creatura sulla linea deve superare un tiro salvezza su Forza, altrimenti viene spinta per 4,5 metri lontano dall'incantatore nella direzione della linea. Una creatura che termina il suo turno sulla linea deve effettuare lo stesso tiro salvezza.\nQualsiasi creatura sulla linea deve usare 60 centimetri di movimento per ogni 30 centimetri percorsi per avvicinarsi all'incantatore.\nLa folata può disperdere gas o vapore e spegne candele e simili fiamme non protette nell'area. Le fiamme protette, come quelle delle lanterne, tremolano e hanno il 50% di possibilità di spegnersi.\nCome azione bonus nei suoi turni successivi, l'incantatore può modificare la direzione in cui indirizzare la linea.",
  "save": "str"
 },
 {
  "id": "shatter",
  "name": "Frantumare",
  "nameEn": "Shatter",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un frammento di mica)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Un rumore assordante esplode da un punto a scelta dell'incantatore entro gittata. Ogni creatura all'interno di una sfera di 3 metri di raggio centrata su quel punto effettua un tiro salvezza su Costituzione. In caso di fallimento, subisce 3d8 danni da tuono o la metà dei danni in caso di successo. Un costrutto subisce svantaggio al tiro salvezza.\nAnche un oggetto non magico che non sia indossato o trasportato subisce i danni se si trova entro l'area dell'incantesimo.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 2º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "3d8",
   "damageType": "thunder",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "acid-arrow",
  "name": "Freccia acida",
  "nameEn": "Acid Arrow",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (foglia di rabarbaro in polvere)",
  "duration": "Istantanea",
  "lists": [
   "wizard"
  ],
  "description": "Una freccia verde scintillante sfreccia verso un bersaglio entro gittata ed esplode in uno spruzzo di acido. L'incantatore effettua un attacco a distanza con incantesimo contro il bersaglio. Se il colpo va a segno, il bersaglio subisce 4d4 danni da acido e 2d4 danni da acido alla fine del suo turno successivo. Se il colpo manca, la freccia schizza acido sul bersaglio, infliggendo solo la metà dei danni iniziali.",
  "higherLevels": "I danni (sia iniziali che successivi) aumentano di 1d4 per ogni slot di livello superiore al 2º.",
  "attack": "ranged",
  "roll": {
   "kind": "damage",
   "dice": "4d4",
   "damageType": "acid",
   "perSlotLevel": "1d4"
  }
 },
 {
  "id": "mirror-image",
  "name": "Immagine speculare",
  "nameEn": "Mirror Image",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "1 minuto",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Tre duplicati illusori dell'incantatore appaiono nel suo spazio. Fino al termine dell'incantesimo, i duplicati si muovono con l'incantatore e imitano le sue azioni, cambiando posizione in modo che sia impossibile individuare quale sia l'immagine reale.\nOgni volta che una creatura colpisce l'incantatore con tiro per colpire nel corso della durata dell'incantesimo, l'incantatore tira un d6 per ognuno dei duplicati rimasti. Se uno qualsiasi dei risultati che ottiene è pari o superiore a 3, uno dei duplicati subisce il colpo al posto dell'incantatore, e poi viene distrutto. Altrimenti, i duplicati ignorano tutti gli altri danni o effetti. L'incantesimo termina quando tutti e i tre duplicati vengono distrutti.\nUna creatura non è influenzata da questo incantesimo se è accecata o se ha vista cieca o vista pura."
 },
 {
  "id": "detect-thoughts",
  "name": "Individuazione dei pensieri",
  "nameEn": "Detect Thoughts",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (1 pezzo di rame)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore attiva uno dei seguenti effetti. Fino al termine dell'incantesimo, può attivare entrambi gli effetti come azione di Magia nei suoi turni successivi.\n**Pensieri sensoriali.** L'incantatore percepisce la presenza di pensieri entro 9 metri da sé appartenenti a creature che conoscono delle lingue o che comunicano telepaticamente. L'incantatore non legge nel pensiero, ma avverte la presenza di una creatura pensante.\nL'incantesimo viene bloccato da 30 cm di pietra, terriccio o legno, 2,5 centimetri di metallo o una sottile lamina di piombo.\n**Lettura del pensiero.** L'incantatore bersaglia una creatura entro 9 metri da sé che egli è in grado di vedere o che ha individuato con l'opzione Pensieri sensoriali e apprende i pensieri superficiali del bersaglio, ciò che sta pensando in quel momento. Se il bersaglio non conosce alcuna lingua e non comunica telepaticamente, l'incantatore non apprende nulla.\nCome azione di Magia nel suo turno successivo, l'incantatore può provare a scavare più in profondità nella mente della creatura. Nell'ultimo caso, il bersaglio effettua un tiro salvezza su Saggezza. In caso di fallimento, l'incantatore ha accesso ai suoi ragionamenti, al suo stato emotivo e a ciò che principalmente riempie la sua mente (qualcosa di cui si preoccupa, che ama o odia). In caso di successo, l'incantesimo termina. In ogni caso, il bersaglio è consapevole che l'incantatore ha accesso alla sua mente e, se quest'ultimo non distoglie la sua attenzione dalla mente del bersaglio, il bersaglio può usare un'azione nel proprio turno per effettuare una prova di Intelligenza (Arcano) contro la CD del tiro salvezza sull'incantesimo; in caso di successo, l'incantesimo termina.",
  "save": "wis"
 },
 {
  "id": "enlarge-reduce",
  "name": "Ingrandire/ridurre",
  "nameEn": "Enlarge/Reduce",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un pizzico di polvere di ferro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore ingrandisce o riduce una creatura o un oggetto entro gittata che egli è in grado di vedere (vedi di seguito l'effetto scelto). L'oggetto bersaglio non deve essere né indossato né trasportato. Se il bersaglio è una creatura non consenziente, può effettuare un tiro salvezza su Costituzione. Se lo supera, l'incantesimo non sortisce alcun effetto.\nTutto ciò che la creatura indossa o trasporta cambia di taglia insieme a lei. Se un oggetto cade a terra, torna immediatamente alle sue dimensioni normali. Le armi da lancio e le munizioni tornano alle loro dimensioni normali subito dopo aver colpito o mancato un bersaglio.\n**Ingrandire.** La taglia del bersaglio aumenta di una categoria (da Media a Grande, per esempio). Il bersaglio dispone anche di vantaggio alle prove di Forza e ai tiri salvezza su Forza. Gli attacchi effettuati dal bersaglio con armi ingrandite o con colpi senz'armi infliggono 1d4 danni extra se il colpo va a segno.\n**Ridurre.** La taglia del bersaglio diminuisce di una categoria (da Media a Piccola, per esempio). Il bersaglio dispone anche di svantaggio alle prove di Forza e ai tiri salvezza su Forza. Gli attacchi effettuati dal bersaglio con armi ridotte o con colpi senz'armi infliggono 1d4 danni in meno se il colpo va a segno (i danni non possono scendere a meno di 1).",
  "save": "con"
 },
 {
  "id": "invisibility",
  "name": "Invisibilità",
  "nameEn": "Invisibility",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un ciglio in uno strato di resina)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura toccata dall'incantatore diventa invisibile fino al termine dell'incantesimo. L'incantesimo termina immediatamente quando il bersaglio effettua un tiro per colpire, infligge danni o lancia un incantesimo.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 2º."
 },
 {
  "id": "flame-blade",
  "name": "Lama infuocata",
  "nameEn": "Flame Blade",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V, S, M (una foglia di sommacco)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "sorcerer"
  ],
  "description": "L'incantatore evoca una lama infuocata nella sua mano libera. La lama ha forma e dimensioni simili a una scimitarra e permane per la durata dell'incantesimo. Se l'incantatore la lascia cadere, la lama scompare, ma può essere evocata di nuovo come azione bonus.\nCome azione di Magia, l'incantatore può effettuare un attacco in mischia con la lama infuocata. Se il colpo va a segno, il bersaglio subisce 3d6 danni da fuoco più il modificatore di caratteristica da incantatore dell'incantatore.\nLa lama infuocata emana luce intensa in un raggio di 3 metri e luce fioca per ulteriori 3 metri.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 2º.",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "fire",
   "addMod": true,
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "levitate",
  "name": "Levitazione",
  "nameEn": "Levitate",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (una molla in metallo)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una creatura o un oggetto a scelta dell'incantatore, situato entro gittata e che egli è in grado di vedere, si solleva verticalmente fino a 6 metri rimanendo sospeso per la durata dell'incantesimo. L'incantesimo può far levitare un oggetto che pesa fino a 250 kg. Una creatura non consenziente che supera un tiro salvezza su Costituzione non subisce l'effetto dell'incantesimo.\nIl bersaglio può muoversi soltanto spingendosi o aggrappandosi a un oggetto fisso o a una superficie entro portata (come per esempio una parete o un soffitto), che gli permetta di muoversi come se ne stesse scalando la superficie. Nel proprio turno, l'incantatore può variare l'altitudine del bersaglio per un massimo di 6 metri in ogni direzione. Se il bersaglio è l'incantatore stesso, può muoversi verso l'alto o verso il basso come parte del suo movimento. Altrimenti, l'incantatore può usare la sua azione di Magia per muovere il bersaglio, che deve rimanere entro gittata.\nIl bersaglio, se è ancora sospeso, al termine dell'incantesimo fluttua dolcemente fino a terra.",
  "save": "con"
 },
 {
  "id": "locate-animals-or-plants",
  "name": "Localizza animali o vegetali",
  "nameEn": "Locate Animals or Plants",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un ciuffo di peli di un segugio)",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "bard",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore descrive o nomina un tipo specifico di bestia o creatura vegetale, oppure un vegetale non magico. Apprende la direzione e la distanza fino alla creatura o al vegetale di quel tipo più vicino entro 7,5 chilometri, se ne è presente almeno uno."
 },
 {
  "id": "locate-object",
  "name": "Localizza oggetto",
  "nameEn": "Locate Object",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un ramoscello biforcuto)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore descrive o nomina un oggetto a lui familiare, percependo la direzione della sua ubicazione se l'oggetto si trova entro 300 metri da lui. Se l'oggetto è in movimento, l'incantatore apprende verso quale direzione si sta dirigendo.\nL'incantesimo può localizzare un oggetto specifico noto all'incantatore, purché l'abbia visto da vicino (entro 9 metri) almeno una volta. In alternativa, può localizzare l'oggetto di un tipo particolare più vicino, come per esempio un certo tipo di veste, gioiello, mobile, strumento o arma.\nQuesto incantesimo non può localizzare un oggetto se uno strato di piombo blocca il percorso diretto tra esso e l'incantatore."
 },
 {
  "id": "spider-climb",
  "name": "Movimenti del ragno",
  "nameEn": "Spider Climb",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (una goccia di bitume e un ragno)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Fino al termine dell'incantesimo, una creatura consenziente toccata dall'incantatore ottiene la capacità di muoversi verticalmente e orizzontalmente su pareti e soffitti, mantenendo le mani libere. Il bersaglio ottiene anche una velocità di scalata pari alla sua velocità.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 2º."
 },
 {
  "id": "darkness",
  "name": "Oscurità",
  "nameEn": "Darkness",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "carbone) V, M (pelo di pipistrello e un pezzo di",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, un'oscurità magica si estende da un punto entro gittata e riempie una sfera del raggio di 4,5 metri. Una creatura dotata di scurovisione non è in grado di vedere attraverso di essa e la luce non magica non può illuminarla.\nIn alternativa, l'incantatore lancia l'incantesimo su un oggetto che non sia indossato o trasportato, facendo sì che l'oscurità riempia un'emanazione di 4,5 metri di cui l'oggetto è il punto di origine. Coprire l'oggetto con qualcosa di opaco, come una ciotola o un elmo, blocca l'oscurità.\nSe una parte dell'area di questo incantesimo si sovrappone a un'area di luce intensa o luce fioca creata da un incantesimo di 2º livello o inferiore, l'incantesimo che ha creato la luce viene dissolto."
 },
 {
  "id": "pass-without-trace",
  "name": "Passare senza tracce",
  "nameEn": "Pass without Trace",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (ceneri di vischio bruciato)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore irradia un'aura occultante in un'emanazione di 9 metri per la durata dell'incantesimo. Finché si trovano nell'aura, l'incantatore e ogni creatura a sua scelta ricevono un bonus di +10 alle prove di Destrezza (Furtività) e non lasciano tracce."
 },
 {
  "id": "misty-step",
  "name": "Passo velato",
  "nameEn": "Misty Step",
  "level": 2,
  "school": "conjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore è avvolto per un istante da una foschia argentata e si teletrasporta di un massimo di 9 metri fino a uno spazio libero che è in grado di vedere."
 },
 {
  "id": "barkskin",
  "name": "Pelle coriacea",
  "nameEn": "Barkskin",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Contatto",
  "components": "V, S, M (un pezzo di corteccia)",
  "duration": "1 ora",
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura consenziente. Fino al termine dell'incantesimo, la pelle del bersaglio assume l'aspetto della corteccia. Inoltre, il bersaglio ha una Classe Armatura di 17 se la sua CA è inferiore a tale valore."
 },
 {
  "id": "prayer-of-healing",
  "name": "Preghiera di guarigione",
  "nameEn": "Prayer of Healing",
  "level": 2,
  "school": "abjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "9 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "Fino a cinque creature a scelta dell'incantatore, situate entro gittata per l'intera durata del lancio dell'incantesimo, ottengono i benefici di un riposo breve e recuperano 2d8 punti ferita. Una creatura non può essere nuovamente influenzata da questo incantesimo fino a che non completa un riposo lungo.",
  "higherLevels": "La guarigione aumenta di 1d8 per ogni slot di livello superiore al 2º."
 },
 {
  "id": "augury",
  "name": "Presagio",
  "nameEn": "Augury",
  "level": 2,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (bastoncini, ossa, carte o altri oggetti da divinazione dotati di contrassegni speciali, del valore di 25 mo o più)",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "L'incantatore riceve un presagio da un'entità ultraterrena sui risultati di un corso d'azione che intende effettuare nei prossimi 30 minuti. Il GM sceglie il presagio dalla tabella Presagi.\nPresagi\nPresagio | Con risultati...\nVentura | Positivi\nSventura | Negativi\nVentura e sventura | Positivi e negativi\nIndifferenza | Né positivi né negativi\nL'incantesimo non tiene conto delle circostanze, come altri incantesimi, che potrebbero modificare i risultati.\nSe l'incantatore lancia l'incantesimo più volte prima di completare un riposo lungo, esiste una probabilità cumulativa del 25% di non ottenere risposta per ogni lancio dopo il primo."
 },
 {
  "id": "protection-from-poison",
  "name": "Protezione dai veleni",
  "nameEn": "Protection from Poison",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura e pone fine alla condizione avvelenato che la affligge. Per la durata dell'incantesimo, il bersaglio dispone di vantaggio ai tiri salvezza eseguiti per evitare o terminare la condizione avvelenato, ed è resistente ai danni da veleno."
 },
 {
  "id": "shining-smite",
  "name": "Punizione splendente",
  "nameEn": "Shining Smite",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione bonus che l'incantatore effettua subito dopo aver colpito una creatura con un'arma da mischia o con un colpo senz'armi",
  "timing": "bonus",
  "range": "Incantatore",
  "components": "V",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "paladin"
  ],
  "description": "L'attacco infligge 2d6 danni radiosi extra al bersaglio. Fino al termine dell'incantesimo, il bersaglio proietta luce intensa in un raggio di 1,5 metri, non può beneficiare della condizione di invisibilità e i tiri per colpire contro di esso dispongono di vantaggio.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 2º.",
  "roll": {
   "kind": "damage",
   "dice": "2d6",
   "damageType": "radiant",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "ray-of-enfeeblement",
  "name": "Raggio di affaticamento",
  "nameEn": "Ray of Enfeeblement",
  "level": 2,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "warlock"
  ],
  "description": "Un raggio di energia logorante scaturisce dall'incantatore verso una creatura entro gittata. Il bersaglio deve effettuare un tiro salvezza su Costituzione. In caso di successo, fino all'inizio del turno successivo dell'incantatore, il bersaglio subisce svantaggio al suo tiro per colpire successivo.\nIn caso di fallimento, il bersaglio subisce svantaggio alle prove con d20 basate sulla Forza per la durata dell'incantesimo. Durante questo periodo, sottrae anche 1d8 da tutti i suoi tiri per i danni. Alla fine di ogni suo turno, il bersaglio ripete il tiro salvezza e, se lo supera, termina l'incantesimo.",
  "save": "con"
 },
 {
  "id": "scorching-ray",
  "name": "Raggio rovente",
  "nameEn": "Scorching Ray",
  "level": 2,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore lancia tre raggi di fuoco contro uno o più bersagli entro gittata. Con questo incantesimo, l'incantatore effettua un attacco a distanza per ogni raggio. Se il colpo va a segno, il bersaglio subisce 2d6 danni da fuoco.",
  "higherLevels": "L'incantatore crea un raggio aggiuntivo per ogni slot di livello superiore al 2º.",
  "roll": {
   "kind": "damage",
   "dice": "2d6",
   "damageType": "fire"
  }
 },
 {
  "id": "web",
  "name": "Ragnatela",
  "nameEn": "Web",
  "level": 2,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un frammento di ragnatela comune)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore evoca un ammasso di ragnatele appiccicose in un punto entro gittata, che riempiono un cubo con spigolo di 6 metri per la durata dell'incantesimo. Le ragnatele contano come terreno difficile e l'area al loro interno e leggermente oscurata.\nSe le ragnatele non sono ancorate tra due masse solide (per esempio pareti o alberi) o stese su un pavimento, un muro o un soffitto, collassano su se stesse e l'incantesimo termina all'inizio del turno successivo dell'incantatore. Le ragnatele stese su una superficie piatta hanno una profondità di 1,5 metri.\nLa prima volta che una creatura vi entra in un turno o inizia lì il suo turno, deve superare un tiro salvezza su Destrezza, altrimenti sarà trattenuta finché sarà al loro interno o non si libera.\nUna creatura trattenuta dalle ragnatele può usare la un'azione per effettuare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo. Se supera la prova, non è più trattenuta.\nLe ragnatele sono infiammabili. Un cubo di ragnatele con spigolo di 1,5 metri brucia in 1 round, infliggendo 2d4 danni da fuoco a ogni creatura che inizi il suo turno tra le fiamme.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "2d4",
   "damageType": "fire"
  }
 },
 {
  "id": "gentle-repose",
  "name": "Riposo inviolato",
  "nameEn": "Gentle Repose",
  "level": 2,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (2 monete di rame, che l'incante- simo consuma)",
  "duration": "10 giorni",
  "ritual": true,
  "lists": [
   "cleric",
   "wizard",
   "paladin"
  ],
  "description": "L'incantatore tocca un cadavere o altri resti. Per la durata dell'incantesimo, il bersaglio è protetto dalla decomposizione e non può diventare un non morto.\nInoltre, l'incantesimo estende il limite di tempo entro cui rianimare il bersaglio dalla morte, in quanto i giorni trascorsi sotto l'influenza di questo incantesimo non contano al fine di determinare il limite di tempo di incantesimi come rianimare morti."
 },
 {
  "id": "heat-metal",
  "name": "Riscaldare il metallo",
  "nameEn": "Heat Metal",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un pezzo di ferro e una fiamma)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "druid"
  ],
  "description": "L'incantatore sceglie un oggetto lavorato in metallo, come un'arma in metallo o un'armatura di metallo media o pesante entro gittata che egli è in grado di vedere e la rende incandescente. Qualsiasi creatura a contatto fisico con l'oggetto subisce 2d8 danni da fuoco al momento del lancio dell'incantesimo. Fino al termine dell'incantesimo, l'incantatore può effettuare un'azione bonus in ognuno dei suoi turni successivi per infliggere di nuovo i danni se l'oggetto si trova entro gittata. l'oggetto e ne subisce i danni, deve superare un Se una creatura sta stringendo o indossando tiro salvezza su Costituzione o, se possibile, lasciar cadere l'oggetto. Se non lascia cadere l'oggetto, il bersaglio subisce svantaggio ai tiri per colpire e alle prove di caratteristica effettuati prima dell'inizio del turno successivo dell'incantatore.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 2º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "fire",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "lesser-restoration",
  "name": "Ristorare inferiore",
  "nameEn": "Lesser Restoration",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura e pone fine a una delle condizioni che la affligge tra: accecato, assordato, avvelenato o paralizzato."
 },
 {
  "id": "knock",
  "name": "Scassinare",
  "nameEn": "Knock",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore sceglie un oggetto entro gittata che egli è in grado di vedere. Può trattarsi di una porta, uno scrigno, un forziere, un paio di manette, un lucchetto o un altro oggetto dotato di un mezzo normale o magico per la chiusura.\nUn bersaglio tenuto chiuso da una normale serratura, incastrato o sbarrato, cessa di essere tale. Se l'oggetto è protetto da più serrature, con questo incantesimo se ne sblocca soltanto una.\nSe il bersaglio è tenuto chiuso da Serratura Arcana, quell'incantesimo è soppresso per 10 minuti, nel corso dei quali l'oggetto può essere aperto e chiuso.\nQuando l'incantatore lancia l'incantesimo, si percepisce un forte rumore simile al bussare proveniente dal bersaglio, udibile fino a una distanza di 90 metri."
 },
 {
  "id": "find-traps",
  "name": "Scopri trappole",
  "nameEn": "Find Traps",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore percepisce qualsiasi trappola piazzata entro gittata e nel suo campo visivo. Ai fini di questo incantesimo, per trappola si intende qualsiasi oggetto o meccanismo creato per provocare danni o altri pericoli. Pertanto, l'incantesimo è in grado di percepire gli incantesimi allarme o glifo di interdizione, o una fossa meccanica nascosta, ma non di rivelare un cedimento naturale del pavimento, un soffitto instabile o una voragine nascosta.\nQuesto incantesimo rivela la presenza di una trappola ma non la sua ubicazione. L'incantatore scopre solo la natura generale del pericolo che la trappola pone."
 },
 {
  "id": "darkvision",
  "name": "Scurovisione",
  "nameEn": "Darkvision",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (una carota essiccata)",
  "duration": "8 ore",
  "lists": [
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, una creatura consenziente toccata dall'incantatore è dotata di scurovisione fino a 45 metri."
 },
 {
  "id": "arcane-lock",
  "name": "Serratura arcana",
  "nameEn": "Arcane Lock",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere d'oro del valore di 25 mo o più, che viene consumata dall'incantesimo)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard"
  ],
  "description": "Toccando una porta, una finestra, un cancello, un contenitore o una botola, l'oggetto viene sigillato magicamente per la durata dell'incantesimo. L'oggetto non può essere aperto tramite mezzi non magici. L'incantatore e le creature da lui designate al momento del lancio dell'incantesimo possono aprire e chiudere l'oggetto nonostante la serratura. L'incantatore può anche stabilire una parola d'ordine che, una volta pronunciata entro 1,5 metri dall'oggetto, lo mantiene aperto per 1 minuto."
 },
 {
  "id": "flaming-sphere",
  "name": "Sfera infuocata",
  "nameEn": "Flaming Sphere",
  "level": 2,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (una pallina di cera)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea una sfera di fuoco del diametro di 1,5 metri in uno spazio libero del terreno entro gittata che permane per la durata dell'incantesimo. Ogni creatura che termina il suo turno entro 1,5 metri dalla sfera effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 2d6 danni da fuoco, mentre se lo supera subisce soltanto la metà di quei danni.\nCome azione bonus, l'incantatore può muovere la sfera per un massimo di 9 metri, facendola rotolare sul terreno. Se l'incantatore muove la sfera nello spazio di una creatura, quella creatura effettua un tiro salvezza contro la sfera, che smette di muoversi per quel turno.\nQuando l'incantatore muove la sfera, può dirigerla oltre le barriere alte fino a 1,5 metri e farla saltare oltre le fosse larghe fino a 3 metri. Se tocca oggetti infiammabili che non sono indossati o trasportati, la sfera li incendia proiettando luce intensa entro un raggio di 6 metri e luce fioca per altri 6 metri.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 2º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "2d6",
   "damageType": "fire",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "blur",
  "name": "Sfocatura",
  "nameEn": "Blur",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Il corpo dell'incantatore diventa sfocato. Per la durata dell'incantesimo, tutte le creature subiscono svantaggio ai tiri per colpire contro l'incantatore. Un attaccante è immune a questo effetto se percepisce l'incantatore con vista cieca o vista pura."
 },
 {
  "id": "silence",
  "name": "Silenzio",
  "nameEn": "Silence",
  "level": 2,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "ritual": true,
  "lists": [
   "bard",
   "cleric",
   "ranger"
  ],
  "description": "L'incantatore genera una sfera del raggio di 6 metri centrata su un punto a sua scelta situato entro gittata e, per la durata dell'incantesimo, nessun suono può essere creato all'interno di quella sfera o attraversarla. Ogni creatura o oggetto interamente all'interno della sfera è immune ai danni da tuono e ogni creatura interamente all'interno della sfera è assordata. All'interno dell'area è impossibile lanciare un incantesimo che includa una componente verbale."
 },
 {
  "id": "dragons-breath",
  "name": "Soffio del drago",
  "nameEn": "Dragon’s Breath",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "Contatto",
  "components": "V, S, M (un peperoncino)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tocca una creatura consenziente e sceglie acido, freddo, fulmine, fuoco, o veleno. Fino al termine dell'incantesimo, il bersaglio può usare la sua azione di Magia per esalare un cono di 4,5 metri. Ogni creatura nell'area effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 3d6 danni del tipo scelto, mentre se lo supera subisce la metà di quei danni.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 2º.",
  "save": "dex"
 },
 {
  "id": "suggestion",
  "name": "Suggestione",
  "nameEn": "Suggestion",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, M (una goccia di miele)",
  "duration": "Concentrazione, fino a 8 ore",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore suggerisce un corso d'azione da intraprendere (descritto con non più di 25 parole) a una creatura entro gittata che egli è in grado di vedere. Le creature devono essere in grado di comprendere l'incantatore. Il suggerimento deve apparire realizzabile e non deve comportare nulla che infligga palesemente danni al bersaglio o ai suoi alleati. Per esempio, l'incantatore potrebbe dire \"Prendi la chiave per il caveau del tesoro della setta e portamela\". Oppure \"Smetti di combattere, esci dalla biblioteca pacificamente e non tornare mai più\".\nIl bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane affascinato per la durata dell'incantesimo o finché l'incantatore o i suoi alleati non gli infliggono danni. Il bersaglio affascinato segue il suggerimento al meglio delle sue capacità. L'attività suggerita può continuare per l'intera durata, ma se può essere completata in un tempo più breve, l'incantesimo termina e non ha più effetto sul bersaglio una volta portata a termine.",
  "save": "wis"
 },
 {
  "id": "find-steed",
  "name": "Trova cavalcatura",
  "nameEn": "Find Steed",
  "level": 2,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "paladin"
  ],
  "description": "L'incantatore evoca un essere ultraterreno che appare come una cavalcatura forte e fedele in uno spazio libero a scelta dell'incantatore entro gittata. Questa creatura usa la scheda delle statistiche della cavalcatura ultraterrena. Se l'incantatore possiede già una cavalcatura evocata con questo incantesimo, essa viene sostituita da quella nuova.\nLa cavalcatura ha l'aspetto di un animale di taglia Grande a scelta dell'incantatore, per esempio un cavallo, un cammello, un lupo feroce o un alce. Ogni volta che l'incantatore lancia l'incantesimo, sceglie il tipo di creatura della cavalcatura (celestiale, folletto o immondo) e questa scelta determina i tratti e la scheda delle statistiche della creatura.\n**Combattimento.** La cavalcatura diventa un alleato per l'incantatore e i suoi alleati. In combattimento, ha lo stesso punteggio di iniziativa dell'incantatore, il quale può salirci in sella e guidarla come se fosse una cavalcatura controllata (come descritto nelle regole riguardanti il combattimento in sella). Se l'incantatore è incapacitato, la cavalcatura inizia il suo turno subito dopo quello dell'incantatore: la creatura è indipendente e si concentra sul proteggere l'incantatore.\n**Scomparsa della cavalcatura.** La cavalcatura scompare quando scende a 0 punti ferita o se l'incantatore muore. Quando scompare, nello spazio che occupava in precedenza lascia qualsiasi oggetto stesse indossando o trasportando. Lanciando nuovamente l'incantesimo, l'incantatore può scegliere se evocare la cavalcatura scomparsa o una diversa.",
  "higherLevels": "Usa il livello dello slot incantesimo relativo al livello dell'incantesimo nella scheda delle statistiche.\nCavalcatura ultraterrena\nCelestiale Grande, folletto o immondo (a scelta\ndell'incantatore), neutrale\nCA 10 + 1 per livello dell'incantesimo\nPF 5 + 10 per livello dell'incantesimo (la cavalcatura\nha un numero di Dadi Vita [d10] pari al livello\ndell'incantesimo)\nVelocità 18 m, volo 18 m (richiede incantesimo di\n4º livello o superiore)\nMOD SALV | MOD SALV | MOD SALV\nF | or | 18 | +4 +4 | D | es | 12 +1 +1 | C | os | 14 | +2 +2\nI | nt | 6 | −2 −2 | C | ar | 8 | −1 −1\nSensi Percezione passiva 11\nLingue telepatia 1,5 km (funziona solo con l'incantatore)\nGS nessuno (PE 0; BC pari al bonus di competenza del\npersonaggio)\nTratti\nLegame vitale. Quando l'incantatore recupera punti\nferita grazie a un incantesimo di 1º livello o superiore,\nla cavalcatura recupera la stessa quantità di punti ferita\nse l'incantatore si trova entro 1,5 metri da essa.\nAzioni\nSchianto ultraterreno. Tiro per colpire in mischia:\nil bonus equivale al modificatore di attacco dell'incan-\ntesimo del personaggio, portata di 1,5 m Colpito: 1d8\npiù il livello dell'incantesimo danni radiosi (celestiale),\ndanni psichici (folletto) o danni necrotici (immondo).\nAzioni bonus\nPasso fatato (solo folletto; ricarica dopo un riposo\nlungo). La cavalcatura si teletrasporta, insieme al suo\ncavaliere, in un uno spazio libero a scelta del personag-\ngio situato a 18 metri da sé.\nSguardo letale (solo immondo; ricarica dopo un\nriposo lungo). Tiro salvezza su Saggezza: La CD è pari | s | ag | 12 +1 +1\nalla CD del tiro salvezza sull'incantesimo, una creatura\nentro 18 metri che la cavalcatura è in grado di vedere.\nFallimento: Il bersaglio è spaventato fino al termine del\nturno successivo dell'incantantore.\nTocco guaritore (solo celestiale; ricarica dopo un\nriposo lungo). Una creatura entro 1,5 metri dalla caval-\ncatura recupera un numero di punti ferita pari a 2d8\npiù il livello dell'incantesimo."
 },
 {
  "id": "rope-trick",
  "name": "Trucco della corda",
  "nameEn": "Rope Trick",
  "level": 2,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un pezzo di corda)",
  "duration": "1 ora",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore tocca una corda: un'estremità fluttua verso l'alto finché la corda non pende perpendicolarmente al terreno oppure raggiunge il soffitto. All'estremità superiore della corda, si apre un portale invisibile (che misura 90 centimetri per 1,5 metri) verso uno spazio extradimensionale che permane fino al termine dell'incantesimo. È possibile raggiungere questo spazio arrampicandosi in cima alla corda, la quale può essere ritratta al suo interno o lasciata cadere fuori di esso.\nLo spazio può contenere un massimo di otto creature di taglia Media o inferiore. Attacchi, incantesimi e altri effetti non possono attraversare in entrata o in uscita lo spazio, ma le creature al suo interno possono vedere attraverso il portale. Tutto ciò che si trova all'interno dello spazio cade all'esterno al termine dell'incantesimo."
 },
 {
  "id": "see-invisibility",
  "name": "Vedere invisibilità",
  "nameEn": "See Invisibility",
  "level": 2,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un pizzico di talco)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore è in grado di vedere le creature e gli oggetti invisibili e proiettare la sua vista sul Piano Etereo. Le creature e gli oggetti appaiono spettrali."
 },
 {
  "id": "warding-bond",
  "name": "Vincolo di interdizione",
  "nameEn": "Warding Bond",
  "level": 2,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un paio di anelli di platino del valore di 50 mo o più, che l'incantatore e il bersaglio devono indossare per la durata dell'incantesimo)",
  "duration": "1 ora",
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore tocca un'altra creatura consenziente e crea un collegamento mistico tra sé e il bersaglio fino al termine dell'incantesimo. Finché il bersaglio si trova entro 18 metri dall'incantatore, ottiene un bonus di +1 alla CA e ai tiri salvezza e dispone di resistenza a tutti i danni. Inoltre, ogni volta che subisce danni, l'incantatore ne subisce la stessa quantità.\nL'incantesimo termina se l'incantatore scende a 0 punti ferita, se lui e il bersaglio si allontanano di più di 18 metri o se l'incantesimo viene lanciato di nuovo su una delle due creature collegate."
 },
 {
  "id": "zone-of-truth",
  "name": "Zona di verità",
  "nameEn": "Zone of Truth",
  "level": 2,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "10 minuti",
  "lists": [
   "bard",
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore crea una zona magica che protegge dagli inganni all'interno di una sfera del raggio di 4,5 metri, centrata su un punto entro gittata. Fino al termine dell'incantesimo, una creatura che entra nell'area dell'incantesimo per la prima volta in un turno o che inizia qui il suo turno effettua un tiro salvezza su Carisma. Se lo fallisce, non può mentire deliberatamente mentre si trova nell'area. L'incantatore sa se il bersaglio supera o meno il tiro salvezza. dell'incantesimo e può evitare di rispondere alle Una creatura influenzata è consapevole domande a cui normalmente risponderebbe mentendo. In tal caso, deve essere evasiva, ma sincera.",
  "save": "cha"
 },
 {
  "id": "animate-dead",
  "name": "Animare morti",
  "nameEn": "Animate Dead",
  "level": 3,
  "school": "necromancy",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "3 metri",
  "components": "V, S, M (una goccia di sangue, un pezzo di carne e un pizzico di polvere d'osso)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore sceglie una pila di ossa o un cadavere umanoide di taglia Media o Piccola entro gittata, animandolo come creatura non morta. Il bersaglio si trasforma in uno scheletro se l'incantatore sceglie la pila di ossa, o in uno zombi se l'incantatore sceglie un cadavere (vedi \"Mostri\" per le schede delle statistiche).\nA ogni suo turno, l'incantatore può effettuare un'azione bonus per comandare mentalmente qualsiasi creatura creata con questo incantesimo, a patto che si trovi entro 18 metri da lui (se controlla varie creature, l'incantatore può comandarne più di una allo stesso momento, impartendo lo stesso comando a ciascuna di loro). L'incantatore decide quale azione effettuerà la creatura e dove si muoverà nel suo turno successivo, oppure può impartirle un comando generale, come restare a guardia di una stanza o un di corridoio. Se invece non impartisce alcun comando, la creatura effettua l'azione Schivata e si sposta solo per evitare di subire danni. Una volta ricevuto un ordine, la creatura continua a seguirlo finché non ha portato a termine il compito.\nLa creatura rimane sotto il controllo dell'incantatore per 24 ore, passate le quali smette di obbedire a qualsiasi comando ulteriore. Per mantenere il controllo sulla creatura per altre 24 ore, l'incantatore deve lanciare di nuovo questo incantesimo su di essa prima che l'attuale periodo di 24 ore termini. Questo uso dell'incantesimo gli permette di ristabilire il controllo su un massimo di quattro creature da lui animate tramite questo incantesimo, anziché animarne una nuova.",
  "higherLevels": "L'incantatore anima due creature non morte aggiuntive o ristabilisce il controllo su di esse per ogni slot incantesimo di livello superiore al 3º. Ognuna delle creature deve provenire da un diverso cadavere o mucchio d'ossa."
 },
 {
  "id": "nondetection",
  "name": "Anti-individuazione",
  "nameEn": "Nondetection",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un pizzico di polvere di diamante del valore di 25 mo o più, che l'incantesimo consuma)",
  "duration": "8 ore",
  "lists": [
   "bard",
   "wizard",
   "ranger"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore nasconde agli incantesimi di divinazione un bersaglio da lui toccato. Il bersaglio può essere una creatura consenziente, oppure un luogo o un oggetto non più grande di 3 metri in qualsiasi dimensione. Il bersaglio non può essere preso di mira da alcun incantesimo di divinazione né percepito da sensori di scrutamento magico."
 },
 {
  "id": "water-walk",
  "name": "Camminare sull'acqua",
  "nameEn": "Water Walk",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un pezzo di sughero)",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "ranger",
   "sorcerer"
  ],
  "description": "Questo incantesimo conferisce la capacità di muoversi su una qualsiasi superficie liquida, come l'acqua, l'acido, il fango, la neve, le sabbie mobili o la lava, come se si trattasse di un innocuo terreno solido (ma le creature che attraversano un tratto di lava fusa possono comunque subire danni dal calore). Fino a dieci creature consenzienti entro gittata a scelta dell'incantatore ottengono questa capacità per la durata dell'incantesimo.\nUn bersaglio colpito deve usare un'azione bonus per passare dalla superficie del liquido all'interno del liquido stesso e viceversa, ma se il bersaglio cade dentro di esso passa attraverso la superficie nel liquido sottostante."
 },
 {
  "id": "tiny-hut",
  "name": "Capanna",
  "nameEn": "Tiny Hut",
  "level": 3,
  "school": "evocation",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (una perla di cristallo)",
  "duration": "8 ore",
  "ritual": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "Un'emanazione di 3 metri si materializza attorno all'incantatore e permane stazionaria per la durata dell'incantesimo. L'incantesimo fallisce quando dell'incantesimo. Può apparire 30 centimetri più l'incantatore lo lancia ma l'emanazione non è abbastanza grande da poter inglobare totalmente tutte le creature all'interno della sua area.\nLe creature e gli oggetti all'interno dell'emanazione al momento del lancio dell'incantesimo possono attraversarla liberamente, mentre a tutte le altre creature e oggetti è proibito. Non è possibile lanciare incantesimi di 3º livello o inferiore attraverso l'emanazione, e gli effetti di tali incantesimi non si estendono al suo interno.\nL'atmosfera all'interno dell'emanazione è gradevole e asciutta, a prescindere dal tempo atmosferico all'esterno. Fino al termine dell'incantesimo, l'incantatore può decidere che all'interno dell'emanazione ci sia luce fioca o oscurità (nessuna azione richiesta). Dall'esterno, l'emanazione appare opaca e di un qualsiasi colore a scelta dell'incantatore, ma dall'interno risulta trasparente.\nL'incantesimo termina in anticipo se l'incantatore lo lancia di nuovo o se esce dall'area dell'emanazione."
 },
 {
  "id": "magic-circle",
  "name": "Cerchio magico",
  "nameEn": "Magic Circle",
  "level": 3,
  "school": "abjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "3 metri",
  "components": "V, S, M (sale e polvere d'argento del valore di 100 mo o più, che l'incantesimo consuma)",
  "duration": "1 ora",
  "lists": [
   "cleric",
   "wizard",
   "paladin",
   "warlock"
  ],
  "description": "L'incantatore crea un cilindro di energia magica di 3 metri di raggio e 6 metri di altezza, centrato su un punto del terreno entro gittata che egli è in grado di vedere. Rune luminose appaiono nei punti in cui il cilindro si interseca con il pavimento o altre superfici.\nL'incantatore sceglie uno o più tra i tipi di creature seguenti: celestiali, elementali, folletti, immondi o non morti. Il cerchio influenza una creatura del tipo scelto nei seguenti modi:\n• La creatura non può entrare volontariamente nel cilindro tramite mezzi non magici. Se prova a utilizzare il teletrasporto o il viaggio interplanare, deve prima superare un tiro salvezza su Carisma.\n• La creatura subisce svantaggio ai tiri per colpire contro i bersagli all'interno del cilindro.\n• I bersagli all'interno del cilindro non possono essere posseduti, affascinati o spaventati dalla creatura. Ogni volta che lancia questo incantesimo, l'incantatore può far funzionare la sua magia nella direzione inversa, impedendo cioè a una creatura di un tipo specifico di uscire dal cilindro e proteggendo i bersagli all'esterno.",
  "higherLevels": "La durata aumenta di 1 ora per ogni slot di livello superiore al 3º.",
  "save": "cha"
 },
 {
  "id": "clairvoyance",
  "name": "Chiaroveggenza",
  "nameEn": "Clairvoyance",
  "level": 3,
  "school": "divination",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "1,5 chilometri",
  "components": "V, S, M (un focus del valore di 100 mo o più, a scelta tra un cornetto acustico incastonato di gemme o un occhio di vetro per la vista)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea un sensore invisibile entro gittata in un luogo a lui familiare (cioè che ha già visitato o visto), oppure in un luogo ovvio a lui non familiare (come per esempio dietro una porta, dietro un angolo o in un boschetto). Questo sensore intangibile e invulnerabile rimane in quella posizione per la durata dell'incantesimo.\nQuando lancia l'incantesimo, l'incantatore sceglie tra vista e udito, potendo utilizzare il senso scelto attraverso il sensore come se si trovasse nel suo spazio. Come azione bonus, l'incantatore può passare dalla vista all'udito e viceversa.\nUna creatura che vede il sensore (per esempio una creatura che beneficia di vedere invisibilità o vista pura) scorge una sfera luminosa grande quanto il pugno dell'incantatore."
 },
 {
  "id": "counterspell",
  "name": "Controincantesimo",
  "nameEn": "Counterspell",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Effettuare quando vede una creatura entro 18 metri reazione, che l'incantatore può da lui lanciare un incantesimo con componenti verbali, somatiche o materiali",
  "timing": "special",
  "range": "18 metri",
  "components": "S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore tenta di interrompere una creatura nell'atto di lanciare un incantesimo. La creatura effettua un tiro salvezza su Costituzione. Se lo fallisce, l'incantesimo si dissolve senza alcun effetto e l'azione, azione bonus o reazione utilizzata per lanciarlo viene sprecata. Se l'incantesimo è stato lanciato usando uno slot incantesimo, lo slot non viene consumato.",
  "save": "con"
 },
 {
  "id": "create-food-and-water",
  "name": "Creare cibo e acqua",
  "nameEn": "Create Food and Water",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore crea 22,5 chili di cibo e 120 litri d'acqua fresca sul terreno o all'interno di un contenitore entro gittata, utili per tenere lontani i rischi di malnutrizione e disidratazione. Il cibo è insipido ma nutriente e assomiglia a un alimento a scelta dell'incantatore; l'acqua è pulita. Il cibo marcisce dopo 24 ore se non viene consumato."
 },
 {
  "id": "plant-growth",
  "name": "Crescita vegetale",
  "nameEn": "Plant Growth",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione (Groviglio) o 8 ore (Fertilità)",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "druid",
   "ranger"
  ],
  "description": "Questo incantesimo incanala vitalità nei vegetali. Il tempo di lancio utilizzato dall'incantatore determina l'effetto che ha l'incantesimo tra i due descritti di seguito: Groviglio o Fertilità.\n**Groviglio.** L'incantatore sceglie un punto entro gittata e tutti i vegetali normali entro una sfera del raggio di 30 metri centrata su quel punto crescono rigogliosamente fino a formare un groviglio. Una creatura che si muove attraverso quell'area deve usare 1,2 metri di movimento per ogni 30 centimetri di cui si muove. L'incantatore può escludere dall'influenza dell'incantesimo una o più aree di qualsiasi dimensione all'interno dell'area scelta.\n**Fertilità.** Tutti i vegetali entro un raggio di 750 metri centrato in un punto entro gittata cresceranno rigogliosamente per 365 giorni e al momento del raccolto produrranno il doppio del cibo normale. I vegetali possono beneficiare di crescita vegetale solo una volta all'anno."
 },
 {
  "id": "phantom-steed",
  "name": "Destriero fantomatico",
  "nameEn": "Phantom Steed",
  "level": 3,
  "school": "illusion",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "wizard"
  ],
  "description": "Una creatura di taglia Grande, simile a un cavallo quasi reale, compare sul terreno in uno spazio libero entro gittata a scelta dell'incantatore. L'incantatore sceglie l'aspetto della creatura, che è dotata di sella, morso e briglie. Qualsiasi equipaggiamento creato dall'incantesimo svanisce in uno sbuffo di fumo se trasportato a più di 3 metri dal destriero.\nPer la durata dell'incantesimo, l'incantatore o una creatura a sua scelta può cavalcare il destriero, che usa la scheda delle statistiche del cavallo da galoppo (vedi \"Mostri\"), ma ha una velocità di 30 metri e può percorrere 20 chilometri in un'ora. Al termine dell'incantesimo, la cavalcatura svanisce gradualmente, dando al suo cavaliere 1 minuto per smontare. L'incantesimo termina in anticipo se la cavalcatura subisce danni."
 },
 {
  "id": "dispel-magic",
  "name": "Dissolvi magie",
  "nameEn": "Dispel Magic",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "paladin",
   "ranger",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore sceglie una creatura, un oggetto o un effetto magico situato entro gittata. Ogni incantesimo di 3º livello o inferiore presente sul bersaglio termina. Per ogni incantesimo di 4º livello o superiore presente sul bersaglio, l'incantatore effettua una prova di caratteristica usando la propria caratteristica da incantatore (CD 10 più il livello di quell'incantesimo). Se la prova viene superata, l'incantesimo termina.",
  "higherLevels": "L'incantatore termina automaticamente un incantesimo sul bersaglio se il livello di quell'incantesimo è pari o inferiore al livello dello slot incantesimo usato dall'incantatore."
 },
 {
  "id": "conjure-animals",
  "name": "Evoca animali",
  "nameEn": "Conjure Animals",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore evoca degli spiriti della natura che appaiono come un branco Grande di animali spettrali e intangibili in uno spazio libero entro gittata che l'incantatore è in grado di vedere. Il branco permane per la durata dell'incantesimo e l'incantatore può scegliere la forma animale assunta dagli spiriti, per esempio lupi, serpenti o uccelli.\nMentre si trova entro 1,5 metri dal branco, l'incantatore dispone di vantaggio ai tiri salvezza su Forza e, quando si muove nel suo turno, può spostare anche il branco fino a 9 metri in uno spazio libero che è in grado di vedere.\nOgni volta che il branco si muove entro 3 metri da una creatura che l'incantatore è in grado di vedere e ogni volta che una creatura che l'incantatore è in grado di vedere entra in uno spazio entro 3 metri dal branco o vi termina il suo turno, l'incantatore può costringerla a effettuare un tiro salvezza su Destrezza. In caso di fallimento, subisce 3d10 danni taglienti. Una creatura effettua questo tiro salvezza solo una volta per turno.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 3º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "3d10",
   "damageType": "slashing",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "beacon-of-hope",
  "name": "Faro di speranza",
  "nameEn": "Beacon of Hope",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore sceglie un qualsiasi numero di creature entro gittata. Per la durata dell'incantesimo, ogni bersaglio dispone di vantaggio ai tiri salvezza su Saggezza, ai tiri salvezza contro morte e recupera il numero massimo di punti ferita possibile da qualsiasi guarigione."
 },
 {
  "id": "meld-into-stone",
  "name": "Fondersi nella pietra",
  "nameEn": "Meld into Stone",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "8 ore",
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore entra in un oggetto o in una superficie di pietra sufficientemente grande da contenere il suo corpo, fondendosi con esso insieme al suo l'equipaggiamento per la durata dell'incantesimo. Per farlo, l'incantatore deve toccare la pietra, e nulla della sua presenza rimane visibile o individuabile da qualsiasi senso non magico.\nMentre è fuso nella pietra, l'incantatore non può vedere ciò che accade al di fuori e subisce svantaggio in qualsiasi prova di Saggezza (Percezione) effettuata per udire i suoni all'esterno. Rimane tuttavia cosciente del passare del tempo e può lanciare incantesimi su di sé. L'incantatore può usare 1,5 metri del suo movimento per uscire dalla pietra nel punto in cui è entrato, ponendo fine all'incantesimo; altrimenti, non può muoversi.\nEventuali danni fisici minori inflitti alla pietra non danneggiano l'incantatore, ma una distruzione parziale o un'alterazione nella forma (al punto da non contenerne più il corpo) provoca l'espulsione dell'incantatore, infliggendogli 6d6 danni da forza. La completa distruzione della pietra (o la sua trasmutazione in una sostanza differente) provoca l'espulsione dell'incantatore e gli infligge 50 danni da forza. Se l'incantatore viene espulso, cade a terra prono nello spazio libero più vicino al punto in cui era entrato.",
  "roll": {
   "kind": "damage",
   "dice": "6d6",
   "damageType": "force"
  }
 },
 {
  "id": "gaseous-form",
  "name": "Forma gassosa",
  "nameEn": "Gaseous Form",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un pezzo di garza)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura consenziente, toccata dall'incantatore, muta forma, insieme a tutto ciò che indossa o trasporta, trasformandosi in una nube fosca per la durata dell'incantesimo. L'effetto svanisce se il bersaglio scende a 0 punti ferita o se effettua un'azione di Magia per terminare l'incantesimo su di sé.\nMentre si trova in questa forma, una velocità di volo di 3 metri è l'unico metodo di movimento del bersaglio, che può fluttuare e può entrare nello spazio di un'altra creatura e occuparlo. Il bersaglio è resistente ai danni contundenti, perforanti e taglienti; è immune alla condizione prono; dispone di vantaggio ai tiri salvezza su Forza, Destrezza e Costituzione. Il bersaglio può passare attraverso aperture strette, tuttavia tratta i liquidi come fossero superfici solide.\nIl bersaglio non può parlare o manipolare oggetti e quelli che trasporta o impugna non possono essere lasciati cadere, usati o manipolati in alcun modo. Infine, il bersaglio non può attaccare o lanciare incantesimi.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 3º."
 },
 {
  "id": "lightning-bolt",
  "name": "Fulmine",
  "nameEn": "Lightning Bolt",
  "level": 3,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un ciuffo di pelo e una verga di cristallo)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Un fulmine parte dall'incantatore in una direzione a sua scelta, formando una linea lunga 30 metri e larga 1,5 metri. Ogni creatura sulla linea effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 8d6 danni da fulmine, mentre se lo supera subisce la metà dei danni.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 3º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "8d6",
   "damageType": "lightning",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "glyph-of-warding",
  "name": "Glifo di interdizione",
  "nameEn": "Glyph of Warding",
  "level": 3,
  "school": "abjuration",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (polvere di diamante del valore di 200 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto o innescato",
  "lists": [
   "bard",
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore traccia un glifo da cui, in seguito, si sprigionerà un effetto magico. Il glifo può essere tracciato su una superficie (come un tavolo o una sezione di pavimento) o, al fine di nasconderlo, all'interno di un oggetto che può essere chiuso (come un libro o un forziere). Il glifo può coprire un'area massima del diametro di 3 metri. Se la superficie o l'oggetto viene spostato per più di 3 metri dal punto in cui l'incantatore ha lanciato questo incantesimo, il glifo si infrange e l'incantesimo termina senza essere innescato.\nIl glifo è quasi impercettibile e, per notarlo, è necessario superare una prova di Saggezza (Percezione) contro la CD del tiro salvezza sull'incantesimo.\nQuando l'incantatore traccia il glifo, ne programma l'innesco e sceglie se si tratta di una runa esplosiva o di un glifo magico, come illustrato di seguito.\n**Programmare l'innesco.** Quando questo incantesimo viene lanciato, l'incantatore decide cosa innesca il glifo. Nel caso di glifi tracciati su una superficie, gli inneschi più comuni includono: toccare o camminare su di essi, rimuovere un altro oggetto che li copre o avvicinarsi a una certa distanza da loro. Nel caso di glifi tracciati all'interno di un oggetto, gli inneschi più comuni includono aprire quell'oggetto o vedere il glifo. Una volta che un glifo viene innescato, l'incantesimo termina.\nL'incantatore può perfezionare l'innesco in modo che venga attivato solo da un certo tipo di creature (ad esempio, il glifo potrebbe essere programmato per influenzare le aberrazioni). L'incantatore può inoltre impostare delle condizioni per evitare di innescare il glifo, come pronunciare una specifica parola d'ordine.\n**Runa esplosiva.** Quando attivato, il glifo esplode in una sfera di energia magica con raggio di 6 metri centrata su di esso. Ogni creatura presente nell'area effettua un tiro salvezza su Destrezza. In caso di fallimento, subisce 5d8 danni da acido, freddo, fulmine, fuoco o tuono (a scelta dell'incantatore al momento della creazione del glifo), o la metà dei danni in caso di successo.\n**Glifo magico.** L'incantatore può custodire un incantesimo preparato di 3º livello o inferiore all'interno del glifo lanciandolo come parte del suo processo di creazione. L'incantesimo deve avere come bersaglio una sola creatura o un'area. In questo modo, l'incantesimo custodito non ha effetto immediato, l'incantesimo ha un bersaglio, risulterà essere la ma ha effetto quando il glifo si attiva. Se creatura che ha attivato il glifo, mentre se influenza un'area, tale area sarà centrata su quella creatura. Se l'incantatore crea un glifo magico, può custodirvi oggetti o trappole dannose, ciò che viene evocato o creato appare nel punto più vicino possibile all'intruso e lo attacca. Se l'incantesimo richiede concentrazione, permane per tutta la sua durata.",
  "higherLevels": "I danni di una runa esplosiva aumentano di 1d8 per ogni slot di livello superiore al 3º. Se l'incantesimo evoca creature ostili oppure crea qualsiasi incantesimo di livello pari o inferiore a quello dello slot incantesimo usato per il glifo di interdizione.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "5d8",
   "damageType": "acid",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "spirit-guardians",
  "name": "Guardiani spirituali",
  "nameEn": "Spirit Guardians",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una pergamena con una preghiera)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "Degli spiriti protettori fluttuano attorno al personaggio in un'emanazione di 4,5 metri per la durata dell'incantesimo. Se l'incantatore è buono o neutrale, la loro forma spettrale appare angelica o fatata (a scelta dell'incantatore). Se è malvagio, appaiono con sembianze demoniache.\nQuando l'incantatore lancia questo incantesimo, può indicare le creature che non ne saranno influenzate. All'interno dell'emanazione, la velocità di ogni altra creatura è dimezzata e, ogni volta che una creatura entra nel suo spazio e viceversa, o ogni volta che vi termina lì il turno, dovrà effettuare un tiro salvezza su Saggezza. Se lo fallisce, subisce 3d8 danni radiosi (se l'incantatore è buono o neutrale) o 3d8 danni necrotici (se è malvagio), mentre se lo supera subisce soltanto la metà di quei danni. Una creatura effettua questo tiro salvezza solo una volta per turno.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 3º.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "3d8",
   "damageType": "radiant",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "major-image",
  "name": "Immagine maggiore",
  "nameEn": "Major Image",
  "level": 3,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un ciuffo di lana)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore crea l'immagine di un oggetto, una creatura o qualche altro fenomeno visibile che non sia più grande di un cubo con spigolo di 6 metri. L'immagine, apparendo in un punto situato entro gittata che l'incantatore è in grado di vedere, permane per la durata dell'incantesimo. L'immagine sembra reale e include temperature, suoni e odori appropriati all'elemento raffigurato, ma non può infliggere danni o causare condizioni. dell'immagine illusoria, può effettuare la sua azione Se l'incantatore si trova entro la gittata di Magia per fare in modo che l'immagine si muova fino a un qualsiasi altro punto entro gittata. Mentre l'immagine è in movimento, l'incantatore può alterarne l'aspetto in modo che i movimenti risultino naturali. Ad esempio, se l'incantatore crea l'immagine di una creatura e decide di farla muovere, può alterare l'immagine in modo da simulare che stia camminando. Analogamente, può fare in modo che l'illusione generi suoni diversi in momenti diversi, in modo da, per esempio, farle persino sostenere una conversazione.\nL'illusione può essere rivelata da un'interazione fisica, poiché è possibile passarle attraverso. Una creatura che effettua l'azione di Studio per esaminare l'immagine può determinare che si tratta di un'illusione superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se una creatura riconosce l'illusione per ciò che è, riesce a vedere attraverso l'immagine, di cui si attenuano le altre caratteristiche sensoriali.",
  "higherLevels": "L'incantesimo dura finché non viene dissolto, e non necessita di concentrazione, se viene lanciato con uno slot incantesimo 4º livello o superiore."
 },
 {
  "id": "blink",
  "name": "Intermittenza",
  "nameEn": "Blink",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "1 minuto",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tira 1d6 alla fine di ogni suo turno per la durata dell'incantesimo. Con un risultato di 4–6, l'incantatore svanisce dal piano di esistenza in cui si trova per riapparire sul Piano Etereo (l'incantesimo termina immediatamente se l'incantatore si trova già su quel piano). Mentre si trova sul Piano Etereo, l'incantatore può percepire il piano da cui proviene, che è proiettato in scala di grigi ed è visibile solo fino a una distanza di 18 metri. Può influenzare ed essere influenzato solo dalle creature che si trovano sul Piano Etereo, e le creature che si trovano sull'altro piano non possono percepirlo a meno che non abbiano una capacità speciale che consenta loro di percepire le cose sul Piano Etereo.\nL'incantatore fa ritorno sull'altro piano all'inizio del suo turno successivo e al termine dell'incantesimo se si trova sul Piano Etereo, tornando in uno spazio libero a propria scelta egli è in grado di vedere entro 3 metri dallo spazio che ha abbandonato. Se nessuno spazio libero è disponibile entro quella distanza, l'incantatore appare nello spazio libero più vicino."
 },
 {
  "id": "sending",
  "name": "Inviare",
  "nameEn": "Sending",
  "level": 3,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Illimitata",
  "components": "V, S, M (un filo di rame)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore invia un breve messaggio di un massimo di 25 parole a una creatura che ha incontrato o a una creatura che gli è stata descritta da qualcuno che ha conosciuto. Il bersaglio sente il messaggio nella sua mente, riconosce l'incantatore come colui che l'ha inviato e può rispondere immediatamente allo stesso modo. L'incantesimo consente ai bersagli di comprendere il significato del messaggio dell'incantatore.\nL'incantatore può inviare il messaggio a qualsiasi distanza e perfino ad altri piani di esistenza, ma se il bersaglio si trova su un piano di esistenza diverso dal suo, c'è una probabilità del 5% che il messaggio non arrivi. Se l'invio del messaggio fallisce, l'incantatore se ne rende conto.\nQuando riceve il messaggio, una creatura può bloccare la capacità dell'incantatore di contattarla nuovamente tramite questo incantesimo per 8 ore. Se l'incantatore cerca di inviare un altro messaggio durante quel periodo, capisce di essere stato bloccato e l'incantesimo fallisce."
 },
 {
  "id": "call-lightning",
  "name": "Invocare il fulmine",
  "nameEn": "Call Lightning",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "Una nube di tempesta appare in un punto situato entro gittata che l'incantatore è in grado di vedere sopra di sé. Ha la forma di un cilindro alto 3 metri con un raggio di 18 metri.\nQuando lancia questo incantesimo, l'incantatore sceglie un punto che è in grado di vedere al di sotto della nube, dove si abbatte un fulmine originato da essa. Ogni creatura entro un raggio di 1,5 metri da quel punto effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 3d10 danni da fulmine, mentre se lo supera subisce la metà di quei danni.\nFino al termine dell'incantesimo, l'incantatore può effettuare un'azione di Magia per richiamare il fulmine in questo modo, bersagliando lo stesso punto o un punto diverso.\nSe l'incantatore lancia questo incantesimo mentre si trova all'aperto durante una tempesta, l'incantesimo permette di controllare quella tempesta invece di crearne una nuova. In queste condizioni, i danni provocati dall'incantesimo aumentano di 1d10.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 3º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "3d10",
   "damageType": "lightning",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "slow",
  "name": "Lentezza",
  "nameEn": "Slow",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (una goccia di melassa)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore altera il tempo intorno a un massimo di sei creature a sua scelta all'interno in un cubo con spigolo di 12 metri entro gittata. Ogni bersaglio deve superare un tiro salvezza su Saggezza, altrimenti è influenzato da questo incantesimo per tutta la sua durata.\nUn bersaglio influenzato subisce una penalità di −2 alla CA e ai tiri salvezza su Destrezza, non può effettuare reazioni e la sua velocità è dimezzata. Quando è il suo turno, può effettuare un'azione o un'azione bonus, non entrambe. Inoltre, se sceglie di eseguire l'azione di Attacco, può sferrare un solo attacco. Se lancia un incantesimo con una componente somatica, ha una probabilità di fallimento del 25%, poiché l'incantatore effettua troppo lentamente i movimenti necessari al lancio.\nInoltre, ripeterà il tiro salvezza alla fine di ogni suo turno. Se lo supera, l'incantesimo svanisce.",
  "save": "wis"
 },
 {
  "id": "tongues",
  "name": "Linguaggi",
  "nameEn": "Tongues",
  "level": 3,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, M (una ziggurat in miniatura)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Questo incantesimo concede alla creatura toccata dall'incantatore l'abilità di comprendere qualsiasi lingua (parlata o non) che sente o vede. Inoltre, quando comunica con parole o gesti, qualsiasi creatura che conosce almeno una lingua può comprenderla se è in grado di sentire ciò che dice o vedere i suoi gesti."
 },
 {
  "id": "daylight",
  "name": "Luce diurna",
  "nameEn": "Daylight",
  "level": 3,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "cleric",
   "druid",
   "paladin",
   "ranger",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, un fascio di luce solare si sprigiona da un punto entro gittata e riempie una sfera del raggio di 18 metri. L'area della luce solare emette luce intensa e poi luce fioca per ulteriori 18 metri.\nIn alternativa, l'incantatore lancia l'incantesimo su un oggetto che non sia indossato o trasportato, facendo sì che la luce solare riempia un'emanazione di 18 metri di cui l'oggetto è il punto di origine. Coprire l'oggetto con qualcosa di opaco, come una ciotola o un elmo, blocca la luce solare.\nSe una parte dell'area di questo incantesimo si sovrappone a un'area di oscurità creata da un incantesimo di 3º livello o inferiore, l'incantesimo che ha creato la luce viene dissolto."
 },
 {
  "id": "wind-wall",
  "name": "Muro di vento",
  "nameEn": "Wind Wall",
  "level": 3,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un ventaglio e una piuma)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "Un muro di vento forte si solleva dal terreno in un punto a scelta dell'incantatore situato entro gittata. Il muro può essere lungo fino a 15 metri, alto 4,5 metri e spesso 30 cm. L'incantatore può modellarlo nel modo che preferisce, purché formi un percorso continuo lungo il terreno. Il muro permane per tutta la durata dell'incantesimo.\nQuando appare, ogni creatura nell'area effettua un tiro salvezza su Forza, subendo 4d8 danni contundenti in caso di fallimento o la metà dei danni in caso di successo.\nIl vento forte tiene lontani fumo, nebbia e altri gas. Le creature o gli oggetti volanti di taglia Piccola o inferiore non possono passare attraverso il muro e i materiali leggeri, non fissati in qualche modo, volano verso l'alto una volta portati al suo interno. Frecce, quadrelli e altri proiettili ordinari lanciati contro bersagli dietro il muro vengono deviati verso l'alto e mancano automaticamente il bersaglio (i macigni scagliati dai giganti o dalle macchine d'assedio e altri proiettili simili non sono influenzati dal muro). Inoltre, le creature in forma gassosa non possono attraversarlo.",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "4d8",
   "damageType": "bludgeoning"
  }
 },
 {
  "id": "stinking-cloud",
  "name": "Nube maleodorante",
  "nameEn": "Stinking Cloud",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (un uovo marcio)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore genera una sfera di gas nauseante giallastro del raggio di 6 metri centrata su un punto entro gittata. La nube è pesantemente oscurata e rimane attiva per la durata dell'incantesimo o finché un vento forte (come quello creato da folata di vento) non la disperde.\nOgni creatura che inizi il proprio turno all'interno della sfera deve superare un tiro salvezza su Costituzione, altrimenti sarà avvelenata fino al termine del turno in corso. Finché è avvelenato, il bersaglio non può effettuare né azioni né azioni bonus.",
  "save": "con"
 },
 {
  "id": "fireball",
  "name": "Palla di fuoco",
  "nameEn": "Fireball",
  "level": 3,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (una pallina di guano di pipistrello e zolfo)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una scia di luce brillante parte dall'incantatore e sfreccia fino a un punto a sua scelta entro gittata, provocando un'esplosione infuocata con un profondo boato. Ogni creatura presente in una sfera dal raggio di 6 metri e centrata su quel punto deve effettuare un tiro salvezza su Destrezza, subendo 8d6 danni da fuoco in caso di fallimento, o la metà dei danni in caso di successo.\nGli oggetti infiammabili nell'area che non sono indossati o trasportati iniziano a bruciare.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 3º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "8d6",
   "damageType": "fire",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "speak-with-dead",
  "name": "Parlare con i morti",
  "nameEn": "Speak with Dead",
  "level": 3,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "3 metri",
  "components": "V, S, M (incenso bruciato)",
  "duration": "10 minuti",
  "lists": [
   "bard",
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore conferisce una parvenza di vita a un cadavere a sua scelta situato entro gittata, permettendogli di rispondere alle domande che gli vengono poste. Il cadavere deve avere la bocca e, se la creatura deceduta era un non morto al momento del trapasso, l'incantesimo fallisce. Fallisce allo stesso modo se il cadavere è già stato il bersaglio di questo incantesimo negli ultimi 10 giorni.\nFino al termine dell'incantesimo, l'incantatore può porre al cadavere un massimo di cinque domande. Il cadavere conosce solo quello che sapeva in vita, incluse le lingue. Generalmente, le risposte sono brevi, criptiche o ripetitive e il cadavere non è obbligato a offrirne una sincera se l'incantatore gli è ostile o se il cadavere lo riconosce come nemico. Questo incantesimo non riporta l'anima della creatura nel suo corpo, solamente lo spirito animante. Perciò il cadavere non può apprendere nuove informazioni, non conosce nulla di ciò che è accaduto dopo la sua morte e non può speculare sugli eventi futuri."
 },
 {
  "id": "speak-with-plants",
  "name": "Parlare con i vegetali",
  "nameEn": "Speak with Plants",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "10 minuti",
  "lists": [
   "bard",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore infonde nei vegetali in un'emanazione fissa di 9 metri una parvenza di animazione e volontà, donando loro l'abilità di comunicare con lui e di seguire dei comandi semplici. Può interrogare i vegetali sugli eventi avvenuti nell'area dell'incantesimo nella giornata passata, ottenere informazioni riguardo alle creature transitate al suo interno, al clima e ad altre circostanze.\nPer la durata dell'incantesimo, l'incantatore può anche trasformare un terreno difficile a causa della crescita vegetale (come per esempio arbusti e sottobosco) in un terreno normale. In alternativa può trasformare un terreno normale dove siano presenti dei vegetali in un terreno difficile.\nL'incantesimo non consente alle piante di sradicarsi e deambulare, ma permette loro di muovere rami, rampicanti e viticci per l'incantatore.\nSe una creatura vegetale si trova nell'area, il personaggio può comunicarci come se entrambi condividessero una lingua comune."
 },
 {
  "id": "mass-healing-word",
  "name": "Parola guaritrice di massa",
  "nameEn": "Mass Healing Word",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric"
  ],
  "description": "Fino a sei creature a scelta dall'incantatore entro gittata e che egli è in grado di vedere recuperano un ammontare di punti ferita pari a 2d4 più il modificatore di caratteristica da incantatore dell'incantatore.",
  "higherLevels": "La guarigione aumenta di 1d4 per ogni slot di livello superiore al 3º.",
  "roll": {
   "kind": "heal",
   "dice": "2d4",
   "addMod": true,
   "perSlotLevel": "1d4"
  }
 },
 {
  "id": "fear",
  "name": "Paura",
  "nameEn": "Fear",
  "level": 3,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una piuma bianca)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Ogni creatura entro un cono di 9 metri deve superare un tiro salvezza su Saggezza, altrimenti lascia cadere ciò che tiene in mano e diventa spaventata per la durata dell'incantesimo.\nUna creatura spaventata effettua l'azione di Scatto e si muove a ogni suo turno per allontanarsi dall'incantatore lungo il percorso più sicuro possibile, sempre che abbia lo spazio per muoversi. Se la creatura termina il suo turno in uno spazio dove l'incantatore non è in vista, effettua un tiro salvezza su Saggezza. In caso di successo, l'incantesimo termina.",
  "save": "wis"
 },
 {
  "id": "protection-from-energy",
  "name": "Protezione dall'energia",
  "nameEn": "Protection from Energy",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, una creatura consenziente toccata dall'incantatore dispone di resistenza a un tipo di danni a scelta di quest'ultimo: acido, freddo, fulmine, fuoco o tuono."
 },
 {
  "id": "water-breathing",
  "name": "Respirare sott'acqua",
  "nameEn": "Water Breathing",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un piccolo giunco)",
  "duration": "24 ore",
  "ritual": true,
  "lists": [
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "Questo incantesimo concede a un massimo di dieci creature consenzienti entro gittata (a scelta dell'incantatore) la capacità di respirare sott'acqua per tutta la sua durata. Le creature influenzate conservano inoltre la loro normale modalità di respirazione."
 },
 {
  "id": "remove-curse",
  "name": "Rimuovi maledizione",
  "nameEn": "Remove Curse",
  "level": 3,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "wizard",
   "paladin",
   "warlock"
  ],
  "description": "Al tocco dell'incantatore, tutte le maledizioni che affliggono una creatura o un oggetto terminano. Nel caso di un oggetto magico maledetto, la sua maledizione permane, ma l'incantesimo spezza la sintonia del suo proprietario, consentendogli di rimuoverlo o di liberarsene."
 },
 {
  "id": "revivify",
  "name": "Rinascita",
  "nameEn": "Revivify",
  "level": 3,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (un diamante del valore di 300 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura morta nell'ultimo minuto, la quale ritorna in vita con 1 punto ferita. Questo incantesimo non può riportare in vita una creatura morta di vecchiaia e non ripristina le eventuali parti del corpo mancanti."
 },
 {
  "id": "bestow-curse",
  "name": "Scagliare maledizione",
  "nameEn": "Bestow Curse",
  "level": 3,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore tocca una creatura che deve superare un tiro salvezza su Saggezza, altrimenti verrà maledetta per la durata dell'incantesimo. Finché la maledizione non svanisce, il bersaglio subisce uno dei seguenti effetti a scelta:\n• L'incantatore sceglie una caratteristica. Il bersaglio subisce svantaggio alle prove di caratteristica e ai tiri salvezza effettuati con quella caratteristica.\n• Il bersaglio subisce svantaggio ai tiri per colpire contro l'incantatore.\n• In combattimento, il bersaglio deve superare un tiro salvezza su Saggezza all'inizio di ogni suo turno, altrimenti in quel turno è costretto a effettuare l'azione Schivata.\n• Se l'incantatore infligge danni al bersaglio con un tiro per colpire o un incantesimo, il bersaglio subisce 1d8 danni necrotici extra.",
  "higherLevels": "Se l'incantatore lancia questo incantesimo usando uno slot incantesimo di 4º livello, può mantenere la concentrazione su di esso fino a un massimo di 10 minuti. Se usa uno slot incantesimo di 5º livello o superiore, l'incantesimo non richiede concentrazione e la durata diventa di 8 ore (slot di 5º e 6º livello) o 24 ore (slot di 7º o 8º livello). Se usa uno slot incantesimo di 9º livello, l'incantesimo dura finché non viene dissolto.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "1d8",
   "damageType": "necrotic"
  }
 },
 {
  "id": "sleet-storm",
  "name": "Tempesta di nevischio",
  "nameEn": "Sleet Storm",
  "level": 3,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (un ombrello in miniatura)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Fino al termine dell'incantesimo cade del nevischio in un cilindro alto 12 metri dal raggio di 6 metri il cui centro è un punto a scelta dell'incantatore entro gittata. L'area è pesantemente oscurata e le fiamme libere al suo interno vengono estinte.\nLa superficie all'interno del cilindro è un terreno difficile. Quando una creatura entra nell'area del cilindro per la prima volta in un turno o vi inizia il proprio turno, deve superare un tiro salvezza su Destrezza, altrimenti cadrà a terra prona e perderà la concentrazione.",
  "save": "dex"
 },
 {
  "id": "vampiric-touch",
  "name": "Tocco del vampiro",
  "nameEn": "Vampiric Touch",
  "level": 3,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "sorcerer",
   "wizard",
   "warlock"
  ],
  "description": "Il tocco della mano dell'incantatore, avviluppata in una cortina d'ombra, può risucchiare l'energia vitale delle altre creature per curare le proprie ferite. Effettua un attacco con incantesimo in mischia contro una creatura a portata. Se il colpo va a segno, il bersaglio subisce 3d6 danni necrotici e l'incantatore recupera una quantità di punti ferita pari alla metà dei danni necrotici inflitti.\nFino al termine dell'incantesimo, come azione di Magia, l'incantatore può effettuare di nuovo l'attacco a ogni suo turno, prendendo di mira la stessa creatura o un'altra.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 3º.",
  "attack": "melee",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "necrotic",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "hypnotic-pattern",
  "name": "Trama ipnotica",
  "nameEn": "Hypnotic Pattern",
  "level": 3,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "S, M (una manciata di coriandoli)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "All'interno di un cubo con spigolo di 9 metri entro gittata, l'incantatore crea un intreccio di colori serpeggianti che appare per qualche secondo prima di svanire. Ogni creatura all'interno dell'area in grado di vedere l'intreccio deve superare un tiro salvezza su Saggezza, altrimenti rimane affascinata per la durata dell'incantesimo. Finché è affascinata, la creatura è incapacitata e la sua velocità è pari a 0.\nL'incantesimo su una creatura influenzata termina se questa subisce danni o se qualcuno usa un'azione per scuoterla, destandola dal suo stato confusionale.",
  "save": "wis"
 },
 {
  "id": "haste",
  "name": "Velocità",
  "nameEn": "Haste",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una scaglia di radice di liquirizia)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore sceglie una creatura consenziente entro gittata che egli è in grado di vedere. Fino al termine dell'incantesimo, il bersaglio ottiene un bonus di +2 alla Classe Armatura, dispone di vantaggio ai tiri salvezza su Destrezza, la sua velocità raddoppia e ottiene un'azione aggiuntiva per ogni turno. Tale azione può essere utilizzata solo per effettuare un'azione di Attacco (un solo attacco), Scatto, Disimpegno, Nascondersi o Utilizzo.\nAl termine dell'incantesimo, il bersaglio è incapacitato e ha una velocità pari a 0 fino al termine del proprio turno successivo, essendo sopraffatto da un'ondata di spossatezza."
 },
 {
  "id": "fly",
  "name": "Volare",
  "nameEn": "Fly",
  "level": 3,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (una piuma)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore tocca una creatura consenziente. Per la durata dell'incantesimo, il bersaglio ottiene una velocità di volo di 18 metri e può fluttuare. Al termine dell'incantesimo, il bersaglio ancora sospeso in aria cade, sempre che non abbia modo di impedire la caduta.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 3º."
 },
 {
  "id": "phantasmal-killer",
  "name": "Allucinazione mortale",
  "nameEn": "Phantasmal Killer",
  "level": 4,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore attinge agli incubi di una creatura entro gittata che egli è in grado di vedere e crea un'illusione delle sue paure più profonde, visibile solo a lei. Il bersaglio effettua un tiro salvezza su Saggezza. In caso di fallimento, subisce 4d10 danni psichici e subisce svantaggio alle prove di caratteristica e ai tiri per colpire per la durata dell'incantesimo. In caso di successo, subisce soltanto la metà di quei danni e l'incantesimo termina.\nPer la durata dell'incantesimo, il bersaglio effettua un tiro salvezza su Saggezza alla fine di ogni suo turno. In caso di fallimento, subisce nuovamente i danni psichici. In caso di successo, l'incantesimo termina.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 4º.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "4d10",
   "damageType": "psychic",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "aura-of-life",
  "name": "Aura di vita",
  "nameEn": "Aura of Life",
  "level": 4,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore irradia un'aura in un'emanazione di 9 metri da sé che permane per la durata dell'incantesimo. Mentre sono nell'aura, l'incantatore e i suoi alleati ottengono resistenza ai danni necrotici e i loro punti ferita massimi non possono essere ridotti. Se un alleato con 0 punti ferita inizia il suo turno nell'aura, ne recupera 1."
 },
 {
  "id": "charm-monster",
  "name": "Charme sui mostri",
  "nameEn": "Charm Monster",
  "level": 4,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "1 ora",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura entro gittata che l'incantatore è in grado di vedere effettua un tiro salvezza su Saggezza, disponendo di vantaggio se l'incantatore o i suoi alleati stanno combattendo contro di essa. In caso di fallimento, il bersaglio è affascinato fino al termine dell'incantesimo o finché non gli vengono inflitti danni dall'incantatore o i suoi alleati. La creatura affascinata è amichevole nei confronti dell'incantatore. Al termine dell'incantesimo, il bersaglio capirà di essere stato affascinato dall'incantatore.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 4º.",
  "save": "wis"
 },
 {
  "id": "compulsion",
  "name": "Compulsione",
  "nameEn": "Compulsion",
  "level": 4,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard"
  ],
  "description": "Ogni creatura a scelta dell'incantatore, entro gittata e che egli è in grado di vedere, deve superare un tiro salvezza su Saggezza, altrimenti diventa affascinata fino al termine dell'incantesimo.\nPer la durata dell'incantesimo, l'incantatore può effettuare un'azione bonus per scegliere una direzione orizzontale rispetto a lui. Ogni bersaglio affascinato deve usare la maggior parte possibile del suo movimento per muoversi in quella direzione nel suo turno successivo, percorrendo la via più sicura. Dopo essersi mosso in questo modo, un bersaglio ripete il tiro salvezza e, se lo supera, termina l'incantesimo su di sé.",
  "save": "wis"
 },
 {
  "id": "confusion",
  "name": "Confusione",
  "nameEn": "Confusion",
  "level": 4,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (tre gusci di noce)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Ogni creatura all'interno di una sfera del raggio di 3 metri centrata su un punto entro gittata a scelta dell'incantatore deve superare un tiro salvezza su Saggezza, altrimenti non può effettuare azioni bonus o reazioni e deve tirare 1d10 all'inizio di ogni suo turno per determinare il suo comportamento durante quel turno, consultando la tabella sottostante.\n1d10 Comportamento per il turno\n1 | Il bersaglio non effettua alcuna azione e usa\ntutto il suo movimento per muoversi, tirando\n1d4 per la direzione: 1, nord; 2, est; 3, sud; o 4,\novest.\n2–6 Il bersaglio non si muove e non effettua azioni.\n7–8 Il bersaglio non si muove ed effettua l'azione\ndi Attacco per eseguire un attacco in mischia\ncontro una creatura casuale entro portata.\nSe nessuna creatura si trova entro la sua por-\ntata, il bersaglio non effettua azioni.\n9–10 Il bersaglio sceglie il comportamento.\nAlla fine di ogni suo turno, un bersaglio influenzato ripete il tiro salvezza e, se lo supera, termina l'incantesimo su di sé.",
  "higherLevels": "Il raggio della sfera aumenta di 1,5 metri per ogni slot di livello superiore al 4º.",
  "save": "wis"
 },
 {
  "id": "control-water",
  "name": "Controllare acqua",
  "nameEn": "Control Water",
  "level": 4,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "90 metri",
  "components": "V, S, M (una miscela di acqua e polvere)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "Fino al termine dell'incantesimo, l'incantatore controlla una massa d'acqua all'interno di un'area a sua scelta, con un volume massimo pari a un cubo con spigolo di 30 metri, usando uno dei seguenti effetti. Come azione di Magia durante i suoi turni successivi, può ripetere il medesimo effetto o sceglierne uno differente.\n**Deviare la corrente.** L'incantatore fa in modo che l'acqua corrente nell'area si muova in una direzione scelta da lui, anche se l'acqua deve risalire ostacoli e pareti o scorrere in altre direzioni inverosimili. L'acqua nell'area si muove secondo le indicazioni dell'incantatore, ma una volta superata l'area dell'incantesimo, riprende il suo corso in base al terreno. L'acqua continua a scorrere nella direzione scelta fino al termine dell'incantesimo o finché l'incantatore non sceglie un effetto diverso.\n**Gorgo.** L'incantatore crea un gorgo al centro dell'area, che deve essere di almeno 15 metri per lato e 7,5 metri di profondità. Il gorgo permane finché l'incantatore non sceglie un effetto diverso o fino al termine dell'incantesimo. Il gorgo è alto 7,5 metri e ampio 1,5 metri alla base e fino a 15 metri alla sommità. Qualsiasi creatura nell'acqua ed entro 7,5 metri dal gorgo viene trascinata per 3 metri verso di esso. Quando una creatura viene trascinata nel gorgo per la prima volta in un turno o vi finisce il suo turno, effettua un tiro salvezza su Forza. In caso di fallimento, la creatura subisce 2d8 danni contundenti, mentre se lo supera, subisce soltanto la metà di quei danni. Una creatura può nuotare via dal gorgo solo se prima effettua un'azione per allontanarsi e supera una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo dell'incantatore.\nIl livello dell'acqua rimane elevato fino al termine dell'incantesimo o finché l'incantatore non sceglie un effetto diverso. Se questo effetto produce un'onda, questa si ripete all'inizio del turno successivo dell'incantatore finché l'effetto di inondazione permane.\n**Inondazione.** L'incantatore fa in modo che il livello di tutta l'acqua ferma dell'area si alzi di un massimo di 6 metri. Se l'incantatore sceglie un'area all'interno di un grande specchio d'acqua, genera invece un'onda alta 6 metri che da una parte dell'area si infrange sull'altra. Qualsiasi veicolo di taglia Enorme o inferiore sul percorso dell'onda viene trascinato dall'altra parte dell'area e ha una probabilità del 25% di capovolgersi.\n**Separare le acque.** L'incantatore fa in modo che l'acqua presente nell'area si separi, creando un canale che si estende per tutta l'area dell'incantesimo; le acque divise formano un muro su entrambi i lati. Il canale permane fino al termine dell'incantesimo o finché l'incantatore non sceglie un effetto diverso. L'acqua poi riempie lentamente il canale nel corso del round successivo, finché il livello normale dell'acqua non viene ripristinato.",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "bludgeoning"
  }
 },
 {
  "id": "divination",
  "name": "Divinazione",
  "nameEn": "Divination",
  "level": 4,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (incenso del valore di 25 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "Questo incantesimo mette in contatto l'incantatore con una divinità o con un servitore della divinità. L'incantatore pone una sola domanda relativa a uno specifico obiettivo, evento o attività che si verificherà entro 7 giorni. Il GM fornisce una risposta onesta, che può essere una breve frase o una rima enigmatica. L'incantesimo non tiene conto delle circostanze che potrebbero modificare la risposta, come il lancio di altri incantesimi.\nSe l'incantatore lancia l'incantesimo più volte prima di completare un riposo lungo, esiste una probabilità cumulativa del 25% di non ottenere risposta per ogni lancio dopo il primo."
 },
 {
  "id": "dominate-beast",
  "name": "Dominare bestie",
  "nameEn": "Dominate Beast",
  "level": 4,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "ranger",
   "sorcerer"
  ],
  "description": "Una bestia entro gittata e che l'incantatore è in grado di vedere deve superare un tiro salvezza su Saggezza, altrimenti diventa affascinata per la durata dell'incantesimo. Il bersaglio dispone di vantaggio al tiro salvezza se l'incantatore o i suoi alleati stanno combattendo contro di essa. Ogni volta che il bersaglio subisce danni, ripete il tiro salvezza; se lo supera, l'effetto svanisce.\nL'incantatore ha un legame telepatico con il bersaglio affascinato mentre i due si trovano sullo stesso piano di esistenza. Nel proprio turno, l'incantatore può utilizzare questo legame per impartire comandi al bersaglio (nessuna azione richiesta), come ad esempio \"attacca quella creatura\", \"spostati lì\", o \"recupera quell'oggetto\". Il bersaglio fa del suo meglio per obbedire nel suo turno. Se porta a termine un ordine e non riceve ulteriori istruzioni dall'incantatore, agisce e si muove a suo piacimento, concentrandosi sulla propria incolumità.\nL'incantatore può comandare al bersaglio di effettuare una reazione, ma per farlo dovrà utilizzare la propria reazione.",
  "higherLevels": "La concentrazione dell'incantatore può durare più a lungo utilizzando uno slot incantesimo di 5º livello (fino a 10 minuti), di 6º livello (fino a 1 ora) o di 7º livello o superiore (fino a 8 ore).",
  "save": "wis"
 },
 {
  "id": "banishment",
  "name": "Esilio",
  "nameEn": "Banishment",
  "level": 4,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un pentacolo)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "wizard",
   "paladin",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura entro gittata che l'incantatore è in grado di vedere deve superare un tiro salvezza su Carisma o essere trasportata in un semipiano sicuro per la durata dell'incantesimo. Mentre si trova lì, il bersaglio è incapacitato. Al termine dell'incantesimo, il bersaglio riappare nello spazio in cui si trovava prima del lancio o, se è occupato, nello spazio libero più vicino.\nSe l'incantesimo sul bersaglio dura 1 minuto, il bersaglio non fa ritorno se è un'aberrazione, un celestiale, un elementale, un folletto o un immondo. In questo caso, viene trasportato in un luogo casuale di un piano (a scelta del GM) associato al tipo di creatura di cui fa parte.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 4º.",
  "save": "cha"
 },
 {
  "id": "conjure-woodland-beings",
  "name": "Evoca creature boschive",
  "nameEn": "Conjure Woodland Beings",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore evoca degli spiriti della natura che gli fluttuano attorno in un'emanazione di 3 metri per la durata dell'incantesimo. Ogni volta che l'emanazione entra nello spazio di una creatura che l'incantatore è in grado di vedere e ogni volta che una creatura che l'incantatore è in grado di vedere entra nell'emanazione o vi termina il suo turno, l'incantatore può costringerla a effettuare un tiro salvezza su Saggezza. In caso di fallimento, subisce 5d8 danni da forza, o la metà dei danni in caso di successo. Una creatura effettua questo tiro salvezza solo una volta per turno.\nInoltre, per la durata dell'incantesimo, l'incantatore può effettuare l'azione di Disimpegno come azione bonus.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "5d8",
   "damageType": "force",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "conjure-minor-elementals",
  "name": "Evoca elementali minori",
  "nameEn": "Conjure Minor Elementals",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "wizard"
  ],
  "description": "L'incantatore evoca degli spiriti dai Piani Elementali che gli fluttuano attorno in un'emanazione di 4,5 metri per la durata dell'incantesimo. Fino al termine dell'incantesimo, ogni attacco effettuato dall'incantatore infligge 2d8 danni extra quando colpisce una creatura nell'emanazione. I danni inflitti sono da acido, freddo, fuoco o fulmine (a scelta dell'incantatore quando effettua l'attacco).\nInoltre, il terreno all'interno dell'emanazione diventa terreno difficile per i nemici.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º."
 },
 {
  "id": "fabricate",
  "name": "Fabbricare",
  "nameEn": "Fabricate",
  "level": 4,
  "school": "transmutation",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore converte materie prime in prodotti dello stesso materiale. Per esempio, può fabbricare un ponte di legno da una catasta di tronchi, una corda da un groviglio di canapa o abiti da lino o lana.\nL'incantatore sceglie materie prime entro gittata che egli è in grado di vedere e, qualora ne possegga una quantità sufficiente, può fabbricare un oggetto di taglia Grande o inferiore (contenuto in un cubo con spigolo di 3 metri o in otto cubi con spigolo di 1,5 metri collegati tra loro). Tuttavia, se l'incantatore lavora con metallo, pietra o un'altra sostanza minerale, l'oggetto fabbricato potrà essere al massimo di taglia Media (contenuto in un cubo con spigolo di 1,5 metri). La qualità degli oggetti realizzati è basata sulla qualità delle materie prime.\nQuesto incantesimo non può creare creature o oggetti magici. Inoltre, l'incantatore non può utilizzarlo per creare oggetti che richiedono un alto grado di precisione, come armi o armature, a meno che non possegga competenza con il tipo di strumenti da artigiano usati per realizzare tali oggetti."
 },
 {
  "id": "guardian-of-faith",
  "name": "Guardiano della fede",
  "nameEn": "Guardian of Faith",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V",
  "duration": "8 ore",
  "lists": [
   "cleric"
  ],
  "description": "Per la durata dell'incantesimo, un guardiano spettrale di taglia Grande compare e fluttua in uno spazio libero entro gittata che l'incantatore è in grado di vedere. Il guardiano occupa quello spazio ed è invulnerabile: assume inoltre una forma appropriata alla divinità o al pantheon dell'incantatore.\nQualsiasi nemico si muova in uno spazio entro 3 metri dal guardiano per la prima volta in un turno o che inizi il proprio turno lì, effettua un tiro salvezza su Destrezza. In caso di fallimento, subisce 20 danni radiosi o la metà dei danni in caso di successo. Il guardiano svanisce quando ha inflitto un totale di 60 danni.",
  "save": "dex"
 },
 {
  "id": "blight",
  "name": "Inaridire",
  "nameEn": "Blight",
  "level": 4,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura entro gittata che l'incantatore è in grado di vedere effettua un tiro salvezza su Costituzione, subendo 8d8 danni necrotici in caso di fallimento, o la metà dei danni in caso di successo. Una creatura vegetale fallisce automaticamente il tiro salvezza.\nIn alternativa, l'incantatore bersaglia un vegetale non magico che non sia una creatura, come un albero o un arbusto. Il vegetale non effettua il tiro salvezza, semplicemente appassisce e muore.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "8d8",
   "damageType": "necrotic",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "giant-insect",
  "name": "Insetto gigante",
  "nameEn": "Giant Insect",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "L'incantatore evoca un millepiedi gigante, un ragno gigante o una vespa gigante (a sua scelta al momento del lancio). L'insetto si manifesta in uno spazio libero entro gittata che l'incantatore è in grado di vedere e utilizza la scheda delle statistiche dell'insetto gigante. La forma scelta dall'incantatore determina alcuni dettagli della sua scheda delle statistiche. La creatura scompare quando scende a 0 punti ferita o quando l'incantesimo termina.\ned è un alleato per il personaggio e i suoi alleati. In combattimento, la creatura ha lo stesso punteggio di iniziativa dell'incantatore, ma inizia il turno immediatamente dopo il suo, obbedendo ai suoi comandi verbali (nessuna azione richiesta da parte dell'incantatore). Se l'incantatore non pronuncia comandi verbali, la creatura compie l'azione di Schivata e usa il suo movimento per sottrarsi al pericolo.",
  "higherLevels": "Usa il livello dello slot incantesimo relativo al livello dell'incantesimo nella scheda delle statistiche.\nInsetto gigante\nBestia Grande, senza allineamento\nCA 11 + il livello dell'incantesimo\nPF 30 + 10 per ogni livello di incantesimo sopra il 4º\nVelocità 12 m, scalata 12 m, volo 12 m (solo vespa)\nMOD SALV | MOD SALV | MOD SALV\nF | or | 17 +3 +3 | D | es | 13 +1 +1 | C | os | 15 | +2 +2\nI | nt | 4 −3 −3 | +2 +2 | C | ar | 3 | −4 −4\nSensi Percezione passiva 12; scurovisione 18 m\nLingue comprende le lingue parlate dal personaggio\nGS nessuno (PE 0; BC pari al bonus di competenza del\npersonaggio)\nTratti\nMovimenti del ragno. L'insetto può scalare le superfici\ndifficili, compresi i soffitti, senza effettuare una prova di | s | ag | 14\ncaratteristica.\nAzioni\nMultiattacco. L'insetto effettua un numero di attacchi\npari alla metà del livello di quest'incantesimo (arroton-\ndando per difetto).\nColpo velenoso. Tiro per colpire in mischia: Il bonus\nequivale al modificatore di attacco dell'incantesimo del\npersonaggio, portata di 3 metri. Colpito: 1d6 + 3 più\nil livello dell'incantesimo danni perforanti e 1d4 danni\nda veleno.\nDardo di ragnatela (solo ragno). Tiro per colpire\na distanza: il bonus equivale al modificatore di attacco\ndell'incantesimo del personaggio, gittata di 18 metri.\nColpito: 1d10 + 3 più il livello dell'incantesimo danni\ncontundenti. Inoltre, la velocità del bersaglio è ridotta\na 0 fino all'inizio del turno successivo dell'insetto.\nAzioni bonus\nRigurgito velenoso (solo millepiedi). Tiro salvezza su\nCostituzione: CD del tiro salvezza sull'incantesimo,\nuna creatura che l'insetto può vedere entro 3 metri.\nFallimento: il bersaglio è avvelenato fino all'inizio del\nturno successivo dell'insetto."
 },
 {
  "id": "death-ward",
  "name": "Interdizione alla morte",
  "nameEn": "Death Ward",
  "level": 4,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "8 ore",
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "L'incantatore tocca una creatura e le concede una misura di protezione dalla morte. La prima volta che il bersaglio scende a 0 punti ferita prima del termine dell'incantesimo, scende invece a 1 punto ferita e l'incantesimo termina.\nSe l'incantesimo è ancora attivo quando il bersaglio è soggetto a un effetto che ne provocherebbe la morte istantanea senza infliggere danni, quell'effetto viene annullato e l'incantesimo termina."
 },
 {
  "id": "greater-invisibility",
  "name": "Invisibilità superiore",
  "nameEn": "Greater Invisibility",
  "level": 4,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Una creatura toccata dall'incantatore diventa invisibile fino al termine dell'incantesimo."
 },
 {
  "id": "freedom-of-movement",
  "name": "Libertà di movimento",
  "nameEn": "Freedom of Movement",
  "level": 4,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (una cinghia di cuoio)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura consenziente. Per la durata dell'incantesimo, il movimento del bersaglio non è influenzato dal terreno difficile, inoltre incantesimi e altri effetti magici non possono né ridurne la velocità né trattenerlo o renderlo paralizzato. Il bersaglio dispone anche di una velocità di nuoto pari alla sua velocità.\nInoltre, il bersaglio può usare 1,5 metri di movimento per sfuggire automaticamente alle restrizioni non magiche, come un paio di manette o la presa di una creatura che lo afferra.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 4º."
 },
 {
  "id": "locate-creature",
  "name": "Localizza creatura",
  "nameEn": "Locate Creature",
  "level": 4,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un ciuffo di peli di un segugio)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore descrive o nomina una creatura a lui familiare, percependo la direzione della sua ubicazione se la creatura si trova entro 300 metri da lui. Se la creatura è in movimento, l'incantatore apprende verso quale direzione si sta dirigendo.\nL'incantesimo può localizzare una creatura specifica nota all'incantatore o una creatura di un tipo specifico più vicina (come un umano o un unicorno), purché l'incantatore abbia visto tale creatura da vicino (entro 9 metri) almeno una volta. Se la creatura descritta o nominata ha una forma diversa, per esempio se si trova sotto l'effetto di un incantesimo carne in pietra o metamorfosi, questo incantesimo non riesce a localizzarla.\nQuesto incantesimo non può localizzare una creatura se uno strato di piombo blocca il percorso diretto tra essa e l'incantatore."
 },
 {
  "id": "polymorph",
  "name": "Metamorfosi",
  "nameEn": "Polymorph",
  "level": 4,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (il bozzolo di un bruco)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tenta di trasformare in bestia una creatura entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti assume la forma di una bestia per la durata dell'incantesimo. La forma in cui muta può essere quella di qualsiasi bestia, a scelta dell'incantatore, il cui grado di sfida sia pari o inferiore a quello del bersaglio (o al livello del bersaglio, se esso non possiede un grado di sfida). Le statistiche di gioco del bersaglio vengono sostituite dalla scheda delle statistiche della bestia scelta, ma il bersaglio conserva il proprio allineamento, personalità, tipo di creatura, punti ferita e Dadi Vita. Vedi la sezione \"Animali\" in \"Mostri\" per un esempio di scheda delle statistiche di una bestia.\nIl bersaglio guadagna un numero di punti ferita temporanei pari ai punti ferita della forma bestiale. Al termine dell'incantesimo, il bersaglio perde tutti i punti ferita temporanei rimasti. L'incantesimo termina in anticipo se il bersaglio non ha punti ferita temporanei rimasti.\nIl bersaglio è limitato alle azioni che può effettuare in base alla anatomia della sua nuova forma e non può parlare o lanciare incantesimi.\nL'attrezzatura del bersaglio si fonde nella sua nuova forma e la creatura non può utilizzare il suo equipaggiamento o beneficiarne in alcun modo.",
  "save": "wis"
 },
 {
  "id": "wall-of-fire",
  "name": "Muro di fuoco",
  "nameEn": "Wall of Fire",
  "level": 4,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un pezzo di carbone)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea un muro di fuoco su una superficie solida entro gittata. Il muro può essere lungo fino a 18 metri, alto 6 metri e spesso 30 cm, oppure essere un muro circolare del diametro massimo di 6 metri, alto 6 metri e spesso 30 cm. Il muro è opaco e permane per la durata dell'incantesimo.\nQuando compare, ogni creatura al suo interno effettua un tiro salvezza su Destrezza, subendo 5d8 danni da fuoco in caso di fallimento, o la metà dei danni in caso di successo.\nUn lato del muro, scelto dall'incantatore al momento del lancio dell'incantesimo, infligge 5d8 danni da fuoco a ogni creatura che termina il proprio turno entro 3 metri da quel lato o all'interno del muro. Una creatura subisce gli stessi danni quando lo attraversa per la prima volta in un turno o vi termina il suo turno. L'altro lato del muro non infligge danni.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "5d8",
   "damageType": "fire",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "arcane-eye",
  "name": "Occhio arcano",
  "nameEn": "Arcane Eye",
  "level": 4,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un ciuffo di peli di pipistrello)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore crea un occhio invisibile e invulnerabile che fluttua per la durata dell'incantesimo entro la sua gittata. L'incantatore riceve informazioni visive dall'occhio, che può vedere in ogni direzione e che è inoltre dotato di scurovisione fino a 9 metri.\nCome azione bonus, l'incantatore può muovere l'occhio per un massimo di 9 metri in ogni direzione. Una barriera solida blocca il movimento dell'occhio, che tuttavia può passare attraverso un'apertura dal diametro minimo di 2,5 centimetri."
 },
 {
  "id": "stoneskin",
  "name": "Pelle di pietra",
  "nameEn": "Stoneskin",
  "level": 4,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere di diamante del valore di 100 mo o più, che l'incantesimo consuma)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "ranger",
   "sorcerer"
  ],
  "description": "Fino al termine dell'incantesimo, una creatura consenziente toccata dall'incantatore avrà resistenza a danni contundenti, perforanti e taglienti."
 },
 {
  "id": "dimension-door",
  "name": "Porta dimensionale",
  "nameEn": "Dimension Door",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "150 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore si teletrasporta in un punto entro gittata arrivando precisamente nel luogo desiderato, che può essere un punto che è in grado di vedere, che riesce a visualizzare o che è in grado di descrivere dichiarandone la distanza e la direzione, come per esempio \"60 metri in linea retta verso il basso\" o \"90 metri verso nord-ovest, a un'angolazione ascendente di 45 gradi\".\nL'incantatore può anche teletrasportare una creatura consenziente. Prima che si teletrasporti, la creatura deve trovarsi entro 1,5 metri dall'incantatore, per poi teletrasportarsi in uno spazio entro 1,5 metri dalla destinazione dell'incantatore.\nSe l'incantatore, l'altra creatura o entrambi arrivano in uno spazio occupato da una creatura o riempito completamente da uno o più oggetti, l'incantatore e qualsiasi creatura che viaggia con lui subiscono 4d6 danni da forza e il teletrasporto fallisce.",
  "roll": {
   "kind": "damage",
   "dice": "4d6",
   "damageType": "force"
  }
 },
 {
  "id": "private-sanctum",
  "name": "Santuario privato",
  "nameEn": "Private Sanctum",
  "level": 4,
  "school": "abjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "36 metri",
  "components": "V, S, M (una sottile lamina di piombo)",
  "duration": "24 ore",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore rende magicamente sicura un'area entro gittata: un cubo le cui dimensioni possono variare da un minimo di 1,5 metri per spigolo a un massimo di 30 metri per spigolo. L'incantesimo permane per tutta la sua durata.\nQuando lancia l'incantesimo, l'incantatore decide che tipo di sicurezza esso fornisce, scegliendo una o più tra le proprietà seguenti:\n• I suoni non possono attraversare la barriera ai confini dell'area protetta.\n• La barriera nell'area protetta appare oscura e nebulosa, rendendo impossibile vedere oltre (anche utilizzando scurovisione).\n• I sensori creati dagli incantesimi di divinazione non possono apparire all'interno dell'area protetta né oltrepassarne il perimetro.\n• Le creature nell'area non possono essere bersaglio di incantesimi di divinazione.\n• Nulla può teletrasportarsi dentro o fuori dall'area protetta.\n• I viaggi planari sono bloccati all'interno dell'area protetta. Lanciando questo incantesimo nello stesso punto ogni giorno per 365 giorni, l'incantesimo dura finché non viene dissolto.",
  "higherLevels": "L'incantatore può aumentare le dimensioni del cubo di 30 metri per spigolo per ogni slot di livello superiore al 4º."
 },
 {
  "id": "stone-shape",
  "name": "Scolpire pietra",
  "nameEn": "Stone Shape",
  "level": 4,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (argilla morbida)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "L'incantatore tocca un oggetto di pietra di taglia Media o inferiore, oppure una sezione di pietra non più grande di 1,5 metri in ogni dimensione, modellandola nella forma che desidera. Per esempio, potrebbe trasformare una grossa roccia in un'arma, una statua, un forziere o creare un piccolo sentiero di passaggio attraverso un muro spesso 1,5 metri. L'incantatore può anche modellare una porta di pietra o i suoi stipiti per sigillarla. L'oggetto creato può avere un massimo di due cardini e una chiusura, ma non può essere dotato di meccanismi più raffinati."
 },
 {
  "id": "secret-chest",
  "name": "Scrigno segreto",
  "nameEn": "Secret Chest",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (uno scrigno che misura 90 x 60 x 60 centimetri, realizzato con materiali rari del valore di 5.000 mo o più e una riproduzione minuscola dello scrigno fatta degli stessi materiali del valore di 50 mo o più)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore nasconde uno scrigno e tutti i suoi contenuti sul Piano Etereo. Per farlo, deve toccare lo scrigno e la riproduzione in miniatura che fungono da componenti materiali dell'incantesimo. Il forziere può contenere fino a 12 cubi con spigolo di 30 centimetri di materiale non vivente (90 x 60 x 60 cm).\nFinché il forziere rimane sul Piano Etereo, l'incantatore può effettuare un'azione di Magia e toccare la riproduzione per richiamare a sé lo scrigno, che appare a terra in uno spazio libero entro 1,5 metri da lui. L'incantatore può inviare nuovamente lo scrigno sul Piano Etereo, effettuando un'azione di Magia per toccare lo scrigno e la riproduzione.\nDopo 60 giorni, esiste una probabilità cumulativa del 5% al termine di ogni giorno che l'incantesimo termini. L'incantesimo termina anche se l'incantatore lancia nuovamente questo incantesimo o se la riproduzione minuscola dello scrigno viene distrutta. Se l'incantesimo termina e lo scrigno più grande si trova sul Piano Etereo, lo scrigno rimane lì per poter essere ritrovato dall'incantatore o da qualcun altro."
 },
 {
  "id": "fire-shield",
  "name": "Scudo di fuoco",
  "nameEn": "Fire Shield",
  "level": 4,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un frammento di fosforo o una lucciola)",
  "duration": "10 minuti",
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Per la durata dell'incantesimo, il corpo dell'incantatore è avvolto da fiamme sottili, che proiettano luce intensa in un raggio di 3 metri e luce fioca per ulteriori 3 metri.\nLe fiamme conferiscono all'incantatore uno scudo ardente o gelido a sua scelta. Lo scudo ardente gli conferisce resistenza ai danni da freddo, mentre lo scudo gelido resistenza ai danni da fuoco.\nInoltre, ogni volta che una creatura entro 1,5 metri dall'incantatore lo colpisce con un tiro per colpire in mischia, dallo scudo erompono delle fiamme. L'attaccante subisce 2d8 danni da fuoco da uno scudo ardente o 2d8 danni da freddo da uno scudo gelido.",
  "roll": {
   "kind": "damage",
   "dice": "2d8",
   "damageType": "fire"
  }
 },
 {
  "id": "faithful-hound",
  "name": "Segugio fedele",
  "nameEn": "Faithful Hound",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un fischietto d'argento)",
  "duration": "8 ore",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore evoca un cane da guardia fantasma in uno spazio libero entro gittata che egli è in grado di vedere. Il segugio permane per la durata dell'incantesimo o fino a quando la distanza tra il segugio e l'incantatore non supera i 90 metri di distanza.\nSolo l'incantatore è in grado di vedere il segugio, che è intangibile e invulnerabile. Quando una creatura di taglia Piccola o inferiore si avvicina entro 9 metri dal segugio senza prima aver pronunciato la parola d'ordine specificata dall'incantatore al momento del lancio dell'incantesimo, il segugio inizia ad abbaiare sonoramente. Il segugio ottiene vista pura con un raggio di 9 metri.\nAll'inizio di ogni turno dell'incantatore, il segugio tenta di mordere un nemico entro 1,5 metri da sé. Il nemico deve superare un tiro salvezza su Destrezza, altrimenti subisce 4d8 danni da forza.\nNei turni successivi, l'incantatore può effettuare un'azione di Magia per spostare il segugio fino a 9 metri.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "4d8",
   "damageType": "force"
  }
 },
 {
  "id": "vitriolic-sphere",
  "name": "Sfera al vetriolo",
  "nameEn": "Vitriolic Sphere",
  "level": 4,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (una goccia di bile)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore indica un punto entro gittata e un globo luminescente di acido del diametro di 30 centimetri sfreccia verso quel punto, dove esplode in una sfera del raggio di 6 metri. Ogni creatura nell'area effettua un tiro salvezza su Destrezza. Se lo fallisce, subisce 10d4 danni da acido e altri 5d4 danni da acido alla fine del suo turno successivo. In caso di successo, subisce soltanto la metà dei danni iniziali.",
  "higherLevels": "I danni iniziali aumentano di 2d4 per ogni slot di livello superiore al 4º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "10d4",
   "damageType": "acid",
   "perSlotLevel": "2d4"
  }
 },
 {
  "id": "resilient-sphere",
  "name": "Sfera elastica",
  "nameEn": "Resilient Sphere",
  "level": 4,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una sfera di vetro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "Una sfera di forza scintillante racchiude una creatura o un oggetto di taglia Grande o inferiore entro gittata. Una creatura non consenziente deve superare un tiro salvezza su Destrezza, altrimenti viene rinchiusa nella sfera per la durata dell'incantesimo.\nNulla può attraversare la barriera in entrata e in uscita (oggetti fisici, energia o altri effetti magici), ma una creatura all'interno può respirare liberamente. La sfera è immune a tutti i danni e una creatura o un oggetto all'interno non può essere danneggiato dagli attacchi o dagli effetti che provengono dall'esterno; analogamente, non può infliggere danni a qualsiasi cosa si trovi all'esterno.\nLa sfera non ha peso ed è grande quanto basta da contenere la creatura o l'oggetto al suo interno. Una creatura rinchiusa può effettuare un'azione per spingere le pareti della sfera e farla rotolare a una velocità massima pari alla metà della propria. Analogamente, la sfera può essere sollevata e mossa da altre creature.\nUn incantesimo disintegrazione distrugge la sfera senza danneggiare ciò che contiene.",
  "save": "dex"
 },
 {
  "id": "ice-storm",
  "name": "Tempesta di ghiaccio",
  "nameEn": "Ice Storm",
  "level": 4,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "90 metri",
  "components": "V, S, M (una muffola)",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Chicchi di grandine cadono in un cilindro del raggio di 6 metri e alto 12 metri, centrato su un punto entro gittata. Ogni creatura presente nel cilindro effettua un tiro salvezza su Destrezza, subendo 2d10 danni contundenti e 4d6 danni da freddo in caso di fallimento, o la metà dei danni in caso di successo.\nLa grandine trasforma l'area all'interno del cilindro in terreno difficile fino al termine del turno successivo dell'incantatore.",
  "higherLevels": "I danni contundenti aumentano di 1d10 per ogni slot di livello superiore al 4º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "2d10",
   "damageType": "bludgeoning",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "black-tentacles",
  "name": "Tentacoli neri",
  "nameEn": "Black Tentacles",
  "level": 4,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (un tentacolo)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "Una massa di tentacoli brulicanti color ebano riempie un quadrato con lato di 6 metri situato sul terreno entro gittata e che l'incantatore è in grado di vedere. Per la durata dell'incantesimo, questi tentacoli trasformano quell'area in un terreno difficile.\nOgni creatura nell'area effettua un tiro salvezza su Forza. In caso di fallimento, subisce 3d6 danni contundenti ed è trattenuta fino al termine dell'incantesimo. Una creatura effettua il tiro salvezza anche se entra nell'area o vi termina il suo turno. Il tiro salvezza può essere effettuato solo una volta per turno.\nUna creatura trattenuta può usare un'azione per effettuare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo, ponendo fine alla sua condizione \"trattenuta\" in caso di successo.",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "bludgeoning"
  }
 },
 {
  "id": "hallucinatory-terrain",
  "name": "Terreno illusorio",
  "nameEn": "Hallucinatory Terrain",
  "level": 4,
  "school": "illusion",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "90 metri",
  "components": "V, S, M (un fungo)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore fa in modo che un terreno naturale in un cubo con spigolo di 45 metri entro gittata abbia l'aspetto, i suoni e gli odori di un altro tipo di terreno naturale. Un campo aperto o una strada potrebbe così sembrare una palude, una collina, un crepaccio o qualche altro tipo di terreno difficile e invalicabile. Allo stesso modo, uno stagno potrebbe apparire come un prato erboso, un precipizio come un dolce pendio o un fosso irto di rocce come una strada ampia e accogliente. Tuttavia, le strutture artificiali, l'equipaggiamento e le creature all'interno dell'area non cambiano.\nInoltre, le caratteristiche tattili del terreno rimangono invariate, quindi le creature che entrano nell'area hanno buone probabilità di accorgersi dell'illusione. Se la differenza non è ovvia al tatto, una creatura che esamina l'illusione può effettuare l'azione di Studio per effettuare una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo per non essere tratta in inganno. Se una creatura si accorge che il terreno è illusorio, vede un'immagine indistinta sovrapposta al terreno reale."
 },
 {
  "id": "animate-objects",
  "name": "Animare oggetti",
  "nameEn": "Animate Objects",
  "level": 5,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Gli oggetti si animano su ordine dell'incantatore. L'incantatore sceglie un numero di oggetti non magici entro gittata che non siano indossati o trasportati, fissati su una superficie o di dimensioni Mastodontiche. Il numero massimo di oggetti è uguale al suo modificatore di caratteristica da incantatore; per questo numero, un bersaglio di taglia Media o inferiore conta come un oggetto, un bersaglio di taglia Grande conta come due e un bersaglio Enorme conta come tre.\nOgni bersaglio si anima e diventa un costrutto provvisto di gambe che utilizza la scheda delle statistiche dell'oggetto animato; questa creatura è sotto il controllo dell'incantatore fino al termine dell'incantesimo o finché non viene ridotta a 0 punti ferita. Ogni creatura creata con questo incantesimo diventa un alleato per l'incantatore e i suoi alleati. In combattimento, la creatura ha lo stesso punteggio di iniziativa dell'incantatore, ma inizia il turno immediatamente dopo il suo.\nFino al termine dell'incantesimo, come azione bonus, l'incantatore può comandare mentalmente qualsiasi creatura creata con questo incantesimo, a patto che si trovi entro 150 metri da sé (se controlla varie creature, l'incantatore può comandarne più di una allo stesso momento, impartendo lo stesso comando a ciascuna di loro). Se invece non impartisce alcun comando, la creatura effettua l'azione Schivata e si sposta solo per evitare di subire danni. Quando la creatura scende a 0 punti ferita, riassume la sua forma di oggetto, a cui vengono trasferiti eventuali danni rimanenti.",
  "higherLevels": "I danni da Schianto della creatura aumentano di 1d4 (taglia Media o inferiore), 1d6 (taglia Grande) o 1d12 (taglia Enorme) per ogni slot di livello superiore al 5º.\nOggetto animato\nCostrutto Enorme o inferiore, senza allineamento\nCA 15\nPF 10 (taglia Media o inferiore), 20 (taglia Grande),\n40 (taglia Enorme)\nVelocità 9 m\nMOD SALV | MOD SALV | MOD SALV\nF | or | 16 +3 +3 | D | es | 10 +0 +0 | C | os | 10 +0 +0\nI | nt | 3 | −4 −4 | 3 | −4 −4 | C | ar | 1 | −5 −5\nImmunità affascinato, avvelenato, indebolimento,\nparalizzato, psichico, spaventato, veleno\nSensi Percezione passiva 6; vista cieca 9 m\nLingue comprende le lingue parlate dal personaggio\nGS nessuno (PE 0; BC pari al bonus di competenza del\npersonaggio)\nAzioni\nSchianto. Tiro per colpire in mischia: il bonus equivale\nal modificatore di attacco dell'incantesimo del perso-\nnaggio, portata di 1,5 m Colpito: danni da forza pari\na 1d4 + 3 (taglia Media o inferiore), 2d6 + 3 + il modi-\nficatore di caratteristica da incantatore dell'incantatore\n(taglia Grande) o 2d12 + 3 + il modificatore di caratteri-\nstica da incantatore dell'incantatore (taglia Enorme)."
 },
 {
  "id": "hold-monster",
  "name": "Blocca mostri",
  "nameEn": "Hold Monster",
  "level": 5,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (una sbarra di ferro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore sceglie una creatura entro gittata che egli è in grado di vedere. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane paralizzato per la durata dell'incantesimo. Alla fine di ogni suo turno, il bersaglio ripete il tiro salvezza e, se lo supera, termina l'incantesimo su di sé.",
  "higherLevels": "L'incantatore può bersagliare una creatura aggiuntiva per ogni slot di livello superiore al 5º.",
  "save": "wis"
 },
 {
  "id": "teleportation-circle",
  "name": "Cerchio di teletrasporto",
  "nameEn": "Teleportation Circle",
  "level": 5,
  "school": "conjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "3 metri",
  "components": "V, M (inchiostri rari dal valore di 50 mo o più, che l'incantesimo consuma)",
  "duration": "1 round",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Quando lancia l'incantesimo, l'incantatore traccia un cerchio del diametro di 1,5 metri sul terreno dotato di sigilli che collegano il luogo in cui si trova a un cerchio di teletrasporto permanente a sua scelta, di cui conosce la sequenza di sigilli e che si trova sul suo stesso piano di esistenza. All'interno del cerchio tracciato si apre un portale scintillante che rimane aperto fino al termine del suo turno successivo. Qualsiasi creatura che entra nel portale appare immediatamente entro 1,5 metri dal cerchio di destinazione o nello spazio libero più vicino se tale spazio è occupato.\nNella maggior parte dei casi, templi e palazzi delle gilde più grandi, oltre ad altri luoghi importanti, sono dotati di cerchi di teletrasporto permanenti. Ognuno di essi include una sequenza di sigilli unica: una serie di rune disposte secondo uno schema particolare.\nQuando l'incantatore ottiene per la prima volta la capacità di lanciare questo incantesimo, apprende la sequenza di sigilli abbinata a due destinazioni situate sul Piano Materiale, determinate dal GM. Nel corso delle sue avventure può apprendere ulteriori sequenze di sigilli, imparando a memoria ciascuna di esse dopo 1 minuto di studio.\nL'incantatore può creare un cerchio di teletrasporto permanente lanciando questo incantesimo nello stesso luogo ogni giorno per 365 giorni."
 },
 {
  "id": "flame-strike",
  "name": "Colpo infuocato",
  "nameEn": "Flame Strike",
  "level": 5,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un pizzico di zolfo)",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "Una colonna verticale di fuoco splendente si abbatte dall'alto. Ogni creatura all'interno di un cilindro del raggio di 3 metri e dell'altezza di 12 metri centrato in un punto entro gittata effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 5d6 danni da fuoco e 5d6 danni radiosi, mentre se lo supera subisce soltanto la metà di quei danni.",
  "higherLevels": "I danni da fuoco e i danni radiosi aumentano di 1d6 per ogni slot di livello superiore al 5º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "5d6",
   "damageType": "fire",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "commune",
  "name": "Comunione",
  "nameEn": "Commune",
  "level": 5,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (incenso)",
  "duration": "1 minuto",
  "ritual": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore entra in contatto con una divinità o un emissario divino e, prima della fine dell'incantesimo, pone fino a tre domande a cui è possibile rispondere con sì o no. L'incantatore riceve una risposta corretta per ogni domanda.\nGli esseri divini non sono necessariamente onniscienti, quindi l'incantatore potrebbe ricevere \"ignoto\" come risposta se una domanda riguarda informazioni che vanno oltre le loro conoscenze. Nel caso in cui una risposta di una parola sola possa rivelarsi fuorviante o contraria agli interessi della divinità, il GM può fornire come risposta una breve frase.\nSe l'incantatore lancia l'incantesimo più volte prima di completare un riposo lungo, esiste una probabilità cumulativa del 25% di non ottenere risposta per ogni lancio dopo il primo."
 },
 {
  "id": "commune-with-nature",
  "name": "Comunione con la natura",
  "nameEn": "Commune with Nature",
  "level": 5,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Istantanea",
  "ritual": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore entra in comunione con gli spiriti della natura e acquisisce conoscenza dell'area circostante. All'aperto, l'incantesimo fornisce all'incantatore la conoscenza dell'area entro un raggio di 4,5 chilometri. Nelle caverne e in altri ambienti naturali sotterranei, il raggio è limitato a 90 metri. L'incantesimo non funziona nei luoghi in cui la natura è stata sostituita da costruzioni, come castelli e insediamenti.\nScegli tre dei seguenti fatti; l'incantatore apprende i fatti che riguardano l'area dell'incantesimo:\n• Luoghi di insediamento\n• Ubicazione dei portali che conducono verso altri piani di esistenza\n• Ubicazione di una creatura con grado di sfida pari o superiore a 10 (a scelta del GM) che sia un celestiale, un elementale, un folletto, un immondo o un non morto\n• Il tipo di pianta, minerale o bestia più diffuso (l'incantatore sceglie quale apprendere)\n• Ubicazione di distese d'acqua\nAd esempio, l'incantatore può determinare l'ubicazione di un potente mostro situato in quell'area, l'ubicazione delle distese d'acqua e l'ubicazione di eventuali cittadine."
 },
 {
  "id": "cone-of-cold",
  "name": "Cono di freddo",
  "nameEn": "Cone of Cold",
  "level": 5,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un piccolo cono di cristallo o vetro)",
  "duration": "Istantanea",
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Un getto d'aria gelida si propaga dall'incantatore. Ogni creatura entro un cono di 18 metri che ha origine dall'incantatore effettua un tiro salvezza su Costituzione, subendo 8d8 danni da freddo in caso di fallimento, o la metà dei danni in caso di successo. Una creatura uccisa da questo incantesimo si tramuta in una statua di ghiaccio finché non si scioglie.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 5º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "8d8",
   "damageType": "cold",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "legend-lore",
  "name": "Conoscenza delle leggende",
  "nameEn": "Legend Lore",
  "level": 5,
  "school": "divination",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (incenso del valore di 250 mo o più, che l'incantesimo consuma, e quattro bastoncini d'avorio del valore di 50 mo o più ciascuno)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "wizard"
  ],
  "description": "L'incantatore nomina o descrive una persona, un luogo o un oggetto famosi. L'incantesimo riporta alla mente dell'incantatore un breve riassunto delle conoscenze più significative relative a ciò che ha nominato, come descritto dal GM.\nQueste conoscenze possono includere dettagli importanti, rivelazioni sorprendenti o persino conoscenze segrete che non sono note ai più. Più informazioni l'incantatore conosce già riguardo a ciò che ha nominato, più precise e dettagliate saranno le informazioni che riceverà. Le informazioni che riceve sono accurate, ma potrebbero essere celate da un linguaggio figurativo o sotto forma di poesia, in base alla scelta del GM.\nSe l'incantatore nomina qualche cosa che in realtà non è famosa, sente il suono delle tristi note di un trombone, e l'incantesimo fallisce."
 },
 {
  "id": "contagion",
  "name": "Contagio",
  "nameEn": "Contagion",
  "level": 5,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "7 giorni",
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "Il tocco dell'incantatore trasmette un contagio magico. Il bersaglio deve superare un tiro salvezza su Costituzione, altrimenti subirà 11d8 danni necrotici e sarà avvelenato. Inoltre, quando l'incantatore lancia l'incantesimo, sceglie una caratteristica. Mentre è avvelenato, il bersaglio subisce svantaggio ai tiri salvezza effettuati con la caratteristica scelta.\nIl bersaglio deve ripetere il tiro salvezza alla fine di ogni suo turno finché non raggiunge tre tiri superati o falliti. Se il bersaglio supera tre tiri salvezza, si libera dall'effetto dell'incantesimo. Se il bersaglio fallisce tre tiri salvezza, subisce l'incantesimo per 7 giorni.\nOgni volta che il bersaglio avvelenato riceve un effetto che porrebbe fine all'avvelenamento, deve riuscire a superare un tiro salvezza su Costituzione, altrimenti l'avvelenamento permane.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "11d8",
   "damageType": "necrotic"
  }
 },
 {
  "id": "contact-other-plane",
  "name": "Contattare altri piani",
  "nameEn": "Contact Other Plane",
  "level": 5,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V",
  "duration": "1 minuto",
  "ritual": true,
  "lists": [
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore contatta mentalmente un semidio, lo spirito di un sapiente defunto da tempo o qualche altra entità saggia appartenente a un altro piano. Contattare questa intelligenza ultraterrena può sconvolgere la sua mente: quando l'incantatore lancia questo incantesimo, deve effettuare un tiro salvezza su Intelligenza con CD 15. In caso di successo, l'incantatore può porre all'entità un massimo di cinque domande prima del termine dell'incantesimo. Il GM risponde a ogni domanda con una parola, come per esempio \"sì\", \"no\", \"forse\", \"mai\", \"irrilevante\" o \"ignoto\" (se l'entità non conosce la risposta alla domanda). Nel caso in cui una risposta di una parola sola possa rivelarsi fuorviante, il GM può fornire come risposta una breve frase.\nIn caso di fallimento, l'incantatore subisce 6d6 danni psichici ed è incapacitato finché non completa un riposo lungo. Un incantesimo ristorare superiore fa svanire questo effetto.",
  "save": "int",
  "roll": {
   "kind": "damage",
   "dice": "6d6",
   "damageType": "psychic"
  }
 },
 {
  "id": "geas",
  "name": "Costrizione",
  "nameEn": "Geas",
  "level": 5,
  "school": "enchantment",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "18 metri",
  "components": "V",
  "duration": "30 giorni",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "paladin"
  ],
  "description": "L'incantatore impartisce un comando verbale a una creatura entro gittata che egli è in grado di vedere, ordinandole di compiere un servizio di qualche tipo o ad astenersi dal compiere un'azione o un'attività, come da lui stabilito. Il bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane affascinato per la durata dell'incantesimo. Il bersaglio supera automaticamente il tiro se non è in grado di comprendere il comando dell'incantatore.\nMentre è affascinata, la creatura subisce 5d10 danni psichici se agisce in maniera direttamente contraria al comando dell'incantatore, subendo questi danni non più di una volta al giorno.\nL'incantatore può impartire al bersaglio un comando a sua scelta, a eccezione di un'attività che ne provocherebbe la morte certa: se impartisce un comando suicida, l'incantesimo termina.\nUn incantesimo desiderio, rimuovi maledizione o ristorare superiore è in grado di porre fine all'incantesimo.",
  "higherLevels": "Se l'incantatore usa uno slot incantesimo di 7º o 8º livello, la durata diventa 365 giorni. Se l'incantatore usa uno slot incantesimo di 9º livello, l'incantesimo dura finché uno degli incantesimi menzionati sopra non vi pone fine.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "5d10",
   "damageType": "psychic"
  }
 },
 {
  "id": "creation",
  "name": "Creazione",
  "nameEn": "Creation",
  "level": 5,
  "school": "illusion",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S, M (un pennello)",
  "duration": "Speciale",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore attrae a sé dei filamenti di sostanza d'ombra dalla Coltre Oscura per creare un oggetto entro gittata. L'oggetto può essere di materia vegetale (tessuti, corda, legno o materiali simili) o di materia minerale (pietra, cristallo, metallo o materiali simili). L'oggetto non dev'essere più grande di un cubo con spigolo di 1,5 metri e deve avere una forma ed essere un materiale che l'incantatore ha già visto.\nLa durata dell'incantesimo dipende dal materiale dell'oggetto, come indicato nella tabella Materiali. se l'oggetto è composto da vari materiali, si usa la durata più breve. Usare un qualsiasi oggetto creato da questo incantesimo come componente materiale di un altro incantesimo ne provoca il fallimento.\nMateriali\nMateriale | Durata\nMateria vegetale | 24 ore\nPietra o cristallo | 12 ore\nMetalli preziosi | 1 ora\nGemme | 10 minuti\nAdamantio o mithral | 1 minuto",
  "higherLevels": "Il cubo aumenta di 1,5 metri per spigolo per ogni slot di livello superiore al 5º."
 },
 {
  "id": "mass-cure-wounds",
  "name": "Cura ferite di massa",
  "nameEn": "Mass Cure Wounds",
  "level": 5,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid"
  ],
  "description": "Un'ondata di energia curativa si sprigiona da un punto entro gittata che l'incantatore è in grado di vedere. L'incantatore sceglie fino a sei creature in una sfera di 9 metri di raggio centrata su quel punto: ogni bersaglio recupera una quantità di punti ferita pari a 5d8 più il modificatore di caratteristica da incantatore dell'incantatore.",
  "higherLevels": "La guarigione aumenta di 1d8 per ogni slot di livello superiore al 5º.",
  "roll": {
   "kind": "heal",
   "dice": "5d8",
   "addMod": true,
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "dispel-evil-and-good",
  "name": "Dissolvi il bene e il male",
  "nameEn": "Dispel Evil and Good",
  "level": 5,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (polvere d'argento e ferro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "paladin"
  ],
  "description": "Per la durata dell'incantesimo, celestiali, elementali, folletti, immondi e non morti subiscono svantaggio ai tiri per colpire effettuati contro l'incantatore. L'incantatore può terminare prematuramente l'incantesimo usando una delle funzioni speciali seguenti.\n**Congedo.** Come azione di Magia, l'incantatore bersaglia una creatura che egli è in grado di vedere situata entro 1,5 metri da sé dei tipi sopraindicati. Il bersaglio deve superare un tiro salvezza su Carisma, altrimenti viene cacciata sul suo piano d'origine (se non vi si trova già). Se non si trovano già sul loro piano d'origine, i non morti vengono respinti nella Coltre Oscura e i folletti nella Selva Fatata.\n**Spezzare ammaliamento.** Come azione di Magia, l'incantatore tocca una creatura affascinata, spaventata o posseduta da una o più creature dei tipi sopraindicati. Il bersaglio non è più posseduto, affascinato o spaventato da quelle creature.",
  "save": "cha"
 },
 {
  "id": "dominate-person",
  "name": "Dominare persone",
  "nameEn": "Dominate Person",
  "level": 5,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Un umanoide entro gittata e che l'incantatore è in grado di vedere deve superare un tiro salvezza su Saggezza, altrimenti diventa affascinato per la durata dell'incantesimo. Il bersaglio dispone di vantaggio al tiro salvezza se l'incantatore o i suoi alleati stanno combattendo contro di essa. Ogni volta che il bersaglio subisce danni, ripete il tiro salvezza; se lo supera, l'effetto svanisce.\nL'incantatore ha un legame telepatico con il bersaglio affascinato mentre i due si trovano sullo stesso piano di esistenza. Nel proprio turno, l'incantatore può utilizzare questo legame per impartire comandi al bersaglio (nessuna azione richiesta), come ad esempio \"attacca quella creatura\", \"spostati lì\", o \"recupera quell'oggetto\". Il bersaglio fa del suo meglio per obbedire nel suo turno. Se porta a termine un ordine e non riceve ulteriori istruzioni dall'incantatore, agisce e si muove a suo piacimento, concentrandosi sulla propria incolumità.\nL'incantatore può comandare al bersaglio di effettuare una reazione, ma per farlo dovrà utilizzare la propria reazione.",
  "higherLevels": "La concentrazione dell'incantatore può durare più a lungo utilizzando uno slot incantesimo di 6º livello (fino a 10 minuti), di 7º livello (fino a 1 ora) o di 8º livello o superiore (fino a 8 ore).",
  "save": "wis"
 },
 {
  "id": "conjure-elemental",
  "name": "Evoca elementale",
  "nameEn": "Conjure Elemental",
  "level": 5,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "wizard"
  ],
  "description": "L'incantatore può evocare uno spirito intangibile di taglia Grande dai Piani Elementali che appare in uno spazio libero entro gittata. L'incantatore sceglie l'elemento dello spirito, che ne determina il tipo di danno: aria (fulmine), terra (tuono), fuoco (fuoco) o acqua (freddo). Lo spirito permane per la durata dell'incantesimo.\nOgni volta che una creatura che l'incantatore è in grado di vedere entra nello spazio dello spirito o inizia il suo turno entro un raggio di 1,5 metri da esso, l'incantatore può costringerla a effettuare un tiro salvezza su Destrezza, a patto che lo spirito non stia trattenendo una creatura. In caso di fallimento, il bersaglio subisce 8d8 danni del tipo dello spirito, e il bersaglio è trattenuto fino al termine dell'incantesimo. All'inizio di ogni suo turno, il bersaglio trattenuto ripete il tiro. In caso di fallimento, il bersaglio subisce 4d8 danni del tipo determinato dallo spirito. In caso di successo, il bersaglio non è più trattenuto dallo spirito.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º.",
  "save": "dex"
 },
 {
  "id": "mislead",
  "name": "Fuorviare",
  "nameEn": "Mislead",
  "level": 5,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore diventa invisibile nello stesso momento in cui un suo sosia illusorio appare nel punto in cui si trova. Il sosia permane per la durata dell'incantesimo, ma l'invisibilità termina se non appena l'incantatore effettua un tiro per colpire, infligge danni o lancia un incantesimo.\nCome azione di Magia, l'incantatore può muovere il sosia illusorio fino al doppio della sua velocità e farlo gesticolare, parlare e comportare nel modo che ritiene più opportuno. Il sosia è intangibile e invulnerabile.\nInoltre, l'incantatore può vedere e sentire attraverso il sosia, come se si trovasse nello stesso punto."
 },
 {
  "id": "antilife-shell",
  "name": "Guscio anti-vita",
  "nameEn": "Antilife Shell",
  "level": 5,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "Un'aura si estende dall'incantatore in un'emanazione di 3 metri e permane per la durata dell'incantesimo, impedendo a tutte le creature che non siano non morti e costrutti di attraversarla o protendersi oltre essa. Una creatura influenzata può lanciare incantesimi o effettuare attacchi utilizzando armi a distanza o con portata attraverso la barriera.\nSe l'incantatore si muove in modo che una creatura influenzata sia costretta ad attraversare la barriera, l'incantesimo termina."
 },
 {
  "id": "planar-binding",
  "name": "Legame planare",
  "nameEn": "Planar Binding",
  "level": 5,
  "school": "abjuration",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "18 metri",
  "components": "V, S, M (un gioiello del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore tenta di vincolare un celestiale, un elementale, un folletto o un immondo al suo servizio. La creatura deve trovarsi entro gittata per l'intera durata del lancio dell'incantesimo (in genere, la creatura viene prima evocata al centro di una versione invertita dell'incantesimo cerchio magico per tenerla intrappolata mentre questo incantesimo viene lanciato). Completato il lancio dell'incantesimo, il bersaglio deve superare un tiro salvezza su Carisma, altrimenti è obbligato a servire l'incantatore per la durata dell'incantesimo. Se la creatura è stata evocata o creata da un altro incantesimo, la durata di quell'incantesimo viene estesa per corrispondere alla durata di questo.\nUna creatura vincolata deve eseguire gli ordini al meglio delle sue capacità. L'incantatore potrebbe ordinarle di accompagnarlo in un'avventura, di proteggere un luogo o di consegnare un messaggio. Se la creatura è ostile, cercherà in tutti i modi di distorcere gli ordini dell'incantatore per perseguire i suoi obiettivi personali. Se la creatura porta a termine gli ordini dell'incantatore prima del termine dell'incantesimo, si reca da lui per riferirglielo, ma solo se si trovano sullo stesso piano di esistenza. Se l'incantatore si trova su un piano diverso, la creatura ritorna nel luogo in cui è stata vincolata e vi rimane fino al termine dell'incantesimo.",
  "higherLevels": "La durata aumenta con uno slot incantesimo di 6º livello (10 giorni), di 7º livello (30 giorni), di 8º livello (180 giorni) e di 9º livello (366 giorni).",
  "save": "cha"
 },
 {
  "id": "telepathic-bond",
  "name": "Legame telepatico",
  "nameEn": "Telepathic Bond",
  "level": 5,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (due uova)",
  "duration": "1 ora",
  "ritual": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore stringe un legame telepatico con un massimo di otto creature consenzienti a sua scelta entro gittata, collegando mentalmente ogni creatura a tutte le altre per la durata dell'incantesimo. Le creature che non sono in grado di comunicare in nessuna lingua, non sono influenzate da questo incantesimo.\nFino al termine dell'incantesimo, i bersagli possono comunicare telepaticamente attraverso il legame, a prescindere dal fatto che condividano la stessa lingua. La comunicazione è possibile attraverso qualsiasi distanza, ma non può estendersi ad altri piani di esistenza."
 },
 {
  "id": "arcane-hand",
  "name": "Mano arcana",
  "nameEn": "Arcane Hand",
  "level": 5,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un guscio d'uovo e un guanto)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore crea una mano Grande di energia magica luccicante in uno spazio libero entro gittata che è in grado di vedere. La mano permane per la durata dell'incantesimo e si muove al comando dell'incantatore, imitando i movimenti della sua mano.\nLa mano è un oggetto che possiede CA 20 e una quantità di punti ferita pari ai punti ferita massimi dell'incantatore; se scende a 0 punti ferita, l'incantesimo termina. La mano non occupa spazio.\nQuando l'incantatore lancia l'incantesimo come azione bonus nei suoi turni successivi, può muovere la mano per un massimo di 18 metri e causare uno dei seguenti effetti:\n**Mano interposta.** La mano conferisce all'incantatore mezza copertura contro gli attacchi e altri effetti che hanno origine dal suo spazio o che la attraversano. Inoltre, il suo spazio conta come terreno difficile per i nemici.\n**Mano possente.** La mano tenta di spingere una creatura di taglia Enorme o inferiore situata entro 1,5 metri da essa: Il bersaglio deve superare un tiro salvezza su Forza, altrimenti viene spinto dalla mano fino a una distanza pari a 1,5 metri, più un numero di metri pari a cinque volte il modificatore di caratteristica da incantatore. La mano si muove insieme al bersaglio, rimanendo entro 1,5 metri da esso.\n**Mano stritolatrice.** La mano tenta di afferrare una creatura di taglia Enorme o inferiore situata entro 1,5 metri da essa. Il bersaglio deve superare un tiro salvezza su Destrezza, altrimenti viene afferrato; la CD per sfuggire alla presa è pari alla CD del tiro salvezza sull'incantesimo dell'incantatore. Mentre la mano afferra il bersaglio, l'incantatore può effettuare un'azione bonus per ordinarle di stritolarlo, infliggendogli danni contundenti pari a 4d6 più il modificatore di caratteristica da incantatore dell'incantatore.\n**Pugno serrato.** La mano colpisce un bersaglio che si trova entro 1,5 metri da essa. L'incantatore effettua un attacco con incantesimo in mischia. Se il colpo va a segno, il bersaglio subisce 5d8 danni da forza.",
  "higherLevels": "I danni del pugno serrato aumentano di 2d8 e quelli della mano stritolatrice di 2d6 per ogni slot di livello superiore al 5º.",
  "attack": "melee",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "5d8",
   "damageType": "force"
  }
 },
 {
  "id": "modify-memory",
  "name": "Modificare memoria",
  "nameEn": "Modify Memory",
  "level": 5,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore tenta di alterare i ricordi di un'altra creatura entro gittata che egli è in grado di vedere, la quale effettua un tiro salvezza su Saggezza. Se l'incantatore sta combattendo contro la creatura, essa dispone di vantaggio al tiro salvezza. Se il bersaglio fallisce il tiro, diventa affascinato per la durata dell'incantesimo. Mentre è affascinato, il bersaglio è anche incapacitato e inconsapevole di ciò che gli accade intorno, ma può ancora udire l'incantatore. Se subisce danni o è bersagliato da un altro incantesimo, questo incantesimo termina e nessun ricordo viene modificato.\nFinché questo ammaliamento permane, l'incantatore può alterare il ricordo che il bersaglio ha di un evento avvenuto entro le 24 ore precedenti e della durata massima di 10 minuti. Può eliminare permanentemente tutti i ricordi dell'evento, consentire al bersaglio di ricordarlo con estrema chiarezza, alterare il ricordo di alcuni dettagli o creare il ricordo di un evento diverso.\nPer descrivere in che modo i ricordi vengono alterati, l'incantatore deve parlare con il bersaglio, che deve quindi comprendere il linguaggio usato affinché i ricordi modificati si radichino nella sua mente. La sua mente poi riempie le eventuali lacune presenti nella descrizione dell'incantatore. Se l'incantesimo termina prima che l'incantatore abbia finito di descrivere i ricordi modificati, la memoria della creatura non subisce alcuna alterazione. In caso contrario, i ricordi modificati si radicano nella sua mente e l'incantesimo termina.\nUn ricordo modificato non influenza necessariamente il comportamento di una creatura, in particolare se contraddice le sue inclinazioni naturali, il suo allineamento o le sue convinzioni. Un ricordo modificato illogicamente, come per esempio il falso ricordo di quanto la creatura ami nuotare nell'acido, viene ignorato e considerato come un brutto sogno. Il GM potrebbe ritenere che un ricordo modificato sia troppo insensato per influenzare la creatura.\nUn incantesimo rimuovi maledizione o ristorare superiore lanciato su un bersaglio ripristina i veri ricordi della creatura.",
  "higherLevels": "L'incantatore può alterare i ricordi del bersaglio relativi a un evento risalente fino a 7 giorni prima (slot incantesimo di 6º livello), 30 giorni prima (slot incantesimo di 7º livello), 365 giorni prima (slot incantesimo di 8º livello) o a un qualsiasi momento del suo passato (slot incantesimo di 9º livello).",
  "save": "wis"
 },
 {
  "id": "wall-of-force",
  "name": "Muro di forza",
  "nameEn": "Wall of Force",
  "level": 5,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un frammento di vetro)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "Un muro di forza invisibile si materializza in un punto a scelta dell'incantatore situato entro gittata. Esso appare nell'orientamento che l'incantatore desidera, come barriera orizzontale, verticale o inclinata. Può fluttuare nell'aria o poggiare su una superficie solida. L'incantatore può modellare la barriera in una cupola semisferica o in una sfera del raggio massimo di 3 metri, oppure come una superficie piatta composta da dieci pannelli quadrati con lato di 3 metri. Ogni pannello dev'essere contiguo a un altro pannello. In qualsiasi forma, il muro ha uno spessore di 0,6 centimetri e permane per la durata dell'incantesimo. Se, nel momento in cui appare, il muro passa attraverso lo spazio di una creatura, questa viene spinta verso un lato del muro a scelta dell'incantatore.\nNulla può fisicamente attraversare il muro, che è immune a tutti i danni e non può essere dissolto con dissolvi magie. Tuttavia, un incantesimo disintegrazione lo distrugge all'istante. Il muro si estende anche sul Piano Etereo e blocca i viaggi eterei che lo attraversano."
 },
 {
  "id": "wall-of-stone",
  "name": "Muro di pietra",
  "nameEn": "Wall of Stone",
  "level": 5,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un cubo di granito)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Un muro non magico di solida pietra si materializza in un punto a scelta dell'incantatore situato entro gittata. Il muro è spesso 15 cm ed è composto da pannelli con lato di 3 metri, Ogni pannello dev'essere contiguo a un altro pannello. In alternativa, l'incantatore può creare pannelli di 3 metri per 6 metri spessi solo 8 centimetri.\nSe, nel momento in cui appare, il muro passa attraverso lo spazio di una creatura, questa viene spinta verso un lato del muro a scelta dell'incantatore. Se una creatura rischia di trovarsi circondata su tutti i lati dal muro (o dal muro e un'altra superficie solida) può effettuare un tiro salvezza su Destrezza. In caso di successo, può usare la sua reazione per muoversi fino alla sua velocità massima nel tentativo di non rimanere intrappolata dal muro.\nIl muro può avere la forma desiderata dall'incantatore, ma non può occupare lo stesso spazio di una creatura o un oggetto. Non è necessario che sia verticale o poggi su fondamenta solide, deve tuttavia fondersi ed essere saldamente appoggiato a un blocco di pietra già esistente. È quindi possibile usare questo incantesimo per creare una rampa o realizzare un ponte che attraversi un baratro.\nSe l'incantatore crea una campata di lunghezza superiore a 6 metri, deve dimezzare le dimensioni di ogni pannello per creare dei sostegni. Può modellare rozzamente il muro per creare parapetti e altri elementi simili.\nIl muro è un oggetto in pietra che può essere danneggiato e quindi sfondato. Ogni pannello ha CA 15 e 30 punti ferita per ogni 2,5 centimetri di spessore ed è immune ai danni da veleno e psichici. Quando un pannello scende a 0 punti ferita, viene distrutto e potrebbe causare il crollo dei pannelli collegati, a discrezione del GM.\nSe l'incantatore mantiene la concentrazione su questo incantesimo per l'intera durata, il muro diventa permanente e non può essere rimosso. In caso contrario, il muro scompare al termine dell'incantesimo.",
  "save": "dex"
 },
 {
  "id": "cloudkill",
  "name": "Nube mortale",
  "nameEn": "Cloudkill",
  "level": 5,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore genera una sfera di nebbia giallo-verdastra del raggio di 6 metri centrata su un punto entro gittata. La nebbia permane la durata dell'incantesimo o finché un vento forte (come quello creato da folata di vento) non la disperde, ponendo fine all'incantesimo. L'area della sfera è pesantemente oscurata.\nOgni creatura nella sfera effettua un tiro salvezza su Costituzione, subendo 5d8 danni da veleno in caso di fallimento, o la metà dei danni in caso di successo. Una creatura deve effettuare questo tiro salvezza anche quando la sfera si muove nel suo spazio e quando la creatura entra nella sfera o vi termina il suo turno. Una creatura effettua questo tiro salvezza solo una volta per turno.\nLa sfera si allontana di 3 metri dall'incantatore all'inizio di ogni suo turno.",
  "higherLevels": "I danni aumentano di 1d8 per ogni slot di livello superiore al 4º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "5d8",
   "damageType": "poison",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "passwall",
  "name": "Passapareti",
  "nameEn": "Passwall",
  "level": 5,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (un pizzico di semi di sesamo)",
  "duration": "1 ora",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore sceglie un punto entro gittata e che egli è in grado di vedere su una superficie di legno, pietra o intonaco (come una parete, un soffitto o un pavimento), dove si apre un passaggio che permane per la durata dell'incantesimo. L'incantatore sceglie inoltre le dimensioni dell'apertura, che non possono superare una larghezza di 1,5 metri, un'altezza di 2,4 metri e una profondità di 6 metri. Il passaggio non crea alcuna instabilità nella struttura che lo circonda.\nQuando l'apertura scompare, qualsiasi creatura o oggetto all'interno del passaggio creato dall'incantesimo viene espulso senza subire danni nello spazio libero più vicino alla superficie su cui l'incantesimo è stato lanciato."
 },
 {
  "id": "insect-plague",
  "name": "Piaga degli insetti",
  "nameEn": "Insect Plague",
  "level": 5,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "90 metri",
  "components": "V, S, M (una locusta)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "sorcerer"
  ],
  "description": "Uno sciame di locuste riempie una sfera del raggio di 6 metri centrata su un punto a scelta dell'incantatore situato entro gittata. La sfera permane per la durata dell'incantesimo, la sua area è leggermente oscurata e lo spazio al suo interno è considerato terreno difficile.\nQuando lo sciame compare, ogni creatura al suo interno effettua un tiro salvezza su Costituzione, subendo 4d10 danni perforanti in caso di fallimento, o la metà dei danni in caso di successo. Inoltre, una creatura effettua questo tiro salvezza anche quando entra nell'area dell'incantesimo per la prima volta in un turno o quando vi termina il suo turno. Una creatura effettua questo tiro salvezza solo una volta per turno.",
  "higherLevels": "I danni aumentano di 1d10 per ogni slot di livello superiore al 5º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "4d10",
   "damageType": "piercing",
   "perSlotLevel": "1d10"
  }
 },
 {
  "id": "reincarnate",
  "name": "Reincarnazione",
  "nameEn": "Reincarnate",
  "level": 5,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (oli rari del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "druid"
  ],
  "description": "L'incantatore tocca un umanoide defunto o una parte di umanoide defunto. Se la creatura non è morta da più di 10 giorni, l'incantesimo le forma un nuovo corpo e richiama la sua anima all'interno di quel corpo. Si tira 1d10 e si consulta la tabella di seguito per determinare la specie del nuovo corpo, oppure il GM sceglie un'altra specie giocabile.\n1d10 | Specie | 1d10 | Specie\n1 | Il personaggio | 6 | Halfling\ntira di nuovo\n2 | Dragonide | 7 | Nano\n3 | Elfo | 8 | Orchesco\n4 | Gnomo | 9 | Tiefling\n5 | Goliath | 10 | Umano\nLa creatura reincarnata compie le scelte indicate nella descrizione della specie scelta e ricorda la sua vita precedente. Conserva le capacità che possedeva nella sua forma originale, ad eccezione del fatto che i tratti della sua specie originaria vengono sostituiti dai tratti della nuova specie."
 },
 {
  "id": "raise-dead",
  "name": "Rianimare morti",
  "nameEn": "Raise Dead",
  "level": 5,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (un diamante del valore di 500 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "paladin"
  ],
  "description": "Con un tocco, l'incantatore riporta in vita una creatura morta, purché non sia deceduta da più di 10 giorni e non fosse un non morto al momento della morte.\nLa creatura torna in vita con 1 punto ferita. Inoltre, questo incantesimo neutralizza qualsiasi veleno che influenzava la creatura al momento della morte.\nL'incantesimo richiude tutte le ferite mortali, ma non ripristina le parti del corpo mancanti. Se una creatura è priva di organi o parti del corpo essenziali per la sua sopravvivenza, come per esempio la testa, l'incantesimo fallisce automaticamente.\nIl ritorno dalla morte è un vero e proprio travaglio. Il bersaglio subisce una penalità di −4 alle prove con d20. Ogni volta che completa un riposo lungo, questa penalità viene ridotta di 1 finché non arriva a 0."
 },
 {
  "id": "summon-dragon",
  "name": "Richiama drago",
  "nameEn": "Summon Dragon",
  "level": 5,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un oggetto su cui è incisa l'imma- gine di un drago, del valore di 500 mo o più)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore invoca uno spirito di drago, che si manifesta in uno spazio libero entro gittata che egli sia in grado di vedere e utilizza la scheda delle statistiche dello spirito draconico. La creatura scompare quando scende a 0 punti ferita o quando sag 14 l'incantesimo termina ed è un alleato per il personaggio e i suoi alleati. In combattimento, la creatura ha lo stesso punteggio di iniziativa dell'incantatore, ma inizia il turno immediatamente dopo il suo, obbedendo ai suoi comandi verbali (nessuna azione richiesta da parte dell'incantatore). Se l'incantatore non pronuncia comandi verbali, la creatura compie l'azione di Schivata e usa il suo movimento per sottrarsi al pericolo.",
  "higherLevels": "Usa il livello dello slot incantesimo relativo al livello dell'incantesimo nella scheda delle statistiche.\nSpirito draconico\nDrago Grande, neutrale\nCA 14 + il livello dell'incantesimo\nPF 50 + 10 per ogni livello di incantesimo sopra il 5º\nVelocità 9 m, volo 18 m, nuoto 9 m\nMOD SALV | MOD SALV | MOD SALV\nF | or | 19 | +4 +4 | D | es | 14 | +2 +2 | C | os | 17 +3 +3\nI | nt | 10 +0 +0 | +2 +2 | C | ar | 14 | +2 +2\nResistenze acido, freddo, fulmine, fuoco, veleno\nImmunità affascinato, avvelenato, spaventato\nSensi Percezione passiva 30; scurovisione 18 m, vista\ncieca 3 m\nLingue Draconico, comprende le lingue parlate dal\npersonaggio\nGS nessuno (PE 0; BC pari al bonus di competenza del\npersonaggio)\nTratti\nResistenze condivise. Quando il personaggio evoca\nlo spirito, sceglie una delle sue resistenze. Così facendo,\nottiene resistenza al tipo di danno scelto fino al termine\ndell'incantesimo.\nAzioni\nMultiattacco. Lo spirito effettua un numero di attacchi\nSquarcio pari alla metà del livello dell'incantesimo\n(arrotondando per difetto) e usa Soffio.\nSquarcio. Tiro per colpire in mischia: il bonus equivale\nal modificatore di attacco dell'incantesimo del perso-\nnaggio, portata di 3 metri. Colpito: 1d6 + 4 + il livello\ndell'incantesimo danni perforanti.\nSoffio. Tiro salvezza su Destrezza: la CD è pari alla\nCD del tiro salvezza sull'incantesimo, ogni creatura\nin un cono di 9 m. Fallimento: 2d6 danni di un tipo\na cui lo spirito è resistente (a scelta dell'incantatore\nal momento del lancio dell'incantesimo). Successo:\ndanni dimezzati."
 },
 {
  "id": "greater-restoration",
  "name": "Ristorare superiore",
  "nameEn": "Greater Restoration",
  "level": 5,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere di diamante del valore di 100 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "paladin",
   "ranger"
  ],
  "description": "L'incantatore tocca una creatura e rimuove magicamente da essa uno dei seguenti effetti:\n• 1 livello di indebolimento\n• La condizione affascinato o pietrificato\n• Una maledizione, inclusa la sintonia del bersaglio con un oggetto magico maledetto\n• Qualsiasi riduzione di un punteggio di caratteristica del bersaglio\n• Qualsiasi riduzione dei punti ferita massimi del bersaglio"
 },
 {
  "id": "awaken",
  "name": "Risveglio",
  "nameEn": "Awaken",
  "level": 5,
  "school": "transmutation",
  "castingTime": "8 ore",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (un'agata del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "druid"
  ],
  "description": "L'incantatore trascorre il tempo di lancio tracciando percorsi magici su una pietra preziosa, poi tocca il bersaglio. Il bersaglio deve essere una bestia o una creatura vegetale con Intelligenza pari o inferiore a 3 o una pianta naturale che non sia una creatura. Il bersaglio acquisisce Intelligenza pari a 10 e la capacità di parlare una lingua conosciuta dall'incantatore. Se il bersaglio è una pianta naturale, diventa una creatura vegetale e ottiene l'abilità di muovere i suoi rami, radici, liane, rampicanti e così via e sviluppa sensi simili a quelli umani. Il GM sceglie le statistiche appropriate per il vegetale risvegliato, come per esempio nel caso di un cespuglio risvegliato o di un albero risvegliato, in \"Mostri\".\nIl bersaglio risvegliato rimane affascinato per 30 giorni o finché l'incantatore o i suoi alleati non gli infliggono danni. Quando l'effetto di tale condizione svanisce, la creatura risvegliata sceglie il suo atteggiamento nei confronti dell'incantatore."
 },
 {
  "id": "hallow",
  "name": "Santificare",
  "nameEn": "Hallow",
  "level": 5,
  "school": "abjuration",
  "castingTime": "24 ore",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (incenso del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore tocca un punto e infonde un potere sacro o sacrilego in un'area del raggio massimo di 18 metri intorno a esso. L'incantesimo tuttavia fallisce se il raggio comprende un'area già sotto l'effetto di santificare. L'area influenzata è soggetta ai seguenti effetti:\n**Protezione consacrata.** L'incantatore sceglie uno dei seguenti tipi di creature: aberrazione, celestiale, elementale, folletto, immondo o non morto. Le creature del tipo scelto non possono entrare volontariamente nell'area, e qualsiasi creatura affascinata, spaventata o posseduta da tali creature non viene affascinata, spaventata o posseduta fintantoché si trova nell'area.\n**Effetto aggiuntivo.** L'incantatore vincola un effetto aggiuntivo all'area, scegliendolo dalla lista sottostante:\n**Coraggio.** Le creature di qualsiasi tipo scelto dall'incantatore non possono essere spaventate finché si trovano nell'area.\n**Interferenza extradimensionale.** Le creature di qualsiasi tipo scelte dall'incantatore non possono entrare o uscire dall'area utilizzando il teletrasporto o i viaggi interplanari.\n**Linguaggi.** Le creature di qualsiasi tipo scelto dall'incantatore possono comunicare con qualsiasi creatura all'interno dell'area, anche se non condividono la stessa lingua.\n**Luce diurna.** L'area è pervasa di luce intensa. L'oscurità magica creata dagli incantesimi di livello inferiore rispetto a questo incantesimo non può sopprimere la luce.\n**Oscurità.** L'area si riempie di oscurità. La luce normale, nonché la luce magica creata dagli incantesimi di livello inferiore rispetto a questo incantesimo, non possono illuminare l'area.\n**Paura.** Le creature di qualsiasi tipo scelto finché si trovano nell'area.\n**Resistenza.** Le creature di qualsiasi tipo scelto dall'incantatore sono resistenti a un tipo di danno dall'incantatore non possono essere spaventate scelto dall'incantatore finché si trovano nell'area.\n**Sereno riposo.** I cadaveri sepolti nell'area non possono diventare non morti.\n**Silenzio.** L'area è insonorizzata, nessun suono può fuoriuscire o penetrare al suo interno.\n**Vulnerabilità.** Le creature di qualsiasi tipo scelto dall'incantatore sono vulnerabili a un tipo di danno scelto dall'incantatore finché si trovano nell'area."
 },
 {
  "id": "scrying",
  "name": "Scrutare",
  "nameEn": "Scrying",
  "level": 5,
  "school": "divination",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (un focus del valore di 1.000 mo o più, come una sfera di cristallo, uno specchio o una fonte d'acqua)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore può vedere e udire una creatura a sua scelta situata sul suo stesso piano di esistenza. Il bersaglio effettua un tiro salvezza su Saggezza, modificato (vedi le tabelle di seguito) dalla conoscenza e dal tipo di legame fisico che l'incantatore ha nei confronti della creatura. Il bersaglio non sa contro cosa sta effettuando il tiro salvezza, avverte solo una sensazione di disagio.\nL'incantatore conosce il bersaglio in | Modificatore\nmaniera... | al tiro salvezza\nIndiretta (ha sentito parlare del | +5\nbersaglio)\nDiretta (ha incontrato il bersaglio) | +0\nApprofondita (conosce bene | −5\nil bersaglio)\nL'oggetto del bersaglio che | Modificatore\nl'incantatore possiede è... | al tiro salvezza\nImmagine o altra raffigurazione | −2\nAbito o altro oggetto personale | −4\nParte del corpo, ciocca di capelli | −10\no pezzo di unghia\nIn caso di tiro salvezza superato, il bersaglio non viene influenzato dall'incantesimo, che l'incantatore non può lanciare su di esso per 24 ore.\nIn caso di fallimento, l'incantesimo crea un sensore invisibile e intangibile entro 3 metri dal bersaglio, attraverso cui l'incantatore può vedere e sentire come se si trovasse sul posto. Il sensore si muove insieme al bersaglio, rimanendo entro 3 metri da esso per la durata dell'incantesimo. Se qualcosa è in grado di vedere il sensore, esso appare come un globo luminoso grande all'incirca quanto un pugno umano.\nInvece di bersagliare una creatura, l'incantatore può bersagliare un luogo che ha già visto. Quando lo fa, il sensore appare in quel luogo e non si muove.",
  "save": "wis"
 },
 {
  "id": "seeming",
  "name": "Sembrare",
  "nameEn": "Seeming",
  "level": 5,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "8 ore",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore assegna un aspetto illusorio a ogni creatura a sua scelta entro gittata che egli è in grado di vedere. Un bersaglio non consenziente può effettuare un tiro salvezza su Carisma e, se lo supera, non ne viene influenzato.\nL'incantatore può assegnare lo stesso aspetto oaspetti diversi ai bersagli. L'incantesimo consente di modificare l'aspetto fisico e l'equipaggiamento dei bersagli. Ogni creatura può apparire 30 centimetri più alta o più bassa, più grassa o più magra. Il nuovo aspetto del bersaglio deve usare la stessa disposizione basilare degli arti del bersaglio. Entro questi limiti, la natura dell'illusione dipende dall'incantatore. L'incantesimo permane per tutta la sua durata.\nI cambiamenti apportati da questo incantesimo non passano il vaglio di un'ispezione fisica. Per esempio, se l'incantatore usa questo incantesimo per aggiungere un cappello all'abbigliamento della creatura, gli oggetti sono in grado di attraversarlo.\nUna creatura che effettua l'azione di Studio per esaminare un bersaglio può effettuare una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se la supera, capisce che il bersaglio è camuffato.",
  "save": "cha"
 },
 {
  "id": "dream",
  "name": "Sogno",
  "nameEn": "Dream",
  "level": 5,
  "school": "illusion",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Speciale",
  "components": "V, S, M (una manciata di sabbia)",
  "duration": "8 ore",
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore bersaglia una creatura che conosce sullo stesso piano di esistenza. L'incantatore o una creatura consenziente da lui toccata entra in uno stato di trance, assumendo il ruolo di messaggero onirico. Durante la trance, il messaggero è incapacitato e la sua velocità è pari a 0.\nSe il bersaglio dorme, il messaggero gli appare in sogno e può conversare con lui finché rimane addormentato e l'incantesimo non termina. Il messaggero può anche modellare l'ambiente del sogno, creando paesaggi, oggetti e altre immagini. Il messaggero può uscire dalla trance in ogni momento, terminando l'incantesimo. Al suo risveglio, il bersaglio ricorda il sogno perfettamente.\nSe il bersaglio è sveglio quando l'incantatore lancia l'incantesimo, il messaggero ne è consapevole e può terminare la trance (e l'incantesimo) o aspettare che il bersaglio si addormenti e così apparire nei suoi sogni.\nL'incantatore può fare in modo che il messaggero appaia terrificante al bersaglio. In questo caso, il messaggero può trasmettere un messaggio di massimo dieci parole e poi il bersaglio effettua un tiro salvezza su Saggezza. In caso di fallimento, il bersaglio non ottiene alcun beneficio dal suo riposo e subisce 3d6 danni psichici al risveglio.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "3d6",
   "damageType": "psychic"
  }
 },
 {
  "id": "telekinesis",
  "name": "Telecinesi",
  "nameEn": "Telekinesis",
  "level": 5,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore ottiene la capacità di spostare o manipolare creature e oggetti con la forza del pensiero. Al lancio e come sua azione di Magia ogni turno successivo prima del termine dell'incantesimo, l'incantatore può esercitare la propria volontà su una creatura o un oggetto entro gittata che egli è in grado di vedere, provocando l'effetto appropriato descritto di seguito. L'incantatore può influenzare lo stesso bersaglio in ogni round o sceglierne uno nuovo in ogni momento. Se cambia bersaglio, quello precedente non risentirà più degli effetti dell'incantesimo.\n**Creatura.** L'incantatore può provare a spostare una creatura di taglia Enorme o inferiore. Il bersaglio deve superare un tiro salvezza su Forza, altrimenti verrà spostato dall'incantatore di massimo 9 metri in una direzione entro la gittata dell'incantesimo. Fino alla fine del suo turno successivo, la creatura è trattenuta e, se alzata a mezz'aria, rimarrà sospesa lì. Cadrà al termine del turno successivo dell'incantatore, a meno che non utilizzi di nuovo questa opzione su di essa e fallisca il tiro salvezza.\n**Oggetto.** L'incantatore può provare a spostare un oggetto di taglia Enorme o inferiore. Se esso non è indossato o trasportato, lo sposta automaticamente fino a 9 metri in qualsiasi direzione entro la gittata dell'incantesimo.\nSe l'oggetto è indossato o trasportato da una creatura, quest'ultima deve superare un tiro salvezza su Forza, altrimenti l'incantatore lo tirerà via e lo sposterà fino a 9 metri in qualsiasi direzione entro la gittata dell'incantesimo.\nCon la sua presa telecinetica, l'incantatore può esercitare un controllo più preciso sugli oggetti, come manipolare uno strumento semplice.",
  "save": "str"
 },
 {
  "id": "tree-stride",
  "name": "Traslazione arborea",
  "nameEn": "Tree Stride",
  "level": 5,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "ranger"
  ],
  "description": "L'incantatore ottiene la capacità di entrare in un albero e muoversi al suo interno fino ad arrivare a un altro albero dello stesso tipo posto entro 150 metri. Entrambi gli alberi devono essere vivi e di taglia pari o superiore a quella dell'incantatore, che deve usare 1,5 metri di movimento per entrare in uno di essi. L'incantatore apprende immediatamente l'ubicazione di tutti gli altri alberi dello stesso tipo entro 150 metri e, come parte del movimento usato per entrare nell'albero, può scegliere se passare in uno di quegli alberi o riemergere da quello in cui si trova. L'incantatore ricompare in un punto a sua scelta entro 1,5 metri dall'albero di destinazione, usando ulteriori 1,5 metri di movimento. Se non gli rimane più alcun movimento, ricompare entro 1,5 metri dall'albero in cui è entrato.\nQuest'abilità di trasporto è utilizzabile una sola volta per turno. Inoltre, l'incantatore deve concludere ogni suo turno fuori dall'albero."
 },
 {
  "id": "planar-ally",
  "name": "Alleato planare",
  "nameEn": "Planar Ally",
  "level": 6,
  "school": "conjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore chiede aiuto a un'entità ultraterrena che deve essergli nota: un dio, un principe dei demoni o qualche altro essere dotato di poteri cosmici. Quell'entità invia in aiuto un celestiale, un elementale o un immondo a lei fedele, che appare in uno spazio libero entro gittata. Se l'incantatore conosce il nome di una creatura specifica, può pronunciarlo quando lancia l'incantesimo per richiedere il suo intervento, ma potrebbe apparire comunque una creatura diversa (a scelta del GM).\nQuando la creatura appare, non è obbligata a comportarsi in un modo particolare. L'incantatore può chiederle di svolgere per lui un servizio in cambio di pagamento, ma essa non è costretta ad accettare. Il compito richiesto potrebbe essere qualcosa di semplice (\"portaci in volo oltre il baratro\" o \"aiutaci a combattere una battaglia\") o di complesso (\"spia i nostri nemici\" o \"proteggici durante la nostra incursione nel dungeon\"). L'incantatore deve essere in grado di comunicare con la creatura per contrattare per i suoi servigi.\nIl pagamento può avere varie forme: Un celestiale potrebbe richiedere un'ingente donazione in oro o oggetti magici a un tempio alleato, un immondo esigere una creatura vivente in sacrificio o un tesoro in dono. Alcune creature potrebbero scambiare i propri servigi con una missione che l'incantatore deve svolgere.\nUn compito che può essere misurato in minuti richiede un pagamento del valore di 100 mo al minuto, un compito misurato in ore richiede 1.000 mo all'ora e un compito misurato in giorni (per un massimo di 10 giorni) richiede 10.000 mo al giorno. Il GM può modificare questi pagamenti in base alle circostanze del lancio. Se il compito è in sintonia con l'etica della creatura, il pagamento potrebbe essere dimezzato o addirittura revocato. I compiti non pericolosi richiedono tipicamente solo la metà del pagamento suggerito, mentre quelli particolarmente rischiosi potrebbero richiedere una ricompensa superiore. È raro che una creatura accetti un compito potenzialmente suicida.\nDopo aver portato a termine il compito o quando la durata pattuita termina, la creatura fa ritorno al suo piano d'origine dopo aver fatto rapporto all'incantatore, se possibile. Se l'incantatore e la creatura non riescono ad accordarsi sul prezzo del suo servizio, quest'ultima ritorna immediatamente sul suo piano d'origine."
 },
 {
  "id": "sunbeam",
  "name": "Bagliore solare",
  "nameEn": "Sunbeam",
  "level": 6,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una lente d'ingrandimento)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore lancia un bagliore solare in una linea larga 1,5 metri e lunga 18 metri. Ogni creatura nella sua traiettoria effettua un tiro salvezza su Costituzione e, se lo fallisce, subisce 6d8 danni radiosi e rimane accecata fino all'inizio del turno successivo dell'incantatore. Se lo supera, invece, subisce solo la metà dei danni.\nFino al termine dell'incantesimo, l'incantatore può effettuare un'azione di Magia per creare una nuova linea radiosa.\nPer la durata dell'incantesimo, una scintilla di luce radiosa risplende nella sua mano ed emana luce intensa in un raggio di 9 metri e luce fioca per ulteriori 9 metri. Questa luce è considerata luce solare.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "6d8",
   "damageType": "radiant"
  }
 },
 {
  "id": "heroes-feast",
  "name": "Banchetto degli eroi",
  "nameEn": "Heroes’ Feast",
  "level": 6,
  "school": "conjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (una ciotola tempestata di gemme del valore di 1.000 mo o più, che l'incantesimo con- suma)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric",
   "druid"
  ],
  "description": "L'incantatore evoca accanto a sé un banchetto che appare su una superficie all'interno di un cubo libero con spigolo di 3 metri. Consumare il banchetto richiede 1 ora, solo al termine della quale il convivio scompare e i suoi effetti benefici vengono applicati. Fino a un massimo di dodici creature possono partecipare al banchetto.\nUna creatura che partecipa al banchetto ottiene numerosi benefici che durano 24 ore. La creatura diventa resistente ai danni da veleno e immune alle condizioni avvelenato e spaventato. Inoltre, i suoi punti ferita massimi aumentano di 2d10 e ottiene lo stesso numero di punti ferita."
 },
 {
  "id": "blade-barrier",
  "name": "Barriera di lame",
  "nameEn": "Blade Barrier",
  "level": 6,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore crea un muro di lame turbinanti composte da energia magica. Il muro compare entro gittata e permane per la durata dell'incantesimo. L'incantatore crea un muro lineare lungo fino a 30 metri, alto 6 metri e spesso 1,5 metri, oppure un muro circolare del diametro massimo di 18 metri, alto 6 metri e spesso 1,5 metri. Il muro garantisce tre quarti di copertura e il suo spazio è un terreno difficile.\nQualsiasi creatura situata nello spazio del muro deve effettuare un tiro salvezza su Destrezza, subendo 6d10 danni forza in caso di fallimento, o la metà dei danni in caso di successo. Una creatura effettua il tiro salvezza anche se entra nello spazio del muro o vi termina il suo turno. Il tiro salvezza può essere effettuato solo una volta per turno.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "6d10",
   "damageType": "force"
  }
 },
 {
  "id": "wind-walk",
  "name": "Camminare nel vento",
  "nameEn": "Wind Walk",
  "level": 6,
  "school": "transmutation",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S, M (una candela)",
  "duration": "8 ore",
  "lists": [
   "druid"
  ],
  "description": "L'incantatore e un massimo di dieci creature consenzienti a sua scelta entro gittata assumono una forma gassosa per la durata dell'incantesimo, apparendo come sbuffi di nuvole. Finché il bersaglio ha queste sembianze, ha una velocità di volo di 90 metri e può fluttuare. Inoltre, è immune alla condizione prono e resistente ai danni contundenti, perforanti e taglienti. Le uniche azioni che può effettuare in questa forma sono l'azione Scatto, un'azione di Magia o riassumere la propria forma normale. Quest'ultima opzione richiede 1 minuto, durante il quale il bersaglio è stordito. Fino al termine dell'incantesimo, il bersaglio può assumere nuovamente la forma di nuvola usando un'azione di Magia seguita da 1 minuto di trasformazione.\nSe una creatura è in forma gassosa e sta volando quando l'effetto termina, scende di 18 metri per round per 1 minuto finché non atterra, senza subire danni. Se tuttavia non riesce ad atterrare in 1 minuto, cade per la distanza rimanente."
 },
 {
  "id": "flesh-to-stone",
  "name": "Carne in pietra",
  "nameEn": "Flesh to Stone",
  "level": 6,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (una piuma di coccatrice)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore tenta di tramutare in pietra una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Costituzione. In caso di fallimento, è trattenuto per la durata dell'incantesimo. In caso di successo, la sua velocità è pari a 0 fino all'inizio del turno successivo dell'incantatore. I costrutti superano automaticamente il tiro salvezza.\nUn bersaglio trattenuto effettua un altro tiro salvezza su Costituzione al termine di ogni suo turno. L'incantesimo termina se il bersaglio supera per tre volte il tiro salvezza contro questo incantesimo. Mentre se lo fallisce per tre volte, viene tramutato in pietra e diventa pietrificato per la durata dell'incantesimo. Non è necessario che i tiri superati o falliti siano consecutivi: si tiene semplicemente il conto di entrambi finché il bersaglio non ne accumula tre di un certo tipo.\nSe l'incantatore mantiene la concentrazione su questo incantesimo per l'intera durata possibile, il bersaglio è pietrificato fino a quando non viene posta fine alla condizione con ristorare superiore o un'altra magia simile.",
  "save": "con"
 },
 {
  "id": "chain-lightning",
  "name": "Catena di fulmini",
  "nameEn": "Chain Lightning",
  "level": 6,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (tre spilli d'argento)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore scaglia un fulmine verso un bersaglio entro gittata e che egli è in grado di vedere. Tre fulmini sfrecciano poi dal bersaglio verso un massimo di altri tre bersagli a scelta dell'incantatore, ognuno dei quali deve trovarsi entro 9 metri dal primo. I bersagli dell'incantesimo possono essere creature o oggetti e possono essere bersagliati soltanto da uno dei fulmini.\nOgni bersaglio effettua un tiro salvezza su Destrezza, subendo 10d8 danni da fulmine in caso di fallimento, o la metà dei danni in caso di successo.",
  "higherLevels": "Un fulmine aggiuntivo si trasmette dal primo bersaglio a un altro bersaglio per ogni slot di livello superiore al 6º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "10d8",
   "damageType": "lightning"
  }
 },
 {
  "id": "circle-of-death",
  "name": "Cerchio di morte",
  "nameEn": "Circle of Death",
  "level": 6,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (polvere ricavata da una perla nera frantumata, del valore di 500 mo o più)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Un flusso di energia negativa si espande in una sfera del raggio di 18 metri da un punto a scelta dell'incantatore situato entro gittata. Ogni creatura nell'area effettua un tiro salvezza su Costituzione, subendo 8d8 danni necrotici in caso di fallimento, o la metà dei danni in caso di successo.",
  "higherLevels": "I danni aumentano di 2d8 per ogni slot di livello superiore al 6º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "8d8",
   "damageType": "necrotic",
   "perSlotLevel": "2d8"
  }
 },
 {
  "id": "contingency",
  "name": "Contingenza",
  "nameEn": "Contingency",
  "level": 6,
  "school": "abjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (una statuetta dell'incantatore tempestata di gemme, del valore di 1.500 mo o più)",
  "duration": "10 giorni",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore sceglie un incantesimo di livello pari o inferiore a 5 che sia in grado di lanciare, che abbia un tempo di lancio di un'azione e che possa avere come bersaglio l'incantatore stesso. Lancia l'incantesimo, chiamato incantesimo contingente, come parte del lancio di contingenza, consumando gli slot incantesimo per entrambi. L'incantesimo contingente, tuttavia, non ha effetto finché non si verificano determinati inneschi che l'incantatore descrive nel momento in cui lancia i due incantesimi. Per esempio, un lancio di contingenza con respirare sott'acqua potrebbe stabilire che respirare sott'acqua avrà effetto quando l'incantatore sarà sommerso nell'acqua o in un liquido simile.\nChe l'incantatore lo desideri o meno, l'incantesimo contingente ha effetto nel momento in cui gli inneschi vengono soddisfatti per la prima volta, poi contingenza termina.\nL'incantesimo contingente ha effetto solamente sull'incantatore, nonostante normalmente possa essere lanciato su altri bersagli. L'incantatore può utilizzare un solo incantesimo contingenza alla volta. Se l'incantatore lancia nuovamente questo incantesimo, l'effetto di un altro incantesimo contingenza su di sé termina. Inoltre, contingenza termina qualora la sua componente materiale non si trovi sulla persona dell'incantatore."
 },
 {
  "id": "create-undead",
  "name": "Creare non morti",
  "nameEn": "Create Undead",
  "level": 6,
  "school": "necromancy",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "3 metri",
  "components": "V, S, M (una pietra onice nera del valore di 150 mo o più per ogni cadavere)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore può lanciare questo incantesimo solo di notte, scegliendo fino a tre cadaveri umanoidi di taglia Media o Piccola entro gittata. Ognuno di loro diventa un ghoul sotto il controllo dell'incantatore (vedi il \"Mostri\" per la scheda delle statistiche).\nCome azione bonus a ogni suo turno, l'incantatore può comandare mentalmente qualsiasi creatura animata con questo incantesimo, a patto che la creatura si trovi entro 36 metri da lui (se controlla varie creature, l'incantatore può comandarne più di una allo stesso momento, impartendo lo stesso comando a ciascuna di loro). L'incantatore decide quale azione effettuerà la creatura e dove si muoverà nel suo turno successivo, oppure può impartirle un comando generale, come restare a guardia di un determinato luogo. Se invece non impartisce alcun comando, la creatura effettua l'azione Schivata e si sposta solo per evitare di subire danni. Una volta ricevuto un ordine, la creatura continua a seguirlo finché non ha portato a termine il compito.\nLa creatura rimane sotto il controllo dell'incantatore per 24 ore, passate le quali smette di obbedire a qualsiasi comando ulteriore. Per mantenere il controllo sulla creatura per altre 24 ore, l'incantatore deve lanciare questo incantesimo su di essa prima che l'attuale periodo di 24 ore termini. Questo uso dell'incantesimo gli permette di ristabilire il controllo su un massimo di tre creature da lui animate tramite questo incantesimo, anziché animarne di nuove.",
  "higherLevels": "Se l'incantatore usa uno slot incantesimo di 7º livello, può animare o ristabilire il controllo su quattro ghoul. Se l'incantatore usa uno slot incantesimo di 8º livello, può animare o ristabilire il controllo su cinque ghoul, o due ghast o wight. Se l'incantatore usa uno slot incantesimo di 9º livello, può animare o ristabilire il controllo su sei ghoul, tre ghast o wight, o due mummie. Vedi \"Mostri\" per le relative schede delle statistiche."
 },
 {
  "id": "irresistible-dance",
  "name": "Danza irresistibile",
  "nameEn": "Irresistible Dance",
  "level": 6,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "Una creatura entro gittata che l'incantatore è in grado di vedere deve effettuare un tiro salvezza su Saggezza. In caso di successo, il bersaglio danza comicamente fino al termine del proprio turno successivo, durante il quale deve spendere tutto il suo movimento danzando sul posto.\nSe il bersaglio fallisce il tiro, diventa affascinato per la durata dell'incantesimo. Mentre è affascinato, il bersaglio danza comicamente, deve spendere tutto il suo movimento danzando sul posto, subisce svantaggio ai tiri salvezza su Destrezza e ai tiri per colpire, e le altre creature dispongono di vantaggio ai tiri per colpire contro di esso. In ognuno dei suoi turni, il bersaglio può effettuare un'azione per riprendere il controllo di sé e ripetere il tiro salvezza. Se lo supera, l'incantesimo termina.",
  "save": "wis"
 },
 {
  "id": "disintegrate",
  "name": "Disintegrazione",
  "nameEn": "Disintegrate",
  "level": 6,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (una calamita e della polvere)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore lancia un raggio verde verso un bersaglio entro gittata che egli è in grado di vedere. Il bersaglio può essere una creatura, un oggetto non magico o una creazione di forza magica, come un muro creato da muro di forza.\nUna creatura bersagliata da questo incantesimo effettua un tiro salvezza su Destrezza. Se lo fallisce, subisce 10d6 + 40 danni da forza. Se tali danni riducono i punti ferita del bersaglio a 0, la creatura, insieme a qualsiasi oggetto non magico indossi o trasporti, viene disintegrata in polvere grigia. Il bersaglio può essere rianimato solo da un incantesimo desiderio o resurrezione pura.\nQuesto incantesimo disintegra automaticamente un oggetto non magico di taglia Grande o inferiore, oppure una creazione di forza magica. Se il bersaglio è Enorme o superiore, questo incantesimo ne disintegra una parte pari a un cubo con spigolo di 3 metri.",
  "higherLevels": "I danni aumentano di 3d6 per ogni slot di livello superiore al 6º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "10d6+40",
   "damageType": "force",
   "perSlotLevel": "3d6"
  }
 },
 {
  "id": "conjure-fey",
  "name": "Evoca folletto",
  "nameEn": "Conjure Fey",
  "level": 6,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "L'incantatore evoca uno spirito di taglia Media dalla Selva Fatata in uno spazio libero entro gittata che egli è in grado di vedere. Lo spirito permane per la durata dell'incantesimo e ha le sembianze di una creatura fatata a scelta dell'incantatore. Quando lo spirito appare, l'incantatore può effettuare un attacco in mischia con incantesimo contro una creatura entro 1,5 metri dallo spirito. Se il colpo va a segno, il bersaglio subisce danni psichici pari a 3d12 più il modificatore di caratteristica da incantatore dell'incantatore. Inoltre, il bersaglio è spaventato fino all'inizio del turno successivo dell'incantatore, con l'incantatore e lo spirito come fonti della sua paura.\nCome azione bonus nei suoi turni successivi, l'incantatore può teletrasportare lo spirito in uno spazio libero che è in grado di vedere, a una distanza massima di 9 metri dal punto in cui si trovava prima, ed effettuare l'attacco contro una creatura entro 1,5 metri dallo spirito.",
  "higherLevels": "I danni aumentano di 1d12 per ogni slot di livello superiore al 6º.",
  "attack": "melee"
 },
 {
  "id": "instant-summons",
  "name": "Evocazioni istantanee",
  "nameEn": "Instant Summons",
  "level": 6,
  "school": "conjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (uno zaffiro del valore di 1.000 mo o più)",
  "duration": "Finché non viene dissolto",
  "ritual": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore tocca lo zaffiro utilizzato per lanciare l'incantesimo e un oggetto del peso pari o inferiore a 5 kg e la cui dimensione più lunga sia pari o inferiore a 1,8 metri. L'incantesimo imprime un marchio invisibile su quell'oggetto e traccia in modo invisibile il nome dell'oggetto sullo zaffiro. Ogni volta che l'incantatore lancia questo incantesimo, deve utilizzare uno zaffiro diverso.\nSuccessivamente, l'incantatore può effettuare un'azione di Magia per pronunciare il nome dell'oggetto e distruggere lo zaffiro. L'oggetto appare immediatamente nella mano dell'incantatore, a prescindere dalle distanze fisiche o planari e l'incantesimo termina. l'oggetto, la distruzione dello zaffiro non com-Se un'altra creatura impugna o trasporta porta l'apparizione dell'oggetto, ma l'incantatore apprende invece chi è la creatura in suo possesso e l'ubicazione attuale."
 },
 {
  "id": "harm",
  "name": "Ferire",
  "nameEn": "Harm",
  "level": 6,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore scatena una malattia virulenta su una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Costituzione. Se lo fallisce, subisce 14d6 danni necrotici, e i suoi punti ferita massimi vengono ridotti di una quantità pari ai danni necrotici subiti, mentre se lo supera, subisce solo la metà dei danni. Questo incantesimo non può ridurre i punti ferita massimi del bersaglio a meno di 1.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "14d6",
   "damageType": "necrotic"
  }
 },
 {
  "id": "magic-jar",
  "name": "Giara magica",
  "nameEn": "Magic Jar",
  "level": 6,
  "school": "necromancy",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (una gemma, un cristallo o un reli- quiario del valore di 500 mo o più)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard"
  ],
  "description": "Il corpo dell'incantatore cade in uno stato catatonico e la sua anima lo abbandona entrando nel contenitore utilizzato come componente materiale dell'incantesimo. Mentre la sua anima si trova all'interno del contenitore, l'incantatore è consapevole di ciò che accade intorno a lui come se si trovasse nello spazio del contenitore. L'incantatore non può muoversi o effettuare reazioni, l'unica azione che può effettuare è proiettare la propria anima fino a 30 metri fuori dal contenitore, tornando nel suo corpo (e così terminando l'incantesimo) o provando a prendere possesso di un corpo di un umanoide.\nL'incantatore può tentare di possedere un qualsiasi umanoide entro 30 metri da lui che egli è in grado di vedere (tranne le creature protette da un incantesimo protezione dal bene e dal male o cerchio magico). Il bersaglio effettua un tiro salvezza su Carisma. In caso di fallimento, l'anima dell'incantatore entra nel corpo del bersaglio, la cui anima viene intrappolata nel contenitore. In caso di successo, il bersaglio resiste agli sforzi dell'incantatore di possederlo e quest'ultimo non può riprovare per le 24 ore successive.\nQuando l'incantatore prende possesso del corpo di una creatura, ne ha il pieno controllo. I suoi punti ferita, Dadi Vita, Forza, Destrezza, Costituzione, Velocità e sensi vengono sostituiti da quelli della creatura. Altrimenti, l'incantatore conserva le proprie statistiche di gioco.\nNel frattempo, l'anima della creatura posseduta può percepire ciò che accade intorno al contenitore utilizzando i propri sensi, ma non può muoversi ed è incapacitata.\nMentre è in possesso di un corpo, l'incantatore può effettuare la sua azione di Magia per tornare nel contenitore se si trova entro 30 metri da lui, riportando l'anima della creatura ospite nel suo corpo. Se il corpo ospite muore mentre l'incantatore si trova al suo interno, anche la creatura muore e l'incantatore effettua un tiro salvezza su Carisma contro la CD del suo stesso incantesimo. In caso di successo, l'incantatore torna nel contenitore, che deve tuttavia trovarsi entro 30 metri da lui; altrimenti muore.\nSe il contenitore viene distrutto o l'incantesimo termina, l'anima dell'incantatore torna nel suo corpo. Tuttavia, se il suo corpo si trova a più di 30 metri da lui o se è morto, anche l'incantatore muore. Se l'anima di un'altra creatura si trova all'interno del contenitore quando viene distrutto, questa ritorna nel suo corpo, a patto che sia vivo e si trovi entro 30 metri; altrimenti, la creatura muore.\nAl termine dell'incantesimo, il contenitore viene distrutto.",
  "save": "cha"
 },
 {
  "id": "globe-of-invulnerability",
  "name": "Globo di invulnerabilità",
  "nameEn": "Globe of Invulnerability",
  "level": 6,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (una perla di vetro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una barriera scintillante e immobile si materializza in un'emanazione di 3 metri attorno all'incantatore e permane per la durata dell'incantesimo.\nQualsiasi incantesimo di 5º livello o inferiore lanciato dall'esterno della barriera non può influenzare niente che si trovi al suo interno. Questo tipo di incantesimo può essere rivolto contro le creature e gli oggetti all'interno della barriera, senza tuttavia avere effetti su di loro. Allo stesso modo, l'area all'interno della barriera è esclusa dalle aree di effetto create da questo tipo di incantesimi.",
  "higherLevels": "La barriera blocca incantesimi superiori di 1 livello per ogni slot di livello superiore al 6º."
 },
 {
  "id": "heal",
  "name": "Guarigione",
  "nameEn": "Heal",
  "level": 6,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore sceglie una creatura entro gittata che egli è in grado di vedere. Un flusso di energia positiva investe il bersaglio, facendogli recuperare 70 punti ferita. Inoltre, questo incantesimo termina le condizioni accecato, assordato e avvelenato che affliggono il bersaglio.",
  "higherLevels": "La guarigione aumenta di 10 per ogni slot di livello superiore al 6º."
 },
 {
  "id": "programmed-illusion",
  "name": "Illusione programmata",
  "nameEn": "Programmed Illusion",
  "level": 6,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (polvere di giada del valore di 25 mo o più)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore crea un'illusione di un oggetto, una creatura o qualche altro fenomeno visibile entro gittata che si attiva al verificarsi di un innesco specifico. Fino ad allora, l'illusione è impercettibile. Inoltre, essa non può essere più grande di un cubo con spigolo di 9 metri ed è l'incantatore, al momento del lancio, a decidere come si comporta e quali suoni emette. Questa esibizione programmata può durare un massimo di 5 minuti.\nQuando l'innesco specificato si verifica, l'illusione si materializza e si comporta nella maniera descritta dall'incantatore. Al termine della sua esibizione, l'illusione scompare e rimane latente per 10 minuti, dopo i quali può essere attivata nuovamente.\nL'innesco può essere sia generale che dettagliato, ma deve essere basato su fenomeni visibili o udibili che si verificano entro 9 metri dall'area. Per esempio, l'incantatore potrebbe creare un'illusione di se stesso per avvertire coloro che tentano di aprire una porta protetta da una trappola.\nL'illusione può essere rivelata da un'interazione fisica, poiché gli oggetti possono attraversarla. Una creatura che effettua l'azione di Studio per esaminare l'immagine può determinare che si tratta di un'illusione superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se una creatura riconosce l'illusione per ciò che è, riesce a vedere attraverso l'immagine e gli eventuali suoni che emette si attenuano alle sue orecchie."
 },
 {
  "id": "move-earth",
  "name": "Muovere il terreno",
  "nameEn": "Move Earth",
  "level": 6,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (una pala in miniatura)",
  "duration": "Concentrazione, fino a 2 ore",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore sceglie un'area di terreno entro gittata con un lato lungo al massimo 12 metri. Per la durata dell'incantesimo, può rimodellare come desidera l'argilla, il terriccio o la sabbia presente nell'area. L'incantatore può aumentare o ridurre l'elevazione dell'area, creare o riempire una fossa, erigere o spianare una parete, oppure innalzare una colonna. Tuttavia, l'estensione di tali cambiamenti non può superare la metà della dimensione più grande dell'area. Ad esempio, se l'area dell'incantesimo è un quadrato con lato di 12 metri, l'incantatore può creare una colonna alta fino a 6 metri, aumentare o ridurre l'elevazione del terreno di 6 metri, scavare una fossa della profondità massima di 6 metri e così via. Le modifiche verranno completate in 10 minuti. Dal momento che la trasformazione del terreno avviene lentamente, le creature nell'area non restano intrappolate o ferite a causa dei movimenti del suolo.\nAl termine di ogni 10 minuti trascorsi a concentrarsi sull'incantesimo, l'incantatore può scegliere una nuova area di terreno entro gittata da influenzare.\nQuesto incantesimo non può manipolare la pietra naturale e le costruzioni realizzate in pietra: le rocce e le strutture si spostano per adattarsi al nuovo terreno. Se il modo in cui l'incantatore modella il terreno rende una struttura instabile, essa potrebbe crollare.\nAllo stesso modo, questo incantesimo non influenza in modo diretto la crescita vegetale: la terra in movimento trasporta con sé i vegetali presenti."
 },
 {
  "id": "wall-of-ice",
  "name": "Muro di ghiaccio",
  "nameEn": "Wall of Ice",
  "level": 6,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (un pezzo di quarzo)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore crea un muro di ghiaccio su una superficie solida entro gittata, modellandolo in una cupola semisferica o in una sfera del raggio massimo di 3 metri, oppure in una superficie piatta composta da dieci pannelli quadrati con lato di 3 metri. Ogni pannello dev'essere contiguo a un altro pannello. In qualsiasi forma, il muro ha uno spessore di 30 centimetri e permane per la durata dell'incantesimo.\nSe il muro invade lo spazio di una creatura alla sua apparizione, quest'ultima viene spinta verso un lato del muro (a scelta dell'incantatore) ed effettua un tiro salvezza su Destrezza, subendo 10d6 danni da freddo in caso di fallimento, o la metà dei danni in caso di successo.\nIl muro è un oggetto che può essere danneggiato e quindi sfondato, con CA 12 e 30 punti ferita per ogni sezione di 3 metri. Inoltre, è immune ai danni da freddo, da veleno e psichici e vulnerabile ai danni da fuoco. Una sezione di 3 metri viene distrutta se scende a 0 punti ferita e, nello spazio che occupava in precedenza, permane una cortina d'aria gelida.\nUna creatura che attraversa tale cortina d'aria gelida per la per la prima volta in un turno effettua un tiro salvezza su Costituzione, subendo 5d6 danni da freddo in caso di fallimento, o la metà dei danni in caso di successo.",
  "higherLevels": "I danni inflitti dal muro quando compare aumentano di 2d6 e quelli subiti da chi passa attraverso la cortina d'aria gelida aumentano di 1d6 per ogni slot incantesimo di livello superiore al 6º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "10d6",
   "damageType": "cold",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "wall-of-thorns",
  "name": "Muro di spine",
  "nameEn": "Wall of Thorns",
  "level": 6,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S, M (una manciata di spine)",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "L'incantatore crea un muro di rovi irto di spine affilate. Il muro appare entro gittata su una superficie solida e permane per tutta la durata dell'incantesimo. L'incantatore può scegliere se creare un muro lungo fino a 18 metri, alto 3 metri e spesso 1,5 metri, oppure un muro circolare del diametro massimo di 6 metri, alto fino a 6 metri e spesso 1,5 metri. Il muro blocca la visuale.\nQuando compare, ogni creatura al suo interno effettua un tiro salvezza su Destrezza, subendo 7d8 danni perforanti in caso di fallimento, o la metà dei danni in caso di successo.\nUna creatura può muoversi attraverso il muro, seppur con fatica e dolore: per ogni 30 centimetri di muro che attraversa, deve usare 1,2 metri di movimento. Inoltre, la prima volta che una creatura entra in uno spazio nel muro in un turno o vi termina il proprio turno, effettua un tiro salvezza su Destrezza subendo 7d8 danni taglienti in caso di fallimento, o la metà dei danni in caso di successo. Una creatura effettua questo tiro salvezza solo una volta per turno.",
  "higherLevels": "Entrambi i tipi di danno aumentano di 1d8 per ogni slot incantesimo di livello superiore al 6º.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "7d8",
   "damageType": "piercing",
   "perSlotLevel": "1d8"
  }
 },
 {
  "id": "word-of-recall",
  "name": "Parola del ritiro",
  "nameEn": "Word of Recall",
  "level": 6,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "1,5 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore e un massimo di cinque creature consenzienti entro 1,5 metri da lui si teletrasportano immediatamente in un santuario indicato in precedenza. L'incantatore e le creature che si teletrasportano con lui appaiono nello spazio libero più vicino al punto indicato dall'incantatore quando ha preparato il suo santuario (vedi di seguito). Se lancia questo incantesimo senza prima preparare un santuario, l'incantesimo non ha effetto.\nDeve designare un luogo (come un tempio o un santuario) lanciando lì l'incantesimo."
 },
 {
  "id": "forbiddance",
  "name": "Proibizione",
  "nameEn": "Forbiddance",
  "level": 6,
  "school": "abjuration",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (polvere di rubino del valore di 1.000 mo o più)",
  "duration": "1 giorno",
  "ritual": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore crea una difesa contro i viaggi magici che protegge un'area quadrata di terreno con lato di 60 metri e un'altezza di massimo 9 metri. Per la durata dell'incantesimo, per entrare in tale area le creature non possono utilizzare teletrasporto o portali, come quelli creati dall'incantesimo portale. L'incantesimo protegge l'area dai viaggi planari, impedendo perciò alle creature di accedervi tramite il Piano Astrale, il Piano Etereo, la Selva Fatata, la Coltre Oscura e l'incantesimo spostamento planare.\nInoltre, infligge danni a uno o più tipi di creature indicati dall'incantatore al momento del lancio, scelti tra i seguenti: aberrazioni, celestiali, elementali, folletti, immondi e non morti. Quando una creatura del tipo scelto entra nell'area dell'incantesimo per la prima volta in un turno o termina il suo turno qui, subisce 5d10 danni necrotici o radiosi (a scelta dell'incantatore al momento del lancio).\nQuando lancia l'incantesimo, l'incantatore può indicare una parola d'ordine: una creatura che la pronuncia accedendo all'area non subisce danni.\nL'area di questo incantesimo non può sovrapporsi all'area di un altro incantesimo proibizione. Se l'incantatore lancia proibizione ogni giorno nello stesso luogo per 30 giorni, l'incantesimo permane finché non viene dissolto e le componenti materiali vengono consumate al momento dell'ultimo lancio.",
  "roll": {
   "kind": "damage",
   "dice": "5d10",
   "damageType": "necrotic"
  }
 },
 {
  "id": "find-the-path",
  "name": "Scopri il percorso",
  "nameEn": "Find the Path",
  "level": 6,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (un set di strumenti di divinazione, come carte o rune, del valore di 100 mo o più)",
  "duration": "Concentrazione, fino a 1 giorno",
  "concentration": true,
  "lists": [
   "bard",
   "cleric",
   "druid"
  ],
  "description": "L'incantatore percepisce magicamente il percorso fisico più diretto verso una destinazione di cui nomina il nome e che gli sia nota. Se nomina una destinazione su un altro piano di esistenza, una destinazione in movimento (come una fortezza mobile) o una destinazione poco specifica (come \"la tana di un drago verde\"), l'incantesimo non ha effetto.\nPer la durata dell'incantesimo, finché l'incantatore si trova sullo stesso piano di esistenza della destinazione, sa quanto è lontana e in che direzione si trova. Ogni volta che l'incantatore si trova a scegliere tra più percorsi, sa qual è il più diretto."
 },
 {
  "id": "freezing-sphere",
  "name": "Sfera congelante",
  "nameEn": "Freezing Sphere",
  "level": 6,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "90 metri",
  "components": "V, S, M (una sfera di cristallo in miniatura)",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Una sfera congelata sfreccia dall'incantatore verso un punto a sua scelta entro gittata, dove esplode in una sfera di 18 metri di raggio. Ogni creatura in quell'area effettua un tiro salvezza su Costituzione, subendo 10d6 danni da freddo in caso di fallimento, o la metà dei danni in caso di successo.\nSe la sfera colpisce uno specchio d'acqua, congela l'acqua fino a una profondità di 15 centimetri su un'area quadrata con lato di 9 metri. Lo strato di ghiaccio dura 1 minuto. Le creature che stavano nuotando sulla superficie dell'acqua ghiacciata rimangono intrappolate nel ghiaccio e sono trattenute. Per liberarsi, possono effettuare un'azione per effettuare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo.\nUna volta completato il lancio dell'incantesimo, l'incantatore può decidere di non scagliare la sfera. Così facendo, una sfera grande all'incirca quanto un proiettile da fionda, freddo al tatto, compare nella sua mano. In qualsiasi momento, l'incantatore o una creatura a cui l'ha consegnata può lanciare la sfera (entro una gittata di 12 metri) o scagliarla con una fionda (entro la normale gittata della fionda). La sfera si infrange all'impatto, con lo stesso effetto di un lancio normale dell'incantesimo. Tuttavia, l'incantatore può anche appoggiare la sfera a terra senza romperla. Dopo 1 minuto, se non è ancora stata infranta, la sfera esplode.",
  "higherLevels": "I danni aumentano di 1d6 per ogni slot di livello superiore al 6º.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "10d6",
   "damageType": "cold",
   "perSlotLevel": "1d6"
  }
 },
 {
  "id": "eyebite",
  "name": "Sguardo penetrante",
  "nameEn": "Eyebite",
  "level": 6,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, gli occhi dell'incantatore diventano neri e vacui. Una creatura a scelta dell'incantatore entro 18 metri da lui e che l'incantatore è in grado di vedere deve superare un tiro salvezza su Saggezza o essere influenzata da uno dei seguenti effetti a sua scelta per la durata dell'incantesimo.\nIn ogni suo turno fino al termine dell'incantesimo, l'incantatore può usare un'azione di Magia per bersagliare un'altra creatura, non potendo tuttavia bersagliare di nuovo una creatura che abbia superato un tiro salvezza contro questo lancio dell'incantesimo.\n**Addormentato.** Il bersaglio cade privo di sensi e si risveglia se subisce danni o se un'altra creatura usa un'azione per svegliarla scuotendola.\n**In preda al panico.** Il bersaglio è spaventato. In ogni suo turno, il bersaglio spaventato deve effettuare l'azione Scatto e muoversi per allontanarsi dall'incantatore lungo il percorso più sicuro e rapido possibile. Se il bersaglio si muove in un punto a più di 18 metri dall'incantatore dove non è più in grado di vederlo, l'effetto termina.\n**Nauseato.** Il bersaglio viene avvelenato.",
  "save": "wis"
 },
 {
  "id": "mass-suggestion",
  "name": "Suggestione di massa",
  "nameEn": "Mass Suggestion",
  "level": 6,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, M (una lingua di serpente)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore suggerisce un corso d'azione da intraprendere (descritto con non più di 25 parole) a fino a dodici creature entro gittata che egli è in grado di vedere. Le creature devono essere in grado di comprendere l'incantatore. Il suggerimento deve apparire realizzabile e non deve comportare nulla che infligga palesemente danni ai bersagli o ai loro alleati. Ad esempio, l'incantatore potrebbe dire: \"Cammina fino al villaggio in fondo alla strada e aiuta gli abitanti a raccogliere le colture fino al tramonto\". Oppure potrebbe dire: \"Non è il momento della violenza. Getta le armi e balla! Fermati tra un'ora\".\nOgni bersaglio deve superare un tiro salvezza su Saggezza, altrimenti rimane affascinato per la durata dell'incantesimo o finché l'incantatore o isuoi alleati non gli infliggono danni. Ogni bersaglio affascinato segue il suggerimento al meglio delle sue capacità. L'attività suggerita può continuare per l'intera durata, ma se può essere completata in un tempo più breve, l'incantesimo termina e non ha più effetto sul bersaglio che completa l'attività.",
  "higherLevels": "La durata aumenta con uno slot incantesimo di 7º livello (10 giorni), 8º livello (30 giorni) o 9º livello (366 giorni).",
  "save": "wis"
 },
 {
  "id": "transport-via-plants",
  "name": "Trasporto vegetale",
  "nameEn": "Transport via Plants",
  "level": 6,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "3 metri",
  "components": "V, S",
  "duration": "1 minuto",
  "lists": [
   "druid"
  ],
  "description": "Questo incantesimo crea un legame magico tra un vegetale inanimato di taglia Grande o superiore situato entro gittata e un altro vegetale, situato a qualsiasi distanza sullo stesso piano di esistenza. L'incantatore deve aver visto o toccato il vegetale di destinazione almeno una volta in precedenza. Per la durata dell'incantesimo, qualsiasi creatura può entrare nel vegetale bersaglio e uscire da quello di destinazione usando 1,5 metri di movimento."
 },
 {
  "id": "guards-and-wards",
  "name": "Vigilanza e interdizione",
  "nameEn": "Guards and Wards",
  "level": 6,
  "school": "abjuration",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (una verga d'argento del valore di 10 mo o più)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore crea una difesa che protegge un'area di terreno di massimo 225 metri quadrati. L'area protetta può essere alta fino a 6 metri e l'incantatore può darle una delle seguenti forme: un quadrato con lato di 15 metri, cento quadrati contigui con lato di 1,5 metri o venticinque quadrati contigui con lato di 3 metri.\nQuando lancia questo incantesimo, l'incantatore può specificare quali individui non saranno influenzati dagli effetti dell'incantesimo. Può anche specificare una parola d'ordine che, una volta pronunciata a voce alta entro 1,5 metri dall'area protetta, renderà chi la pronuncia immune a questi effetti.\nL'incantesimo crea gli effetti illustrati di seguito all'interno dell'area protetta. Dissolvi magie non ha effetti su vigilanza e interdizione, ma ciascuno dei seguenti effetti può essere dissolto. Se tutti e quattro vengono dissolti, vigilanza e interdizione termina. Se l'incantatore lancia l'incantesimo ogni giorno per 365 giorni sulla stessa area, esso permane finché tutti i suoi effetti non vengono dissolti.\n**Corridoi.** Tutti i corridoi protetti si riempiono di nebbia e diventano pesantemente oscurati. Inoltre, a ogni incrocio o diramazione che richieda di scegliere una direzione, una creatura diversa dall'incantatore ha una probabilità del 50% di credere di andare in una direzione differente da quella che ha scelto.\n**Porte.** Tutte le porte nell'area protetta vengono chiuse a chiave magicamente, come sigillate dall'incantesimo serratura arcana. Inoltre, l'incantatore può coprire fino a dieci porte con un'illusione per farle apparire come normali sezioni di parete.\n**Scale.** Tutte le scale nell'area protetta si riempiono da cima a fondo di ragnatele, come succederebbe lanciando l'incantesimo ragnatela. Per la durata dell'incantesimo vigilanza e interdizione, i fili di queste ragnatele si riformano in 10 minuti se queste vengono distrutte.\n**Altri effetti dell'incantesimo.** L'incantatore posiziona uno dei seguenti effetti magici all'interno dell'area protetta:\n• Luci danzanti in quattro corridoi, specificando anche un semplice schema che le luci ripetono per la durata di vigilanza e interdizione.\n• Bocca magica in due luoghi.\n• Nube maleodorante in due luoghi (il vapore riappare nel giro di 10 minuti se disperso fintantoché vigilanza e interdizione permane).\n• Folata di vento in un corridoio o una stanza (il vento soffia ininterrottamente per la durata dell'incantesimo).\n• Suggestione in un'area quadrata con lato di 1,5 metri. Qualsiasi creatura che entri nell'area riceve mentalmente la suggestione."
 },
 {
  "id": "true-seeing",
  "name": "Visione del vero",
  "nameEn": "True Seeing",
  "level": 6,
  "school": "divination",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere di funghi del valore di 25 mo o più, che l'incantesimo consuma)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Per la durata dell'incantesimo, una creatura consenziente toccata dall'incantatore è dotata di vista pura fino a 36 metri."
 },
 {
  "id": "sequester",
  "name": "Celare",
  "nameEn": "Sequester",
  "level": 7,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (polvere di gemme del valore di 5.000 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard"
  ],
  "description": "Con un tocco, l'incantatore cela magicamente un oggetto o una creatura consenziente. Per la durata dell'incantesimo, il bersaglio è invisibile e non può essere bersagliato da incantesimi di divinazione, individuato dalla magia o osservato a distanza con la magia.\nSe il bersaglio è una creatura, entra in uno stato di animazione sospesa, è priva di sensi, non invecchia e non necessita di cibo, acqua o aria.\nPer terminare prematuramente l'incantesimo, l'incantatore può stabilire una condizione, che può essere qualsiasi cosa a sua scelta che, tuttavia, debba verificarsi o essere visibile entro 1,5 chilometri dal bersaglio. Per esempio, \"dopo 1.000 anni\" o \"al risveglio del tarrasque\". Questo incantesimo termina inoltre se il bersaglio subisce danni."
 },
 {
  "id": "finger-of-death",
  "name": "Dito della morte",
  "nameEn": "Finger of Death",
  "level": 7,
  "school": "necromancy",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore scatena un'ondata di energia negativa contro una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Costituzione, subendo 7d8 + 30 danni necrotici in caso di fallimento, o la metà dei danni in caso di successo.\nAll'inizio del turno successivo dell'incantatore, un umanoide ucciso da questo incantesimo si rianima come uno zombi (vedi \"Mostri\") che segue gli ordini verbali dell'incantatore.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "7d8+30",
   "damageType": "necrotic"
  }
 },
 {
  "id": "conjure-celestial",
  "name": "Evoca celestiale",
  "nameEn": "Conjure Celestial",
  "level": 7,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore evoca uno spirito dai Piani Superiori, che si manifesta come un pilastro di luce in un cilindro del raggio di 3 metri e dell'altezza di 12 metri centrato in un punto entro gittata. Per ogni creatura che l'incantatore è in grado di vedere nel cilindro, sceglie quale di queste luci brilla su di essa:\n**Luce curatrice.** Il bersaglio recupera una quantità di punti ferita pari a 4d12 più il modificatore di caratteristica da incantatore dell'incantatore.\n**Luce ustionante.** Il bersaglio effettua un tiro salvezza su Destrezza, subendo 6d12 danni radiosi in caso di fallimento, o la metà dei danni in caso di successo.\nFino al termine dell'incantesimo, una luce intensa riempie il cilindro e, quando l'incantatore si muove nel suo turno, può spostare anche il cilindro fino a 9 metri.\nOgni volta che il cilindro si muove nello spazio di una creatura che l'incantatore è in grado di vedere e ogni volta che una creatura che l'incantatore è in grado di vedere entra nel cilindro o vi termina il suo turno, l'incantatore può immergerla in una di queste luci. Una creatura può essere influenzata da questo incantesimo solo una volta per turno.",
  "higherLevels": "I danni e la guarigione aumentano di 1d12 per ogni slot di livello superiore al 7º.",
  "save": "dex",
  "roll": {
   "kind": "heal",
   "dice": "4d12",
   "addMod": true,
   "perSlotLevel": "1d12"
  }
 },
 {
  "id": "etherealness",
  "name": "Forma eterea",
  "nameEn": "Etherealness",
  "level": 7,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Fino a 8 ore",
  "lists": [
   "bard",
   "cleric",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore mette piede nelle regioni di confine in cui il Piano Etereo si sovrappone al suo piano attuale. Rimane nel Confine Etereo per la durata dell'incantesimo. Durante questo periodo, l'incantatore può muoversi in ogni direzione. Muovendosi su o giù, ogni 30 cm di movimento gli costano 30 cm extra. L'incantatore può percepire il piano da cui proviene, che appare in scala di grigi ed è visibile solo fino a una distanza di 18 metri.\nMentre si trova sul Piano Etereo, l'incantatore può influenzare ed essere influenzato solo dalle creature, gli oggetti e gli effetti che si trovano su quel piano. Le creature che non sono presenti sul Piano Etereo non possono percepire o interagire con l'incantatore, a meno che un privilegio non dia loro la capacità per farlo.\nAl termine dell'incantesimo, l'incantatore torna sul piano da cui proviene, sul punto che corrisponde al suo spazio nel Confine Etereo. Se l'incantatore appare in uno spazio occupato, viene sbalzato nello spazio libero più vicino e subisce una quantità di danni da forza pari al doppio del numero di metri di cui si è mosso. l'incantatore lo lancia mentre si trova sul Piano Questo incantesimo termina all'istante se Etereo o su un piano non confinante, come uno dei Piani Esterni.",
  "higherLevels": "L'incantatore può bersagliare fino a un massimo di tre creature consenzienti (incluso se stesso) per ogni slot di livello superiore al 7º. Al momento del lancio dell'incantesimo, le creature non devono trovarsi a più di 3 metri dall'incantatore."
 },
 {
  "id": "forcecage",
  "name": "Gabbia di forza",
  "nameEn": "Forcecage",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "30 metri",
  "components": "V, S, M (polvere di rubino del valore di 1.500 mo o più, che l'incantesimo consuma)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "Una prigione cubica di forza magica invisibile e immobile si materializza intorno a un'area entro gittata scelta dall'incantatore. La prigione può essere una gabbia o una struttura solida a sua scelta.\nUna prigione a forma di gabbia può misurare fino a 6 metri per lato ed essere composta da sbarre di 1,25 centimetri di diametro disposte a 1,25 centimetri di distanza. Una prigione a forma di scatola chiusa può misurare fino a 3 metri per lato e crea una barriera compatta che impedisce a ogni tipo di materia di passarle attraverso e blocca qualsiasi incantesimo lanciato verso l'interno o l'esterno dell'area.\nAl momento del lancio dell'incantesimo, ogni creatura completamente all'interno dell'area della gabbia è intrappolata. Le creature situate solo parzialmente all'interno dell'area o quelle di dimensioni troppo grandi per essere contenute al suo interno sono spinte lontano dal centro dell'area finché non ne fuoriescono completamente.\nUna creatura all'interno della gabbia non può uscirne tramite mezzi non magici. Se la creatura prova a utilizzare il teletrasporto o il viaggio interplanare, deve prima effettuare un tiro salvezza su Carisma. Se lo supera, la creatura può usare quella magia per uscire dalla gabbia, mentre se lo fallisce, non può uscire dalla gabbia e spreca un uso di quell'incantesimo o effetto. La gabbia si estende anche sul Piano Etereo, bloccando i viaggi eterei.\nQuesto incantesimo non può essere dissolto con dissolvi magie.",
  "save": "cha"
 },
 {
  "id": "project-image",
  "name": "Immagine proiettata",
  "nameEn": "Project Image",
  "level": 7,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "800 chilometri",
  "components": "V, S, M (una statuetta dell'incantatore del valore di 5 mo o più)",
  "duration": "Concentrazione, fino a 1 giorno",
  "concentration": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore crea una copia illusoria di se stesso che permane per la durata dell'incantesimo. La copia può apparire in qualsiasi luogo entro gittata che l'incantatore abbia visto in precedenza, a prescindere dalla presenza di ostacoli. L'illusione assomiglia in tutto e per tutto all'incantatore, ma è intangibile. Inoltre, se subisce danni, scompare e l'incantesimo termina.\nL'incantatore può vedere e sentire attraverso gli occhi e le orecchie dell'illusione, come se si trovasse nel suo spazio. Come azione di Magia, l'incantatore può muovere l'illusione fino a 18 metri e farla gesticolare, parlare e comportare nel modo che ritiene più opportuno. L'illusione imita i modi di fare dell'incantatore alla perfezione.\nL'illusione può essere rivelata da un'interazione fisica, poiché gli oggetti possono attraversarla. Una creatura che effettua l'azione di Studio per esaminare l'immagine può determinare che si tratta di un'illusione superando una prova di Intelligenza (Indagare) contro la CD del tiro salvezza sull'incantesimo. Se una creatura riconosce l'illusione per ciò che è, riesce a vedere attraverso l'immagine e gli eventuali suoni che emette si attenuano alle sue orecchie."
 },
 {
  "id": "reverse-gravity",
  "name": "Inversione della gravità",
  "nameEn": "Reverse Gravity",
  "level": 7,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "30 metri",
  "components": "V, S, M (una calamita e limatura di ferro)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Questo incantesimo inverte la gravità all'interno di un cilindro del raggio di 15 metri e dell'altezza di 30 metri centrato su un punto entro gittata. Tutte le creature e gli oggetti presenti nell'area che non sono ancorati al terreno vengono trascinati verso l'alto e raggiungono la parte superiore del cilindro. Una creatura può effettuare un tiro salvezza su Destrezza per afferrare un oggetto ancorato entro portata, evitando così di essere trascinata verso l'alto.\nSe un soffitto o un oggetto ancorato viene urtato durante questa caduta, gli oggetti e le creature subiscono un impatto identico a quello che subirebbero durante una normale caduta verso il basso. Se una creatura o un oggetto influenzato arriva in cima al cilindro senza colpire niente, rimane lì a fluttuare per la durata dell'incantesimo. Al termine dell'incantesimo, le creature e gli oggetti influenzati cadono verso il basso.",
  "save": "dex"
 },
 {
  "id": "mirage-arcane",
  "name": "Miraggio arcano",
  "nameEn": "Mirage Arcane",
  "level": 7,
  "school": "illusion",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Vista",
  "components": "V, S",
  "duration": "10 giorni",
  "lists": [
   "bard",
   "druid",
   "wizard"
  ],
  "description": "L'incantatore fa in modo che il terreno in un'area quadrata con lato fino a 1,5 chilometri appaia, suoni, odori e perfino risulti al tatto come un altro tipo di terreno. Un campo aperto o una strada potrebbe così sembrare una palude, una collina, un crepaccio o qualche altro tipo di terreno impervio e invalicabile. Allo stesso modo, uno stagno potrebbe apparire come un prato erboso, un precipizio come un dolce pendio o un fosso irto di rocce come una strada ampia e accogliente.\nL'incantatore può similmente modificare l'aspetto di strutture o aggiungerne altre dove non sono presenti. Tuttavia, l'incantesimo non può camuffare, occultare o aggiungere creature.\nL'illusione include elementi uditivi, visivi, tattili e olfattivi, quindi può trasformare un terreno libero in un terreno difficile (o viceversa), oppure ostacolare in altri modi i movimenti all'interno dell'area. Ogni frammento di terreno illusorio (come una roccia o un bastone) che viene rimosso dall'area dell'incantesimo scompare immediatamente.\nLe creature con vista pura sono in grado di vedere la vera forma del terreno attraverso l'illusione; tuttavia, permangono tutti gli altri elementi dell'illusione, quindi, nonostante la creatura sia consapevole della sua presenza, può continuare a interagire fisicamente con essa."
 },
 {
  "id": "delayed-blast-fireball",
  "name": "Palla di fuoco ritardata",
  "nameEn": "Delayed Blast Fireball",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (una pallina di guano di pipistrello e zolfo)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Un raggio di luce gialla si sprigiona dall'incantatore per poi condensarsi in un punto a sua scelta entro gittata, formando una sfera scintillante che permane per la durata dell'incantesimo. Al termine dell'incantesimo, la sfera esplode e ogni creatura all'interno di una sfera del raggio di 6 metri centrata su quel punto effettua un tiro salvezza su Destrezza. In caso di fallimento, la creatura subisce una quantità di danni da fuoco pari al totale dei danni accumulati, o la metà dei danni in caso di successo.\nI danni base dell'incantesimo sono pari a 12d6 e aumentano di 1d6 ogni volta che termina il turno dell'incantatore e l'incantesimo è ancora attivo.\nSe una creatura tocca la sfera scintillante prima del termine dell'incantesimo, effettua un tiro salvezza su Destrezza. In caso di fallimento, l'incantesimo termina, causando l'esplosione della sfera. In caso di successo, la creatura può lanciare la sfera fino a una distanza di 12 metri: se entra nello spazio di una creatura o si scontra con un oggetto solido, l'incantesimo termina, facendo esplodere la sfera.\nQuando la sfera esplode, gli oggetti infiammabili all'interno dell'esplosione che non sono indossati o trasportati iniziano a bruciare.",
  "higherLevels": "I danni base aumentano di 1d6 per ogni slot di livello superiore al 7º.",
  "save": "dex"
 },
 {
  "id": "divine-word",
  "name": "Parola divina",
  "nameEn": "Divine Word",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione bonus",
  "timing": "bonus",
  "range": "9 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "L'incantatore pronuncia una parola pervasa di potere dei Piani Superiori. Ogni creatura a sua scelta situata entro gittata effettua una tiro salvezza su Carisma. In caso di fallimento, un bersaglio che ha 50 punti ferita o meno subisce un effetto basato sui suoi punti ferita attuali, come indicato nella tabella Effetti della parola divina. Indipendentemente dai suoi punti ferita, un bersaglio celestiale, elementale, folletto o immondo che fallisce il suo tiro salvezza viene respinto sul suo piano d'origine (se non vi si trova già) e non può ritornare sul piano attuale per 24 ore in alcun modo se non tramite un incantesimo desiderio.\nEffetti della parola divina\nPunti\nferita | Effetto\n0–20 | Il bersaglio muore.\n21–30 | Il bersaglio è accecato, assordato e stor-\ndito per 1 ora.\n31–40 | Il bersaglio è accecato e assordato per\n10 minuti.\n41–50 | Il bersaglio è assordato per 1 minuto.",
  "save": "cha"
 },
 {
  "id": "magnificent-mansion",
  "name": "Reggia meravigliosa",
  "nameEn": "Magnificent Mansion",
  "level": 7,
  "school": "conjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "90 metri",
  "components": "V, S, M (una miniatura di una porta del valore di 15 mo o più)",
  "duration": "24 ore",
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore evoca una porta scintillante entro gittata che permane per la durata dell'incantesimo. La porta, larga 1,5 metri e alta 3 metri, conduce a una dimora extradimensionale. L'incantatore e una qualsiasi creatura da lui scelta al momento del lancio possono entrare nella dimora extradimensionale fintantoché la porta rimane aperta. L'incantatore può aprire o chiudere la porta (nessuna azione richiesta) se si trova entro 9 metri da essa; quando è chiusa, la porta è impercettibile.\nOltre la porta si trova un atrio sfarzoso su cui si aprono numerose stanze. L'atmosfera della dimora è pulita, fresca e accogliente.\nL'incantatore può definire la planimetria della dimora come preferisce, ma le sue dimensioni non devono superare quelle di 50 cubi contigui con spigolo di 3 metri. Inoltre, la dimora è ammobiliata e decorata come l'incantatore preferisce e contiene cibo a sufficienza per servire un banchetto di nove portate per un massimo di 100 persone. Arredi e altri oggetti creati da questo incantesimo si dissolvono in fumo quando vengono rimossi dalla dimora.\nA provvedere a ogni bisogno degli ospiti è presente una schiera di 100 servitori semitrasparenti. L'incantatore decide l'aspetto e la tenuta di questi servitori, che sono invulnerabili e obbediscono ai suoi ordini. Ogni servitore può eseguire qualsiasi compito che un umano sarebbe in grado di eseguire, ma non può attaccare o effettuare azioni che ferirebbero in modo diretto un'altra creatura. I servitori possono perciò trasportare oggetti, pulire, riparare, piegare abiti, accendere fuochi, servire cibo, versare vino e così via. Tuttavia, non possono lasciare la dimora.\nAl termine dell'incantesimo, tutte le creature e gli oggetti rimasti all'interno dello spazio extradimensionale vengono espulsi negli spazi liberi più vicini all'entrata."
 },
 {
  "id": "resurrection",
  "name": "Resurrezione",
  "nameEn": "Resurrection",
  "level": 7,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (un diamante del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric"
  ],
  "description": "L'incantatore tocca e resuscita una creatura morta da non più di un secolo, che non sia morta di vecchiaia e che non fosse un non morto al momento della morte.\nLa creatura torna in vita con tutti i suoi punti ferita. Inoltre, questo incantesimo neutralizza qualsiasi veleno che influenzava la creatura al momento della morte, richiude tutte le ferite mortali e ripristina le eventuali parti del corpo mancanti.\nIl ritorno dalla morte è un vero e proprio travaglio. Il bersaglio subisce una penalità di −4 alle prove con d20. Ogni volta che completa un riposo lungo, questa penalità viene ridotta di 1 finché non arriva a 0.\nLanciare questo incantesimo per riportare in vita una creatura morta da 365 giorni o più risulta logorante per l'incantatore. Finché non completa un riposo lungo, non può lanciare di nuovo incantesimi e subisce svantaggio alle prove con d20."
 },
 {
  "id": "regenerate",
  "name": "Rigenerazione",
  "nameEn": "Regenerate",
  "level": 7,
  "school": "transmutation",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (un ruota della preghiera)",
  "duration": "1 ora",
  "lists": [
   "bard",
   "cleric",
   "druid"
  ],
  "description": "Una creatura toccata dall'incantatore recupera 4d8 + 15 punti ferita. Per la durata dell'incantesimo, il bersaglio recupera 1 punto ferita all'inizio di ogni suo turno e qualsiasi parte del corpo sia stata recisa, ricresce dopo 2 minuti."
 },
 {
  "id": "symbol",
  "name": "Simbolo",
  "nameEn": "Symbol",
  "level": 7,
  "school": "abjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (polvere di diamante del valore di 1.000 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto o innescato",
  "lists": [
   "bard",
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "L'incantatore traccia un glifo nocivo su una superficie (come una sezione di pavimento o una parete) o all'interno di un oggetto che può essere chiuso (come un libro o un forziere). Il glifo può coprire un'area massima del diametro di 3 metri. Se l'incantatore sceglie un oggetto, questo non deve essere spostato; se ciò avviene, una volta che l'oggetto si allontana di più di 3 metri dal luogo in cui è stato lanciato l'incantesimo, il glifo si infrange e l'incantesimo termina senza essere innescato.\nIl glifo è quasi impercettibile e, per notarlo, è necessario superare una prova di Saggezza (Percezione) contro la CD del tiro salvezza sull'incantesimo. l'innesco, oltre all'effetto che scatenerà: morte, Quando viene tracciato, l'incantatore sceglie discordia, paura, dolore, sonno o stordimento. Ciascuno di essi è spiegato di seguito.\n**Programmare l'innesco.** Quando questo incantesimo viene lanciato, l'incantatore decide cosa innesca il glifo. Nel caso di glifi tracciati su una superficie, gli inneschi più comuni includono: toccare o camminare su di essi, rimuovere un altro oggetto che li copre o avvicinarsi a una certa distanza da loro. Nel caso di glifi tracciati all'interno di un oggetto, gli inneschi più comuni includono aprire quell'oggetto o vedere il glifo.\nL'incantatore può perfezionare l'innesco in modo che venga attivato solo da un certo tipo di creature (ad esempio, il glifo potrebbe essere programmato per influenzare le aberrazioni). Può inoltre impostare delle condizioni per evitare di innescare il glifo, come pronunciare una specifica parola d'ordine.\nUna volta attivato, il glifo brilla, proiettando luce fioca in una sfera del raggio di 18 metri per 10 minuti, dopodiché l'incantesimo termina. Ogni creatura all'interno della sfera quando il glifo si attiva, oppure che entra nella sfera per la prima volta in un turno o termina il suo turno qui, ne subisce l'effetto. Una creatura può essere presa di mira una sola volta per turno.\n**Discordia.** Ogni bersaglio effettua un tiro salvezza su Saggezza. Se lo fallisce, inizia a litigare con le altre creature per 1 minuto, durante il quale non è in grado di comunicare in modo significativo e subisce svantaggio ai tiri per colpire e alle prove di caratteristica.\n**Dolore.** Ogni bersaglio deve superare un tiro salvezza su Costituzione, altrimenti sarà incapacitato per 1 minuto.\n**Morte.** Ogni bersaglio effettua un tiro salvezza su Costituzione, subendo 10d10 danni necrotici in caso di fallimento, o la metà dei danni in caso di successo.\n**Paura.** Ogni bersaglio deve superare un tiro salvezza su Saggezza, altrimenti sarà spaventato per 1 minuto. Mentre è spaventato, il bersaglio deve allontanarsi di almeno 9 metri dal glifo in ogni suo turno, se ne è in grado.\n**Sonno.** Ogni bersaglio deve superare un tiro salvezza su Saggezza, altrimenti cade privo di sensi per 10 minuti. Una creatura si risveglia se subisce danni o se qualcuno usa un'azione per scuoterla.\n**Stordimento.** Ogni bersaglio deve superare un tiro salvezza su Saggezza, altrimenti sarà stordito per 1 minuto.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "10d10",
   "damageType": "necrotic"
  }
 },
 {
  "id": "simulacrum",
  "name": "Simulacro",
  "nameEn": "Simulacrum",
  "level": 7,
  "school": "illusion",
  "castingTime": "12 ore",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (polvere di rubino del valore di 1.500 mo o più, che l'incantesimo consuma)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard"
  ],
  "description": "Il personaggio crea un simulacro di una bestia o un umanoide entro 3 metri da sé per l'intera durata del lancio dell'incantesimo. Il lancio termina toccando sia il bersaglio che un cumulo di ghiaccio o neve della sua stessa taglia. Quest'ultimo diventa il simulacro, il quale è una creatura che utilizza le statistiche di gioco della controparte originale al momento del lancio, tranne per il fatto che è un costrutto, per cui ha la metà dei punti ferita massimi e non può lanciare questo incantesimo. dell'incantatore e delle creature da lui indicate. Il simulacro è amichevole nei confronti Inoltre, obbedisce ai comandi che gli impartisce durante il suo turno in combattimento. Il simulacro non può né ottenere livelli né compiere riposi brevi o lunghi.\nSe subisce dei danni, l'unico modo che il personaggio ha di ripristinare i suoi punti ferita è ripararlo mentre compie un riposo lungo, durante il quale consuma componenti del valore di 100 mo per ogni punto ferita ripristinato. Per poter eseguire la riparazione, il simulacro deve essere entro 1,5 metri dal personaggio.\nIl simulacro permane finché non scende a 0 punti ferita, nel qual caso si ritrasforma in neve e si scioglie. Se l'incantatore lancia di nuovo questo incantesimo, il simulacro da lui creato in precedenza viene istantaneamente distrutto."
 },
 {
  "id": "arcane-sword",
  "name": "Spada arcana",
  "nameEn": "Arcane Sword",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "27 metri",
  "components": "V, S, M (una spada in miniatura del valore di 250 mo o più)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "L'incantatore crea una spada spettrale che fluttua entro gittata e permane per tutta la durata dell'incantesimo.\nQuando la spada appare, l'incantatore può effettuare un attacco in mischia con questo incantesimo contro un bersaglio che si trova entro 1,5 metri dalla spada. Se il colpo va a segno, il bersaglio subisce 4d12 danni da forza più il modificatore di caratteristica da incantatore dell'incantatore.\nNei suoi turni successivi, l'incantatore può effettuare un'azione bonus per spostare la spada fino a 9 metri in un punto che è in grado di vedere e ripetere l'attacco contro lo stesso bersaglio o uno diverso.",
  "attack": "melee",
  "roll": {
   "kind": "damage",
   "dice": "4d12",
   "damageType": "force",
   "addMod": true
  }
 },
 {
  "id": "plane-shift",
  "name": "Spostamento planare",
  "nameEn": "Plane Shift",
  "level": 7,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S, M (una verga di metallo biforcuta del valore di 250 mo o più e in sintonia con un piano di esistenza)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore e un massimo di otto creature consenzienti, che si tengono per mano formando un cerchio, vengono trasportati su un piano di esistenza diverso. L'incantatore può specificare la destinazione in termini generici, come una città specifica sul Piano Elementale del Fuoco o palazzo sul secondo livello dei Nove Inferi, apparendo in quella destinazione o nelle sue immediate vicinanze, in base alla scelta del GM.\nIn alternativa, se l'incantatore conosce la sequenza di sigilli di un cerchio di teletrasporto su un altro piano di esistenza, questo incantesimo può portarlo fino a quel cerchio. Se il cerchio di teletrasporto è troppo piccolo per contenere tutte le creature trasportate dall'incantatore, esse appariranno negli spazi liberi più vicini."
 },
 {
  "id": "prismatic-spray",
  "name": "Spruzzo prismatico",
  "nameEn": "Prismatic Spray",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Otto raggi di luce si sprigionano dall'incantatore in un cono di 18 metri. Ogni creatura presente nel cono effettua un tiro salvezza su Destrezza. Per ogni bersaglio, si tira 1d8 per determinare da quale raggio viene influenzato, consultando la tabella Raggi prismatici.\nRaggi prismatici\n1d8 Raggio\n1 | Rosso. | Tiro salvezza fallito: | 12d6 danni da fuoco.\nTiro salvezza superato: | la metà dei danni.\n2 | Arancione. | Tiro salvezza fallito: | 12d6 danni da\nacido. | Tiro salvezza superato: | la metà dei danni.\n3 | Giallo. | Tiro salvezza fallito: | 12d6 danni da fulmine.\nTiro salvezza superato: | la metà dei danni.\n4 | Verde. | Tiro salvezza fallito: | 12d6 danni da veleno.\nTiro salvezza superato: | la metà dei danni.\n5 | Blu. | Tiro salvezza fallito: | 12d6 danni da freddo. | Tiro\nsalvezza superato: | la metà dei danni.\n6 | Indaco. | Tiro salvezza fallito: | il bersaglio è tratte-\nnuto ed effettua un tiro salvezza su Costituzione\nalla fine di ogni suo turno. Se lo supera per tre\nvolte, pone fine alla condizione. Se fallisce per tre\nvolte, resta pietrificato finché non viene liberato\nda un effetto come quello dell'incantesimo risto-\nrare superiore | . Non è necessario che i tiri superati\no falliti siano consecutivi: si tiene semplicemente\nil conto di entrambi finché il bersaglio non ne\naccumula tre di un certo tipo.\n7 | Viola. | Tiro salvezza fallito: | il bersaglio è accecato\ned effettua un tiro salvezza su Saggezza all'inizio\ndel turno successivo dell'incantatore. Se lo\nsupera, non è più accecato. Se lo fallisce, non\nè più accecato e viene teletrasportato su un altro\npiano di esistenza (a scelta del GM).\n8 | Speciale. | Il bersaglio viene colpito da due raggi.\nSi tira altre due volte, rilanciando i dadi se il risul-\ntato ottenuto è 8.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "12d6",
   "damageType": "fire"
  }
 },
 {
  "id": "teleport",
  "name": "Teletrasporto",
  "nameEn": "Teleport",
  "level": 7,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "3 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer"
  ],
  "description": "Questo incantesimo teletrasporta immediatamente l'incantatore e un solo oggetto o un massimo di otto creature consenzienti, che si trovano entro gittata e che egli è in grado di vedere, fino a una destinazione a sua scelta. Se il bersaglio è un oggetto, deve essere di taglia Grande o inferiore e non può essere impugnato o trasportato da una creatura non consenziente. all'incantatore e deve trovarsi sul suo stesso piano La destinazione scelta deve essere nota di esistenza. La sua familiarità con la destinazione determina il successo del teletrasporto. Il GM tira 1d100 e consulta la tabella Risultato del teletrasporto e le spiegazioni successive.\nRisultato del teletrasporto\nArea | Fuori | Sul\nFamiliarità | Errore | simile | bersaglio | bersaglio\nCerchio | — | — | — | 01–00\npermanente\nOggetto | — | — | — | 01–00\ncollegato\nMolto | 01–05 | 06–13 | 14–24 | 25–00\nfamiliare\nVisto occa- | 01–33 | 34–43 | 44–53 | 54–00\nsionalmente\nVisto una | 01–43 | 44–53 | 54–73 | 74–00\nvolta o\ndescritto\nFalsa | 01–50 | 51–00 | — | —\ndestinazione\n**Familiarità.** Di seguito vengono spiegati i significati dei termini presenti nella colonna Familiarità:\n• \"Cerchio permanente\" indica un cerchio di teletrasporto permanente di cui l'incantatore conosce la sequenza di sigilli.\n• \"Oggetto collegato\" indica un oggetto in possesso dell'incantatore prelevato dalla destinazione desiderata negli ultimi sei mesi, come un libro della biblioteca di un mago.\n• \"Molto familiare\" indica un luogo che l'incantatore ha visitato spesso, un luogo che ha studiato con attenzione o un luogo che è in grado di vedere quando lancia l'incantesimo.\n• \"Visto occasionalmente\" indica un luogo che l'incantatore ha visto più di una volta, ma che non gli è troppo familiare.\n• \"Visto una volta o descritto\" indica un luogo che l'incantatore ha visto una volta, magari usando la magia, o un luogo noto attraverso la descrizione di un'altra persona o una mappa.\n• \"Falsa destinazione\" è un luogo inesistente. Per esempio, l'incantatore ha cercato di scrutare il rifugio segreto di un nemico ma ha visto invece un'illusione, oppure tenta di teletrasportarsi in un luogo che non esiste più.\n**Errore.** La magia imprevedibile dell'incantesimo rende difficile il viaggio. Ogni creatura che si teletrasporta (o l'oggetto bersaglio) subisce 3d10 danni da forza e il GM lancia di nuovo sulla tabella per determinare dove arriverà (potrebbero verificarsi vari errori, nel qual caso i danni verranno inflitti ogni volta).\n**Area simile.** L'incantatore e il suo gruppo (o l'oggetto bersaglio) arrivano in un'area diversa che è visivamente o tematicamente simile all'area bersaglio, oltre a essere nelle sue immediate vicinanze. Per esempio, se l'incantatore vuole dirigersi al suo laboratorio personale, potrebbe comparire in quello di un'altra persona nella stessa città.\n**Fuori bersaglio.** L'incantatore e il suo gruppo (o l'oggetto bersaglio) compaiono a una distanza di 2d12 chilometri dalla destinazione in una direzione casuale. Tira 1d8 per la direzione: 1, est; 2, sud-est; 3, sud; 4, sud-ovest; 5, ovest; 6, nord-ovest; 7, nord; oppure 8, nord-est.\n**Sul bersaglio.** L'incantatore e il suo gruppo (o l'oggetto bersaglio) compaiono nel luogo designato.",
  "roll": {
   "kind": "damage",
   "dice": "3d10",
   "damageType": "force"
  }
 },
 {
  "id": "fire-storm",
  "name": "Tempesta di fuoco",
  "nameEn": "Fire Storm",
  "level": 7,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "sorcerer"
  ],
  "description": "Una tempesta di fuoco compare in un luogo entro gittata. L'area della tempesta è composta da dieci cubi con spigolo di 3 metri, che l'incantatore può disporre come desidera. Ogni cubo deve essere contiguo ad almeno un altro cubo. Ogni creatura nell'area effettua un tiro salvezza su Destrezza; se lo fallisce, subisce 7d10 danni da fuoco, mentre se lo supera subisce la metà dei danni.\nGli oggetti infiammabili nell'area che non sono indossati o trasportati iniziano a bruciare.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "7d10",
   "damageType": "fire"
  }
 },
 {
  "id": "antipathy-sympathy",
  "name": "Antipatia/simpatia",
  "nameEn": "Antipathy/Sympathy",
  "level": 8,
  "school": "enchantment",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "18 metri",
  "components": "V, S, M (una miscela di aceto e miele)",
  "duration": "10 giorni",
  "lists": [
   "bard",
   "druid",
   "wizard"
  ],
  "description": "Quando l'incantatore lancia l'incantesimo, decide se creare antipatia o simpatia e sceglie come bersaglio sag una creatura o un oggetto di taglia Enorme o inferiore. Dopodiché, specifica un tipo di creatura, come per esempio draghi rossi, goblin o vampiri. Una creatura del tipo scelto effettua un tiro salvezza su Saggezza quando si trova entro 36 metri dal bersaglio. La scelta dell'incantatore tra gli effetti di antipatia e simpatia determina cosa accade a una creatura quando questa fallisce il tiro salvezza.\n**Antipatia.** La creatura è spaventata e deve usare il movimento nel suo turno per allontanarsi il più possibile dal bersaglio, muovendosi per la via più sicura.\n**Simpatia.** La creatura è affascinata e deve usare il movimento nel suo turno per avvicinarsi il più possibile al bersaglio, muovendosi per la via più sicura. Se la creatura si trova entro 1,5 metri dal bersaglio, non può allontanarsi volontariamente. Se il bersaglio infligge danni alla creatura affascinata, questa può effettuare un tiro salvezza su Saggezza per porre fine all'effetto, come descritto di seguito.\n**Porre fine all'effetto.** Se la creatura spaventata o affascinata termina il suo turno a più di 36 metri di distanza dal bersaglio, effettua un tiro salvezza su Saggezza. In caso di successo, la creatura non è più sotto l'influenza del bersaglio. Una creatura che supera un tiro salvezza contro l'effetto ne è immune per 1 minuto, al termine del quale può esserne influenzata di nuovo.",
  "save": "wis"
 },
 {
  "id": "holy-aura",
  "name": "Aura sacra",
  "nameEn": "Holy Aura",
  "level": 8,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un reliquiario del valore di 1.000 mo o più)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore irradia un'aura in un'emanazione di 9 metri. Le creature scelte dell'incantatore che si trovano all'interno dell'aura dispongono di vantaggio a tutti i tiri salvezza, mentre le altre creature subiscono svantaggio ai tiri per colpire contro le creature scelte. Inoltre, quando un immondo o un non morto colpisce una creatura influenzata con un tiro per colpire in mischia, l'attaccante deve superare un tiro salvezza su Costituzione, altrimenti viene accecato fino al termine del proprio turno successivo.",
  "save": "con"
 },
 {
  "id": "antimagic-field",
  "name": "Campo anti-magia",
  "nameEn": "Antimagic Field",
  "level": 8,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (limatura di ferro)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "cleric",
   "wizard"
  ],
  "description": "Un'aura di anti-magia circonda l'incantatore in un'emanazione di 3 metri. Nessuno può lanciare incantesimi, compiere azioni di Magia o creare altri effetti magici all'interno dell'aura, e tali azioni non possono colpire o influenzare in alcun modo nulla al suo interno. Le proprietà degli oggetti magici non funzionano all'interno dell'aura o su qualsiasi cosa al suo interno.\nLe aree di effetto create da incantesimi o da altre magie non possono estendersi all'interno dell'aura e nessuno può teletrasportarsi all'interno o all'esterno di essa o utilizzare il viaggio planare. I portali si chiudono temporaneamente quando si trovano all'interno dell'aura.\nGli incantesimi già in corso, tranne quelli lanciati da manufatti o divinità, sono soppressi all'interno dell'area. Mentre un effetto è soppresso non funziona, ma il tempo che trascorre in questo stato conta ai fini della sua durata.\nDissolvi magie non ha alcun effetto sull'aura, e le aure create da più incantesimi campo anti-magia non si annullano a vicenda."
 },
 {
  "id": "clone",
  "name": "Clone",
  "nameEn": "Clone",
  "level": 8,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (un diamante del valore di 1.000 mo o più, che l'incantesimo consuma, e un con- tenitore sigillabile del valore di 2.000 mo o più, abba- stanza grande da contenere la creatura da clonare)",
  "duration": "Istantanea",
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore tocca una creatura o un cubo della sua carne di almeno 2,5 cm per lato. Un duplicato inerme di quella creatura si sviluppa all'interno del contenitore utilizzato per lanciare l'incantesimo e finisce di crescere dopo 120 giorni; l'incantatore sceglie se il clone sviluppato ha la stessa età della creatura o è più giovane. Il clone rimane inerte e permane per un tempo indeterminato, fintantoché il suo involucro rimane indisturbato.\nDopo che il clone ha raggiunto la maturazione, se la creatura originale muore, la sua anima viene trasferita al clone, purché essa sia libera e disposta a tornare. Il clone è fisicamente identico all'originale e possiede la sua personalità, i suoi ricordi e le sue abilità, ma non il suo equipaggiamento. I resti della creatura originale, se ancora esistono, diventano inerti e non possono più essere riportati in vita, in quanto l'anima della creatura è altrove."
 },
 {
  "id": "control-weather",
  "name": "Controllare tempo atmosferico",
  "nameEn": "Control Weather",
  "level": 8,
  "school": "transmutation",
  "castingTime": "10 minuti",
  "timing": "special",
  "range": "Incantatore",
  "components": "V, S, M (incenso bruciato)",
  "duration": "Concentrazione, fino a 8 ore",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "wizard"
  ],
  "description": "L'incantatore assume il controllo del tempo atmosferico entro 7,5 chilometri per la durata dell'incantesimo, che dev'essere lanciato in un luogo all'aperto. L'incantesimo termina anticipatamente se l'incantatore si sposta in un luogo chiuso.\nQuando lancia un incantesimo, l'incantatore cambia le condizioni atmosferiche attuali determinate dal GM. L'incantatore può modificare le precipitazioni, la temperatura e il vento. Occorrono 1d4 × 10 minuti perché le nuove condizioni abbiano effetto. Quando questo accade, l'incantatore le può cambiare di nuovo. Al termine dell'incantesimo, il tempo atmosferico torna alla normalità.\nQuando l'incantatore modifica le condizioni atmosferiche, trova la condizione attuale nelle tabelle seguenti e la modifica di un grado, verso l'alto o verso il basso. Quando l'incantatore cambia il vento, può modificarne anche la direzione.\nPrecipitazioni\nGrado Condizione\n1 | Sereno\n2 | Poco nuvoloso\n3 | Nuvoloso o nebbia\n4 | Pioggia, grandine o neve\n5 | Pioggia torrenziale, grandinata violenta o\ntormenta\nTemperatura | Vento\nGrado Condizione | Grado Condizione\n1 | Torrido | 1 | Calmo\n2 | Caldo | 2 | Vento moderato\n3 | Temperato | 3 | Vento forte\n4 | Fresco | 4 | Burrasca\n5 | Freddo | 5 | Tempesta\n6 | Gelido"
 },
 {
  "id": "befuddlement",
  "name": "Disorientare",
  "nameEn": "Befuddlement",
  "level": 8,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (un portachiavi senza chiavi)",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore assale la mente di una creatura entro gittata che egli è in grado di vedere. Il bersaglio effettua un tiro salvezza su Intelligenza.\nSe lo fallisce, il bersaglio subisce 10d12 danni psichici e non può lanciare incantesimi o eseguire l'azione di Magia. Alla fine di ogni 30 giorni, il bersaglio ripete il tiro salvezza e, se lo supera, l'effetto svanisce. L'effetto può essere dissolto anche tramite gli incantesimi ristorare superiore, guarigione o desiderio.\nIn caso di successo, subisce soltanto la metà di quei danni.",
  "save": "int",
  "roll": {
   "kind": "damage",
   "dice": "10d12",
   "damageType": "psychic"
  }
 },
 {
  "id": "dominate-monster",
  "name": "Dominare mostri",
  "nameEn": "Dominate Monster",
  "level": 8,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "Una creatura entro gittata e che l'incantatore è in grado di vedere deve superare un tiro salvezza su Saggezza, altrimenti diventa affascinato per la durata dell'incantesimo. Il bersaglio dispone di vantaggio al tiro salvezza se l'incantatore o i suoi alleati stanno combattendo contro di essa. Ogni volta che il bersaglio subisce danni, ripete il tiro salvezza; se lo supera, l'effetto svanisce.\nL'incantatore ha un legame telepatico con il bersaglio affascinato mentre i due si trovano sullo stesso piano di esistenza. Nel proprio turno, l'incantatore può utilizzare questo legame per impartire comandi al bersaglio (nessuna azione richiesta), come ad esempio \"attacca quella creatura\", \"spostati lì\", o \"recupera quell'oggetto\". Il bersaglio fa del suo meglio per obbedire nel suo turno. Se porta a termine un ordine e non riceve ulteriori istruzioni dall'incantatore, agisce e si muove a suo piacimento, concentrandosi sulla propria incolumità.\nL'incantatore può comandare al bersaglio di effettuare una reazione, ma per farlo dovrà utilizzare la propria reazione.",
  "higherLevels": "La concentrazione dell'incantatore può durare più a lungo usando uno slot incantesimo di 9º livello (fino a 8 ore).",
  "save": "wis"
 },
 {
  "id": "sunburst",
  "name": "Esplosione solare",
  "nameEn": "Sunburst",
  "level": 8,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S, M (un frammento di pietra di sole)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Una radiosa luce solare splende in una sfera del raggio di 18 metri, centrata su un punto entro gittata a scelta dell'incantatore. Ogni creatura al suo interno deve effettuare un tiro salvezza su Costituzione. Se lo fallisce, subisce 12d6 danni radiosi e rimane accecata per 1 minuto, mentre se lo supera subisce solo la metà dei danni.\nUna creatura accecata da questo incantesimo effettua un altro tiro salvezza su Costituzione al termine di ogni suo turno, facendone svanire l'effetto in caso di successo.\nQuesto incantesimo dissolve qualsiasi oscurità nell'area creata da un incantesimo.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "12d6",
   "damageType": "radiant"
  }
 },
 {
  "id": "animal-shapes",
  "name": "Forme animali",
  "nameEn": "Animal Shapes",
  "level": 8,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S",
  "duration": "24 ore",
  "lists": [
   "druid"
  ],
  "description": "L'incantatore sceglie un qualsiasi numero di creature consenzienti entro gittata che egli è in grado di vedere. Ogni bersaglio muta forma in una bestia Grande o Piccola a scelta, con un grado di sfida pari o inferiore a 4. L'incantatore può scegliere una forma differente per ogni bersaglio e, nei turni successivi, può effettuare un'azione di Magia per trasformare nuovamente i bersagli.\nLe statistiche della bestia scelta sostituiscono le statistiche di gioco del bersaglio, il cui tipo di creatura non cambia. Inoltre, il bersaglio conserva i punti ferita, i dadi vita, il proprio allineamento, l'abilità di comunicare e i punteggi di Intelligenza, Saggezza e Carisma. Le azioni del bersaglio sono limitate dalla forma anatomica della bestia scelta, che non può lanciare incantesimi. L'equipaggiamento del bersaglio si fonde nella nuova forma e non può essere utilizzato finché non viene assunta di nuovo la forma originale.\nIl bersaglio guadagna un numero di punti ferita temporanei pari ai punti ferita della prima forma in cui viene mutato. Al termine dell'incantesimo, il bersaglio perde tutti i punti ferita temporanei rimasti. La trasformazione permane per la durata dell'incantesimo o finché il bersaglio non la termina come azione bonus."
 },
 {
  "id": "maze",
  "name": "Labirinto",
  "nameEn": "Maze",
  "level": 8,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 10 minuti",
  "concentration": true,
  "lists": [
   "wizard"
  ],
  "description": "L'incantatore bandisce una creatura entro gittata che egli è in grado di vedere in un semipiano labirintico. Il bersaglio rimane laggiù per la durata dell'incantesimo o finché non fugge dal labirinto.\nIl bersaglio può effettuare un'azione di Studio per provare a fuggire. Quando questo avviene, effettua una prova di Intelligenza (Indagare) con CD 20. In caso di successo, il bersaglio fugge e l'incantesimo termina.\nAl termine dell'incantesimo, il bersaglio riappare nello spazio in cui si trovava prima del lancio o, se è occupato, nello spazio libero più vicino."
 },
 {
  "id": "glibness",
  "name": "Loquacità",
  "nameEn": "Glibness",
  "level": 8,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V",
  "duration": "1 ora",
  "lists": [
   "bard",
   "warlock"
  ],
  "description": "Fino al termine dell'incantesimo, quando l'incantatore effettua una prova di Carisma, può sostituire il risultato del tiro con un 15. Inoltre, a prescindere da ciò che dice, le magie in grado di determinare se un bersaglio stia dicendo o meno la verità indicano che l'incantatore è sincero."
 },
 {
  "id": "incendiary-cloud",
  "name": "Nube incendiaria",
  "nameEn": "Incendiary Cloud",
  "level": 8,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "45 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid",
   "wizard",
   "sorcerer"
  ],
  "description": "Una nube turbinante di fumo e tizzoni incandescenti appare in una sfera del raggio di 6 metri centrata su un punto entro gittata. L'area coperta dalla nuvola è pesantemente oscurata. La nube permane per la durata dell'incantesimo o finché un vento forte (come quello creato da folata di vento) non la disperde.\nQuando essa compare, ogni creatura al suo interno effettua un tiro salvezza su Destrezza, subendo 10d8 danni da fuoco in caso di fallimento, o la metà dei danni in caso di successo. Una creatura deve effettuare questo tiro salvezza anche quando la sfera si muove nel suo spazio e quando la creatura entra nella sfera o vi termina il suo turno. Una creatura effettua questo tiro salvezza solo una volta per turno.\nLa nube si allontana di 3 metri dall'incantatore in una direzione scelta da quest'ultimo all'inizio di ogni suo turno.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "10d8",
   "damageType": "fire"
  }
 },
 {
  "id": "power-word-stun",
  "name": "Parola del potere stordire",
  "nameEn": "Power Word Stun",
  "level": 8,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore sconvolge la mente di una creatura situata entro gittata che egli è in grado di vedere. Se il bersaglio possiede 150 punti ferita o meno, è stordito. Altrimenti, la sua velocità è pari a 0 fino all'inizio del turno successivo dell'incantatore.\nIl bersaglio stordito effettua un tiro salvezza su Costituzione alla fine di ogni suo turno e, se lo supera, pone fine alla condizione.",
  "save": "con"
 },
 {
  "id": "demiplane",
  "name": "Semipiano",
  "nameEn": "Demiplane",
  "level": 8,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "S",
  "duration": "1 ora",
  "lists": [
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore crea una porta d'ombra di taglia Media su una superficie piatta e solida entro gittata che egli è in grado di vedere. La porta può essere aperta e chiusa, e conduce verso un semipiano che appare come una stanza vuota di legno o pietra (a scelta dell'incantatore) ampia 9 metri in ogni dimensione.\nAl termine dell'incantesimo, la porta scompare e gli oggetti al suo interno rimangono nel semipiano. Ciò si applica anche alle creature, a meno che non scelgano di venire spinte attraverso la porta mentre questa svanisce, atterrando prone sugli spazi liberi più vicini allo spazio occupato precedentemente dalla porta.\nOgni volta che lancia questo incantesimo, l'incantatore può creare un nuovo semipiano o collegare la porta d'ombra a un semipiano da lui creato con un lancio precedente di questo incantesimo. Inoltre, se l'incantatore conosce la natura e i contenuti di un semipiano creato da un'altra creatura lanciando questo incantesimo, può fare invece in modo che la porta d'ombra si colleghi a quel semipiano."
 },
 {
  "id": "earthquake",
  "name": "Terremoto",
  "nameEn": "Earthquake",
  "level": 8,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "150 metri",
  "components": "V, S, M (una roccia fratturata)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "druid",
   "sorcerer"
  ],
  "description": "L'incantatore sceglie un punto del terreno entro gittata che egli è in grado di vedere. Per la durata dell'incantesimo, una scossa intensa sconquassa il terreno in un raggio di 30 metri centrato su quel punto, rendendolo terreno difficile.\nQuando l'incantatore lancia questo incantesimo, e alla fine di ogni suo turno per tutta la durata, ogni creatura sul terreno nell'area effettua un tiro salvezza su Destrezza. In caso di fallimento, la creatura cade prona e la sua concentrazione viene interrotta.\nL'incantatore può anche causare i seguenti effetti.\n**Crepe.** Un totale di 1d6 crepe si apre nell'area dell'incantesimo alla fine del turno in cui viene lanciato. L'incantatore sceglie i punti in cui si aprono le crepe, che non possono trovarsi al di sotto di strutture. Ognuna di esse è profonda 1d10 × 3 metri, ampia 3 metri e si estende da un lato all'altro dell'area dell'incantesimo. Se una creatura si trova nel punto i cui si apre una crepa, deve superare un tiro salvezza su Destrezza o vi cade dentro. Una creatura che supera il tiro salvezza riesce a spostarsi insieme al bordo della crepa mentre si apre.\n**Strutture.** La scossa infligge 50 danni contundenti a una qualsiasi struttura a contatto con il terreno nell'area in cui è stato lanciato l'incantesimo e alla fine di ogni turno dell'incantatore fino al termine dell'incantesimo. Se la struttura scende a 0 punti ferita, crolla.\nUna creatura situata entro una distanza da una struttura in disfacimento pari alla metà dell'altezza della struttura stessa effettua un tiro salvezza su Destrezza. Se fallisce, subisce 12d6 danni contundenti, viene buttata a terra prona e rimane sepolta sotto le macerie; per liberarsi con un'azione deve effettuare una prova di Forza (Atletica) con CD 20. In caso di successo, subisce soltanto la metà di quei danni.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "12d6",
   "damageType": "bludgeoning"
  }
 },
 {
  "id": "tsunami",
  "name": "Tsunami",
  "nameEn": "Tsunami",
  "level": 8,
  "school": "conjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "1,5 chilometri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 6 round",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "Un muro di acqua si materializza in un punto a scelta dell'incantatore entro gittata. Il muro può avere dimensioni massime di 90 metri di lunghezza, 90 metri di altezza e 15 metri di spessore Il muro permane per tutta la durata dell'incantesimo.\nQuando appare, ogni creatura nell'area effettua un tiro salvezza su Forza, subendo 6d10 danni contundenti in caso di fallimento o la metà dei danni in caso di successo.\nAll'inizio di ogni turno dell'incantatore, dopo l'apparizione del muro, esso si sposta di 15 metri (insieme alle creature che contiene) allontanandosi dall'incantatore. Qualsiasi creatura di taglia Enorme o inferiore all'interno del muro e qualsiasi creatura in uno spazio in cui il muro entra quando si sposta, deve superare un tiro salvezza su Forza, altrimenti subisce 5d10 danni contundenti. Una creatura può subire questi danni solo una volta per round. Alla fine del turno, l'altezza del muro si riduce di 15 metri e i danni che infligge nei round successivi sono ridotti di 1d10. Quando il muro raggiunge 0 metri di altezza, l'incantesimo termina.\nUna creatura immersa nel muro può muoversi nuotando. Tuttavia, a causa della forza dell'onda, per potersi effettivamente muovere deve superare una prova di Forza (Atletica) contro la CD del tiro salvezza sull'incantesimo. Se fallisce la prova, non può muoversi. Una creatura che, muovendosi, esce dal muro, cade a terra.",
  "save": "str",
  "roll": {
   "kind": "damage",
   "dice": "6d10",
   "damageType": "bludgeoning"
  }
 },
 {
  "id": "mind-blank",
  "name": "Vuoto mentale",
  "nameEn": "Mind Blank",
  "level": 8,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Contatto",
  "components": "V, S",
  "duration": "24 ore",
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "Fino al termine dell'incantesimo, l'incantatore tocca una creatura consenziente rendendola immune ai danni psichici e alla condizione affascinato. Inoltre, il bersaglio non è influenzato da nulla che sia in grado di percepire le sue emozioni o allineamento, leggere i suoi pensieri o individuare magicamente la sua posizione. Nessun incantesimo, nemmeno l'incantesimo desiderio, può raccogliere informazioni sul bersaglio, osservarlo a distanza, o controllarne la mente."
 },
 {
  "id": "wish",
  "name": "Desiderio",
  "nameEn": "Wish",
  "level": 9,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Desiderio è l'incantesimo più potente che un mortale sia in grado di lanciare. Gli basta parlare a voce alta per alterare l'essenza stessa della realtà.\nL'uso base di questo incantesimo è riprodurre un qualsiasi altro incantesimo di livello pari o inferiore all'8º. Utilizzandolo in questo modo, non è necessario soddisfare particolari requisiti per lanciarlo e non servono costose componenti: l'incantesimo ha semplicemente effetto.\nIn alternativa, l'incantatore può creare uno dei seguenti effetti a sua scelta:\n**Creazione di un oggetto.** L'incantatore crea un oggetto del valore massimo di 25.000 mo che non sia un oggetto magico e che non misuri più di 90 metri in ogni dimensione. L'oggetto si materializza a terra in uno spazio libero che l'incantatore è in grado di vedere.\n**Salute istantanea.** L'incantatore consente a sé e un massimo di venti creature che egli è in grado di vedere di recuperare tutti i punti ferita e pone fine a tutti gli effetti su di loro come descritto nell'incantesimo ristorare superiore.\n**Resistenza.** L'incantatore conferisce a un massimo di dieci creature che egli è in grado di vedere resistenza a un tipo di danno a sua scelta. La resistenza conferita è permanente.\n**Immunità a un incantesimo.** L'incantatore conferisce a un massimo di dieci creature che egli è in grado di vedere immunità a un singolo incantesimo o un altro effetto magico per 8 ore.\n**Apprendimento improvviso.** L'incantatore sostituisce uno dei suoi talenti con un altro di cui soddisfa i requisiti, perdendo tutti i benefici di quello precedente e ottenendo quelli del nuovo talento. Non è possibile sostituirne uno che è un prerequisito per altri talenti o caratteristiche del personaggio.\n**Ripetizione del tiro.** L'incantatore annulla un singolo evento recente imponendo la ripetizione di un qualsiasi tiro effettuato entro l'ultimo round (incluso il suo ultimo turno). La realtà viene rimodellata e si adatta al nuovo risultato. Per esempio, un incantesimo desiderio potrebbe annullare un tiro salvezza fallito da un alleato o il colpo critico inferto da un avversario. L'incantatore può imporre che il tiro ripetuto sia effettuato con vantaggio o svantaggio e poi può scegliere se usare il tiro ripetuto o il tiro originale.\n**Riplasmazione della realtà.** L'incantatore potrebbe desiderare qualcosa che non è incluso negli altri effetti elencati. Per farlo, deve dichiarare il suo desiderio al GM nel modo più preciso possibile. Il GM ha la massima libertà di decidere cosa accade in questi casi: più potente è il desiderio, maggiori sono le probabilità che qualcosa vada storto. L'incantesimo potrebbe semplicemente fallire, l'effetto desiderato potrebbe avverarsi solo in parte o l'incantatore potrebbe subire conseguenze inaspettate come risultato della formulazione del desiderio. Per esempio, se desidera che un suo nemico sia morto, potrebbe essere trascinato nel futuro fino al momento in cui quel nemico non è più in vita, venendo a tutti gli effetti rimosso dal gioco. Analogamente, se desidera un manufatto o un oggetto magico leggendario, potrebbe essere trasportato istantaneamente in presenza del suo attuale proprietario. Se il desiderio viene esaudito e i suoi effetti hanno conseguenze per un'intera comunità, regione o per tutto il mondo, l'incantatore potrebbe attirare l'attenzione di potenti nemici. Se invece potrebbe avere effetti su una divinità, i suoi servi divini potrebbero intervenire all'istante per impedirlo o incoraggiare l'incantatore a formularlo in un modo preciso. Se dovesse disfare il multiverso stesso, il desiderio fallisce.\nLa tensione provocata dal lancio di desiderio per produrre un qualsiasi effetto diverso dalla duplicazione di un altro incantesimo debilita l'incantatore. Dopo aver sopportato quella tensione, ogni volta che l'incantatore lancia un incantesimo prima di avere completato un riposo lungo, subisce 1d10 danni necrotici per livello di quell'incantesimo. Questi danni non possono essere ridotti o prevenuti in alcun modo. Inoltre, il punteggio di Forza dell'incantatore scende a 3 per 2d4 giorni. Per ognuno di quei giorni trascorso a riposare e a non fare nulla fuorché attività poco impegnative, il tempo di recupero rimanente diminuisce di 2 giorni. Esiste infine una probabilità del 33% che l'incantatore non sia più in grado di lanciare desiderio, se non riesce a reggere la tensione.",
  "roll": {
   "kind": "damage",
   "dice": "1d10",
   "damageType": "necrotic"
  }
 },
 {
  "id": "weird",
  "name": "Fatale",
  "nameEn": "Weird",
  "level": 9,
  "school": "illusion",
  "castingTime": "Azione",
  "timing": "action",
  "range": "36 metri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore tenta di creare orrori illusori nella mente degli avversari. Ogni creatura a sua scelta all'interno di una sfera con raggio di 9 metri, centrata su un punto entro gittata, effettua un tiro salvezza su Saggezza. In caso di fallimento, il bersaglio subisce 10d10 danni psichici ed è spaventato per la durata dell'incantesimo. Se invece lo supera, subisce soltanto la metà di quei danni.\nUn bersaglio spaventato effettua un tiro salvezza su Saggezza alla fine di ogni suo turno. In caso di fallimento, subisce 5d10 danni psichici, mentre in caso di successo l'incantesimo termina.",
  "save": "wis",
  "roll": {
   "kind": "damage",
   "dice": "10d10",
   "damageType": "psychic"
  }
 },
 {
  "id": "time-stop",
  "name": "Fermare il tempo",
  "nameEn": "Time Stop",
  "level": 9,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "L'incantatore interrompe brevemente lo scorrere nel tempo per tutti tranne che per se stesso. Per le altre creature il tempo non passa, mentre mente, nel corso dei quali può usare azioni e muoversi normalmente.\nQuesto incantesimo termina se una delle azioni usate o qualsiasi effetto creato dall'incantatore nel corso della sua durata influenza una creatura diversa da lui o un oggetto indossato o trasportato da qualcuno diverso da lui. Termina inoltre se l'incantatore si muove in un luogo a più di 300 metri l'incantatore effettua 1d4 + 1 turni consecutivadal punto in cui ha lanciato l'incantesimo."
 },
 {
  "id": "mass-heal",
  "name": "Guarigione di massa",
  "nameEn": "Mass Heal",
  "level": 9,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "cleric"
  ],
  "description": "Un'ondata di energia curativa si sprigiona dall'incantatore, investendo le creature intorno a lui. In questo modo, ripristina fino a 700 punti ferita, ripartendoli come desidera tra un qualsiasi numero di creature entro gittata che egli è in grado di vedere. Le creature guarite da questo incantesimo vengono inoltre curate dalle condizioni accecato, assordato e avvelenato."
 },
 {
  "id": "imprisonment",
  "name": "Imprigionare",
  "nameEn": "Imprisonment",
  "level": 9,
  "school": "abjuration",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "9 metri",
  "components": "V, S, M (una statuetta del bersaglio del valore di 5.000 mo o più)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore crea una costrizione magica per trattenere una creatura entro gittata che egli è in grado di vedere. Il bersaglio deve effettuare un tiro salvezza su Saggezza. In caso di successo, il bersaglio non viene influenzato ed è immune a questo incantesimo per le 24 ore successive. In caso di fallimento, il bersaglio è imprigionato. Mentre è imprigionato, il bersaglio non ha bisogno di respirare, mangiare o bere, e non invecchia. Gli incantesimi di divinazione non possono localizzare il bersaglio imprigionato e questo non può teletrasportarsi.\nInoltre, fino al termine dell'incantesimo, il bersaglio subisce uno dei seguenti effetti a scelta dell'incantatore:\n**Ceppi.** Il bersaglio è bloccato da una serie di catene saldamente ancorate al terreno. Il bersaglio è trattenuto e non può essere spostato in alcun modo.\n**Prigione protetta.** Il bersaglio è intrappolato in un semipiano protetto da teletrasporto e viaggi planari. Il semipiano può essere un labirinto, una gabbia, una torre o una struttura simile, a scelta dell'incantatore.\n**Prigionia ridotta.** Il bersaglio viene rimpicciolito fino all'altezza di 2,5 centimetri ed è intrappolato in una gemma indistruttibile o un oggetto simile. La luce passa attraverso la gemma (permettendo al bersaglio di guardare all'esterno e alle altre creature di guardare all'interno), ma nient'altro può attraversarla in alcun modo.\n**Sepoltura.** Il bersaglio viene sepolto nelle viscere della terra in un globo di forza magica sufficientemente ampio da contenerlo. Nulla può entrare o uscire dal globo.\n**Sonno.** Il bersaglio è privo di sensi e non può essere risvegliato.\n**Porre fine all'incantesimo.** Quando lancia l'incantesimo, l'incantatore specifica un innesco che porrà fine all'incantesimo. L'innesco può essere tanto semplice quanto complesso, in base alla scelta dell'incantatore, ma il GM deve ritenere che abbia una certa probabilità di verificarsi entro i dieci anni successivi. L'innesco deve essere un'azione osservabile, ad esempio: una persona che fa un'offerta particolare al tempio della divinità dell'incantatore, il salvataggio del vero amore dell'incantatore, o la sconfitta di un mostro specifico.\nDissolvi magie può porre fine a questo incantesimo solo se viene lanciato con uno slot incantesimo di 9º livello, bersagliando la prigione o la componente usata per crearla.",
  "save": "wis"
 },
 {
  "id": "true-polymorph",
  "name": "Metamorfosi pura",
  "nameEn": "True Polymorph",
  "level": 9,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "9 metri",
  "components": "V, S, M (una goccia di mercurio, una pic- cola quantità di resina e uno sbuffo di fumo)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "bard",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore sceglie una creatura o un oggetto non magico entro gittata che egli è in grado di vedere La prima si trasforma in un'altra creatura o un oggetto non magico, mentre il secondo diventa una creatura (l'oggetto non deve essere né indossato né trasportato). La trasformazione permane per la durata dell'incantesimo, o finché il bersaglio non muore o viene distrutto. Tuttavia, se l'incantatore mantiene la concentrazione per l'intera durata, l'incantesimo ha efficacia finché non viene dissolto o una creatura non consenziente supera un tiro salvezza su Saggezza.\n**Creatura in creatura.** Se l'incantatore trasforma una creatura in un altro tipo di creatura, la nuova forma può essere di qualsiasi tipo, purché il suo grado di sfida sia pari o inferiore a quello del bersaglio (o al suo livello). Le sue statistiche di gioco sono sostituite dalla scheda delle statistiche della nuova forma, mantenendo punti ferita, Dadi Vita, allineamento e personalità.\nIl bersaglio guadagna un numero di punti ferita temporanei pari ai punti ferita della nuova forma. Al termine dell'incantesimo, il bersaglio perde tutti i punti ferita temporanei rimasti.\nIl bersaglio è limitato alle azioni che può effettuare in base alla anatomia della sua nuova forma e non può parlare o lanciare incantesimi.\nL'attrezzatura del bersaglio si fonde nella sua nuova forma e la creatura non può utilizzare il suo equipaggiamento o beneficiarne in alcun modo.\n**Oggetto in creatura.** L'incantatore può trasformare un oggetto in un qualsiasi tipo di creatura, purché la sua taglia non sia superiore a quella dell'oggetto e il suo grado di sfida sia pari o inferiore a 9. La creatura è amichevole nei confronti dell'incantatore e dei suoi compagni e, in combattimento, obbedisce ai suoi comandi e svolge il suo turno subito dopo di lui.\nTuttavia, se l'incantesimo dura per più di un'ora, l'incantatore perde il controllo su di essa. Potrebbe rimanere amichevole o meno nei suoi confronti, in base a come è stata trattata.\n**Creatura in oggetto.** Se l'incantatore trasforma una creatura in un oggetto, tutto ciò che essa indossa o trasporta si fonde nella nuova forma, purché la taglia dell'oggetto non sia superiore a quella della creatura. Le statistiche della creatura diventano quelle dell'oggetto e, una volta terminato l'incantesimo e tornata nella sua forma normale, essa non ricorderà nulla del tempo trascorso in quella forma.",
  "save": "wis"
 },
 {
  "id": "prismatic-wall",
  "name": "Muro prismatico",
  "nameEn": "Prismatic Wall",
  "level": 9,
  "school": "abjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S",
  "duration": "10 minuti",
  "lists": [
   "bard",
   "wizard"
  ],
  "description": "Un piano scintillante di luce multicolore forma un muro opaco verticale (che può misurare fino a 27 metri di lunghezza, 9 metri di altezza e 2,5 centimetri di spessore), centrato su un punto entro gittata. In alternativa, l'incantatore modella il muro in un globo del diametro massimo di 9 metri centrato su un punto entro gittata. Il muro permane per tutta la durata dell'incantesimo. Se l'incantatore posiziona il muro in uno spazio occupato da una creatura, l'incantesimo termina immediatamente, senza alcun effetto.\nIl muro emana luce intensa entro 30 metri e luce fioca per ulteriori 30 metri. L'incantatore e le creature da lui scelte al momento del lancio dell'incantesimo possono passare attraverso il muro o rimanervi accanto senza subire danni. Se un'altra creatura in grado di vedere il muro giunge entro 6 metri da esso o comincia lì il proprio turno, deve superare un tiro salvezza su Costituzione, altrimenti è accecata per 1 minuto.\nIl muro è composto da sette strati, ognuno di un colore diverso. Quando una creatura si protende oltre il muro o ci passa attraverso, lo fa attraversando uno strato alla volta. Ogni strato costringe la creatura a effettuare un tiro salvezza su Destrezza, altrimenti viene influenzata dalle proprietà di quello strato, come descritto nella tabella degli strati prismatici.\nIl muro, che ha una CA pari a 10, può essere distrutto uno strato alla volta e in ordine dal rosso al viola, in un modo specifico per ogni strato. Se uno strato viene distrutto, resta distrutto per la durata dell'incantesimo. L'incantesimo campo anti-magia non ha alcun effetto sul muro e l'incantesimo dissolvi magie può influenzare solo lo strato viola.\nStrati prismatici\nOrdine Effetti\n1 | Rosso. | Tiro salvezza fallito: | 12d6 danni da\nfuoco. | Tiro salvezza superato: | la metà dei\ndanni. | Effetti aggiuntivi: | gli attacchi a distanza\nnon magici non possono attraversare questo\nstrato, che viene distrutto se subisce almeno\n25 danni da freddo.\n2 | Arancione. | Tiro salvezza fallito: | 12d6 danni da\nacido. | Tiro salvezza superato: | la metà dei danni.\nEffetti aggiuntivi: | gli attacchi a distanza magici\nnon possono attraversare questo strato,\nche viene distrutto da un vento forte (come\nquello creato da folata di vento | ).\n3 | Giallo. | Tiro salvezza fallito: | 12d6 danni da ful-\nmine. | Tiro salvezza superato: | la metà dei danni.\nEffetti aggiuntivi: | questo strato viene distrutto\nse subisce almeno 60 danni da forza.\n4 | Verde. | Tiro salvezza fallito: | 12d6 danni da\nveleno. | Tiro salvezza superato: | la metà dei\ndanni. | Effetti aggiuntivi: | un incantesimo\npassapareti | o un altro incantesimo di livello\npari o superiore che è in grado di aprire un\nportale su una superficie solida, distrugge\nquesto strato.\n5 | Blu. | Tiro salvezza fallito: | 12d6 danni da freddo.\nTiro salvezza superato: | la metà dei danni. | Effetti\naggiuntivi: | questo strato viene distrutto se\nsubisce almeno 25 danni da fuoco.\n6 | Indaco. | Tiro salvezza fallito: | il bersaglio è trat-\ntenuto ed effettua un tiro salvezza su Costitu-\nzione alla fine di ogni suo turno. Se lo supera\nper tre volte, pone fine alla condizione. Se\nfallisce per tre volte, resta pietrificato finché\nnon viene liberato da un effetto come quello\ndell'incantesimo | ristorare superiore | . Non è\nnecessario che i tiri superati o falliti siano\nconsecutivi: si tiene semplicemente il conto di\nentrambi finché il bersaglio non ne accumula\ntre di un certo tipo. | Effetti aggiuntivi: | non\nè possibile lanciare incantesimi attraverso\nquesto strato, che viene distrutto dalla luce\nintensa emanata dall'incantesimo | luce diurna | .\nOrdine Effetti\n7 | Viola. | Tiro salvezza fallito: | il bersaglio è acce-\ncato ed effettua un tiro salvezza su Saggezza\nall'inizio del turno successivo dell'incantatore.\nSe lo supera, non è più accecato. Se lo fallisce,\nnon è più accecato e viene teletrasportato su\nun altro piano di esistenza (a scelta del GM).\nEffetti aggiuntivi: | questo strato viene distrutto\nda | dissolvi magie | .",
  "save": "con"
 },
 {
  "id": "power-word-heal",
  "name": "Parola del potere guarire",
  "nameEn": "Power Word Heal",
  "level": 9,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "cleric"
  ],
  "description": "Un'ondata di energia curativa investe una creatura entro gittata che l'incantatore è in grado di vedere. Il bersaglio recupera tutti i suoi punti ferita. Se la creatura è affascinata, avvelenata, paralizzata, spaventata o stordita, questa condizione termina. Se la creatura è prona, può usare la sua reazione per rialzarsi."
 },
 {
  "id": "power-word-kill",
  "name": "Parola del potere uccidere",
  "nameEn": "Power Word Kill",
  "level": 9,
  "school": "enchantment",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V",
  "duration": "Istantanea",
  "lists": [
   "bard",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore costringe una creatura entro gittata che egli è in grado di vedere a morire. Se il bersaglio possiede 100 punti ferita o meno, muore. Altrimenti, subisce 12d12 danni psichici.",
  "roll": {
   "kind": "damage",
   "dice": "12d12",
   "damageType": "psychic"
  }
 },
 {
  "id": "gate",
  "name": "Portale",
  "nameEn": "Gate",
  "level": 9,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "18 metri",
  "components": "V, S, M (un diamante del valore di 5.000 mo o più)",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "cleric",
   "wizard",
   "sorcerer",
   "warlock"
  ],
  "description": "L'incantatore evoca un portale che collega uno spazio libero entro gittata che egli è in grado di vedere a un luogo preciso su un piano di esistenza differente. Il portale è un'apertura circolare, del diametro variabile tra 1,5 e 6 metri a scelta dell'incantatore e può essere orientato in qualsiasi direzione. Il portale permane per la durata dell'incantesimo e la sua destinazione è visibile attraverso di esso.\nIl portale ha un lato anteriore e un lato posteriore su ogni piano dove appare e i viaggi sono possibili solo attraversandolo dalla parte anteriore. Tutto ciò che lo attraversa è trasportato immediatamente sull'altro piano, apparendo nello spazio libero più vicino al portale.\nDivinità e altri sovrani planari possono impedire che i portali creati tramite questo incantesimo si aprano in loro presenza o nei loro domini.\nQuando lancia questo incantesimo, l'incantatore può pronunciare il nome di una creatura specifica (pseudonimi, titoli o soprannomi non funzionano). Se la creatura nominata si trova su un piano diverso da quello in cui si trova l'incantatore, il portale si apre nelle immediate vicinanze della creatura, trasportandola fino allo spazio libero più vicino sul lato del portale in cui si trova l'incantatore. L'incantatore non ottiene alcun potere speciale sulla creatura, che è libera di agire come il GM ritiene più appropriato: potrebbe andarsene, attaccarlo o aiutarlo."
 },
 {
  "id": "foresight",
  "name": "Previsione",
  "nameEn": "Foresight",
  "level": 9,
  "school": "divination",
  "castingTime": "1 minuto",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (una piuma di colibrì)",
  "duration": "8 ore",
  "lists": [
   "bard",
   "druid",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore tocca una creatura consenziente e le conferisce una capacità limitata di vedere nell'immediato futuro. Per la durata dell'incantesimo, il bersaglio dispone di vantaggio alle prove con d20. Inoltre, le altre creature subiscono svantaggio ai tiri per colpire contro di esso. L'incantesimo termina in anticipo se l'incantatore lo lancia di nuovo."
 },
 {
  "id": "astral-projection",
  "name": "Proiezione astrale",
  "nameEn": "Astral Projection",
  "level": 9,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "3 metri",
  "components": "V, S, M (per ogni bersaglio dell'incan- tesimo, l'incantatore deve possedere un giacinto del valore di 1.000 mo o più e un lingotto d'argento del valore di 100 mo o più; l'incantesimo consuma entrambi)",
  "duration": "Finché non viene dissolto",
  "lists": [
   "cleric",
   "wizard",
   "warlock"
  ],
  "description": "L'incantatore e un massimo di otto creature consenzienti entro gittata proiettano i loro corpi astrali sul Piano Astrale (l'incantesimo termina immediatamente se l'incantatore si trova già su quel piano). Il corpo di ogni bersaglio cade in uno stato di animazione sospesa; ha la condizione privo di sensi, non ha bisogno di cibo o aria e non invecchia.\nLa forma astrale di un bersaglio assomiglia in tutto e per tutto al suo corpo, replicando le sue statistiche di gioco e le sue proprietà. La differenza principale consiste nell'aggiunta di un cordone argentato che si snoda tra le scapole della forma astrale, diventando invisibile dopo 30 cm. Se il cordone viene reciso, cosa che può accadere solo quando un effetto lo specifica chiaramente, il corpo e la forma astrale del bersaglio muoiono entrambi.\nLa forma astrale di un bersaglio può viaggiare sul Piano Astrale. Nel momento in cui una forma astrale lascia questo piano, il corpo e le proprietà del bersaglio vengono trasportati lungo il cordone argentato, permettendogli di rientrare nel suo corpo nel momento in cui accede al nuovo piano.\nQualsiasi danno o altro effetto che si applichi a una forma astrale non ha effetto sul corpo del bersaglio e viceversa. Inoltre, l'incantesimo termina se il corpo originale o la forma astrale di un bersaglio scende a 0 punti ferita. L'incantesimo termina per tutti i bersagli se l'incantatore effettua un'azione di Magia per interromperlo.\nQuando l'incantesimo termina per un bersaglio che non è morto, il bersaglio riappare nel suo corpo ed esce dallo stato di animazione sospesa."
 },
 {
  "id": "true-resurrection",
  "name": "Resurrezione pura",
  "nameEn": "True Resurrection",
  "level": 9,
  "school": "necromancy",
  "castingTime": "1 ora",
  "timing": "special",
  "range": "Contatto",
  "components": "V, S, M (diamanti del valore di 25.000 mo o più, che vengono consumati dall'incantesimo)",
  "duration": "Istantanea",
  "lists": [
   "cleric",
   "druid"
  ],
  "description": "L'incantatore tocca una creatura morta da non più di 200 anni a causa di un qualsiasi motivo fuorché la vecchiaia. Il bersaglio viene rianimato con tutti i propri punti ferita.\nQuesto incantesimo chiude tutte le ferite, neutralizza ogni veleno, cura tutti i contagi magici e annulla ogni maledizione che affiggeva la creatura al momento della morte. Inoltre, ripristina gli eventuali organi e arti danneggiati o mancanti. Se la creatura era un non morto, viene riportata alla forma originaria che aveva in vita.\nL'incantesimo può fornire al bersaglio un nuovo corpo se l'originale non esiste più, nel qual caso l'incantatore deve pronunciare il nome della creatura, che appare in uno spazio libero a scelta dell'incantatore entro 3 metri da lui."
 },
 {
  "id": "meteor-swarm",
  "name": "Sciame di meteore",
  "nameEn": "Meteor Swarm",
  "level": 9,
  "school": "evocation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "1,5 chilometri",
  "components": "V, S",
  "duration": "Istantanea",
  "lists": [
   "wizard",
   "sorcerer"
  ],
  "description": "Globi infuocati precipitano sul terreno in quattro punti differenti entro gittata che l'incantatore è in grado di vedere. Ogni creatura situata in una sfera del raggio di 12 metri centrata su ognuno di quei punti effettua un tiro salvezza su Destrezza. Una creatura subisce 20d6 danni da fuoco e 20d6 danni contundenti in caso di fallimento, o la metà dei danni in caso di successo. Una creatura in un'area con più sfere infuocate subisce l'effetto soltanto una volta.\nAnche un oggetto non magico che non sia indossato o trasportato subisce i danni se si trova entro l'area dell'incantesimo, e inizia a bruciare se è infiammabile.",
  "save": "dex",
  "roll": {
   "kind": "damage",
   "dice": "20d6",
   "damageType": "fire"
  }
 },
 {
  "id": "storm-of-vengeance",
  "name": "Tempesta di vendetta",
  "nameEn": "Storm of Vengeance",
  "level": 9,
  "school": "conjuration",
  "castingTime": "Azione",
  "timing": "action",
  "range": "1,5 chilometri",
  "components": "V, S",
  "duration": "Concentrazione, fino a 1 minuto",
  "concentration": true,
  "lists": [
   "druid"
  ],
  "description": "Per la durata dell'incantesimo, l'incantatore genera una minacciosa nube temporalesca che si espande fino a una raggio di 90 metri centrata su un punto entro gittata. Ogni creatura che si trova sotto alla nube quando appare deve superare un tiro salvezza su Costituzione, altrimenti subirà 2d6 danni da tuono e sarà assordata per la durata dell'incantesimo.\nAll'inizio di ciascun turno successivo, la tempesta produce effetti diversi, come indicato sotto.\n**2º turno.** Cade della pioggia acida. Ogni creatura e ogni oggetto sotto la nube subisce 4d6 danni da acido.\n**3º turno.** L'incantatore invoca sei fulmini che scendono dalla nube e colpiscono sei creature o oggetti situati sotto di essa. Ogni bersaglio effettua un tiro salvezza su Destrezza, subendo 10d6 danni da fulmine in caso di fallimento, o la metà dei danni in caso di successo.\n**4º turno.** Cade della grandine. Ogni creatura sotto la nube subisce 2d6 danni contundenti.\n**Dal 5º al 10º turno.** L'area sotto la nube è attraversata da raffiche di vento e pioggia gelida, ogni creatura sotto di essa subisce 1d6 danni da freddo. Fino al termine dell'incantesimo, quest'area è considerata terreno difficile ed è pesantemente oscurata. È sferzata da forti venti e al suo interno è impossibile eseguire attacchi a distanza.",
  "save": "con",
  "roll": {
   "kind": "damage",
   "dice": "2d6",
   "damageType": "thunder"
  }
 },
 {
  "id": "shapechange",
  "name": "Trasformazione",
  "nameEn": "Shapechange",
  "level": 9,
  "school": "transmutation",
  "castingTime": "Azione",
  "timing": "action",
  "range": "Incantatore",
  "components": "V, S, M (un diadema di giada del valore di 1.500 mo o più)",
  "duration": "Concentrazione, fino a 1 ora",
  "concentration": true,
  "lists": [
   "druid",
   "wizard"
  ],
  "description": "L'incantatore assume la forma di una creatura diversa per la durata dell'incantesimo o finché non effettua un'azione di Magia per mutare in un'altra forma possibile. La nuova forma deve essere quella di una creatura con un grado di sfida pari o inferiore al livello o al grado di sfida dell'incantatore. La creatura non può essere un costrutto o un non morto e deve essere un tipo di creatura che l'incantatore abbia già visto.\nQuando l'incantatore lancia l'incantesimo, ottiene un numero di punti ferita temporanei pari ai punti ferita della prima forma in cui si trasforma. Al termine dell'incantesimo, il bersaglio perde tutti i punti ferita temporanei rimasti.\nLe statistiche di gioco dell'incantatore vengono sostituite dalla scheda delle statistiche della forma scelta, ma l'incantatore conserva il suo tipo di creatura, allineamento, personalità, punteggi di Intelligenza, Saggezza e Carisma, punti ferita, Dadi Vita, competenze e abilità di comunicare. Se l'incantatore possiede il privilegio Incantesimi, conserva anche quello.\nQuando si trasforma, l'incantatore sceglie se lasciare a terra il suo equipaggiamento o se cambiarne taglia e aspetto per adattarlo alla sua nuova forma e continuare a indossarlo."
 }
];
