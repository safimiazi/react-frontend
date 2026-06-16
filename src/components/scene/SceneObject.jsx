import { useMemo, Component, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useScene } from "../../hooks/useScene";
import { useDrag } from "../../hooks/useDrag";
import { SceneContext } from "../../contexts/SceneContext";

// Khronos glTF Sample Assets — canonical, permanently maintained public GLB files
const CUSTOM1_URL = "/models/Duck.glb";
// Public human GLTF (CesiumMan) as an example human character
const CUSTOM3_URL = "/models/human.glb";

class GLTFErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    if (this.props.onError)
      this.props.onError(`Failed to load 3D model. ${error.message || ""}`);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

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
  const model = useMemo(() => {
    if (!scene) return { cloned: null, normalizedScale: 1 };
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    let norm = 1;
    if (maxDim > 0) {
      norm = 1.5 / maxDim;
      // don't permanently mutate scale here; apply normalization through group scale
      clone.position.y -= box.min.y;
    }
    return { cloned: clone, normalizedScale: norm };
  }, [scene]);

  if (!model.cloned) return null;

  // finalScale is the user's resize value (1 = default); include normalization and drag multiplier
  const s = (model.normalizedScale || 1) * finalScale * (isThisDragging ? 1.1 : 1.0);

  return (
    <group
      position={[position.x, 0, position.z]}
      scale={[s, s, s]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e, instanceId);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(instanceId);
      }}
      /* double-click intentionally removed */
    >
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01 / s, 0]}>
          <ringGeometry args={[1.1 / s, 1.3 / s, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
        </mesh>
      )}
      <primitive object={model.cloned} />
    </group>
  );
}

function CustomModelWithFallback(props) {
  return (
    <SceneContext.Consumer>
      {(ctx) => (
        <GLTFErrorBoundary
          onError={(msg) =>
            ctx && ctx.setToast({ message: msg, type: "error" })
          }
        >
          <Suspense fallback={null}>
            <CustomModel {...props} />
          </Suspense>
        </GLTFErrorBoundary>
      )}
    </SceneContext.Consumer>
  );
}

export function SceneObject({ instanceId, type, position, scale = 1 }) {
  const { isDragging, dragId, selectedId, setSelectedId } = useScene();
  const { onPointerDown } = useDrag();
  const isThisDragging = isDragging && dragId === instanceId;
  const isSelected = selectedId === instanceId;

  /* double-click intentionally removed */
  const handleSelect = (id) => setSelectedId(selectedId === id ? null : id);

  const commonProps = {
    position,
    instanceId,
    finalScale: scale,
    isThisDragging,
    isSelected,
    onPointerDown,
    /* double-click intentionally removed */
    onSelect: handleSelect,
  };

  if (type === "custom1")
    return <CustomModelWithFallback url={CUSTOM1_URL} {...commonProps} />;
  if (type === "custom3")
    return <CustomModelWithFallback url={CUSTOM3_URL} {...commonProps} />;
  // Render a simpler primitive for `custom2` (replace misbehaving Fox model)
  if (type === "custom2") {
    const sTorus = scale * (isThisDragging ? 1.1 : 1.0);
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
          scale={[sTorus, sTorus, sTorus]}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerDown(e, instanceId);
          }}
          /* double-click intentionally removed */
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

  const s = scale * (isThisDragging ? 1.1 : 1.0);
  const geometry =
    type === "cube" ? (
      <boxGeometry args={[1, 1, 1]} />
    ) : (
      <sphereGeometry args={[0.5, 32, 32]} />
    );

  return (
    <group
      position={[position.x, 0, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect(instanceId);
      }}
    >
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.75 * scale, 0.9 * scale, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
        </mesh>
      )}
      <mesh
        position={[0, 0.5 * scale, 0]}
        scale={[s, s, s]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown(e, instanceId);
        }}
        /* double-click intentionally removed */
      >
        {geometry}
        <meshStandardMaterial
          color={isSelected ? "#93c5fd" : "royalblue"}
          emissive={isThisDragging ? "orange" : "black"}
          emissiveIntensity={isThisDragging ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}
