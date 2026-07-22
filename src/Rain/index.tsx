import { useFrame } from "@react-three/fiber";
import { Howl } from "howler";
import * as React from "react";
import { Drops } from "./Drops";
import { Splashes } from "./Splashes";
import { useSound } from "../SoundContext";

export function Rain({
  children,
  rainProgressRef,
}: React.PropsWithChildren<{
  rainProgressRef: React.MutableRefObject<number>;
}>) {
  const { rainSoundRef, nightSoundRef, isSoundOn } = useSound();

  const rainSound = React.useMemo(
    () =>
      new Howl({
        src: "/sounds/light-rain-109591.mp3",
        loop: true,
        volume: 0.5,
      }),
    []
  );

  const nightSound = React.useMemo(
    () =>
      new Howl({
        src: "/sounds/night-ambience-17064.mp3",
        loop: true,
        volume: 0.5,
      }),
    []
  );

  // Сохраняем ссылки на звуки в контексте
  React.useEffect(() => {
    rainSoundRef.current = rainSound;
    nightSoundRef.current = nightSound;

    return () => {
      rainSound.stop();
      nightSound.stop();
      rainSound.unload();
      nightSound.unload();
    };
  }, [rainSound, nightSound, rainSoundRef, nightSoundRef]);

  const playingSound = React.useRef(false);
  
  useFrame(() => {
    // Запускаем звуки только если дождь начался
    if (rainProgressRef.current > 0 && !playingSound.current) {
      rainSound.volume(0);
      nightSound.volume(0);

      // Запускаем звуки только если звук включен
      if (isSoundOn) {
        rainSound.play();
        nightSound.play();
      }
      playingSound.current = true;
    }

    // Управляем громкостью в зависимости от состояния звука
    if (isSoundOn) {
      // Если звук включен - устанавливаем нормальную громкость
      if (rainSound.playing()) {
        rainSound.volume(Math.min(rainProgressRef.current, 0.5));
      }
      if (nightSound.playing()) {
        nightSound.volume(Math.min(rainProgressRef.current ** 0.5, 1));
      }
    } else {
      // Если звук выключен - устанавливаем громкость 0
      if (rainSound.playing()) {
        rainSound.volume(0);
      }
      if (nightSound.playing()) {
        nightSound.volume(0);
      }
    }
  });

  return (
    <>
      <Drops rainProgressRef={rainProgressRef} />
      <Splashes rainProgressRef={rainProgressRef}>{children}</Splashes>
    </>
  );
}