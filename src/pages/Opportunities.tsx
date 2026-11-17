import { BadgeCheck, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead, Why } from '../components/ui';
import { goalLabels, opportunities, type OppKind } from '../data';
import { useStore } from '../store';

const KINDS: ('All' | OppKind)[] = ['All', 'Startup', 'Job', 'Freelance', 'Pilot customer'];

export default function Opportunities() {
  const { goals, notify } = useStore();
  const [kind, setKind] = useState<'All' | OppKind>('All');
  const [applied, setApplied] = useState<string[]>([]);
  const list = opportunities.filter((o) => kind === 'All' || o.kind === kind);

  return (
    <div>
      <PageHead eyebrow="Opportunities" title="Turn your proof"
        accent="into what's next." sub="Ranked by your goal mix. Community introductions — never hiring guarantees." />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row wrap between">
          <div className="row wrap small">
            <span className="muted">Your mix:</span>
            {Object.entries(goals).map(([k, v]) => (
              <span key={k} className="chip">
                {goalLabels[k]} {v}%
              </span>
            ))}
          </div>
          <Link to="/settings" className="btn sm ghost">
            Adjust goals
          </Link>
        </div>
      </div>

      <div className="tabs">
        {KINDS.map((k) => (
          <button key={k} className={`tab ${kind === k ? 'active' : ''}`} onClick={() => setKind(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="grid g2">
        {list.map((o) => (
          <div key={o.id} className="card">
            <div className="row between">
              <span className="status sky">{o.kind}</span>
              {o.verified ? (
                <span className="xs row" style={{ gap: 4, color: 'var(--mint)' }}>
                  <BadgeCheck size={14} /> Verified by admins
                </span>
              ) : (
                <span className="xs dim">Member post · unverified</span>
              )}
            </div>
            <h3 className="mt-s">{o.title}</h3>
            <p className="small muted">
              {o.org} · {o.posted}
            </p>
            <div className="mt-s row xs" style={{ color: 'var(--mint)', fontWeight: 700 }}>
              <Info size={13} /> Why it fits you
            </div>
            <Why items={o.fit} />
            <div className="row mt">
              <button className={`btn sm ${applied.includes(o.id) ? '' : 'primary'}`} disabled={applied.includes(o.id)} onClick={() => { setApplied([...applied, o.id]); notify('Interest sent with your Passport — contact shared only with your consent'); }}>
                {applied.includes(o.id) ? 'Interest sent' : 'Express interest'}
              </button>
              <button className="btn sm ghost" onClick={() => notify('Hidden — we’ll show fewer like this')}>
                Not relevant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
