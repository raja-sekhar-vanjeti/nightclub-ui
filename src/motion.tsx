import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, type ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** True when the user asked the OS for reduced motion. */
export function useCalm() {
  return useReducedMotion() ?? false;
}

/** Splits text into masked words that rise into place (GSAP). */
export function SplitText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const calm = useCalm();
  useLayoutEffect(() => {
    if (calm || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll('.w > span'), {
        yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay,
      });
    }, ref);
    return () => ctx.revert();
  }, [calm, delay, text]);
  return (
    <span ref={ref} className={`split ${className ?? ''}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="w" aria-hidden>
          <span>{w}</span>
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/**
 * Scroll-triggered entrance for cards and section titles inside `root`.
 * Runs once per route; elements already on screen animate immediately.
 */
export function useScrollReveal(root: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const calm = useCalm();
  useLayoutEffect(() => {
    if (calm || !root.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('.card, .ktask, .section-title, .kcol', root.current!);
      gsap.set(targets, { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch(targets, {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07, overwrite: true, clearProps: 'transform,opacity,visibility' }),
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm, ...deps]);
}

/** Pulls its child toward the pointer — used on dock icons and hero CTAs. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const calm = useCalm();
  const move = (e: React.PointerEvent) => {
    if (calm || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.5, ease: 'power3.out' });
  };
  const leave = () => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}

/** Fixed background layers: aurora light, faint stars and film grain. */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <div className="stars" />
      <div className="grain" />
    </div>
  );
}
