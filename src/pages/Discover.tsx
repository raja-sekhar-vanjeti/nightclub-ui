import { Bookmark, MessageSquare, Search, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, Empty, PageHead } from '../components/ui';
import { byId, feed, members } from '../data';
import { useStore } from '../store';

const SKILLS = ['All', 'Figma', 'LLMs', 'Python', 'Flutter', 'SEO', 'Sales', 'Video'];
const GOALS = ['Any goal', 'Startup', 'Career', 'Freelance', 'Learning'];

export default function Discover() {
  const { notify } = useStore();
  const [tab, setTab] = useState<'people' | 'feed'>('people');
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('All');
  const [goal, setGoal] = useState('Any goal');
  const [lang, setLang] = useState('Any');
  const [requested, setRequested] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  const results = useMemo(
    () =>
      members.filter(
        (m) =>
          (skill === 'All' || m.skills.includes(skill)) &&
          (goal === 'Any goal' || m.goals.includes(goal)) &&
          (lang === 'Any' || m.languages.includes(lang)) &&
          (q === '' || `${m.name} ${m.role} ${m.skills.join(' ')} ${m.bio}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, skill, goal, lang],
  );

  return (
    <div>
      <PageHead eyebrow="Discover" title="Find your people"
        accent="and their builds." sub="Search with intent, or browse a short feed of real work from people you follow." />
      <div className="tabs">
        <button className={`tab ${tab === 'people' ? 'active' : ''}`} onClick={() => setTab('people')}>
          Member search
        </button>
        <button className={`tab ${tab === 'feed' ? 'active' : ''}`} onClick={() => setTab('feed')}>
          Builder feed
        </button>
      </div>

      {tab === 'people' ? (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="row" style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--dim)' }} />
              <input className="input" style={{ paddingLeft: 36 }} placeholder="Search skills, roles, ideas…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="row wrap mt">
              {SKILLS.map((s) => (
                <button key={s} className={`chip ${skill === s ? 'on' : ''}`} onClick={() => setSkill(s)}>
                  {s}
                </button>
              ))}
            </div>
            <div className="row wrap mt-s">
              <select className="select" style={{ width: 'auto' }} value={goal} onChange={(e) => setGoal(e.target.value)}>
                {GOALS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <select className="select" style={{ width: 'auto' }} value={lang} onChange={(e) => setLang(e.target.value)}>
                {['Any', 'Telugu', 'English', 'Hindi'].map((l) => (
                  <option key={l} value={l}>
                    {l === 'Any' ? 'Any language' : l}
                  </option>
                ))}
              </select>
              <button className="btn sm ghost" onClick={() => notify('Search saved — we’ll send an opted-in digest when someone new fits')}>
                <Bookmark size={14} /> Save search
              </button>
            </div>
          </div>

          <p className="xs dim" style={{ marginBottom: 10 }}>
            {results.length} builders · only members who opted in to discovery are shown
          </p>
          {results.length === 0 ? (
            <Empty title="No one matches those filters yet">
              <p className="small">Try removing a filter, or save this search to hear when someone joins.</p>
            </Empty>
          ) : (
            <div className="grid g3">
              {results.map((m) => (
                <div key={m.id} className="card">
                  <div className="row">
                    <Avatar id={m.id} size={44} />
                    <div style={{ minWidth: 0 }}>
                      <b>{m.name}</b>
                      <p className="xs muted">{m.role}</p>
                    </div>
                  </div>
                  <p className="small muted mt">{m.bio}</p>
                  <div className="row wrap mt-s">
                    {m.skills.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="xs dim mt-s">
                    Goals: {m.goals.join(', ')} · {m.availability} · {m.verified} verified
                  </p>
                  <div className="row mt">
                    <button
                      className={`btn sm ${requested.includes(m.id) ? '' : 'primary'}`}
                      disabled={requested.includes(m.id)}
                      onClick={() => {
                        setRequested([...requested, m.id]);
                        notify(`Intro requested to ${m.name.split(' ')[0]}`);
                      }}
                    >
                      <UserPlus size={14} /> {requested.includes(m.id) ? 'Requested' : 'Request intro'}
                    </button>
                    <button className={`btn sm ghost ${saved.includes(m.id) ? 'on' : ''}`} aria-label="Save" onClick={() => setSaved(saved.includes(m.id) ? saved.filter((x) => x !== m.id) : [...saved, m.id])}>
                      <Bookmark size={14} fill={saved.includes(m.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ maxWidth: 760 }}>
          {feed.map((f) => (
            <div key={f.id} className="list-row" style={{ alignItems: 'flex-start' }}>
              <Avatar id={f.who} size={38} />
              <div style={{ flex: 1 }}>
                <div className="row xs wrap">
                  <b>{byId(f.who)?.name}</b>
                  <span className="chip">{f.tag}</span>
                  <span className="dim">{f.time}</span>
                </div>
                <p className="small mt-s">{f.text}</p>
                <div className="row mt-s">
                  <button className="btn sm ghost" onClick={() => notify('Feedback box opened (demo)')}>
                    <MessageSquare size={14} /> Give feedback
                  </button>
                  <button className="btn sm ghost" onClick={() => notify('Contribution request sent')}>
                    Ask to contribute
                  </button>
                  <button className="btn sm ghost" aria-label="Save" onClick={() => notify('Saved')}>
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="caught-up">You're caught up ✓ — no endless scroll here.</div>
        </div>
      )}
    </div>
  );
}
