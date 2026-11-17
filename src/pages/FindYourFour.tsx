import { Info, RefreshCw, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Empty, PageHead, TierBadge, Why } from '../components/ui';
import { byId, findYourFour, members } from '../data';
import { useCalm } from '../motion';
import { useStore } from '../store';
import Stage from '../three/Stage';

const LIFECYCLE = ['generated', 'intros_requested', 'partially_accepted', 'circle_ready', 'active', 'completed'];
const DECLINE_REASONS = ['Not now', 'Wrong skills', 'No time overlap', 'Different goals'];

export default function FindYourFour() {
  const { intros, setIntro, notify } = useStore();
  const [declining, setDeclining] = useState<string | null>(null);
  const [lowInventory, setLowInventory] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const calm = useCalm();

  const picks = lowInventory ? findYourFour.picks.slice(0, 2) : findYourFour.picks;
  const states = picks.map((p) => intros[p.memberId]);
  const accepted = states.filter((s) => s === 'accepted').length;
  const stage = accepted === picks.length ? 'circle_ready' : accepted > 0 ? 'partially_accepted' : states.some((s) => s === 'requested') ? 'intros_requested' : 'generated';
  const stageIdx = LIFECYCLE.indexOf(stage);

  const replacement = members.find((m) => !findYourFour.picks.some((p) => p.memberId === m.id));

  return (
    <div>
      <PageHead
        eyebrow="Find Your Four"
        title="Four builders"
        accent="who complete your team."
        sub={`Picked for "${findYourFour.project}" by skill coverage and mutual fit, not popularity. Nobody joins a circle without saying yes.`}
        action={
          <button className="btn sm ghost" onClick={() => setLowInventory(!lowInventory)}>
            {lowInventory ? 'Show full four' : 'Preview: few matches'}
          </button>
        }
      />

      {/* Live constellation — each accepted intro lights its thread */}
      <div className="card f4-stage edge">
        <Stage nodes={picks.map((p) => ({ id: p.memberId, state: intros[p.memberId] }))} calm={calm} onHover={setHovered} />
        <div className="stage-copy">
          <div className="eyebrow">Your constellation</div>
          <p className="small muted">
            {hovered ? (
              <>
                <b style={{ color: 'var(--text)' }}>{byId(hovered)?.name}</b> · {findYourFour.picks.find((p) => p.memberId === hovered)?.contribution}
              </>
            ) : (
              'Hover a star to see who it is. Threads glow as people say yes.'
            )}
          </p>
        </div>
        <div className="stage-foot">
          <div className="stepper">
            {LIFECYCLE.map((s, i) => (
              <span key={s} className={`step ${i < stageIdx ? 'done' : i === stageIdx ? 'now' : ''}`}>
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <span className="mono xs muted">
            {accepted}/{picks.length} ACCEPTED
          </span>
        </div>
      </div>

      <div className="grid g2">
        {picks.map((p) => {
          const m = byId(p.memberId)!;
          const s = intros[p.memberId];
          return (
            <div key={p.memberId} className="card match-card" style={{ opacity: s === 'declined' ? 0.55 : 1 }}>
              <div className="match-band" />
              <div className="match-body">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <Avatar id={m.id} size={60} />
                <div style={{ flex: 1, minWidth: 0, paddingTop: 10 }}>
                  <div className="row between">
                    <h3>{m.name}</h3>
                    <TierBadge tier={p.tier} />
                  </div>
                  <p className="small muted">
                    {m.role} · {m.availability}
                  </p>
                  <p className="small mt-s">
                    <span className="dim">Would contribute: </span>
                    <b>{p.contribution}</b>
                  </p>
                </div>
              </div>
              <div className="mt">
                <div className="row xs" style={{ color: 'var(--mint)', fontWeight: 700 }}>
                  <Info size={13} /> Why this match
                </div>
                <Why items={p.why} />
              </div>
              <div className="row wrap mt-s">
                {m.skills.map((sk) => (
                  <span key={sk} className="chip">
                    {sk}
                  </span>
                ))}
                <span className="chip">{m.verified} verified contributions</span>
              </div>

              <div className="row mt" style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                {s === 'suggested' && (
                  <>
                    <button className="btn primary sm" onClick={() => { setIntro(m.id, 'requested'); notify(`Introduction requested to ${m.name.split(' ')[0]}`); }}>
                      <UserPlus size={14} /> Request intro
                    </button>
                    <button className="btn sm ghost" onClick={() => setDeclining(m.id)}>
                      <X size={14} /> Not for me
                    </button>
                  </>
                )}
                {s === 'requested' && (
                  <>
                    <span className="status amber">Waiting for {m.name.split(' ')[0]}</span>
                    <button className="btn sm ghost" onClick={() => { setIntro(m.id, 'accepted'); notify(`${m.name.split(' ')[0]} accepted (demo)`); }}>
                      Simulate accept
                    </button>
                  </>
                )}
                {s === 'accepted' && <span className="status green">Connected · chat unlocked</span>}
                {s === 'declined' && <span className="status rose">Declined — thanks for the feedback</span>}
              </div>
              </div>
            </div>
          );
        })}

        {lowInventory && (
          <Empty title="Only 2 strong matches right now">
            <p className="small">We'd rather show fewer than guess. You're on the waitlist and we'll suggest more when someone genuinely fits.</p>
          </Empty>
        )}
      </div>

      {Object.values(intros).includes('declined') && replacement && !lowInventory && (
        <div className="card mt" style={{ borderStyle: 'dashed' }}>
          <div className="row wrap" style={{ gap: 14 }}>
            <RefreshCw size={18} color="var(--mint)" />
            <div style={{ flex: 1 }}>
              <b>Suggested replacement: {replacement.name}</b>
              <p className="small muted">
                {replacement.role} — {replacement.bio}
              </p>
            </div>
            <button className="btn sm" onClick={() => notify('Replacement added to your suggestions')}>
              Consider
            </button>
          </div>
        </div>
      )}

      {stage === 'circle_ready' && (
        <div className="card hl mt">
          <b>Everyone said yes 🎉</b>
          <p className="small muted">Propose a circle with an objective and cadence — each member confirms before it goes active.</p>
          <button className="btn primary sm mt" onClick={() => notify('Circle invitation sent')}>
            Propose circle
          </button>
        </div>
      )}

      {declining && (
        <div className="modal-bg" onClick={() => setDeclining(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Why isn't {byId(declining)?.name.split(' ')[0]} a fit?</h3>
            <p className="small muted mt-s">Private. Helps us suggest better people — they won't be notified.</p>
            <div className="row wrap mt">
              {DECLINE_REASONS.map((r) => (
                <button key={r} className="chip" onClick={() => { setIntro(declining, 'declined'); setDeclining(null); notify('Got it — we\'ll suggest a replacement'); }}>
                  {r}
                </button>
              ))}
            </div>
            <button className="btn ghost sm mt" onClick={() => setDeclining(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
