import React, { createContext, useContext, useState, useCallback } from "react";
const SpriteContext = createContext();
export function SpriteProvider({ children }) {
  const [activeActions, setActiveActions] = useState({});
  const [spritePositions, setSpritePositions] = useState({});
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
  const updateSpritePosition = useCallback(
    (spriteId, position, size = { width: 80, height: 80 }) => {
      if (!position || typeof position !== "object") {
        console.warn(
          "Invalid position passed to updateSpritePosition",
          position
        );
        return;
      }
      setSpritePositions((prev) => ({
        ...prev,
        [spriteId]: {
          ...position,
          ...size,
        },
      }));
    },
    []
  );
  const getSpritePosition = useCallback(
    (spriteId) => {
      return spritePositions[spriteId] || null;
    },
    [spritePositions]
  );
  return (
    <SpriteContext.Provider
      value={{
        activeActions,
        startAction,
        clearAction,
        spritePositions,
        updateSpritePosition,
        getSpritePosition,
      }}
    >
      {children}
    </SpriteContext.Provider>
  );
}
export function useSprite() {
  return useContext(SpriteContext);
}
