import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Briefcase, Calendar, ChevronDown, Command, Compass, CreditCard, Hammer, Home, IdCard, MessageCircle, Search, Settings, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { notifications } from '../data';
import { Magnetic, useCalm, useScrollReveal } from '../motion';
import { useStore } from '../store';
import { Avatar, BrandMark } from './ui';

type Item = { to: string; label: string; icon: typeof Home; hint?: string };

const groups: { label: string; items: Item[] }[] = [
  {
    label: 'Your space',
    items: [
      { to: '/', label: 'Home', icon: Home, hint: 'Your constellation' },
      { to: '/find-your-four', label: 'Find Your Four', icon: Sparkles, hint: 'Four complementary builders' },
      { to: '/discover', label: 'Discover', icon: Compass, hint: 'Search people & builds' },
      { to: '/messages', label: 'Messages', icon: MessageCircle, hint: 'Conversations' },
    ],
  },
  {
    label: 'Build',
    items: [
      { to: '/circles', label: 'Circles', icon: Users, hint: 'Your teams' },
      { to: '/missions', label: 'Build Missions', icon: Hammer, hint: 'Task board' },
      { to: '/sessions', label: 'Sessions', icon: Calendar, hint: 'Live learning' },
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase, hint: 'Jobs, gigs, pilots' },
      { to: '/passport', label: 'Builder Passport', icon: IdCard, hint: 'Your verified proof' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/notifications', label: 'Notifications', icon: Bell },
      { to: '/membership', label: 'Membership', icon: CreditCard },
      { to: '/settings', label: 'Settings & privacy', icon: Settings },
      { to: '/safety', label: 'Safety', icon: ShieldAlert },
    ],
  },
];
const all = groups.flatMap((g) => g.items);
const dockItems = ['/', '/find-your-four', '/discover', '/circles', '/messages'].map((to) => all.find((i) => i.to === to)!);
const pick = (...tos: string[]) => tos.map((to) => all.find((i) => i.to === to)!);
// Top navigation: direct links + two grouped menus.
const topNav: ({ label: string; to: string } | { label: string; items: Item[] })[] = [
  { label: 'Home', to: '/' },
  { label: 'Build', items: pick('/circles', '/missions', '/passport') },
  { label: 'People', items: pick('/find-your-four', '/discover', '/messages') },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Sessions', to: '/sessions' },
];


const isActive = (path: string, to: string) => (to === '/' ? path === '/' : path.startsWith(to));

function Palette({ onClose }: { onClose: () => void }) {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const list = useMemo(() => all.filter((i) => `${i.label} ${i.hint ?? ''}`.toLowerCase().includes(q.toLowerCase())), [q]);
  const go = (to: string) => { nav(to); onClose(); };
  return (
    <motion.div className="palette-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="palette" role="dialog" aria-label="Go to"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      >
        <div className="row" style={{ paddingLeft: 20 }}>
          <Search size={18} color="var(--muted)" />
          <input
            autoFocus placeholder="Where to? Search pages…" value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, list.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
              if (e.key === 'Enter' && list[idx]) go(list[idx].to);
              if (e.key === 'Escape') onClose();
            }}
          />
        </div>
        <div className="groups">
          {groups.map((g) => {
            const items = g.items.filter((i) => list.includes(i));
            if (!items.length) return null;
            return (
              <div key={g.label}>
                <div className="glabel">{g.label}</div>
                {items.map((i) => {
                  const Icon = i.icon;
                  return (
                    <div key={i.to} className={`item ${list[idx] === i ? 'on' : ''}`} onMouseEnter={() => setIdx(list.indexOf(i))} onClick={() => go(i.to)}>
                      <Icon size={17} />
                      <span>{i.label}</span>
                      {i.hint && <span className="dim xs">· {i.hint}</span>}
                      <span className="k">↵</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {!list.length && <p className="muted small" style={{ padding: 16 }}>Nothing matches “{q}”.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Keeps the outgoing page's content on screen while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

/** Mounted fresh per route, so scroll reveals target the incoming page only. */
function RevealScope({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, []);
  return <div ref={ref}>{children}</div>;
}

export default function Layout() {
  const { convos, toast } = useStore();
  const loc = useLocation();
  const nav = useNavigate();
  const calm = useCalm();
  const [palette, setPalette] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const unread = convos.reduce((n, c) => n + c.unread, 0);

  // Ctrl/Cmd+K opens the universe menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === 'Escape') setPalette(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); setPalette(false); }, [loc.pathname]);

  // Cursor light + per-card spotlight + gentle tilt on `.tilt` elements.
  useEffect(() => {
    if (calm) return;
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--cx', `${e.clientX}px`);
        root.style.setProperty('--cy', `${e.clientY}px`);
        const card = (e.target as HTMLElement).closest?.('.card') as HTMLElement | null;
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
          if (card.classList.contains('tilt')) {
            card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
            card.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`);
          }
        }
      });
    };
    const onOut = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest?.('.tilt') as HTMLElement | null;
      if (card && !card.contains(e.relatedTarget as Node)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerout', onOut); cancelAnimationFrame(raf); };
  }, [calm]);

  const pageMotion = calm
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 24 },
        // no blur filter: blurring the page (and the 3D canvas inside it) every frame stutters on integrated GPUs.
        // transform must end as 'none' or fixed-position modals inside pages would anchor to this element
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, transitionEnd: { transform: 'none' } },
        exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] } },
      };

  return (
    <div className="app">
      {!calm && <div className="cursor-light" aria-hidden />}
      <div className="main">
        <header className={`topbar ${scrolled || loc.pathname !== '/' ? 'scrolled' : ''}`}>
          <Link to="/" className="brand" aria-label="Nightclub home">
            <BrandMark />
            <div>
              <b>nightclub</b>
              <small>FOUNDER LABS</small>
            </div>
          </Link>

          <nav className="top-nav" aria-label="Primary">
            {topNav.map((n) =>
              'to' in n ? (
                <NavLink key={n.label} to={n.to} end={n.to === '/'} className={`nav-link ${isActive(loc.pathname, n.to) ? 'active' : ''}`}>
                  {n.label}
                </NavLink>
              ) : (
                <div key={n.label} className="nav-item">
                  <button className={`nav-link ${n.items.some((i) => isActive(loc.pathname, i.to)) ? 'active' : ''}`} aria-haspopup="true">
                    {n.label} <ChevronDown size={14} />
                  </button>
                  <div className="nav-menu" role="menu">
                    {n.items.map(({ to, label, icon: Icon, hint }) => (
                      <NavLink key={to} to={to} role="menuitem" className={isActive(loc.pathname, to) ? 'active' : ''} onClick={(e) => (e.currentTarget as HTMLElement).blur()}>
                        <span className="mi"><Icon size={16} /></span>
                        <span>
                          <b>{label}</b>
                          {hint && <small>{hint}</small>}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ),
            )}
          </nav>

          <div className="top-actions">
            <button className="icon-btn" aria-label="Search (Ctrl K)" title="Search · Ctrl K" onClick={() => setPalette(true)}>
              <Search size={19} />
            </button>
            <button className="icon-btn" aria-label="Notifications" onClick={() => nav('/notifications')}>
              <Bell size={19} />
              {notifications.length > 0 && <span className="dot" />}
            </button>
            <Link to="/passport" className="me-btn" aria-label="Your Builder Passport" title="Your Builder Passport">
              <Avatar id="u0" size={38} />
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.main key={loc.pathname} className="content" {...pageMotion}>
            <RevealScope>
              <FrozenOutlet />
            </RevealScope>
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Orbit dock */}
      <nav className="dock" aria-label="Primary">
        {dockItems.map(({ to, label, icon: Icon }) => {
          const active = isActive(loc.pathname, to);
          return (
            <Magnetic key={to}>
              <NavLink to={to} end={to === '/'} className={active ? 'active' : ''} aria-label={label}>
                {active && <motion.span layoutId="dock-pill" className="dock-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <Icon size={19} strokeWidth={1.8} />
                {to === '/messages' && unread > 0 && <span className="badge">{unread}</span>}
                <span className="tip">{label}</span>
              </NavLink>
            </Magnetic>
          );
        })}
        <span className="sep" />
        <Magnetic>
          <button onClick={() => setPalette(true)} aria-label="All pages">
            <Command size={18} strokeWidth={1.8} />
            <span className="tip">All pages · Ctrl K</span>
          </button>
        </Magnetic>
      </nav>

      <AnimatePresence>{palette && <Palette onClose={() => setPalette(false)} />}</AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 16, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 10, x: '-50%' }} style={{ animation: 'none' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
