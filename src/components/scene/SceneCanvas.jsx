import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useScene } from '../../hooks/useScene';
import { useDrag } from '../../hooks/useDrag';
import { Lights } from './Lights';
import { GroundPlane } from './GroundPlane';
import { SceneObject } from './SceneObject';

export function SceneCanvas() {
  const { objects, isDragging } = useScene();
  const drag = useDrag();

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 15, 20], near: 0.1, far: 1000 }}
      shadows
      className="w-screen h-screen"
    >
      <Lights />
      <GroundPlane
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      />
      <OrbitControls enabled={!isDragging} />
      {objects.map((o) => (
        <SceneObject key={o.instanceId} {...o} />
      ))}
    </Canvas>
  );
}
