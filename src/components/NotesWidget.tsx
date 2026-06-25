import React from "react";
import { useStore } from "../store/useStore";

export default function NotesWidget() {
  const notes = useStore((state) => state.notes);
  const setNotes = useStore((state) => state.setNotes);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return (
    <div
      id="widget_notes"
      className="flex flex-col bg-[#F1C75B] text-black rounded-3xl p-6 shadow-xl h-full min-h-[350px] relative overflow-hidden"
    >
      <h3 id="notes_title" className="text-2xl font-black tracking-tight mb-4 uppercase">
        All notes
      </h3>
      <textarea
        id="notes_textarea"
        placeholder="Type your personal notes here... they are saved automatically."
        value={notes}
        onChange={handleNotesChange}
        className="w-full flex-1 bg-transparent resize-none outline-none border-none font-medium text-sm leading-relaxed text-[#1e1e1e] placeholder-[#604f21] focus:ring-0 overflow-y-auto"
      />
    </div>
  );
}
