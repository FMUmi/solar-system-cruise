import { ThreeCanvas } from "@remotion/three";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AdditiveBlending, Color } from "three";

type Planet = {
  nameCn: string;
  nameEn: string;
  distance: string;
  period: string;
  intro: string;
  color: string;
  accent: string;
  radius: number;
  orbit: number;
  phase: number;
  start: number;
};

const planets: Planet[] = [
  {
    nameCn: "水星",
    nameEn: "Mercury",
    distance: "距太阳 5790 万公里",
    period: "公转周期 88 天",
    intro: "太阳系最内侧的岩石行星，昼夜温差极端，表面布满古老撞击坑。",
    color: "#a7a9ad",
    accent: "#d6d7da",
    radius: 0.22,
    orbit: 2.3,
    phase: 0.25,
    start: 75,
  },
  {
    nameCn: "金星",
    nameEn: "Venus",
    distance: "距太阳 1.082 亿公里",
    period: "公转周期 225 天",
    intro: "浓厚大气制造强烈温室效应，云层反射阳光，让它成为夜空中极明亮的行星。",
    color: "#d7a457",
    accent: "#ffd88a",
    radius: 0.34,
    orbit: 3.25,
    phase: 1.45,
    start: 145,
  },
  {
    nameCn: "地球",
    nameEn: "Earth",
    distance: "距太阳 1.496 亿公里",
    period: "公转周期 365 天",
    intro: "目前已知唯一拥有稳定液态水海洋与生命圈的世界，磁场守护着大气层。",
    color: "#2f7de1",
    accent: "#73d5ff",
    radius: 0.36,
    orbit: 4.28,
    phase: 2.15,
    start: 215,
  },
  {
    nameCn: "火星",
    nameEn: "Mars",
    distance: "距太阳 2.279 亿公里",
    period: "公转周期 687 天",
    intro: "富含氧化铁的红色尘土覆盖表面，古河道与极冠记录着水的历史线索。",
    color: "#c95d3a",
    accent: "#ff9a70",
    radius: 0.29,
    orbit: 5.35,
    phase: 3.05,
    start: 285,
  },
  {
    nameCn: "木星",
    nameEn: "Jupiter",
    distance: "距太阳 7.785 亿公里",
    period: "公转周期 11.86 年",
    intro: "太阳系最大行星，条带状云层与大红斑展现了巨大气态世界的长期风暴。",
    color: "#d8b38a",
    accent: "#ffe0b5",
    radius: 0.72,
    orbit: 6.85,
    phase: 3.95,
    start: 355,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const smooth = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = Array.from({ length: 150 }, (_, index) => {
    const x = (Math.sin(index * 38.17) + 1) * 960;
    const y = (Math.sin(index * 91.73) + 1) * 540;
    const size = 1 + ((index * 13) % 4);
    const opacity = 0.24 + ((index * 29) % 70) / 100;
    const drift = frame * (0.015 + (index % 5) * 0.005);
    return { x: x - drift, y, size, opacity };
  });

  return (
    <div className="stars">
      {stars.map((star, index) => (
        <span
          key={index}
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

const Orbit: React.FC<{ radius: number; opacity: number }> = ({ radius, opacity }) => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[radius, 0.008, 8, 220]} />
    <meshBasicMaterial
      color="#6bd6ff"
      transparent
      opacity={opacity}
      blending={AdditiveBlending}
    />
  </mesh>
);

const PlanetMesh: React.FC<{ planet: Planet; active: boolean; frame: number }> = ({
  planet,
  active,
  frame,
}) => {
  const angle = planet.phase + frame * 0.003 * (7 / planet.orbit);
  const x = Math.cos(angle) * planet.orbit;
  const z = Math.sin(angle) * planet.orbit * 0.46;
  const y = Math.sin(angle * 1.7) * 0.05;
  const scale = active ? 1.38 : 1;

  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh rotation={[0.18, frame * 0.018, -0.12]}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.72}
          metalness={0.04}
          emissive={new Color(planet.accent)}
          emissiveIntensity={active ? 0.18 : 0.04}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[planet.radius * 1.12, 48, 48]} />
        <meshBasicMaterial
          color={planet.accent}
          transparent
          opacity={active ? 0.18 : 0.05}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const SolarSystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const activeIndex = clamp(Math.floor((frame - 55) / 70), 0, planets.length - 1);
  const cruise = smooth(frame, [0, 460], [0, -4.85]);
  const reveal = smooth(frame, [0, 80], [0.72, 1.08]);
  const pitch = smooth(frame, [0, 510], [-0.18, -0.32]);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 5.4, 9.4], fov: 42, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#02040b"]} />
      <ambientLight intensity={0.46} />
      <pointLight position={[0, 0, 0]} color="#ffd47a" intensity={35} distance={13} />
      <directionalLight position={[6, 7, 8]} color="#dff5ff" intensity={1.15} />
      <group position={[cruise, -0.18, -1.2]} rotation={[pitch, 0.1, -0.04]} scale={reveal}>
        <mesh>
          <sphereGeometry args={[0.95, 96, 96]} />
          <meshStandardMaterial
            color="#ffb33f"
            emissive="#ff9f1a"
            emissiveIntensity={2.6}
            roughness={0.38}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.22, 96, 96]} />
          <meshBasicMaterial
            color="#ffd36a"
            transparent
            opacity={0.2}
            blending={AdditiveBlending}
          />
        </mesh>
        {planets.map((planet, index) => (
          <group key={planet.nameEn}>
            <Orbit radius={planet.orbit} opacity={index === activeIndex ? 0.46 : 0.2} />
            <PlanetMesh planet={planet} active={index === activeIndex} frame={frame} />
          </group>
        ))}
      </group>
    </ThreeCanvas>
  );
};

const InfoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const active =
    planets.find((planet) => frame >= planet.start && frame < planet.start + 58) ??
    planets[0];
  const local = frame - active.start;
  const opacity = Math.min(
    smooth(local, [0, 14], [0, 1]),
    smooth(local, [46, 58], [1, 0]),
  );
  const translate = smooth(local, [0, 18], [54, 0]);

  return (
    <div className="cardWrap" style={{ opacity, transform: `translateX(${translate}px)` }}>
      <div className="kicker">PLANET DOSSIER</div>
      <div className="titleRow">
        <div>
          <div className="planetCn">{active.nameCn}</div>
          <div className="planetEn">{active.nameEn}</div>
        </div>
        <div className="pulse" style={{ borderColor: active.accent }} />
      </div>
      <div className="facts">
        <div>{active.distance}</div>
        <div>{active.period}</div>
      </div>
      <p>{active.intro}</p>
    </div>
  );
};

const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = Math.round(smooth(frame, [0, 490], [0, 100]));

  return (
    <>
      <div className="topHud">
        <div className="brand">SOLAR SYSTEM CRUISE</div>
        <div className="status">DEEP SPACE ATLAS / LIVE TELEMETRY</div>
      </div>
      <div className="bottomHud">
        <span>巡航进度</span>
        <div className="track">
          <div style={{ width: `${progress}%` }} />
        </div>
        <strong>{progress}%</strong>
      </div>
    </>
  );
};

export const SolarCruise: React.FC = () => {
  const frame = useCurrentFrame();
  const introOpacity = smooth(frame, [0, 35], [1, 0]);

  return (
    <div className="scene">
      <Stars />
      <div className="sunBloom" />
      <SolarSystemScene />
      <div className="scanlines" />
      <Hud />
      <InfoCard />
      <div className="intro" style={{ opacity: introOpacity }}>
        <div>太阳系巡航图鉴</div>
        <span>一次穿越内太阳系的电影级科普飞行</span>
      </div>
    </div>
  );
};
