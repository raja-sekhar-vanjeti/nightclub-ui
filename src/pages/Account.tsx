import { Ban, CreditCard, Download, EyeOff, Flag, Moon, Trash2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GoalSliders from '../components/GoalSliders';
import { PageHead, Ring, Toggle } from '../components/ui';
import { membership, notifications } from '../data';
import { useStore } from '../store';

const prioCls: Record<string, string> = { Transactional: 'rose', High: 'green', Medium: 'sky', Low: 'grey' };

export function Notifications() {
  return (
    <div>
      <PageHead eyebrow="Notifications" title="Only what"
        accent="needs you." sub="Every notification links straight to the next step. Low-priority activity is bundled into a digest." action={<Link to="/settings" className="btn sm">Preferences</Link>} />
      <div className="card" style={{ maxWidth: 760 }}>
        {notifications.map((n) => (
          <Link key={n.id} to={n.link} className="list-row">
            <span className={`status ${prioCls[n.priority]}`}>{n.priority}</span>
            <span style={{ flex: 1 }} className="small">
              {n.text}
            </span>
            <span className="xs dim">{n.time}</span>
          </Link>
        ))}
        <div className="caught-up">That's everything ✓</div>
      </div>
    </div>
  );
}

export function Membership() {
  const { notify } = useStore();
  const [confirmCancel, setConfirmCancel] = useState(false);
  return (
    <div>
      <PageHead eyebrow="Membership" title={membership.plan}
        accent="Active and transparent." sub="Clear billing, no surprises. Cancel any time from here." />
      <div className="grid g2">
        <div className="card hl">
          <div className="row between">
            <span className="status green">{membership.status}</span>
            <b>{membership.price}</b>
          </div>
          <div className="stack mt" style={{ gap: 0 }}>
            {[
              ['Renews on', membership.renews],
              ['Sessions included', `${membership.sessionsIncluded} per month`],
              ['Sessions used', `${membership.sessionsUsed} this cycle`],
              ['Payment method', membership.method],
            ].map(([k, v]) => (
              <div key={k} className="list-row small">
                <span className="muted" style={{ flex: 1 }}>
                  {k}
                </span>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <div className="row mt wrap">
            <button className="btn sm" onClick={() => notify('Opens Razorpay to update method (demo)')}>
              <CreditCard size={14} /> Update payment
            </button>
            <button className="btn sm ghost" onClick={() => notify('Receipts list (demo)')}>
              Receipts
            </button>
            <button className="btn sm danger" onClick={() => setConfirmCancel(true)}>
              Cancel membership
            </button>
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">What you got this month</div>
          <div className="row" style={{ gap: 20, marginBottom: 8 }}>
            <Ring value={membership.sessionsUsed} max={membership.sessionsIncluded} label="sessions" />
            <p className="small muted">You've used {membership.sessionsUsed} of your {membership.sessionsIncluded} included live sessions. They reset on {membership.renews}.</p>
          </div>
          <div className="list-row small"><b style={{ width: 30 }}>2</b> live sessions attended</div>
          <div className="list-row small"><b style={{ width: 30 }}>3</b> introductions accepted</div>
          <div className="list-row small"><b style={{ width: 30 }}>1</b> milestone verified</div>
          <div className="list-row small"><b style={{ width: 30 }}>2</b> recordings & resource packs</div>
        </div>
      </div>

      {confirmCancel && (
        <div className="modal-bg" onClick={() => setConfirmCancel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel your membership?</h3>
            <p className="small muted mt-s">You keep access until {membership.renews}. Your Passport and data stay yours — export them any time.</p>
            <textarea className="input mt" rows={2} placeholder="Optional: what was missing for you?" />
            <div className="row mt">
              <button className="btn danger" onClick={() => { setConfirmCancel(false); notify('Cancellation scheduled (demo)'); }}>
                Confirm cancellation
              </button>
              <button className="btn ghost" onClick={() => setConfirmCancel(false)}>
                Keep membership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Settings() {
  const { goals, setGoals, notify } = useStore();
  const [prefs, setPrefs] = useState({ matching: true, discover: true, push: true, email: true, digest: true, quiet: true, lock: true });
  const cats = useState({ 'Direct messages': true, 'Intro accepted': true, 'Review requests': true, 'Find Your Four refresh': true, 'Session reminders': true, Opportunities: false, 'Project feedback': false });
  const [catState, setCat] = cats;
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs({ ...prefs, [k]: v });

  return (
    <div>
      <PageHead eyebrow="Settings" title="Your goals,"
        accent="your rules." />
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">Goal mix</div>
          <GoalSliders value={goals} onChange={(g) => { setGoals(g); }} />
        </div>

        <div className="card">
          <div className="eyebrow">Privacy</div>
          {[
            ['matching', 'Include me in matching & Find Your Four', 'Pause to stop new introductions'],
            ['discover', 'Show me in Member search', 'Blocked members never see you'],
          ].map(([k, t, d]) => (
            <div key={k} className="list-row">
              <div style={{ flex: 1 }}>
                <b className="small">{t}</b>
                <p className="xs muted">{d}</p>
              </div>
              <Toggle on={prefs[k as keyof typeof prefs]} onChange={set(k as keyof typeof prefs)} />
            </div>
          ))}
          <div className="list-row">
            <EyeOff size={16} className="muted" />
            <p className="xs muted">Email and phone are never visible to members. Employers see contact info only if you approve.</p>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">Channels</div>
          {[
            ['push', 'Push notifications', 'Max 2 non-essential per day'],
            ['email', 'Email', 'Billing & security always sent'],
            ['digest', 'Daily digest', 'Bundles low-priority updates'],
            ['quiet', 'Quiet hours', '10 PM – 8 AM · your time zone (IST)'],
            ['lock', 'Hide message text on lock screen', 'Shows “New message” only'],
          ].map(([k, t, d]) => (
            <div key={k} className="list-row">
              {k === 'quiet' && <Moon size={15} className="muted" />}
              <div style={{ flex: 1 }}>
                <b className="small">{t}</b>
                <p className="xs muted">{d}</p>
              </div>
              <Toggle on={prefs[k as keyof typeof prefs]} onChange={set(k as keyof typeof prefs)} />
            </div>
          ))}
        </div>

        <div className="card">
          <div className="eyebrow">Notify me about</div>
          {Object.entries(catState).map(([k, v]) => (
            <div key={k} className="list-row">
              <span className="small" style={{ flex: 1 }}>
                {k}
              </span>
              <Toggle on={v} onChange={(nv) => setCat({ ...catState, [k]: nv })} />
            </div>
          ))}
          <button className="btn primary sm mt" onClick={() => notify('Preferences saved')}>
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export function Safety() {
  const { notify } = useStore();
  const items = [
    { icon: Flag, t: 'Report a member or message', d: 'Reviewed privately. You get a factual status update.', a: 'Report' },
    { icon: Ban, t: 'Blocked members', d: '0 blocked · they can’t find, match or message you', a: 'Manage' },
    { icon: VolumeX, t: 'Muted conversations & circles', d: 'Mute without leaving', a: 'Manage' },
    { icon: Download, t: 'Export my data', d: 'Profile, Passport, messages as a ZIP', a: 'Request export' },
    { icon: Trash2, t: 'Delete my account', d: 'Removes your data per our policy', a: 'Delete…' },
  ];
  return (
    <div>
      <PageHead eyebrow="Safety & control" title="Build safely"
        accent="with new people." sub="These tools are always free and never behind a paywall." />
      <div className="card" style={{ maxWidth: 760 }}>
        {items.map(({ icon: Icon, t, d, a }) => (
          <div key={t} className="list-row">
            <Icon size={18} color={a === 'Delete…' ? 'var(--rose)' : 'var(--mint)'} />
            <div style={{ flex: 1 }}>
              <b className="small">{t}</b>
              <p className="xs muted">{d}</p>
            </div>
            <button className={`btn sm ${a === 'Delete…' ? 'danger' : ''}`} onClick={() => notify(`${t} (demo)`)}>
              {a}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
