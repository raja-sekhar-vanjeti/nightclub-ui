import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { conversations as seedConvos, findYourFour, goalPresets, missions as seedMissions, sessions as seedSessions, type IntroState, type Msg, type TaskState } from './data';

interface Store {
  onboarded: boolean;
  finishOnboarding: () => void;
  goals: Record<string, number>;
  setGoals: (g: Record<string, number>) => void;
  intros: Record<string, IntroState>;
  setIntro: (memberId: string, s: IntroState) => void;
  convos: typeof seedConvos;
  send: (convoId: string, text: string) => void;
  readConvo: (convoId: string) => void;
  tasks: typeof seedMissions;
  setTask: (id: string, state: TaskState, owner?: string) => void;
  rsvps: Record<string, boolean>;
  toggleRsvp: (id: string) => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboarded] = useState(() => {
    try { return localStorage.getItem('nc_onboarded') === '1'; } catch { return false; }
  });
  const [goals, setGoals] = useState<Record<string, number>>(goalPresets['Startup focus']);
  const [intros, setIntros] = useState<Record<string, IntroState>>(
    Object.fromEntries(findYourFour.picks.map((p) => [p.memberId, p.state])),
  );
  const [convos, setConvos] = useState(seedConvos);
  const [tasks, setTasks] = useState(seedMissions);
  const [rsvps, setRsvps] = useState<Record<string, boolean>>(Object.fromEntries(seedSessions.map((s) => [s.id, s.rsvp])));
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const value: Store = {
    onboarded,
    finishOnboarding: () => {
      setOnboarded(true);
      try { localStorage.setItem('nc_onboarded', '1'); } catch { /* ignore */ }
    },
    goals,
    setGoals,
    intros,
    setIntro: (id, s) => setIntros((p) => ({ ...p, [id]: s })),
    convos,
    send: (cid, text) =>
      setConvos((p) => p.map((c) => (c.id === cid ? { ...c, messages: [...c.messages, { from: 'u0', text, time: 'now' } as Msg] } : c))),
    readConvo: (cid) => setConvos((p) => p.map((c) => (c.id === cid ? { ...c, unread: 0 } : c))),
    tasks,
    setTask: (id, state, owner) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, state, owner: owner ?? t.owner } : t))),
    rsvps,
    toggleRsvp: (id) => setRsvps((p) => ({ ...p, [id]: !p[id] })),
    toast,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside provider');
  return s;
}
