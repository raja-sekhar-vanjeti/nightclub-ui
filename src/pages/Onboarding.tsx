import { ArrowLeft, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalSliders from '../components/GoalSliders';
import { BrandMark, Toggle } from '../components/ui';
import { goalLabels, me } from '../data';
import { useStore } from '../store';

const ROLES = ['Student', 'Developer', 'Designer', 'Marketer', 'Creator', 'Founder', 'Operator', 'Career switcher'];
const SKILLS = ['React', 'TypeScript', 'Laravel', 'MySQL', 'Flutter', 'Python', 'LLMs', 'Figma', 'UX research', 'SEO', 'Content', 'Sales', 'Video', 'Ops'];
const SEEK = ['UI/UX design', 'Growth marketing', 'AI/ML', 'Backend', 'Mobile', 'Sales', 'Product'];
const LANGS = ['Telugu', 'English', 'Hindi', 'Tamil', 'Kannada'];

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="row wrap">
      {options.map((o) => (
        <button key={o} className={`chip ${value.includes(o) ? 'on' : ''}`} onClick={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const { goals, setGoals, finishOnboarding } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('Developer');
  const [skills, setSkills] = useState<string[]>(me.skills);
  const [seeks, setSeeks] = useState<string[]>(me.seeks);
  const [langs, setLangs] = useState<string[]>(me.languages);
  const [hours, setHours] = useState(12);
  const [consent, setConsent] = useState(true);
  const [showCity, setShowCity] = useState(false);

  const steps = ['Who you are', 'Your goals', 'Availability', 'Privacy & consent', 'Your persona'];
  const canNext = step !== 0 || skills.length > 0;
  const top = Object.entries(goals).sort((a, b) => b[1] - a[1])[0];

  const done = () => {
    finishOnboarding();
    nav('/find-your-four');
  };

  return (
    <div className="onboard">
      <div className="onboard-card">
        <div className="row" style={{ marginBottom: 22 }}>
          <BrandMark />
          <b style={{ fontFamily: 'var(--display)', fontSize: 22, letterSpacing: '-0.045em' }}>nightclub</b>
          <span className="spacer" style={{ flex: 1 }} />
          <span className="xs muted">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <div className="steps-dots">
          {steps.map((s, i) => (
            <i key={s} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        <div className="card">
          <div className="eyebrow">{steps[step]}</div>

          {step === 0 && (
            <div className="stack" style={{ gap: 18 }}>
              <h2>Let's build your Builder Persona.</h2>
              <p className="muted small">Only the essentials. You can edit everything later — no phone number or social handles required.</p>
              <label className="field">
                Current role
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <div className="field">
                Skills you offer <span className="dim xs">(pick at least one)</span>
                <Chips options={SKILLS} value={skills} onChange={setSkills} />
              </div>
              <div className="field">
                Skills you're looking for
                <Chips options={SEEK} value={seeks} onChange={setSeeks} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="stack" style={{ gap: 16 }}>
              <h2>What are you building towards?</h2>
              <p className="muted small">You can want more than one thing. Set the mix — update it any time.</p>
              <GoalSliders value={goals} onChange={setGoals} />
            </div>
          )}

          {step === 2 && (
            <div className="stack" style={{ gap: 18 }}>
              <h2>When can you build?</h2>
              <div>
                <div className="row between small">
                  <span>Hours per week</span>
                  <b style={{ color: 'var(--mint)' }}>{hours} hrs</b>
                </div>
                <input type="range" min={2} max={40} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
              </div>
              <label className="field">
                Best time
                <select className="select" defaultValue="Evenings (IST)">
                  <option>Mornings (IST)</option>
                  <option>Evenings (IST)</option>
                  <option>Weekends</option>
                  <option>Flexible</option>
                </select>
              </label>
              <div className="field">
                Languages
                <Chips options={LANGS} value={langs} onChange={setLangs} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="stack" style={{ gap: 4 }}>
              <h2>You stay in control.</h2>
              <p className="muted small" style={{ marginBottom: 10 }}>
                Your email and phone are never shown. Accepted connections can only message you inside Nightclub.
              </p>
              <div className="list-row">
                <div style={{ flex: 1 }}>
                  <b className="small">Include me in matching & Find Your Four</b>
                  <p className="xs muted">Required to receive introductions. You can pause any time.</p>
                </div>
                <Toggle on={consent} onChange={setConsent} />
              </div>
              <div className="list-row">
                <div style={{ flex: 1 }}>
                  <b className="small">Show my city on my profile</b>
                  <p className="xs muted">Off by default. We never use precise location.</p>
                </div>
                <Toggle on={showCity} onChange={setShowCity} />
              </div>
              <div className="list-row">
                <Lock size={16} className="muted" />
                <p className="xs muted">Contact details hidden · Block & report always available · Export or delete your data from Settings</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="stack" style={{ gap: 14 }}>
              <div className="row">
                <Sparkles size={20} color="var(--mint)" />
                <h2>Here's your persona</h2>
              </div>
              <div className="card hl" style={{ padding: 16 }}>
                <b>
                  {me.name} · {role}
                </b>
                <p className="small muted mt-s">
                  Offers <b style={{ color: 'var(--text)' }}>{skills.join(', ')}</b>. Looking for <b style={{ color: 'var(--text)' }}>{seeks.join(', ') || '—'}</b>. Mostly
                  focused on <b style={{ color: 'var(--mint)' }}>{goalLabels[top[0]].toLowerCase()}</b> ({top[1]}%). Around {hours} hrs/week in {langs.join(' / ')}.
                </p>
              </div>
              <p className="small muted">Looks wrong? Go back and fix it — your corrections make matches better.</p>
              {!consent && <p className="small" style={{ color: 'var(--amber)' }}>Matching is paused, so you won't get introductions until you turn it on in Settings.</p>}
            </div>
          )}

          <div className="row between" style={{ marginTop: 24 }}>
            <button className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
              <ArrowLeft size={15} /> Back
            </button>
            {step < steps.length - 1 ? (
              <button className="btn primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn primary" onClick={done}>
                See my Find Your Four <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
