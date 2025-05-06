import React, { createContext, useState, useContext } from "react";

const SpriteContext = createContext();

export const useSprite = () => useContext(SpriteContext);

export const SpriteProvider = ({ children }) => {
  const [isDraggable, setIsDraggable] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState(null);
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


  return (
    <SpriteContext.Provider value={{ position, rotation, move, rotate, message, showMessage, isDraggable, setIsDraggable }}>
      {children}
    </SpriteContext.Provider>
  );
};
