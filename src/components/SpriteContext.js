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
export function IndividualSpriteProvider({ children, initialState = {} }) {
  const [position, setPosition] = useState(
    initialState.position || { x: 0, y: 0 }
  );
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [message, setMessage] = useState("");
  const [isDraggable, setIsDraggable] = useState(
    initialState.isDraggable || false
  );
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialPosition] = useState(initialState.position || { x: 0, y: 0 });
  const [initialRotation] = useState(initialState.rotation || 0);
  const move = useCallback(
    (delta) => {
      if (isPaused) return;
      setPosition((prev) => ({
        x: prev.x + delta,
        y: prev.y,
      }));
    },
    [isPaused]
  );
  const rotate = useCallback(
    (delta) => {
      if (isPaused) return;
      setRotation((prev) => prev + delta);
    },
    [isPaused]
  );
  const showMessage = useCallback(
    (text) => {
      if (isPaused) return;
      setMessage(text);
      setTimeout(() => setMessage(""), 2000);
    },
    [isPaused]
  );
  const fliph = useCallback(() => {
    if (isPaused) return;
    setFlipHorizontal((prev) => !prev);
  }, [isPaused]);
  const flipv = useCallback(() => {
    if (isPaused) return;
    setFlipVertical((prev) => !prev);
  }, [isPaused]);
  const reset = useCallback(() => {
    setPosition(initialPosition);
    setRotation(initialRotation);
    setMessage("");
    setFlipHorizontal(false);
    setFlipVertical(false);
    setIsPaused(false);
  }, [initialPosition, initialRotation]);
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);
  return (
    <IndividualSpriteContext.Provider
      value={{
        position,
        rotation,
        message,
        isDraggable,
        flipHorizontal,
        flipVertical,
        isPaused,
        move,
        rotate,
        showMessage,
        setIsDraggable,
        fliph,
        flipv,
        reset,
        togglePause,
      }}
    >
      {children}
    </IndividualSpriteContext.Provider>
  );
}
export function useIndividualSprite() {
  return useContext(IndividualSpriteContext);
}
