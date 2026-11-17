import { Pencil, Plus, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, PageHead, ProofBadge } from '../components/ui';
import { byId, me, passport } from '../data';
import { useStore } from '../store';

export default function Passport() {
  const { notify } = useStore();
  const verified = passport.filter((p) => p.proof !== 'self-reported').length;

  return (
    <div>
      <PageHead
        eyebrow="Builder Passport"
        title="Proof of"
        accent="what you've built."
        sub="Every entry says how it's verified — so people can trust it."
        action={
          <div className="row">
            <button className="btn sm" onClick={() => notify('Public link copied (demo)')}>
              <Share2 size={14} /> Share
            </button>
            <button className="btn sm primary" onClick={() => notify('Add entry form (demo)')}>
              <Plus size={14} /> Add work
            </button>
          </div>
        }
      />

      <div className="grid g2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)' }}>
        <div className="card">
          <div className="row">
            <Avatar id="u0" size={64} />
            <div>
              <h3>{me.name}</h3>
              <p className="small muted">{me.role}</p>
            </div>
          </div>
          <div className="grid g2 mt" style={{ gap: 10 }}>
            <div className="card" style={{ padding: 12 }}>
              <b style={{ fontSize: 22 }}>{passport.length}</b>
              <p className="xs muted">Contributions</p>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <b style={{ fontSize: 22, color: 'var(--mint)' }}>{verified}</b>
              <p className="xs muted">Verified by others</p>
            </div>
          </div>
          <div className="mt">
            <p className="xs dim">OFFERS</p>
            <div className="row wrap mt-s">
              {me.skills.map((s) => (
                <span key={s} className="chip on">
                  {s}
                </span>
              ))}
            </div>
            <p className="xs dim mt">LOOKING FOR</p>
            <div className="row wrap mt-s">
              {me.seeks.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <p className="xs dim mt">AVAILABILITY</p>
            <p className="small">{me.availability}</p>
          </div>
          <Link to="/settings" className="btn sm ghost mt">
            <Pencil size={14} /> Edit persona
          </Link>
        </div>

        <div className="stack" style={{ gap: 14 }}>
          {passport.map((p) => (
            <div key={p.id} className="card">
              <div className="row between wrap">
                <div>
                  <p className="xs dim">{p.project}</p>
                  <h3>{p.artifact}</h3>
                </div>
                <ProofBadge proof={p.proof} />
              </div>
              <p className="small muted mt-s">
                Role: <b style={{ color: 'var(--text)' }}>{p.role}</b> · Outcome: {p.outcome}
              </p>
              {p.ack.length > 0 && (
                <div className="row xs muted mt-s">
                  Acknowledged by
                  {p.ack.map((a) => (
                    <span key={a} className="row" style={{ gap: 5 }}>
                      <Avatar id={a} size={20} /> {byId(a)?.name}
                    </span>
                  ))}
                </div>
              )}
              {p.proof === 'self-reported' && (
                <button className="btn sm ghost mt" onClick={() => notify('Verification request sent to teammates')}>
                  Ask a teammate to verify
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
