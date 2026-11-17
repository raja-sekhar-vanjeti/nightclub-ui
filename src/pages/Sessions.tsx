import { Calendar, FileText, PlayCircle, Video } from 'lucide-react';
import { PageHead } from '../components/ui';
import { membership, sessions } from '../data';
import { useStore } from '../store';

export default function Sessions() {
  const { rsvps, toggleRsvp, notify } = useStore();
  const upcoming = sessions.filter((s) => s.status === 'upcoming');
  const past = sessions.filter((s) => s.status === 'past');
  const pct = (membership.sessionsUsed / membership.sessionsIncluded) * 100;

  return (
    <div>
      <PageHead eyebrow="Live sessions" title="Learn live,"
        accent="then build." sub="Every session ends with one follow-up build task tied to what you made." />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row between small">
          <span>
            <b>{membership.sessionsUsed}</b> of {membership.sessionsIncluded} included sessions attended this month
          </span>
          <span className="xs muted">Resets {membership.renews}</span>
        </div>
        <div className="progress mt-s">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="eyebrow">Upcoming</div>
      <div className="grid g2" style={{ marginBottom: 24 }}>
        {upcoming.map((s) => (
          <div key={s.id} className="card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="brand-mark" style={{ background: 'var(--violet-soft)', color: 'var(--mint)' }}>
                <Calendar size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{s.title}</h3>
                <p className="small muted">
                  {s.date} · {s.time} · with {s.host}
                </p>
              </div>
            </div>
            <div className="row mt">
              <button className={`btn sm ${rsvps[s.id] ? '' : 'primary'}`} onClick={() => { toggleRsvp(s.id); notify(rsvps[s.id] ? 'RSVP removed' : 'RSVP saved — reminder only if you opted in'); }}>
                {rsvps[s.id] ? "✓ RSVP'd" : 'RSVP'}
              </button>
              <button className="btn sm ghost" disabled title="Join link appears when the room opens">
                <Video size={14} /> Join (opens at start)
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="eyebrow">Past sessions</div>
      <div className="card">
        {past.map((s) => (
          <div key={s.id} className="list-row" style={{ alignItems: 'flex-start' }}>
            <PlayCircle size={20} color="var(--mint)" />
            <div style={{ flex: 1 }}>
              <b className="small">{s.title}</b>
              <p className="xs muted">
                {s.date} · attended
              </p>
              {s.followUp && (
                <p className="small mt-s">
                  <span className="status amber" style={{ marginRight: 8 }}>
                    Follow-up build
                  </span>
                  {s.followUp}
                </p>
              )}
            </div>
            <div className="row">
              <button className="btn sm ghost" onClick={() => notify('Recording opens (demo)')}>
                <PlayCircle size={14} /> Recording
              </button>
              <button className="btn sm ghost" onClick={() => notify('Resources open (demo)')}>
                <FileText size={14} /> Files
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
