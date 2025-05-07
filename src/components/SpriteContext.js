  import React, { createContext, useState, useContext } from "react";
  const SpriteContext = createContext();
  export const useSprite = () => useContext(SpriteContext);
  export const SpriteProvider = ({ children, initialState = {} }) => {
    const [position, setPosition] = useState(initialState.position);
    const [rotation, setRotation] = useState(initialState.rotation || 0);
    const [message, setMessage] = useState(null);
    const [isDraggable, setIsDraggable] = useState(initialState.isDraggable || false);
    const [blocks, setBlocks] = useState(initialState.blocks || []);
    const move = (steps) => {
      setPosition((prev) => ({
        x: prev.x + steps * Math.cos((rotation * Math.PI) / 180),
        y: prev.y + steps * Math.sin((rotation * Math.PI) / 180),
      }));
    };
    const rotate = (angle) => setRotation((prev) => prev + angle);
    const showMessage = (text, duration = 3000) => {
      setMessage(text);
      setTimeout(() => setMessage(null), duration);
    };
    const swapActions = (sprite1Id, sprite2Id) => {
      if (sprite1Id !== sprite2Id) {
        setBlocks(prev => {
          const sprite1Blocks = prev[sprite1Id]?.blocks || [];
          const sprite2Blocks = prev[sprite2Id]?.blocks || [];
          const newBlocks = { ...prev };
          newBlocks[sprite1Id].blocks = sprite2Blocks;
          newBlocks[sprite2Id].blocks = sprite1Blocks;
          return newBlocks;
        });
      }
    };
    return (
      <SpriteContext.Provider
        value={{
          position,
          rotation,
          message,
          isDraggable,
          blocks,
          move,
          rotate,
          showMessage,
          setIsDraggable,
          swapActions, 
        }}
      >
        {children}
      </SpriteContext.Provider>
    );
  };
