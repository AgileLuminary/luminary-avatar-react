import { Canvas } from "@react-three/fiber";
import { Scenario } from "./Scenario.jsx";
import { SpeechProvider } from "../hooks/useSpeech.jsx";

export const Widget = ({
  backendUrl,
  avatarUrl = "/models/Avatar2.glb",
  animationsUrl = "/models/animations.glb",
  size = 300,
  fov = 10,
  fixedBottomRight = true,
}) => {
  const style = fixedBottomRight
    ? {
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: "50%",
        border: "4px solid white",
        overflow: "hidden",
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }
    : { height: `${size}px`, width: `${size}px`, borderRadius: "50%", border: "4px solid white", overflow: "hidden" };

  return (
    <SpeechProvider backendUrl={backendUrl}>
      <Canvas shadows camera={{ position: [0, 0, 0], fov }} style={style}>
        <Scenario avatarUrl={avatarUrl} animationsUrl={animationsUrl} />
      </Canvas>
    </SpeechProvider>
  );
};


