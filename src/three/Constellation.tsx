import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type StarState = 'suggested' | 'requested' | 'accepted' | 'declined';
export interface StarNode { id: string; state: StarState; label?: string }

interface Props {
  nodes: StarNode[];
  /** Shift the system right on wide screens so hero copy can sit left. */
  offset?: boolean;
  calm?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

const STATE_COLOR: Record<StarState, string> = {
  accepted: '#7c5cff',
  requested: '#f2a46b',
  suggested: '#c8bfe0',
  declined: '#e4e0ec',
};

/* Soft image-based lighting so metal and glass have something to reflect. */
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

/* Fresnel rim glow around the core. */
const glowMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: { uColor: { value: new THREE.Color('#b9a4ff') } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.6); gl_FragColor = vec4(uColor, f*0.55); }`,
  });

function Core({ calm }: { calm: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useMemo(glowMaterial, []);
  useFrame((_, dt) => {
    if (!calm && ref.current) ref.current.rotation.y += dt * 0.15;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 24]} />
        <meshPhysicalMaterial color="#cfc2ff" roughness={0.12} metalness={0.15} clearcoat={1} clearcoatRoughness={0.08} iridescence={0.6} iridescenceIOR={1.3} envMapIntensity={1.2} />
      </mesh>
      <mesh scale={1.32} material={glow}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
      {/* tilted gold ring */}
      <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
        <torusGeometry args={[1.65, 0.012, 8, 160]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Orbiter({ node, index, total, calm, onHover, onSelect }: { node: StarNode; index: number; total: number; calm: boolean; onHover?: Props['onHover']; onSelect?: Props['onSelect'] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), []);
  const [hover, setHover] = useState(false);
  const radius = 2.4 + (index % 2) * 0.55;
  const tilt = 0.35 + index * 0.18;
  const speed = 0.12 + index * 0.025;
  const phase = (index / total) * Math.PI * 2;
  const color = STATE_COLOR[node.state];
  const strength = node.state === 'accepted' ? 0.85 : node.state === 'requested' ? 0.5 : node.state === 'suggested' ? 0.16 : 0.05;
  const thread = useMemo(
    () => new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })),
    [lineGeo],
  );
  useEffect(() => {
    const m = thread.material as THREE.LineBasicMaterial;
    m.color.set(color);
    m.opacity = strength;
  }, [thread, color, strength]);
  useEffect(() => () => { lineGeo.dispose(); (thread.material as THREE.Material).dispose(); }, [lineGeo, thread]);

  useFrame(({ clock }) => {
    const t = calm ? 0 : clock.getElapsedTime();
    const a = phase + t * speed;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    const y = Math.sin(a) * radius * Math.sin(tilt) * 0.45;
    if (mesh.current) {
      mesh.current.position.set(x, y, z);
      const s = THREE.MathUtils.lerp(mesh.current.scale.x, hover ? 1.35 : 1, 0.15);
      mesh.current.scale.setScalar(s);
    }
    const pos = lineGeo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(1, x, y, z);
    pos.needsUpdate = true;
  });

  return (
    <>
      <primitive object={thread} />
      <mesh
        ref={mesh}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover?.(node.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); onHover?.(null); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onSelect?.(node.id); }}
      >
        <sphereGeometry args={[0.3, 48, 48]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.22} emissive={color} emissiveIntensity={node.state === 'accepted' ? 0.35 : node.state === 'requested' ? 0.22 : 0.04} envMapIntensity={1.4} />
      </mesh>
    </>
  );
}

function OrbitPaths({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const r = 2.4 + (i % 2) * 0.55;
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
            <ringGeometry args={[r - 0.004, r + 0.004, 160]} />
            <meshBasicMaterial color="#7c5cff" transparent opacity={0.14} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}

function Stars({ calm }: { calm: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 1400;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const palette = [new THREE.Color('#b9a4ff'), new THREE.Color('#f2a46b'), new THREE.Color('#e48ac8'), new THREE.Color('#9aa8ff')];
    for (let i = 0; i < n; i++) {
      const r = 12 + Math.random() * 28;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
      const c = palette[Math.random() < 0.8 ? 0 : 1 + Math.floor(Math.random() * 3)];
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (!calm && ref.current) ref.current.rotation.y += dt * 0.008;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* Whole system leans toward the pointer for depth. */
function Rig({ children, offset, calm }: { children: React.ReactNode; offset: boolean; calm: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { size, camera } = useThree();
  const narrow = size.width < 700;
  const targetX = offset && size.width > 900 ? 2.5 : 0;
  // On phones the hero system sits in the top ~320px band, above the headline (see .hero padding-top).
  const cam = camera as THREE.PerspectiveCamera;
  const visH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
  const visW = visH * (size.width / size.height);
  const targetY = offset && narrow ? ((size.height / 2 - 175) / size.height) * visH : 0;
  const targetS = narrow ? Math.min(offset ? 0.55 : 0.7, (visW / 2 / 3.1) * 0.95) : 1;
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    const px = calm ? 0 : pointer.x;
    const py = calm ? 0 : pointer.y;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, px * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.18 - py * 0.2, 0.05);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.08);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.08);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetS, 0.08));
  });
  return <group ref={ref}>{children}</group>;
}

export default function Constellation({ nodes, offset = false, calm = false, onHover, onSelect }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering when off-screen or when the tab is hidden.
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
    <div ref={wrap} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
      >
        <Environment />
        <hemisphereLight args={['#ffffff', '#e8dcff', 0.9]} />
        <pointLight position={[5, 4, 5]} intensity={40} color="#fff1e4" />
        <pointLight position={[-6, -2, -3]} intensity={30} color="#c4b0ff" />
        <Rig offset={offset} calm={calm}>
          <Core calm={calm} />
          <OrbitPaths count={2} />
          {nodes.map((n, i) => (
            <Orbiter key={n.id} node={n} index={i} total={nodes.length} calm={calm} onHover={onHover} onSelect={onSelect} />
          ))}
        </Rig>
        <Stars calm={calm} />
      </Canvas>
    </div>
  );
}
