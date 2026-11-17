import { ArrowLeft, Ban, Flag, Lock, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, PageHead } from '../components/ui';
import { byId } from '../data';
import { useStore } from '../store';

const PROMPTS = ['What are you hoping to build?', 'When are you usually free?', 'Want to pair on the next milestone?'];

export default function Messages() {
  const { convos, send, readConvo, notify } = useStore();
  const [activeId, setActiveId] = useState(convos[0]?.id);
  const [listMode, setListMode] = useState(false);
  const [text, setText] = useState('');
  const body = useRef<HTMLDivElement>(null);
  const c = convos.find((x) => x.id === activeId);

  useEffect(() => {
    if (activeId) readConvo(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);
  useEffect(() => {
    body.current?.scrollTo(0, body.current.scrollHeight);
  }, [c?.messages.length]);

  const submit = (t: string) => {
    if (!t.trim() || !c) return;
    send(c.id, t.trim());
    setText('');
  };

  return (
    <div>
      <PageHead eyebrow="Messages" title="Conversations"
        accent="that go somewhere." sub="Only accepted connections can message you. Your phone and email stay private." />
      <div className={`card chat ${listMode ? 'list-mode' : ''}`}>
        <div className="chat-list">
          {convos.map((x) => {
            const m = byId(x.with)!;
            return (
              <div key={x.id} className={`chat-item ${x.id === activeId ? 'active' : ''}`} onClick={() => { setActiveId(x.id); setListMode(false); }}>
                <Avatar id={m.id} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b className="small">{m.name}</b>
                  <p className="xs muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {x.messages[x.messages.length - 1].text}
                  </p>
                </div>
                {x.unread > 0 && <span className="count" style={{ background: 'var(--mint)', color: 'var(--mint-ink)', borderRadius: 99, padding: '0 7px', fontSize: 11, fontWeight: 800 }}>{x.unread}</span>}
              </div>
            );
          })}
        </div>

        {c ? (
          <div className="chat-pane">
            <div className="chat-head">
              <button className="icon-btn back-btn" style={{ width: 32, height: 32 }} aria-label="Back" onClick={() => setListMode(true)}>
                <ArrowLeft size={15} />
              </button>
              <Avatar id={c.with} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <b className="small">{byId(c.with)?.name}</b>
                <p className="xs dim">{c.context}</p>
              </div>
              <button className="icon-btn" aria-label="Report" title="Report" onClick={() => notify('Report form opened — handled privately')}>
                <Flag size={15} />
              </button>
              <button className="icon-btn" aria-label="Block" title="Block" onClick={() => notify('Blocked (demo) — they can no longer message you')}>
                <Ban size={15} />
              </button>
            </div>
            <div className="chat-body" ref={body}>
              <div className="privacy-note">
                <Lock size={11} /> In-app only · contact details are never shared
              </div>
              {c.messages.map((m, i) => (
                <div key={i} className={`bubble ${m.from === 'u0' ? 'mine' : ''}`}>
                  {m.text}
                  <time>{m.time}</time>
                </div>
              ))}
            </div>
            <div className="row wrap" style={{ padding: '0 12px', gap: 6 }}>
              {PROMPTS.map((p) => (
                <button key={p} className="chip" onClick={() => setText(p)}>
                  {p}
                </button>
              ))}
            </div>
            <form className="chat-input" onSubmit={(e) => { e.preventDefault(); submit(text); }}>
              <input className="input" placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn primary" type="submit" aria-label="Send">
                <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div className="empty" style={{ margin: 20 }}>
            <b>No conversations yet</b>
            Accept an introduction to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
