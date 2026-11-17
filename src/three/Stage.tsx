import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from 'react';

// Three.js is code-split: only pages that show a stage download it.
const Constellation = lazy(() => import('./Constellation'));
const Showcase = lazy(() => import('./Showcase'));

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class Guard extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type StageProps =
  | ({ scene?: 'constellation' } & ComponentProps<typeof Constellation>)
  | ({ scene: 'showcase' } & ComponentProps<typeof Showcase>);

export default function Stage(props: StageProps) {
  const fallback = <div className="hero-fallback" aria-hidden />;
  if (!webglOk()) return fallback;
  return (
    <Guard fallback={fallback}>
      <Suspense fallback={fallback}>
        {props.scene === 'showcase' ? <Showcase {...props} /> : <Constellation {...props} />}
      </Suspense>
    </Guard>
  );
}
