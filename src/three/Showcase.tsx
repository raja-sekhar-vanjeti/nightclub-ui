import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * "Showcase" hero: frosted glass tiles (people, code, launch, impact) floating above a
 * stone pedestal with a glowing core, wrapped by a glass orbit ring.
 * Each tile is a door into the app — hover lifts it, click navigates.
 */

export type TileId = 'people' | 'code' | 'launch' | 'impact';

interface Props {
  calm?: boolean;
  /** Active builders count drives how bright the pedestal core is (0..1). */
  energy?: number;
  onHover?: (id: TileId | null) => void;
  onSelect?: (id: TileId) => void;
}

// Lucide icon paths (24×24 viewBox), drawn into canvas textures.
const ICONS: Record<TileId, string[]> = {
  people: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  launch: [
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
    'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
    'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
    'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  ],
  impact: ['M3 3v18h18', 'M8 17v-4', 'M13 17V9', 'M18 17V5'],
};

const TILES: { id: TileId; pos: [number, number, number]; size: number; rot: [number, number, number]; tint: string; glow: string; main?: boolean }[] = [
  { id: 'people', pos: [-0.2, 1.55, 1.2], size: 2.9, rot: [0.06, -0.24, -0.05], tint: '#6a3df0', glow: '#5b2ee6', main: true },
  { id: 'code', pos: [-2.55, 2.25, -0.9], size: 1.7, rot: [0.02, 0.4, 0.06], tint: '#7f95ee', glow: '#5f74d8' },
  { id: 'launch', pos: [1.95, 3.55, -1.2], size: 1.6, rot: [0.06, -0.3, 0.07], tint: '#b989e8', glow: '#9a63d6' },
  { id: 'impact', pos: [3.0, 1.6, -0.3], size: 1.7, rot: [0.02, -0.5, -0.05], tint: '#e29bc0', glow: '#c9719f' },
];

function iconTexture(id: TileId, main: boolean) {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.translate(S * 0.18, S * 0.18);
  g.scale((S * 0.64) / 24, (S * 0.64) / 24);
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.shadowColor = main ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)';
  g.shadowBlur = 14;
  g.strokeStyle = 'rgba(255,255,255,0.96)';
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.lineWidth = main ? 2.1 : 1.8;
  for (const d of ICONS[id]) {
    const p = new Path2D(d);
    // the people icon reads better filled, like a soft 3D emblem
    if (id === 'people') g.fill(p);
    g.stroke(p);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

let glowTex: THREE.Texture | null = null;
function getGlowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.2, 'rgba(255,255,255,0.55)');
  grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

function Glow({ color, size, opacity = 1, position = [0, 0, 0] as [number, number, number], spriteRef }: { color: string; size: number; opacity?: number; position?: [number, number, number]; spriteRef?: React.Ref<THREE.Sprite> }) {
  const mat = useMemo(() => new THREE.SpriteMaterial({ map: getGlowTexture(), color, transparent: true, opacity, depthWrite: false, toneMapped: false }), [color, opacity]);
  useEffect(() => () => mat.dispose(), [mat]);
  return <sprite ref={spriteRef} material={mat} position={position} scale={[size, size, 1]} />;
}

/* Soft studio reflections for glass and stone. */
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pmrem.dispose(); scene.environment = null; };
  }, [gl, scene]);
  return null;
}

function Tile({ tile, index, calm, onHover, onSelect }: { tile: (typeof TILES)[number]; index: number; calm: boolean; onHover?: Props['onHover']; onSelect?: Props['onSelect'] }) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const geo = useMemo(() => new RoundedBoxGeometry(tile.size, tile.size, tile.size * 0.16, 5, tile.size * 0.16), [tile.size]);
  const tex = useMemo(() => iconTexture(tile.id, !!tile.main), [tile.id, tile.main]);
  useEffect(() => () => { geo.dispose(); tex.dispose(); }, [geo, tex]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const t = calm ? 0 : clock.getElapsedTime();
    const bob = Math.sin(t * 0.7 + index * 1.7) * 0.08;
    g.position.y = THREE.MathUtils.damp(g.position.y, tile.pos[1] + bob + (hover ? 0.18 : 0), 6, dt);
    const s = THREE.MathUtils.damp(g.scale.x, hover ? 1.06 : 1, 8, dt);
    g.scale.setScalar(s);
    g.rotation.y = tile.rot[1] + (calm ? 0 : Math.sin(t * 0.35 + index) * 0.05);
  });

  return (
    <group
      ref={group}
      position={tile.pos}
      rotation={tile.rot}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover?.(tile.id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); onHover?.(null); document.body.style.cursor = ''; }}
      onClick={(e) => { e.stopPropagation(); onSelect?.(tile.id); }}
    >
      {/* frosted glass body: cheap standard material, no transmission pass */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color={tile.tint}
          emissive={tile.glow}
          emissiveIntensity={tile.main ? (hover ? 0.6 : 0.42) : hover ? 0.45 : 0.28}
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={tile.main ? 1 : 0.9}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* icon emblem floating just in front of the face */}
      <mesh position={[0, 0, tile.size * 0.085]}>
        <planeGeometry args={[tile.size * 0.62, tile.size * 0.62]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <Glow color={tile.glow} size={tile.size * 1.6} opacity={(tile.main ? 0.5 : 0.22) + (hover ? 0.2 : 0)} position={[0, 0, -0.4]} />
    </group>
  );
}

function OrbitRing({ calm }: { calm: boolean }) {
  const ring = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Sprite[]>([]);
  useFrame(({ clock }) => {
    const t = calm ? 0 : clock.getElapsedTime();
    if (ring.current) ring.current.rotation.z = -0.16 + Math.sin(t * 0.25) * 0.02;
    sparks.current.forEach((s, i) => {
      if (!s) return;
      const a = t * 0.22 + (i / 3) * Math.PI * 2;
      s.position.set(Math.cos(a) * 3.9, Math.sin(a) * 3.9, 0);
    });
  });
  return (
    <group ref={ring} position={[0, 1.6, 0]} rotation={[Math.PI / 2.25, 0, -0.16]}>
      <mesh>
        <torusGeometry args={[3.9, 0.07, 24, 200]} />
        <meshStandardMaterial color="#b48cff" emissive="#8b5cf6" emissiveIntensity={0.55} roughness={0.15} metalness={0.25} envMapIntensity={0.9} />
      </mesh>
      <mesh>
        <torusGeometry args={[4.35, 0.012, 8, 200]} />
        <meshBasicMaterial color="#c86fd0" transparent opacity={0.7} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <Glow key={i} color={i === 0 ? '#ff9a5a' : '#c77dff'} size={0.9} opacity={0.9} spriteRef={(s) => { if (s) sparks.current[i] = s; }} />
      ))}
    </group>
  );
}

function Pedestal({ energy, calm }: { energy: number; calm: boolean }) {
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const stone = useMemo(() => {
    // speckled stone via a small noise canvas
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#d9d4e2';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      const v = 150 + Math.random() * 90;
      g.fillStyle = `rgba(${v - 20},${v - 24},${v},${0.25 + Math.random() * 0.3})`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 1);
    return t;
  }, []);
  useEffect(() => () => stone.dispose(), [stone]);
  useFrame(({ clock }) => {
    if (core.current) core.current.opacity = 0.75 + (calm ? 0 : Math.sin(clock.getElapsedTime() * 1.2) * 0.12);
  });
  return (
    <group position={[0, -1.15, 0]}>
      <mesh>
        <cylinderGeometry args={[3.0, 3.15, 0.75, 96, 1]} />
        <meshStandardMaterial map={stone} color="#b6aec8" roughness={0.85} metalness={0} />
      </mesh>
      {/* inner lip */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.9, 96]} />
        <meshStandardMaterial map={stone} color="#a9a0bd" roughness={0.9} />
      </mesh>
      {/* glowing core */}
      <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.15, 96]} />
        <meshBasicMaterial ref={core} color="#ffb877" transparent toneMapped={false} />
      </mesh>
      <Glow color="#ff9548" size={5.5 + energy * 1.5} opacity={0.6 + energy * 0.3} position={[0, 0.7, 0]} />
      <Glow color="#ffd2a1" size={3} opacity={0.85} position={[0, 0.55, 0]} />
    </group>
  );
}

/* Leans toward the pointer; scales to fit narrow screens. */
function Rig({ children, calm }: { children: React.ReactNode; calm: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { size } = useThree();
  const s = size.width < 520 ? 0.7 : size.width < 800 ? 0.82 : 1;
  useFrame(({ pointer }, dt) => {
    const g = ref.current;
    if (!g) return;
    const px = calm ? 0 : pointer.x;
    const py = calm ? 0 : pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.18, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.06, 3, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt));
  });
  return <group ref={ref}>{children}</group>;
}

function QualityGuard() {
  const { gl } = useThree();
  const acc = useRef({ t: 0, n: 0, slow: 0, done: false });
  useFrame((_, dt) => {
    const a = acc.current;
    if (a.done) return;
    a.t += dt;
    if (a.t < 1.5) return;
    a.n++;
    if (dt > 1 / 40) a.slow++;
    if (a.n >= 120) {
      if (a.slow / a.n > 0.35) gl.setPixelRatio(1);
      a.done = true;
    }
  });
  return null;
}

function Scene({ calm = false, energy = 0.5, onHover, onSelect, onReady }: Props & { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  const backGeo = useMemo(() => new RoundedBoxGeometry(2.4, 2.8, 0.28, 4, 0.34), []);
  useEffect(() => () => backGeo.dispose(), [backGeo]);
  useEffect(() => {
    let alive = true;
    camera.lookAt(0, 1.1, 0);
    gl.compileAsync(scene, camera).catch(() => undefined).finally(() => alive && onReady());
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Environment />
      <hemisphereLight args={['#ffffff', '#c9b6ff', 0.55]} />
      <directionalLight position={[4, 8, 6]} intensity={1.3} color="#fff6ee" />
      <pointLight position={[-4, 2, 3]} intensity={22} color="#a77bff" />
      <pointLight position={[0, -0.2, 1.5]} intensity={10} color="#ffcf9e" />
      <Rig calm={calm}>
        <Pedestal energy={energy} calm={calm} />
        <OrbitRing calm={calm} />
        {/* plain back panel behind the hero tile for depth */}
        <mesh geometry={backGeo} position={[0.75, 2.0, 0.1]} rotation={[0.04, -0.2, 0]}>
          <meshStandardMaterial color="#c9b8f5" transparent opacity={0.6} roughness={0.2} envMapIntensity={0.8} />
        </mesh>
        {TILES.map((t, i) => (
          <Tile key={t.id} tile={t} index={i} calm={calm} onHover={onHover} onSelect={onSelect} />
        ))}
      </Rig>
      <QualityGuard />
    </>
  );
}

export default function Showcase(props: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let inView = true;
    const update = () => setVisible(inView && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return (
    <div ref={wrap} style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0, transition: 'opacity .8s ease' }}>
      <Canvas
        frameloop={visible && ready ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.2, 11.5], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.NeutralToneMapping; gl.toneMappingExposure = 1.0; }}
      >
        <Scene {...props} onReady={() => setReady(true)} />
      </Canvas>
    </div>
  );
}
