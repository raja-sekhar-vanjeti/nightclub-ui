import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Briefcase, CheckCircle2, Circle, Heart, Layers, MessageCircle, Play, Rocket, Target, Users, Zap } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, TierBadge } from '../components/ui';
import { byId, circles, feed, findYourFour, goalLabels, membership, opportunities, sessions } from '../data';
import { gsap, Magnetic, useCalm } from '../motion';
import { useStore } from '../store';
import type { TileId } from '../three/Showcase';
import Stage from '../three/Stage';

/** Layered lavender dunes along the bottom of the hero. */
function Dunes() {
  return (
    <svg className="hero-dunes" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6c6f0" /><stop offset="1" stopColor="#e5d9f5" /></linearGradient>
        <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cbb8ec" /><stop offset="1" stopColor="#e1d4f2" /></linearGradient>
        <linearGradient id="d3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6dcf6" /><stop offset="1" stopColor="#e9e0f6" /></linearGradient>
      </defs>
      <path d="M0 120 C 180 60 320 70 470 110 S 760 170 930 120 S 1260 40 1440 90 V260 H0Z" fill="url(#d1)" />
      <path d="M0 170 C 220 120 380 130 560 165 S 900 210 1100 160 S 1340 120 1440 140 V260 H0Z" fill="url(#d2)" opacity=".85" />
      <path d="M0 215 C 260 185 520 190 760 210 S 1200 230 1440 200 V260 H0Z" fill="url(#d3)" />
    </svg>
  );
}

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ACTIVE_DAYS = 3; // mock streak — replace with real activity data later

export default function Home() {
  const { intros, goals, convos, rsvps, tasks } = useStore();
  const nav = useNavigate();
  const calm = useCalm();
  const heroRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<TileId | null>(null);

  const unreadConvo = convos.find((c) => c.unread > 0);
  const circle = circles[0];
  const nextMilestone = circle.milestones.find((m) => !m.done);
  const doneCount = circle.milestones.filter((m) => m.done).length;
  const topGoal = Object.entries(goals).sort((a, b) => b[1] - a[1])[0][0];
  const opp = opportunities[0];
  const session = sessions.find((s) => s.status === 'upcoming')!;
  const acceptedCount = findYourFour.picks.filter((p) => intros[p.memberId] === 'accepted').length;

  // Soft intro + scroll-linked parallax on the hero.
  useLayoutEffect(() => {
    if (calm || !heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero-arch', { opacity: 0, y: 40, duration: 1.6 })
        .from('.hero-sun', { y: 80, opacity: 0, duration: 2 }, 0.1)
        .from('.hero-title .ln > span', { yPercent: 115, duration: 1.2, stagger: 0.1 }, 0.15)
        .from('.hero-anim', { y: 22, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)
        .from('.features a', { y: 30, opacity: 0, duration: 1, stagger: 0.07 }, 0.7);
      gsap.to('.hero-copy', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-sun', { y: 60, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, heroRef);
    return () => ctx.revert();
  }, [calm]);

  const inProgress = tasks.filter((t) => t.state === 'claimed' || t.state === 'in_review').length;
  const tips: Record<TileId, { title: string; text: string; to: string }> = {
    people: { title: 'Find Your Four', text: `${acceptedCount} of ${findYourFour.picks.length} builders said yes to “${findYourFour.project}”`, to: '/find-your-four' },
    code: { title: 'Build Missions', text: `${inProgress} tasks moving · one waiting for your review`, to: '/missions' },
    launch: { title: 'Opportunities', text: `${opportunities.length} jobs, gigs & pilots matched to your goals`, to: '/opportunities' },
    impact: { title: 'Builder Passport', text: 'Your verified outcomes, ready to share', to: '/passport' },
  };
  const tip = hovered ? tips[hovered] : null;

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero" ref={heroRef}>
        <div className="hero-arch" aria-hidden />
        <div className="hero-sun" aria-hidden />
        <div className="hero-canvas">
          <Stage scene="showcase" calm={calm} energy={acceptedCount / findYourFour.picks.length} onHover={setHovered} onSelect={(id) => nav(tips[id].to)} />
        </div>
        <Dunes />
        {tip && (
          <div className="hero-tip" key={hovered}>
            <b>{tip.title} →</b>
            <span className="muted">{tip.text}</span>
          </div>
        )}

        <div className="hero-copy">
          <div className="eyebrow hero-anim">
            <Zap size={14} color="var(--amber)" fill="var(--amber)" /> Builder Network for Doers
          </div>
          <h1 className="hero-title">
            <span className="ln split" style={{ display: 'block' }}>
              <span className="w" style={{ display: 'block' }}>
                <span>Turn your goals</span>
              </span>
            </span>
            <span className="ln split" style={{ display: 'block' }}>
              <span className="w" style={{ display: 'block' }}>
                <span>
                  into <span className="grad-text plain">real builds.</span>
                </span>
              </span>
            </span>
          </h1>
          <p className="hero-sub hero-anim">Meet the right people, work on meaningful projects, show your impact, and unlock opportunities together.</p>
          <div className="row wrap hero-anim" style={{ marginTop: 34, gap: 14 }}>
            <Magnetic strength={0.25}>
              <Link to="/find-your-four" className="btn primary" style={{ padding: '15px 26px', fontSize: 15.5 }}>
                Find Your Four <ArrowRight size={17} />
              </Link>
            </Magnetic>
            <button className="btn" style={{ padding: '15px 24px', fontSize: 15.5 }} onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })}>
              <span className="play-dot"><Play size={10} fill="currentColor" /></span> How It Works
            </button>
          </div>
        </div>

        <nav className="features" aria-label="What Nightclub gives you">
          {[
            { to: '/find-your-four', icon: Users, t: 'Right People' },
            { to: '/missions', icon: Layers, t: 'Real Projects' },
            { to: '/passport', icon: BadgeCheck, t: 'Verified Outcomes' },
            { to: '/opportunities', icon: Rocket, t: 'Career & Startup Opportunities' },
          ].map(({ to, icon: Icon, t }) => (
            <Link key={t} to={to}>
              <span className="fi"><Icon size={21} strokeWidth={1.8} /></span>
              {t}
            </Link>
          ))}
        </nav>
      </section>

      {/* One next meaningful action */}
      <div className="next-step" style={{ margin: '34px auto 0' }}>
        <div className="icon">
          <MessageCircle size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="xs dim" style={{ fontWeight: 600 }}>Your next step</p>
          <p className="small" style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {unreadConvo ? `${byId(unreadConvo.with)?.name} replied about TeluguTutor AI` : 'Review Rahul’s "RAG answer endpoint"'}
          </p>
        </div>
        <Link to={unreadConvo ? '/messages' : '/missions'} className="btn primary sm">
          {unreadConvo ? 'Reply' : 'Review'} <ArrowRight size={13} />
        </Link>
      </div>

      {/* ---------- How it works ---------- */}
      <div className="section-title" id="how" style={{ scrollMarginTop: 90 }}>
        <div>
          <span className="num">How it works</span>
          <h2>Four steps from goal to proof</h2>
        </div>
      </div>
      <div className="how">
        {[
          { icon: Target, t: 'Set your goals', d: 'Tell us what you want — learning, a startup, a job — and how much each matters.', to: '/settings' },
          { icon: Users, t: 'Meet your four', d: 'We suggest four complementary builders and explain exactly why each fits.', to: '/find-your-four' },
          { icon: Layers, t: 'Build together', d: 'Form a circle, split missions, and ship small pieces every week.', to: '/missions' },
          { icon: BadgeCheck, t: 'Show verified proof', d: 'Teammates verify your work — it lands in your Passport and unlocks opportunities.', to: '/passport' },
        ].map(({ icon: Icon, t, d, to }) => (
          <Link key={t} to={to} className="card tilt">
            <div className="hi"><Icon size={20} /></div>
            <h3>{t}</h3>
            <p className="small muted mt-s">{d}</p>
          </Link>
        ))}
      </div>

      {/* ---------- 01 Tonight ---------- */}
      <div className="section-title">
        <div>
          <span className="num">01 — TONIGHT</span>
          <h2>Your gentle momentum</h2>
        </div>
        <Link to="/sessions">All sessions ↗</Link>
      </div>
      <div className="bento">
        <div className="card session-card span-4 tilt edge">
          <div className="orb" />
          <div>
            <span className="pill-tag">
              <i /> Next live session · {session.date}
            </span>
            <h3 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(24px,2.6vw,36px)', letterSpacing: '-.04em', margin: '18px 0 8px', maxWidth: 520 }}>{session.title}</h3>
            <p className="muted small">
              {session.time} · hosted by {session.host}. Come with curiosity, leave with something you can show.
            </p>
          </div>
          <div className="row wrap mt">
            <Link to="/sessions" className="btn primary sm">
              Explore session <ArrowUpRight size={13} />
            </Link>
            <span className={`status ${rsvps[session.id] ? 'green' : 'grey'}`}>{rsvps[session.id] ? "You're in" : 'Not RSVP’d yet'}</span>
            <span className="mono xs dim" style={{ marginLeft: 'auto' }}>
              {membership.sessionsUsed}/{membership.sessionsIncluded} USED
            </span>
          </div>
        </div>

        <div className="card span-2">
          <div className="eyebrow">Building rhythm</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 10 }}>
            <span className="big-num">{ACTIVE_DAYS}</span>
            <span className="muted">days in a row</span>
          </div>
          <p className="xs muted mt-s">Small steps. Beautiful progress.</p>
          <div className="days">
            {WEEK.map((d, i) => (
              <span key={i} className={i < ACTIVE_DAYS ? 'on' : ''}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- 02 Build ---------- */}
      <div className="section-title">
        <div>
          <span className="num">02 — YOUR BUILD</span>
          <h2>Made for your momentum</h2>
        </div>
        <Link to="/circles">See everything ↗</Link>
      </div>
      <div className="bento">
        <div className="card span-3">
          <div className="row between">
            <span className="pill-tag">
              <i /> Live build
            </span>
            <div className="avatars">
              {circle.members.map((id) => (
                <Avatar key={id} id={id} size={30} />
              ))}
            </div>
          </div>
          <h3 className="mt" style={{ fontSize: 22 }}>
            {circle.name}
          </h3>
          <p className="small muted">{circle.objective}</p>
          <div className="mt">
            <div className="row between xs muted mono">
              <span>
                {doneCount}/{circle.milestones.length} MILESTONES VERIFIED
              </span>
              <span>{Math.round((doneCount / circle.milestones.length) * 100)}%</span>
            </div>
            <div className="progress mt-s">
              <i style={{ width: `${(doneCount / circle.milestones.length) * 100}%` }} />
            </div>
          </div>
          <div className="stack mt" style={{ gap: 9 }}>
            {circle.milestones.map((m) => (
              <div key={m.title} className="row small">
                {m.done ? <CheckCircle2 size={16} color="var(--mint)" /> : <Circle size={16} color="var(--dim)" />}
                <span className={m.done ? 'muted' : ''} style={{ flex: 1 }}>
                  {m.title}
                </span>
                {m === nextMilestone && m.owner && <span className="chip on">{m.owner === 'u0' ? 'You' : byId(m.owner)?.name.split(' ')[0]} · next</span>}
              </div>
            ))}
          </div>
          <Link to="/circles" className="btn sm mt">
            Open circle <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="card span-3">
          <div className="row between">
            <span className="pill-tag">
              <Heart size={11} color="var(--amber)" /> Your people
            </span>
            <span className="mono xs dim">RECOMMENDED</span>
          </div>
          <h3 className="mt" style={{ fontSize: 22 }}>
            Meet the four who build like you.
          </h3>
          <p className="small muted">
            For “{findYourFour.project}” · {acceptedCount} of {findYourFour.picks.length} said yes
          </p>
          <div className="stack mt" style={{ gap: 12 }}>
            {findYourFour.picks.map((p) => {
              const m = byId(p.memberId)!;
              const s = intros[p.memberId];
              return (
                <div key={p.memberId} className="row">
                  <Avatar id={m.id} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b className="small" style={{ fontWeight: 600 }}>
                      {m.name}
                    </b>
                    <p className="xs muted">{p.contribution}</p>
                  </div>
                  {s === 'suggested' ? <TierBadge tier={p.tier} /> : <span className={`status ${s === 'accepted' ? 'green' : s === 'requested' ? 'amber' : 'rose'}`}>{s}</span>}
                </div>
              );
            })}
          </div>
          <Link to="/find-your-four" className="btn primary sm mt">
            Open Find Your Four <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* ---------- 03 Signals ---------- */}
      <div className="section-title">
        <div>
          <span className="num">03 — SIGNALS</span>
          <h2>A little something for you</h2>
        </div>
        <Link to="/discover">Discover ↗</Link>
      </div>
      <div className="home-grid">
        <div className="card">
          <div className="card-head">
            <div className="eyebrow">From builders you follow</div>
          </div>
          {feed.slice(0, 2).map((f) => (
            <div key={f.id} className="list-row" style={{ alignItems: 'flex-start' }}>
              <Avatar id={f.who} size={36} />
              <div style={{ flex: 1 }}>
                <div className="row xs wrap">
                  <b>{byId(f.who)?.name}</b>
                  <span className="chip">{f.tag}</span>
                  <span className="dim mono">{f.time}</span>
                </div>
                <p className="small mt-s">{f.text}</p>
              </div>
            </div>
          ))}
          <div className="caught-up">You're caught up ✓</div>
        </div>

        <aside className="rail">
          <div className="card">
            {[
              { to: '/find-your-four', icon: Users, c: 'var(--mint)', t: 'Someone needs a co-builder', d: `${byId('m4')?.name.split(' ')[0]} has pilot schools ready for your idea` },
              { to: '/sessions', icon: BookOpen, c: 'var(--amber)', t: 'Something new to learn', d: session.title },
              { to: '/passport', icon: Heart, c: 'var(--rose)', t: 'Your work deserves attention', d: 'Turn last week’s prototype into a verified story' },
            ].map(({ to, icon: Icon, c, t, d }) => (
              <Link key={t} to={to} className="suggest">
                <div className="ico" style={{ color: c, background: 'var(--panel-2)' }}>
                  <Icon size={16} />
                </div>
                <div>
                  <b className="small" style={{ fontWeight: 600 }}>
                    {t}
                  </b>
                  <p className="xs muted">{d}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="card">
            <div className="card-head">
              <div className="eyebrow">For your {goalLabels[topGoal].toLowerCase()} goal</div>
              <span className="status sky">{opp.kind}</span>
            </div>
            <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
              <div className="ico" style={{ width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', border: '1px solid var(--line)', color: 'var(--sky)', flex: 'none' }}>
                <Briefcase size={16} />
              </div>
              <div>
                <b style={{ fontWeight: 600 }}>{opp.title}</b>
                <p className="xs muted">{opp.org}</p>
              </div>
            </div>
            <Link to="/opportunities" className="btn sm mt">
              See why it fits
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
