import React, { createContext, useContext, useRef, useState } from "react";
import { Howl } from "howler";

interface SoundContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
  rainSoundRef: React.MutableRefObject<Howl | null>;
  nightSoundRef: React.MutableRefObject<Howl | null>;
  thunderSoundRef: React.MutableRefObject<Howl | null>;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const rainSoundRef = useRef<Howl | null>(null);
  const nightSoundRef = useRef<Howl | null>(null);
  const thunderSoundRef = useRef<Howl | null>(null);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  return (
    <SoundContext.Provider
      value={{
        isSoundOn,
        toggleSound,
        rainSoundRef,
        nightSoundRef,
        thunderSoundRef,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}