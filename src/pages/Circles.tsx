import { CheckCircle2, Circle, Clock, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, PageHead } from '../components/ui';
import { byId, circles, me } from '../data';
import { useStore } from '../store';

export default function Circles() {
  const { notify } = useStore();
  const [active, setActive] = useState(circles[0].id);
  const c = circles.find((x) => x.id === active)!;
  const done = c.milestones.filter((m) => m.done).length;
  const name = (id: string) => (id === 'u0' ? `${me.name} (you)` : byId(id)?.name);

  return (
    <div>
      <PageHead
        eyebrow="Builder Circles"
        title="Your teams,"
        accent="small and focused."
        sub="Small teams of 2–5 with a clear objective, owners and cadence. Join only what you have time for."
        action={
          <button className="btn primary sm" onClick={() => notify('New circle form (demo)')}>
            <Plus size={14} /> New circle
          </button>
        }
      />
      <div className="tabs">
        {circles.map((x) => (
          <button key={x.id} className={`tab ${active === x.id ? 'active' : ''}`} onClick={() => setActive(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>{c.name}</h3>
              <p className="small muted">{c.objective}</p>
            </div>
            <span className={`status ${c.status === 'active' ? 'green' : 'amber'}`}>{c.status}</span>
          </div>
          <div className="row between xs muted">
            <span>Milestones</span>
            <span>
              {done}/{c.milestones.length} verified
            </span>
          </div>
          <div className="stack mt-s">
            {c.milestones.map((m) => (
              <div key={m.title} className="list-row">
                {m.done ? <CheckCircle2 size={18} color="var(--mint)" /> : <Circle size={18} color="var(--dim)" />}
                <span style={{ flex: 1 }} className={m.done ? 'muted' : ''}>
                  {m.title}
                </span>
                {m.owner && <Avatar id={m.owner} size={24} />}
              </div>
            ))}
          </div>
          <div className="row mt">
            <Link to="/missions" className="btn sm primary">
              Open mission board
            </Link>
            <button className="btn sm ghost" onClick={() => notify('Milestone form (demo)')}>
              <Plus size={14} /> Milestone
            </button>
          </div>
        </div>

        <div className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="eyebrow">Members</div>
            {c.members.map((id) => (
              <div key={id} className="list-row">
                <Avatar id={id} size={34} />
                <div>
                  <b className="small">{name(id)}</b>
                  <p className="xs muted">{id === 'u0' ? me.role : byId(id)?.role}</p>
                </div>
              </div>
            ))}
            {c.members.length < 5 && (
              <p className="xs dim mt-s">
                {5 - c.members.length} open seat(s) — fill from Find Your Four, or keep the team small.
              </p>
            )}
          </div>
          <div className="card">
            <div className="eyebrow">Norms</div>
            <div className="row small">
              <Clock size={15} color="var(--mint)" /> {c.cadence}
            </div>
            <p className="xs muted mt-s">Missed a milestone? Rescope together — no shaming, no fake deadlines.</p>
            <button className="btn danger sm mt" onClick={() => notify('You can leave any circle at any time (demo)')}>
              <LogOut size={14} /> Leave circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
