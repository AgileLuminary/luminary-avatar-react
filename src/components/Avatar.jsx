import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useSpeech } from "../hooks/useSpeech.jsx";
import facialExpressions from "../constants/facialExpressions.js";
import visemesMapping from "../constants/visemesMapping.js";

export function Avatar({ avatarUrl = "/models/Avatar2.glb", animationsUrl = "/models/animations.glb", ...props }) {
  const group = useRef();
  const { scene, animations: avatarAnimations } = useGLTF(avatarUrl);
  const { animations: externalAnimations } = useGLTF(animationsUrl);
  const animations = (avatarAnimations ?? []).concat(externalAnimations ?? []);
  const { actions, mixer, names } = useAnimations(animations, group);

  const { message, onMessagePlayed } = useSpeech();
  const [lipsync, setLipsync] = useState(null);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(() => names.includes("Idle") ? "Idle" : names[0]);

  useEffect(() => {
    if (!message) {
      setCurrentAnimation("Idle");
      setFacialExpression("");
      setLipsync(null);
      return;
    }
    setCurrentAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    if (message.audio) {
      const newAudio = new Audio("data:audio/mp3;base64," + message.audio);
      setAudio(newAudio);
      newAudio.play();
      newAudio.onended = onMessagePlayed;
      return () => newAudio.pause();
    }
  }, [message, onMessagePlayed]);

  useEffect(() => {
    if (!actions || !mixer) return;
    const action = actions[currentAnimation];
    if (action) action.reset().fadeIn(0.5).play();
    return () => { if (action) action.fadeOut(0.5); };
  }, [actions, currentAnimation, mixer]);

  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
    if (!lipsync || !audio) return;
    const currentTime = audio.currentTime;
    const applied = new Set();
    if (lipsync.mouthCues) {
      for (const cue of lipsync.mouthCues) {
        if (currentTime >= cue.start && currentTime <= cue.end) {
          const visemeKey = visemesMapping[cue.value];
          applied.add(visemeKey);
          scene.traverse((child) => {
            if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
              const index = child.morphTargetDictionary[visemeKey];
              if (index !== undefined) {
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], 1, 0.2);
              }
            }
          });
          break;
        }
      }
    }
    Object.values(visemesMapping).forEach((key) => {
      if (!applied.has(key)) {
        scene.traverse((child) => {
          if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
            const index = child.morphTargetDictionary[key];
            if (index !== undefined) {
              child.morphTargetInfluences[index] = THREE.MathUtils.lerp(child.morphTargetInfluences[index], 0, 0.1);
            }
          }
        });
      }
    });
  });

  return (
    <group ref={group} {...props} dispose={null} position={[0, -0.65, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Avatar2.glb");
useGLTF.preload("/models/animations.glb");


