import { Check, Inbox, PenLine, ShieldCheck, Sparkle, UserCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { SplitText } from '../motion';
import { byId, me, type Proof, type Tier } from '../data';

// Glossy "planet" avatars, tinted from the member's hue.
const pastel = (hue: number) => `radial-gradient(circle at 32% 28%, hsl(${hue} 80% 96%), hsl(${hue} 60% 84%) 60%, hsl(${hue} 45% 72%))`;

export function Avatar({ id, size = 40 }: { id: string; size?: number }) {
  const m = id === 'u0' ? { name: me.name, hue: 130 } : byId(id);
  if (!m) return null;
  const initials = m.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <div className="avatar" title={m.name} style={{ width: size, height: size, fontSize: size * 0.36, background: pastel(m.hue) }}>
      {initials}
    </div>
  );
}

export function TierBadge({ tier }: { tier: Tier }) {
  const cls = tier === 'Strong fit' ? 'strong' : tier === 'Good fit' ? 'good' : 'explore';
  return <span className={`tier ${cls}`}>{tier}</span>;
}

export function ProofBadge({ proof }: { proof: Proof }) {
  const map = {
    'artifact-verified': { cls: 'green', icon: <ShieldCheck size={12} />, label: 'Artifact-verified' },
    'peer-acknowledged': { cls: 'sky', icon: <UserCheck size={12} />, label: 'Peer-acknowledged' },
    'self-reported': { cls: 'grey', icon: <PenLine size={12} />, label: 'Self-reported' },
  }[proof];
  return (
    <span className={`status ${map.cls}`} style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
      {map.icon}
      {map.label}
    </span>
  );
}

export function Why({ items }: { items: string[] }) {
  return (
    <ul className="why">
      {items.map((w) => (
        <li key={w}>
          <Check size={13} strokeWidth={2.5} />
          {w}
        </li>
      ))}
    </ul>
  );
}

/** Page hero. `accent` renders as a second, sage-coloured headline line. */
export function PageHead({ eyebrow, title, accent, sub, action }: { eyebrow: string; title: string; accent?: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="page-head row between wrap" style={{ alignItems: 'flex-end', gap: 16 }}>
      <div>
        <div className="eyebrow">
          <Sparkle size={12} color="var(--sage)" fill="var(--sage)" />
          {eyebrow}
        </div>
        <h1>
          <SplitText text={title} />
          {accent && (
            <span className="accent">
              <SplitText text={accent} delay={0.12} />
            </span>
          )}
        </h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ title, children, icon }: { title: string; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon ?? <Inbox size={20} />}</div>
      <b>{title}</b>
      {children}
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`toggle ${on ? 'on' : ''}`} role="switch" aria-checked={on} onClick={() => onChange(!on)} />;
}

/** Small SVG ring chart. */
export function Ring({ value, max, label }: { value: number; max: number; label: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div className="ring">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9c27c" />
            <stop offset="100%" stopColor="#8fd8c6" />
          </linearGradient>
        </defs>
        <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(124,92,255,0.1)" strokeWidth="12" />
        <circle cx="66" cy="66" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} style={{ transition: 'stroke-dasharray .8s' }} />
      </svg>
      <div className="ring-label">
        <div>
          <b>
            {value}/{max}
          </b>
          <span className="xs muted">{label}</span>
        </div>
      </div>
    </div>
  );
}

/** Radiating spark mark — eight rounded strokes. */
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <defs>
          <linearGradient id="bm" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="30" y2="30">
            <stop offset="0" stopColor="#2a2350" />
            <stop offset="1" stopColor="#5b46c9" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="15" y1={i % 2 ? 4.5 : 2.5} x2="15" y2="11" stroke="url(#bm)" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${i * 45} 15 15)`} />
        ))}
      </svg>
    </span>
  );
}
