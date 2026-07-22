import { Circle, useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import { AdditiveBlending, MathUtils, RepeatWrapping } from "three";

export function Trash() {
  const maps = useTexture({
    map: "/decals/trash/shmpulh_4K_Albedo.jpg",
    alphaMap: "/decals/trash/shmpulh_4K_Opacity.jpg",
    normalMap: "/decals/trash/shmpulh_4K_Normal.jpg",
    roughnessMap:
      "/decals/trash/shmpulh_4K_Roughness.jpg",
    aoMap: "/decals/trash/shmpulh_4K_AO.jpg",
  });

  useLayoutEffect(() => {
    for (const key in maps) {
      const map = maps[key];
      if (map) {
        map.wrapS = map.wrapT = RepeatWrapping;
        map.repeat.set(2, 2);
      }
    }
  }, []);

  return (
    <>
      <Circle
        args={[0.5]}
        renderOrder={1}
        frustumCulled={false}
        rotation-z={MathUtils.degToRad(30)}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          {...maps}
          polygonOffset
          polygonOffsetFactor={-2}
          depthWrite={false}
          transparent
          blending={AdditiveBlending}
        />
      </Circle>
    </>
  );
}
