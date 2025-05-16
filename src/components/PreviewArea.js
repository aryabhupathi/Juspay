import React, { useRef, useEffect } from "react";
import {
  useIndividualSprite,
  IndividualSpriteProvider,
} from "../context/ActionContext";
export default function PreviewArea({ selectedSprites, setSelectedSprites }) {
  return (
    <div className="relative w-full h-full overflow-auto p-4 bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Area</h2>
      <div className="relative w-full">
        {selectedSprites.map((sprite, index) => (
          <SpriteWrapper
            key={sprite.id}
            sprite={sprite}
            index={index}
            setSelectedSprites={setSelectedSprites}
          />
        ))}
      </div>
    </div>
  );
}
function SpriteWrapper({ sprite, index, setSelectedSprites }) {
  const SpriteComponent = sprite.component;
  const actionsRef = useRef(null);
  const VERTICAL_SPACING = 80;
  const initialState = {
    ...sprite.state,
    position: { x: 0, y: index * VERTICAL_SPACING },
    width: 100,
    height: 100,
  };
  useEffect(() => {
    setSelectedSprites((prev) =>
      prev.map((s) =>
        s.id === sprite.id ? { ...s, actionRef: actionsRef.current } : s
      )
    );
  }, [sprite.id, setSelectedSprites]);
  return (
    <div
      style={{
        position: "absolute",
        top: index * VERTICAL_SPACING,
        left: 0,
      }}
    >
      <IndividualSpriteProvider
        spriteId={sprite.id}
        initialState={initialState}
      >
        <InnerSpriteComponent
          SpriteComponent={SpriteComponent}
          actionsRef={actionsRef}
        />
      </IndividualSpriteProvider>
    </div>
  );
}
function InnerSpriteComponent({ SpriteComponent, actionsRef }) {
  const {
    position,
    setAbsolutePosition,
    rotation,
    width,
    height,
    moveX,
    moveY,
    rotate,
    say,
    think,
    reset,
    randomXY,
  } = useIndividualSprite();
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        moveX,
        moveY,
        rotate,
        say,
        think,
        reset,
        randomXY,
      };
    }
  }, [moveX, moveY, rotate, say, think, reset, randomXY]);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPosition.current = { ...position };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newX = Math.max(0, initialPosition.current.x + dx);
    const newY = Math.max(0, initialPosition.current.y + dy);
    setAbsolutePosition(newX, newY);
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    console.log(`Sprite dragged to: x=${position.x}, y=${position.y}`);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        width: `${width}px`,
        height: `${height}px`,
        boxSizing: "border-box",
        pointerEvents: "auto",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <SpriteComponent />
    </div>
  );
}
