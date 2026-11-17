import { Link2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Avatar, PageHead } from '../components/ui';
import { byId, type TaskState } from '../data';
import { useStore } from '../store';

const COLS: { key: TaskState; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'claimed', label: 'In progress' },
  { key: 'in_review', label: 'In review' },
  { key: 'verified', label: 'Verified' },
];

export default function Missions() {
  const { tasks, setTask, notify } = useStore();
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const task = tasks.find((t) => t.id === reviewing);

  const submitReview = () => {
    if (!reviewing) return;
    setTask(reviewing, 'verified');
    setReviewing(null);
    setAnswers({});
    notify('Milestone verified — added to Builder Passport');
  };

  return (
    <div>
      <PageHead eyebrow="Build Missions" title="Ship small,"
        accent="real things." sub="Claim one deliverable, attach the artifact, get it reviewed. Verified work goes to your Builder Passport." />
      <div className="kanban">
        {COLS.map((col) => {
          const items = tasks.filter((t) => t.state === col.key);
          return (
            <div key={col.key} className="kcol">
              <h4>
                {col.label} <span>{items.length}</span>
              </h4>
              {items.map((t) => (
                <div key={t.id} className="ktask">
                  <p className="xs dim">{t.circle}</p>
                  <b className="small">{t.title}</b>
                  {'artifact' in t && t.artifact && (
                    <p className="xs muted row mt-s" style={{ gap: 5 }}>
                      <Link2 size={12} /> {t.artifact}
                    </p>
                  )}
                  <div className="row between mt-s">
                    {t.owner ? <Avatar id={t.owner} size={24} /> : <span className="xs dim">Unclaimed</span>}
                    {t.state === 'open' && (
                      <button className="btn sm" onClick={() => { setTask(t.id, 'claimed', 'u0'); notify('Claimed — it’s yours'); }}>
                        Claim
                      </button>
                    )}
                    {t.state === 'claimed' && t.owner === 'u0' && (
                      <button className="btn sm" onClick={() => { setTask(t.id, 'in_review'); notify('Review requested'); }}>
                        Request review
                      </button>
                    )}
                    {t.state === 'in_review' && (
                      <button className="btn sm primary" onClick={() => setReviewing(t.id)}>
                        Review
                      </button>
                    )}
                    {t.state === 'verified' && <ShieldCheck size={16} color="var(--mint)" />}
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="xs dim">Nothing here.</p>}
            </div>
          );
        })}
      </div>

      {task && (
        <div className="modal-bg" onClick={() => setReviewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="eyebrow">Structured review</div>
            <h3>{task.title}</h3>
            <p className="xs muted mt-s">By {task.owner === 'u0' ? 'you' : byId(task.owner ?? '')?.name} · private, never shown as a public star rating</p>
            {[
              ['delivered', 'Was the contribution delivered?', ['Yes', 'Partly', 'No']],
              ['responsive', 'Were they responsive?', ['Yes', 'Mostly', 'No']],
              ['again', 'Would you collaborate again?', ['Yes', 'Maybe', 'No']],
            ].map(([key, q, opts]) => (
              <div key={key as string} className="mt">
                <p className="small">{q as string}</p>
                <div className="row mt-s">
                  {(opts as string[]).map((o) => (
                    <button key={o} className={`chip ${answers[key as string] === o ? 'on' : ''}`} onClick={() => setAnswers({ ...answers, [key as string]: o })}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <textarea className="input mt" rows={2} placeholder="Optional private note" />
            <div className="row mt">
              <button className="btn primary" disabled={Object.keys(answers).length < 3} onClick={submitReview}>
                Verify milestone
              </button>
              <button className="btn ghost" onClick={() => setReviewing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
