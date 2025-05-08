import React, { createContext, useContext, useState, useCallback } from "react";
import { useSprite } from "./SpriteContext";
const IndividualSpriteContext = createContext();
export function IndividualSpriteProvider({
  children,
  spriteId,
  initialState = {},
}) {
  const { updateSpritePosition } = useSprite();
  const [position, setPosition] = useState(
    initialState.position || { x: 0, y: 0 }
  );
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [message, setMessage] = useState("");
  const [initialPosition] = useState(initialState.position || { x: 0, y: 0 });
  const [initialRotation] = useState(initialState.rotation || 0);
  React.useEffect(() => {
    updateSpritePosition(spriteId, position);
  }, [spriteId, position, updateSpritePosition]);
  const move = useCallback((delta) => {
    setPosition((prev) => {
      const newPos = { x: prev.x + delta, y: prev.y };
      return newPos;
    });
  }, []);
  const randomXY = useCallback((deltaX, deltaY) => {
    setPosition((prev) => {
      const newPos = { x: prev.x + deltaX, y: prev.y + deltaY };
      return newPos;
    });
  }, []);
  const setAbsolutePosition = useCallback((x, y) => {
    setPosition({ x, y });
  }, []);
  const rotate = useCallback((delta) => {
    setRotation((prev) => {
      const newRot = prev + delta;
      return newRot;
    });
  }, []);
  const say = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  }, []);
  const think = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }, []);
  const reset = useCallback(() => {
    setPosition(initialPosition);
    setRotation(initialRotation);
    setMessage("");
  }, [initialPosition, initialRotation]);
  const getCurrentPosition = useCallback(() => {
    return position;
  }, [position]);
  return (
    <IndividualSpriteContext.Provider
      value={{
        position,
        rotation,
        message,
        move,
        rotate,
        say,
        think,
        reset,
        randomXY,
        setAbsolutePosition,
        getCurrentPosition,
        spriteId,
      }}
    >
      {children}
    </IndividualSpriteContext.Provider>
  );
}
export function useIndividualSprite() {
  return useContext(IndividualSpriteContext);
}
