import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
  const [width, setWidth] = useState(initialState.width || 50);
  const [height, setHeight] = useState(initialState.height || 50);
  const [initialPosition] = useState(initialState.position || { x: 0, y: 0 });
  const [initialRotation] = useState(initialState.rotation || 0);
  const [initialWidth] = useState(initialState.width || 50);
  const [initialHeight] = useState(initialState.height || 50);
  useEffect(() => {
    updateSpritePosition(spriteId, position, { width, height });
  }, [spriteId, position, width, height, updateSpritePosition]);
  const move = useCallback((delta) => {
    setPosition((prev) => ({
      x: prev.x + delta,
      y: prev.y,
    }));
  }, []);
  const randomXY = useCallback((deltaX, deltaY) => {
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  }, []);
  const setAbsolutePosition = useCallback((x, y) => {
    setPosition({ x, y });
  }, []);
  const rotate = useCallback((delta) => {
    setRotation((prev) => prev + delta);
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
        width,
        height,
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
