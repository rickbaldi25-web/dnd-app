import { Link } from "react-router";

/** Crediti e licenze: l'attribuzione dell'SRD è un obbligo della licenza CC-BY-4.0. */
export function Credits() {
  return (
    <main className="page narrow credits">
      <h1 className="page-title">Crediti</h1>

      <section className="panel">
        <h2>Brock's DnD</h2>
        <p>Un'app privata, fatta per un gruppo di amici, per tenere le schede dei personaggi e giocare insieme anche a distanza. Non è in vendita e non è aperta al pubblico.</p>
        <p>
          Non è un prodotto ufficiale e non è affiliata, approvata o sponsorizzata da Wizards of the Coast. Dungeons &amp; Dragons e D&amp;D sono marchi di Wizards of the Coast LLC.
        </p>
      </section>

      <section className="panel">
        <h2>System Reference Document</h2>
        <p>
          Quest'opera include materiale tratto dal System Reference Document 5.1 («SRD 5.1») e dal System Reference Document 5.2.1 («SRD 5.2.1») di Wizards of the Coast LLC, disponibili su{" "}
          <a href="https://www.dndbeyond.com/srd" target="_blank" rel="noreferrer">
            dndbeyond.com/srd
          </a>
          . Entrambi sono concessi in licenza secondo i termini della{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/legalcode.it" target="_blank" rel="noreferrer">
            Creative Commons Attribuzione 4.0 Internazionale
          </a>
          .
        </p>
        <p className="muted small">Il testo è stato adattato al formato dell'app; in parte è tradotto in italiano.</p>
      </section>

      <section className="panel">
        <h2>Caratteri</h2>
        <p>
          Cinzel e Alegreya Sans, distribuiti con licenza SIL Open Font tramite Google Fonts.
        </p>
      </section>

      <Link to="/">Torna ai personaggi</Link>
    </main>
  );
}
