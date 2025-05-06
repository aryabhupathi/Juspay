


import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { SpriteProvider } from "./components/SpriteContext";
export default function App() {
  return (
    <SpriteProvider>
      <div className="bg-blue-100 pt-6 font-sans h-screen">
        <div className="h-full flex flex-row gap-2 px-2">
          <div className="w-1/5 h-full bg-white border border-gray-200 rounded-xl">
            <Sidebar />
          </div>
          <div className="flex-1 h-full bg-white border border-gray-200 rounded-xl">
            <MidArea />
          </div>
          <div className="w-1/3 h-full bg-white border border-gray-200 rounded-xl">
            <PreviewArea />
          </div>
        </div>
      </div>
    </SpriteProvider>
  );
}
