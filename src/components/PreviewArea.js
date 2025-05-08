import React, { useRef, useEffect } from "react";
import { IndividualSpriteProvider, useIndividualSprite } from "./SpriteContext";
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
  const VERTICAL_SPACING = 150; // Adjust this value as needed
  const initialState = {
    ...sprite.state,
    position: { x: 0, y: index * VERTICAL_SPACING },
  };
  useEffect(() => {
    setSelectedSprites((prev) =>
      prev.map((s) =>
        s.id === sprite.id ? { ...s, actionRef: actionsRef.current } : s
      )
    );
  }, [sprite.id, setSelectedSprites]);
  return (
    <IndividualSpriteProvider initialState={initialState}>
      <ActionsExporter ref={actionsRef}>
        <SpriteComponent style={{ marginTop: "100px" }} />
      </ActionsExporter>
    </IndividualSpriteProvider>
  );
}
const ActionsExporter = React.forwardRef(({ children }, ref) => {
  const {
    move,
    rotate,
    showMessage,
    say,
    think,
    fliph,
    flipv,
    reset,
    randomXY,
  } = useIndividualSprite();
  useEffect(() => {
    if (ref) {
      ref.current = {
        move,
        rotate,
        showMessage,
        say,
        think,
        fliph,
        flipv,
        reset,
        randomXY,
      };
    }
  }, [
    move,
    rotate,
    showMessage,
    say,
    think,
    fliph,
    flipv,
    reset,
    ref,
    randomXY,
  ]);
  return <>{children}</>;
});
