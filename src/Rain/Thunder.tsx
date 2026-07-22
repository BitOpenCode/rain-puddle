import { useFrame } from "@react-three/fiber";
import { Howl } from "howler";
import * as React from "react";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";
import { useSound } from "../SoundContext";

export function Thunder({ rainEnabled }: { rainEnabled: boolean }) {
  const { isSoundOn, thunderSoundRef } = useSound();
  const lightformerRef = React.useRef<THREE.Mesh>(null!);

  const sprites = {
    thunder1: [2000, 16000],
    thunder2: [16000, 28000],
    // thunder3: [28000, 46000],
    // thunder4: [46000, 53000],
  };

  const thunderSounds = React.useMemo(
    () =>
      new Howl({
        src: "/sounds/thunderstorm-14708.mp3",
        sprite: sprites as any,
        volume: 0.3,
      }),
    [sprites]
  );

  // Сохраняем ссылку на звук грома в контексте
  React.useEffect(() => {
    thunderSoundRef.current = thunderSounds;
    return () => {
      thunderSounds.stop();
      thunderSounds.unload();
    };
  }, [thunderSounds, thunderSoundRef]);

  const noise = React.useMemo(() => createNoise2D(), []);

  const thunderingDuration = React.useRef(-1);
  const currentTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Следим за изменением isSoundOn и управляем громкостью
  React.useEffect(() => {
    if (thunderSounds.playing()) {
      if (isSoundOn) {
        thunderSounds.volume(0.3);
      } else {
        thunderSounds.volume(0);
      }
    }
  }, [isSoundOn, thunderSounds]);

  React.useEffect(() => {
    if (!rainEnabled) {
      // Если дождь выключен - останавливаем все таймеры и звук
      if (currentTimeout.current) {
        clearTimeout(currentTimeout.current);
        currentTimeout.current = null;
      }
      thunderSounds.stop();
      thunderingDuration.current = -1;
      return;
    }

    const getRandInterval = () => THREE.MathUtils.randInt(5000, 20000);
    const getRandDuration = () => THREE.MathUtils.randInt(500, 1000);
    const getRandSprite = () =>
      Object.keys(sprites)[
        THREE.MathUtils.randInt(0, Object.keys(sprites).length - 1)
      ];

    const makeThunder = () => {
      if (!rainEnabled) return;

      const sprite = getRandSprite();
      const duration = sprites[sprite][1] - sprites[sprite][0];
      thunderingDuration.current = duration / 20;
      
      // Воспроизводим звук только если звук включен
      if (isSoundOn) {
        thunderSounds.fade(0, 1, 0.5).play(sprite);
      } else {
        // Если звук выключен - играем без звука (только визуал)
        thunderSounds.fade(0, 0, 0).play(sprite);
      }
      
      currentTimeout.current = setTimeout(() => {
        thunderSounds.stop();
        thunderingDuration.current = -1;
        currentTimeout.current = setTimeout(() => {
          makeThunder();
        }, getRandInterval());
      }, duration);
    };

    // Первый гром через 5 секунд
    currentTimeout.current = setTimeout(() => {
      makeThunder();
    }, 5 * 1000);

    return () => {
      if (currentTimeout.current) {
        clearTimeout(currentTimeout.current);
        currentTimeout.current = null;
      }
      thunderSounds.stop();
      thunderingDuration.current = -1;
    };
  }, [rainEnabled, thunderSounds, sprites, isSoundOn]);

  useFrame(({ clock }, dt) => {
    if (thunderingDuration.current > 0) {
      const time = clock.elapsedTime;
      const n = THREE.MathUtils.mapLinear(noise(0, time * 5), -1, 1, 0, 1);

      const mat = lightformerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.smoothstep(n, 0.7, 0.95);

      thunderingDuration.current -= dt * 1000;
    } else {
      const mat = lightformerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0;
    }
  });

  return (
    <mesh
      ref={lightformerRef}
      position={[-2, 1, -1]}
      scale={[1, 2, 0.1]}
      material-transparent={true}
    >
      <boxGeometry />
      <meshBasicMaterial
        color={new THREE.Color("#8886f5").multiplyScalar(100)}
        transparent
      />
    </mesh>
  );
}