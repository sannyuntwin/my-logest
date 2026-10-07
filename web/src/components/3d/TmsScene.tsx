import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, Path, Shape, ShapeGeometry, Vector3 } from "three";
import { vehicles } from "../../data/vehicles";

const routePoints = [
  new Vector3(-16, 0.12, 12),
  new Vector3(16, 0.12, 12),
  new Vector3(16, 0.12, -12),
  new Vector3(-16, 0.12, -12),
];

const routeLength = routePoints.reduce(
  (length, point, index) => length + point.distanceTo(routePoints[(index + 1) % routePoints.length]),
  0,
);

const createRoadGeometry = () => {
  const shape = new Shape();
  shape.moveTo(-17.7, -13.7);
  shape.lineTo(17.7, -13.7);
  shape.lineTo(17.7, 13.7);
  shape.lineTo(-17.7, 13.7);
  shape.closePath();

  const roadInner = new Path();
  roadInner.moveTo(-14.3, -10.3);
  roadInner.lineTo(-14.3, 10.3);
  roadInner.lineTo(14.3, 10.3);
  roadInner.lineTo(14.3, -10.3);
  roadInner.closePath();
  shape.holes.push(roadInner);
  return new ShapeGeometry(shape);
};

const laneMarkings = (() => {
  const markings: { position: Vector3; rotation: number }[] = [];
  for (let distance = 1.5; distance < routeLength; distance += 3.2) {
    let remainingDistance = distance;
    for (let index = 0; index < routePoints.length; index += 1) {
      const start = routePoints[index];
      const end = routePoints[(index + 1) % routePoints.length];
      const segmentLength = start.distanceTo(end);
      if (remainingDistance <= segmentLength) {
        markings.push({
          position: start.clone().lerp(end, remainingDistance / segmentLength),
          rotation: Math.atan2(-(end.z - start.z), end.x - start.x),
        });
        break;
      }
      remainingDistance -= segmentLength;
    }
  }
  return markings;
})();

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[36, 28]} />
    <meshStandardMaterial color="#e7e7e1" roughness={1} />
  </mesh>
);

const RectangleRoad = () => {
  const geometry = useMemo(createRoadGeometry, []);

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#414b56" roughness={0.94} />
      </mesh>
      {laneMarkings.map((marking, index) => (
        <mesh
          key={index}
          position={[marking.position.x, 0.1, marking.position.z]}
          rotation={[0, marking.rotation, 0]}
        >
          <boxGeometry args={[1, 0.02, 0.14]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      ))}
    </group>
  );
};

const Truck = ({ onSelect }: { onSelect: () => void }) => {
  const { scene } = useGLTF("/models/truck.glb");
  const truckRef = useRef<Group | null>(null);
  const distanceRef = useRef(0);
  const truckModel = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return model;
  }, [scene]);

  useFrame((_, delta) => {
    const truck = truckRef.current;
    if (!truck) return;

    distanceRef.current = (distanceRef.current + delta * 4.5) % routeLength;
    let remainingDistance = distanceRef.current;

    for (let index = 0; index < routePoints.length; index += 1) {
      const start = routePoints[index];
      const end = routePoints[(index + 1) % routePoints.length];
      const segmentLength = start.distanceTo(end);

      if (remainingDistance <= segmentLength || index === routePoints.length - 1) {
        const progress = remainingDistance / segmentLength;
        truck.position.lerpVectors(start, end, progress);
        truck.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
        break;
      }
      remainingDistance -= segmentLength;
    }
  });

  return (
    <group
      ref={truckRef}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <primitive object={truckModel} scale={0.8} />
    </group>
  );
};

const Container = ({ onSelect }: { onSelect: () => void }) => {
  const { scene } = useGLTF("/models/container.glb");
  const containerModel = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bounds = new Box3().setFromObject(model);
    const dimensions = bounds.getSize(new Vector3());
    const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
    if (largestDimension > 0) model.scale.multiplyScalar(5.5 / largestDimension);

    model.updateMatrixWorld(true);
    const fittedBounds = new Box3().setFromObject(model);
    const center = fittedBounds.getCenter(new Vector3());
    model.position.set(-center.x, -fittedBounds.min.y, -center.z);
    return model;
  }, [scene]);

  return (
    <primitive
      object={containerModel}
      position={[0, 0.02, 0]}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    />
  );
};

useGLTF.preload("/models/truck.glb");
useGLTF.preload("/models/container.glb");

const TmsScene = () => {
  const [selectedObject, setSelectedObject] = useState<"truck" | "container" | null>(null);
  const vehicle = vehicles[0];
  const detailRows = selectedObject === "truck"
    ? [
        ["Vehicle ID", vehicle.id],
        ["Plate", vehicle.plateNumber],
        ["Type", vehicle.vehicleType],
        ["Vehicle", `${vehicle.brand} ${vehicle.model}`],
        ["Status", vehicle.status],
        ["Mileage", `${vehicle.mileage.toLocaleString()} km`],
        ["Driver ID", vehicle.driverId],
      ]
    : selectedObject === "container"
      ? [
          ["Asset", "container.glb"],
          ["Placement", "Center of route"],
          ["Display scale", "5.5 scene units"],
        ]
      : [];

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100dvh - 128px)", background: "#f3f4f6", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ position: [28, 25, 36], fov: 42 }}
        onPointerMissed={() => setSelectedObject(null)}
      >
        <color attach="background" args={["#f3f4f6"]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[8, 14, 8]} intensity={1.5} castShadow />

        <Ground />
        <RectangleRoad />
        <Truck onSelect={() => setSelectedObject("truck")} />
        <Container onSelect={() => setSelectedObject("container")} />

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 - 0.02} />
      </Canvas>

      {selectedObject && (
        <aside
          aria-label={`${selectedObject} details`}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: "min(320px, calc(100% - 32px))",
            boxSizing: "border-box",
            padding: 16,
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.14)",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, color: "#111827", fontSize: 18, textTransform: "capitalize" }}>
              {selectedObject} details
            </h2>
            <button
              type="button"
              aria-label="Close details"
              onClick={() => setSelectedObject(null)}
              style={{ border: 0, background: "transparent", color: "#4b5563", cursor: "pointer", fontSize: 14 }}
            >
              Close
            </button>
          </div>
          <dl style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "9px 12px", margin: 0, fontSize: 13 }}>
            {detailRows.map(([label, value]) => (
              <div key={label} style={{ display: "contents" }}>
                <dt style={{ color: "#6b7280" }}>{label}</dt>
                <dd style={{ margin: 0, color: "#111827", fontWeight: 600 }}>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  );
};

export default TmsScene;
