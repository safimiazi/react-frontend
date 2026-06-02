export function GroundPlane({ onPointerMove, onPointerUp }) {
  return (
    <group>
      {/* Visible grid for spatial orientation */}
      <gridHelper args={[20, 20]} />

      {/* Invisible hit-test plane for drag raycasting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        visible={false}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
