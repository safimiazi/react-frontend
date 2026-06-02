import { useEffect, useRef, Component, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { useScene } from '../../hooks/useScene';
import { useDrag } from '../../hooks/useDrag';
import { SceneContext } from '../../contexts/SceneContext';

const CUSTOM1_URL =
  'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/duck/model.gltf';
const CUSTOM2_URL =
  'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/low-poly-truck/model.gltf';

/**
 * Error boundary that catches GLTF load failures.
 * Reports the error via SceneContext toast and renders nothing.
 */
class GLTFErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Report to SceneContext toast if context is available
    const { onError } = this.props;
    if (onError) {
      onError(`Failed to load 3D model. ${error.message || ''}`);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — don't show a broken object
      return null;
    }
    return this.props.children;
  }
}

function CustomModel({ url, position, instanceId, isThisDragging, onPointerDown }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useEffect(() => {
    if (!scene) return;
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2 / maxDim;
      scene.scale.set(scale, scale, scale);
    }
  }, [scene]);

  const dragScale = isThisDragging ? 1.1 : 1.0;

  return (
    <group
      ref={groupRef}
      position={[position.x, 0, position.z]}
      scale={[dragScale, dragScale, dragScale]}
      onPointerDown={(e) => onPointerDown(e, instanceId)}
    >
      <primitive object={scene} />
    </group>
  );
}

function CustomModelWithFallback({ url, position, instanceId, isThisDragging, onPointerDown }) {
  return (
    <SceneContext.Consumer>
      {(ctx) => (
        <GLTFErrorBoundary
          onError={(msg) => ctx && ctx.setToast({ message: msg, type: 'error' })}
        >
          <Suspense fallback={null}>
            <CustomModel
              url={url}
              position={position}
              instanceId={instanceId}
              isThisDragging={isThisDragging}
              onPointerDown={onPointerDown}
            />
          </Suspense>
        </GLTFErrorBoundary>
      )}
    </SceneContext.Consumer>
  );
}

export function SceneObject({ instanceId, type, position }) {
  const { isDragging, dragId } = useScene();
  const { onPointerDown } = useDrag();
  const isThisDragging = isDragging && dragId === instanceId;

  if (type === 'custom1') {
    return (
      <CustomModelWithFallback
        url={CUSTOM1_URL}
        position={position}
        instanceId={instanceId}
        isThisDragging={isThisDragging}
        onPointerDown={onPointerDown}
      />
    );
  }

  if (type === 'custom2') {
    return (
      <CustomModelWithFallback
        url={CUSTOM2_URL}
        position={position}
        instanceId={instanceId}
        isThisDragging={isThisDragging}
        onPointerDown={onPointerDown}
      />
    );
  }

  const geometry =
    type === 'cube' ? (
      <boxGeometry args={[1, 1, 1]} />
    ) : (
      <sphereGeometry args={[0.5, 32, 32]} />
    );

  return (
    <mesh
      position={[position.x, 0.5, position.z]}
      scale={isThisDragging ? 1.1 : 1.0}
      onPointerDown={(e) => onPointerDown(e, instanceId)}
    >
      {geometry}
      <meshStandardMaterial
        color="royalblue"
        emissive={isThisDragging ? 'orange' : 'black'}
        emissiveIntensity={isThisDragging ? 0.4 : 0}
      />
    </mesh>
  );
}
