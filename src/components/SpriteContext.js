import React, { createContext, useContext, useState, useCallback } from "react";
const SpriteContext = createContext();
export function SpriteProvider({ children, initialState = {} }) {
  const [activeActions, setActiveActions] = useState({});
  const startAction = useCallback((spriteId, actionType) => {
    setActiveActions((prev) => ({
      ...prev,
      [spriteId]: actionType,
    }));
  }, []);
  const clearAction = useCallback((spriteId) => {
    setActiveActions((prev) => {
      const newActions = { ...prev };
      delete newActions[spriteId];
      return newActions;
    });
  }, []);
  return (
    <SpriteContext.Provider
      value={{
        activeActions,
        startAction,
        clearAction,
      }}
    >
      {children}
    </SpriteContext.Provider>
  );
}
export function useSprite() {
  return useContext(SpriteContext);
}
const IndividualSpriteContext = createContext();
export function IndividualSpriteProvider({
  children,
  spriteId,
  initialState = {},
}) {
  const { activeActions, clearAction } = useSprite();
  const [position, setPosition] = useState(
    initialState.position || { x: 0, y: 0 }
  );
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [message, setMessage] = useState("");
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [initialPosition] = useState(initialState.position || { x: 0, y: 0 });
  const [initialRotation] = useState(initialState.rotation || 0);
  const move = useCallback((delta) => {
    setPosition((prev) => {
      const newPos = { x: prev.x + delta, y: prev.y };
      console.log(`Move by ${delta} =>`, newPos);
      return newPos;
    });
  }, []);
  const randomXY = useCallback((deltaX, deltaY) => {
    setPosition((prev) => {
      const newPos = { x: prev.x + deltaX, y: prev.y + deltaY };
      console.log(`RandomXY by x:${deltaX}, y:${deltaY} =>`, newPos);
      return newPos;
    });
  }, []);
  const rotate = useCallback((delta) => {
    setRotation((prev) => {
      const newRot = prev + delta;
      console.log(`Rotate by ${delta} =>`, newRot);
      return newRot;
    });
  }, []);
  const say = useCallback((text) => {
    console.log(`Say: ${text}`);
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  }, []);
  const think = useCallback((text) => {
    console.log(`Think: ${text}`);
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }, []);
  const fliph = useCallback(() => {
    setFlipHorizontal((prev) => {
      const flipped = !prev;
      console.log(`Flip Horizontal =>`, flipped);
      return flipped;
    });
  }, []);
  const flipv = useCallback(() => {
    setFlipVertical((prev) => {
      const flipped = !prev;
      console.log(`Flip Vertical =>`, flipped);
      return flipped;
    });
  }, []);
  const reset = useCallback(() => {
    console.log(`Reset to initial`, initialPosition, initialRotation);
    setPosition(initialPosition);
    setRotation(initialRotation);
    setMessage("");
    setFlipHorizontal(false);
    setFlipVertical(false);
  }, [initialPosition, initialRotation]);
  return (
    <IndividualSpriteContext.Provider
      value={{
        position,
        rotation,
        message,
        flipHorizontal,
        flipVertical,
        move,
        rotate,
        say,
        think,
        fliph,
        flipv,
        reset,
        randomXY,
      }}
    >
      {children}
    </IndividualSpriteContext.Provider>
  );
}
export function useIndividualSprite() {
  return useContext(IndividualSpriteContext);
}
