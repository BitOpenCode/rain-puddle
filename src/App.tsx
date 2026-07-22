import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { Floor } from "./Floor";
import { Lights } from "./Lights";
import { Rain } from "./Rain";
import { useMakeRain } from "./useMakeRain";
import { useSound } from "./SoundContext";

console.log("test")

export default function App() {
  const [rainProgressRef, onRainStart, rainStarted] = useMakeRain();
  const { isSoundOn, toggleSound } = useSound();

  return (
    <>
      <Canvas
        shadows={false}
        gl={{
          antialias: false,
        }}
        style={{
          filter: "contrast(1.2) saturate(1.1) brightness(1.1)",
        }}
        raycaster={null}
      >
        <OrbitControls
          makeDefault
          autoRotate={rainStarted}
          autoRotateSpeed={-0.25}
        />
        <PerspectiveCamera
          position={[
            0.713725247365501, 0.3394033648663526, 0.32126638003592926,
          ]}
          makeDefault
        />

        <Lights rainEnabled={rainStarted} />
        <Rain rainProgressRef={rainProgressRef}>
          <Floor rainProgressRef={rainProgressRef} />
        </Rain>

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            luminanceSmoothing={0.0}
            intensity={0.05}
          />
          <ToneMapping />
        </EffectComposer>
      </Canvas>

      {/* Grading */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%,  rgba(0, 0, 0, 1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 255, 0.2) 100%)",
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0) 40%, rgba(255, 222, 165, 0.2) 100%)",
        }}
      />

      {/* Кнопка старта - по центру */}
      {!rainStarted && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "1rem",
            textAlign: "center",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <button
            className="button"
            onClick={onRainStart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <div className="bloom-container">
              <div className="button-container-main">
                <div className="button-inner">
                  <div className="back"></div>
                  <div className="front">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="svg"
                      viewBox="0 0 512 512"
                      style={{
                        fill: "#ffffff",
                        opacity: 0.5,
                        width: "30px",
                        aspectRatio: 1,
                        transform: "rotate(45deg)",
                        transition: "all 0.2s ease-in",
                      }}
                    >
                      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 368V144l128 112L224 368z"/>
                    </svg>
                  </div>
                </div>
                <div className="button-glass">
                  <div className="back"></div>
                  <div className="front"></div>
                </div>
              </div>
              <div className="bloom bloom1"></div>
              <div className="bloom bloom2"></div>
            </div>
          </button>
          <p className="button-label">
            Start chill
          </p>
        </div>
      )}

      {/* Кнопка управления звуком - показывается только после старта, в правом верхнем углу */}
      {rainStarted && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <button
            className={`button button-sound ${!isSoundOn ? 'sound-off' : ''}`}
            onClick={toggleSound}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <div className="bloom-container">
              <div className="button-container-main">
                <div className="button-inner">
                  <div className="back"></div>
                  <div className="front">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`svg ${isSoundOn ? 'sound-on' : ''}`}
                      viewBox="0 0 512 512"
                      style={{
                        fill: "#ffffff",
                        opacity: isSoundOn ? 0.5 : 0.2,
                        width: "20px",
                        aspectRatio: 1,
                        transform: "rotate(0deg)",
                        transition: "all 0.3s ease-in",
                      }}
                    >
                      {isSoundOn ? (
                        <path d="M160 320h-32c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32zm112 32c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v192zm64-32c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v192zM400 288c0 17.7-14.3 32-32 32s-32-14.3-32-32v-64c0-17.7 14.3-32 32-32s32 14.3 32 32v64z"/>
                      ) : (
                        <path d="M160 320h-32c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32zm112 32c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v192zm80-112l-16 16 16 16c6.25 6.25 6.25 16.38 0 22.63s-16.38 6.25-22.63 0L320 288l-16 16c-6.25 6.25-16.38 6.25-22.63 0s-6.25-16.38 0-22.63L297.4 256l-16-16c-6.25-6.25-6.25-16.38 0-22.63s16.38-6.25 22.63 0L320 224l16-16c6.25-6.25 16.38-6.25 22.63 0s6.25 16.38 0 22.63z"/>
                      )}
                    </svg>
                  </div>
                </div>
                <div className="button-glass">
                  <div className="back"></div>
                  <div className="front"></div>
                </div>
              </div>
              <div className="bloom bloom1"></div>
              <div className="bloom bloom2"></div>
            </div>
          </button>
          <p className={`button-label-small ${!isSoundOn ? 'sound-off' : ''}`}>
            {isSoundOn ? "Sound On" : "Sound Off"}
          </p>
        </div>
      )}
    </>
  );
}