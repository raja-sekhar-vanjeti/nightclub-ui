import { goalLabels, goalPresets } from '../data';

/** Goal-weight editor. Weights always sum to 100: moving one slider rebalances the others proportionally. */
export default function GoalSliders({ value, onChange }: { value: Record<string, number>; onChange: (v: Record<string, number>) => void }) {
  const keys = Object.keys(goalLabels);

  const change = (key: string, next: number) => {
    const others = keys.filter((k) => k !== key);
    const rest = 100 - next;
    const otherSum = others.reduce((s, k) => s + value[k], 0);
    const out: Record<string, number> = { [key]: next };
    others.forEach((k) => (out[k] = otherSum === 0 ? rest / others.length : (value[k] / otherSum) * rest));
    // round while keeping total = 100
    const rounded = Object.fromEntries(keys.map((k) => [k, Math.round(out[k])]));
    const diff = 100 - keys.reduce((s, k) => s + rounded[k], 0);
    rounded[others[0]] += diff;
    onChange(rounded);
  };

  const preset = Object.entries(goalPresets).find(([, p]) => keys.every((k) => p[k] === value[k]))?.[0];

  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row wrap">
        {Object.entries(goalPresets).map(([name, p]) => (
          <button key={name} className={`chip ${preset === name ? 'on' : ''}`} onClick={() => onChange(p)}>
            {name}
          </button>
        ))}
      </div>
      {keys.map((k) => (
        <div key={k}>
          <div className="row between small">
            <span>{goalLabels[k]}</span>
            <b style={{ color: 'var(--mint)' }}>{value[k]}%</b>
          </div>
          <input type="range" min={0} max={100} value={value[k]} onChange={(e) => change(k, Number(e.target.value))} aria-label={goalLabels[k]} />
        </div>
      ))}
      <p className="xs dim">Always totals 100%. Your goals shape matches and opportunities — we never rewrite them based on clicks.</p>
    </div>
  );
}
