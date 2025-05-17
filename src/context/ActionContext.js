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
  containerSize = { width: 800, height: 600 },
}) {
  useEffect(() => {
    if (!spriteId) {
      console.error("Missing required prop: 'spriteId'");
    }
  }, [spriteId]);
  useEffect(() => {
    if (initialState != null && typeof initialState !== "object") {
      console.warn(
        "Invalid initialState passed to IndividualSpriteProvider",
        initialState
      );
    }
  }, [initialState]);
  const { updateSpritePosition } = useSprite();
  const [position, setPosition] = useState(
    initialState.position || { x: 0, y: 0 }
  );
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [message, setMessage] = useState("");
  const [thinks, setthinks] = useState("");
  const [width, setWidth] = useState(initialState.width || 50);
  const [height, setHeight] = useState(initialState.height || 50);
  const [initialPosition] = useState(initialState.position || { x: 0, y: 0 });
  const [initialRotation] = useState(initialState.rotation || 0);
  useEffect(() => {
    updateSpritePosition(spriteId, position, { width, height });
  }, [spriteId, position, width, height, updateSpritePosition]);
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const moveX = useCallback(
    (dx) => {
      setPosition((prev) => {
        const newX = clamp(prev.x + dx, 0, containerSize.width - width);
        return { ...prev, x: newX };
      });
    },
    [containerSize.width, width]
  );

  const moveY = useCallback(
    (dy) => {
      setPosition((prev) => {
        const newY = clamp(prev.y + dy, 0, containerSize.height - height);
        return { ...prev, y: newY };
      });
    },
    [containerSize.height, height]
  );

  const randomXY = useCallback(
    (dx, dy) => {
      setPosition((prev) => {
        const newX = clamp(prev.x + dx, 0, containerSize.width - width);
        const newY = clamp(prev.y + dy, 0, containerSize.height - height);
        return { x: newX, y: newY };
      });
    },
    [containerSize, width, height]
  );
  const setAbsolutePosition = useCallback((x, y) => {
    setPosition({ x, y });
  }, []);
  const rotate = useCallback((delta) => {
    setRotation((prev) => prev + delta);
  }, []);
  const say = useCallback((text, seconds = 2) => {
    setMessage(text);
    setTimeout(() => setMessage(""), seconds * 1000);
  }, []);
  const think = useCallback((text, seconds = 3) => {
    setthinks(text);
    setTimeout(() => setthinks(""), seconds * 1000);
  }, []);
  const reset = useCallback(() => {
    setPosition(initialPosition);
    setRotation(initialRotation);
    setMessage("");
    setthinks("");
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
        thinks,
        height,
        moveX,
        moveY,
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
