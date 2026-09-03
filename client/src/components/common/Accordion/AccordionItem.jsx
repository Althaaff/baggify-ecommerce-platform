import React, { useRef } from "react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  const contentRef = useRef(null);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between p-4 text-left font-sans text-black focus:outline-none transition-all duration-300"
      >
        <span>{title}</span>

        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-100 ease-in-out"
        style={{ maxHeight: isOpen ? contentRef.current.scrollHeight : 0 }}
        ref={contentRef}
      >
        <div className="p-4 font-sans tracking-wide text-gray-600 text-sm">
          {content}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
