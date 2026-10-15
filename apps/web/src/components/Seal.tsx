/** Un d20 visto di fronte, solo contorni: sta dietro al medaglione come un sigillo. */
function D20() {
  return (
    <svg className="seal-d20" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <polygon points="100,6 181,53 181,147 100,194 19,147 19,53" />
        <polygon points="100,46 152,136 48,136" />
        <path d="M100 6 L100 46 M181 53 L152 136 M181 53 L100 46 M19 53 L100 46 M19 53 L48 136 M181 147 L152 136 M19 147 L48 136 M100 194 L152 136 M100 194 L48 136" />
      </g>
    </svg>
  );
}

/** Logo nel medaglione con il d20 dietro: grande nell'accesso, piccolo in testa alla home. */
export function Seal({ className }: { className: string }) {
  return (
    <div className={`seal ${className}`}>
      <D20 />
      <img src="/logo.png" alt="" className="seal-mark" />
    </div>
  );
}
