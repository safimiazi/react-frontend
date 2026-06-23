import { useMemo, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { Box3, Vector3 } from "three";
import { useScene } from "../../hooks/useScene";
import { useDrag } from "../../hooks/useDrag";

const CUSTOM1_URL = "/models/Duck.glb";
const CUSTOM3_URL = "/models/human.glb";

// --- GLTF model with auto-normalised scale ---
function CustomModel({
  url,
  position,
  instanceId,
  finalScale,
  isThisDragging,
  isSelected,
  onPointerDown,
  onSelect,
}) {
  const { scene } = useGLTF(url);

  const { cloned, normalizedScale } = useMemo(() => {
    if (!scene) return { cloned: null, normalizedScale: 1 };
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) clone.position.y -= box.min.y;
    return { cloned: clone, normalizedScale: maxDim > 0 ? 1.5 / maxDim : 1 };
  }, [scene]);

  if (!cloned) return null;

  const s = normalizedScale * finalScale * (isThisDragging ? 1.1 : 1.0);

  return (
    <group
      position={[position.x, 0, position.z]}
      scale={s}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e, instanceId);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(instanceId);
      }}
    >
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01 / s, 0]}>
          <ringGeometry args={[1.1 / s, 1.3 / s, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
        </mesh>
      )}
      <primitive object={cloned} />
    </group>
  );
}

function CustomModelWithFallback(props) {
  const { setToast } = useScene();
  return (
    <ErrorBoundary
      fallback={null}
      onError={(error) =>
        setToast({
          message: `Failed to load 3D model. ${error.message || ""}`,
          type: "error",
        })
      }
    >
      <Suspense fallback={null}>
        <CustomModel {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// --- Main component ---
export function SceneObject({ instanceId, type, position, scale = 1 }) {
  const { isDragging, dragId, selectedId, setSelectedId } = useScene();
  const { onPointerDown } = useDrag();

  const isThisDragging = isDragging && dragId === instanceId;
  const isSelected = selectedId === instanceId;
  const handleSelect = (id) => setSelectedId(selectedId === id ? null : id);

  const commonProps = {
    position,
    instanceId,
    finalScale: scale,
    isThisDragging,
    isSelected,
    onPointerDown,
    onSelect: handleSelect,
  };

  if (type === "custom1")
    return <CustomModelWithFallback url={CUSTOM1_URL} {...commonProps} />;
  if (type === "custom3")
    return <CustomModelWithFallback url={CUSTOM3_URL} {...commonProps} />;

  // custom2 → torus primitive
  if (type === "custom2") {
    const s = scale * (isThisDragging ? 1.1 : 1.0);
    return (
      <group
        position={[position.x, 0, position.z]}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect(instanceId);
        }}
      >
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.75 * scale, 0.9 * scale, 32]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
          </mesh>
        )}
        <mesh
          position={[0, 0.6 * scale, 0]}
          scale={s}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerDown(e, instanceId);
          }}
        >
          <torusGeometry args={[0.6, 0.2, 16, 100]} />
          <meshStandardMaterial
            color={isSelected ? "#93c5fd" : "seagreen"}
            emissive={isThisDragging ? "orange" : "black"}
            emissiveIntensity={isThisDragging ? 0.4 : 0}
          />
        </mesh>
      </group>
    );
  }

  // cube / sphere
  const s = scale * (isThisDragging ? 1.1 : 1.0);
  return (
    <group
      position={[position.x, 0, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect(instanceId);
      }}
    >
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.75 * scale, 0.9 * scale, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
        </mesh>
      )}
      <mesh
        position={[0, 0.5 * scale, 0]}
        scale={s}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown(e, instanceId);
        }}
      >
        {type === "cube" ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : (
          <sphereGeometry args={[0.5, 32, 32]} />
        )}
        <meshStandardMaterial
          color={isSelected ? "#93c5fd" : "royalblue"}
          emissive={isThisDragging ? "orange" : "black"}
          emissiveIntensity={isThisDragging ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}
