import { CameraControls, Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Avatar } from "./Avatar.jsx";

export const Scenario = ({ avatarUrl, animationsUrl }) => {
  const cameraControls = useRef();
  useEffect(() => {
    cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    cameraControls.current.enabled = true;
    cameraControls.current.mouseButtons.left = 0;
    cameraControls.current.mouseButtons.right = 0;
    cameraControls.current.mouseButtons.wheel = 0;
    cameraControls.current.touches.one = 0;
    cameraControls.current.touches.two = 0;
    cameraControls.current.touches.three = 0;
  }, []);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Avatar avatarUrl={avatarUrl} animationsUrl={animationsUrl} />
    </>
  );
};


