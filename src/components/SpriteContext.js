// import React, { createContext, useState, useContext } from "react";

// const SpriteContext = createContext();

// export const useSprite = () => useContext(SpriteContext);

// export const SpriteProvider = ({ children }) => {
//   const [isDraggable, setIsDraggable] = useState(false);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [rotation, setRotation] = useState(0);
//   const [message, setMessage] = useState(null);
//   const move = (steps) => {
//     setPosition((prev) => ({
//       x: prev.x + steps * Math.cos((rotation * Math.PI) / 180),
//       y: prev.y + steps * Math.sin((rotation * Math.PI) / 180),
//     }));
//   };

//   const rotate = (angle) => setRotation((prev) => prev + angle);

  

// const showMessage = (text, duration = 3000) => {
//   setMessage(text);
//   setTimeout(() => setMessage(null), duration);
// };


//   return (
//     <SpriteContext.Provider value={{ position, rotation, move, rotate, message, showMessage, isDraggable, setIsDraggable }}>
//       {children}
//     </SpriteContext.Provider>
//   );
// };


// SpriteContext.js
// import React, { createContext, useState, useContext } from "react";

// const SpriteContext = createContext();

// export const useSprite = () => useContext(SpriteContext);

// export const SpriteProvider = ({ children }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [rotation, setRotation] = useState(0);
//   const [message, setMessage] = useState(null);
//   const [isDraggable, setIsDraggable] = useState(false);

//   const move = (steps) => {
//     setPosition((prev) => ({
//       x: prev.x + steps * Math.cos((rotation * Math.PI) / 180),
//       y: prev.y + steps * Math.sin((rotation * Math.PI) / 180),
//     }));
//   };

//   const rotate = (angle) => setRotation((prev) => prev + angle);

//   const showMessage = (text, duration = 3000) => {
//     setMessage(text);
//     setTimeout(() => setMessage(null), duration);
//   };

//   return (
//     <SpriteContext.Provider value={{ position, rotation, move, rotate, message, showMessage, isDraggable, setIsDraggable }}>
//       {children}
//     </SpriteContext.Provider>
//   );
// };


import React, { createContext, useState, useContext } from "react";

const SpriteContext = createContext();

export const useSprite = () => useContext(SpriteContext);

export const SpriteProvider = ({ children, initialState = {} }) => {
  // Initialize state with provided values or defaults
  const [position, setPosition] = useState(initialState.position || { x: 100, y: 100 });
  const [rotation, setRotation] = useState(initialState.rotation || 0);
  const [message, setMessage] = useState(null);
  const [isDraggable, setIsDraggable] = useState(initialState.isDraggable || false);

  // Sprite actions
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
    <SpriteContext.Provider value={{
      // State
      position,
      rotation,
      message,
      isDraggable,
      // Actions
      move,
      rotate,
      showMessage,
      setIsDraggable
    }}>
      {children}
    </SpriteContext.Provider>
  );
};