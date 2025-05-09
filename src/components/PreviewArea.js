import React, { useRef, useEffect } from "react";
import {
  useIndividualSprite,
  IndividualSpriteProvider,
} from "../context/ActionContext";
export default function PreviewArea({ selectedSprites, setSelectedSprites }) {
  return (
    <div className="relative w-full h-full overflow-y-auto p-4 bg-gray-100">
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
    position: { x: 50, y: index * VERTICAL_SPACING },
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
    rotation,
    width,
    height,
    move,
    rotate,
    showMessage,
    say,
    think,
    reset,
    randomXY,
  } = useIndividualSprite();
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        move,
        rotate,
        showMessage,
        say,
        think,
        reset,
        randomXY,
      };
    }
  }, [move, rotate, showMessage, say, think, reset, randomXY]);
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        width: `${width}px`,
        height: `${height}px`,
        boxSizing: "border-box",
        border: "2px solid red",
        pointerEvents: "none",
      }}
    >
      <SpriteComponent />
    </div>
  );
}
const ActionsExporter = React.forwardRef(({ children }, ref) => {
  const { move, rotate, showMessage, say, think, reset, randomXY } =
    useIndividualSprite();
  useEffect(() => {
    if (ref) {
      ref.current = {
        move,
        rotate,
        showMessage,
        say,
        think,
        reset,
        randomXY,
      };
    }
  }, [move, rotate, showMessage, say, think, reset, ref, randomXY]);
  return <>{children}</>;
});
